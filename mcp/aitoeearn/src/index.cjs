/* Agentika AiToEarn Connector — Local MCP Server (stdio JSON-RPC transport).
   Implements F1 MVP: list_accounts / upload_video / create_batch_post +
   auto_post_pipeline entry point. JS runnable without build; migration to tsc
   planned before production release (see package.json). */
"use strict";
const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "..", "aitoeearn.config.example.json");
const LOCAL_CFG_FILE = path.join(__dirname, "..", "aitoeearn.config.local.json");
const HISTORY_FILE = path.join(__dirname, "..", "..", "..", "logs", "post-history.jsonl");

function loadConfig() {
  const base = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  let local = {};
  try { local = JSON.parse(fs.readFileSync(LOCAL_CFG_FILE, "utf8")); } catch (_) {}
  return {
    baseUrl: process.env.AITOEARN_BASE_URL || base.baseUrl,
    apiKey: process.env.AITOEARN_API_KEY || local.apiKey || "",
    platforms: local.defaultPlatforms || base.defaultPlatforms,
    retryPolicy: Object.assign({}, base.retryPolicy, local.retryPolicy),
    captionTemplates: Object.assign({}, base.captionTemplates, local.captionTemplates),
    logging: Object.assign({ path: "./logs/post-history.jsonl" }, base.logging || {}, local.logging || {}),
  };
}

// ---- HTTP layer (placeholder endpoint verified in config before use) --------
async function apiRequest(method, pathname, body, cfg) {
  if (!cfg.apiKey) throw new Error("AiToEarn API key missing: set AITOEARN_API_KEY");
  const url = cfg.baseUrl.replace(/\/$/, "") + pathname;
  const attemptFetch = async () => {
    const res = await fetch(url, {
      method,
      headers: { Authorization: "Bearer " + cfg.apiKey, "Content-Type": "application/json" },
      body: body == null ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new Error("AiToEarn " + method + " " + pathname + " -> " + res.status);
    return res.json();
  };
  // Retry policy: maxAttempts, exponential backoff
  const max = (cfg.retryPolicy && cfg.retryPolicy.maxAttempts) || 3;
  const baseBackoff = (cfg.retryPolicy && cfg.retryPolicy.backoffMsBase) || 5000;
  for (let i = 0; ; i++) {
    try { return await attemptFetch(); }
    catch (err) {
      if (i >= max - 1) throw err;
      await new Promise((r) => setTimeout(r, baseBackoff * Math.pow(2, i)));
    }
  }
}

async function toolListAccounts(_args, cfg) {
  const data = await apiRequest("GET", "/accounts", null, cfg);
  logPublish({ op: "list_accounts", accounts: data });
  return data;
}
async function toolUploadVideo(args, cfg) {
  if (!args.filePath) throw new Error("upload_video requires filePath");
  if (!fs.existsSync(args.filePath)) throw new Error("File not found: " + args.filePath);
  const buf = fs.readFileSync(args.filePath);
  const formBody = {
    _filename: path.basename(args.filePath),
    content: Buffer.from(buf).toString("base64"),
  };
  const data = await apiRequest("POST", "/videos", formBody, cfg);
  logPublish({ op: "upload_video", filePath: args.filePath, id: data.id });
  return data;
}
async function toolCreateBatchPost(args, cfg) {
  const captions = {};
  const platforms = args.platforms || cfg.platforms;
  for (const plat of platforms) {
    const t = cfg.captionTemplates[plat];
    captions[plat] = typeof t === "string"
      ? t.replace("{title}", args.captions?.title || "").replace("{price}", String(args.captions?.price || ""))
      : (t && t.text) || "";
  }
  const data = await apiRequest("POST", "/posts/batch", {
    videos: args.videos || [],
    captions,
    platforms,
  }, cfg);
  logPublish({ op: "create_batch_post", batchId: data.id, platforms });
  return data;
}

// Entry point: end-to-end generate video via HyperFrames outputs -> upload -> post.
// Note: actual scene render is owned by the host composition side; this connector
// wires the produced mp4s under out/ into the pipeline (dothis.md F2).
async function toolAutoPostPipeline(args, cfg) {
  const outdir = process.cwd() + "/out";
  const files = fs.existsSync(outdir)
    ? fs.readdirSync(outdir).filter((f) => f.endsWith(".mp4")).map((f) => ({ filePath: outdir + "/" + f }))
    : [];
  if (files.length === 0) throw new Error("No MP4 renders found in ./out — render compositions first (npx hyperframes render)");

  // Phase 1: uploads
  const videos = [];
  for (const v of files) videos.push(await toolUploadVideo(v, cfg));

  // Phase 2: cross-platform batch post
  const result = await toolCreateBatchPost({
    videos,
    captions: {
      title: args.brief && args.brief.title,
      price: args.brief && args.brief.price,
    },
    platforms: args.platforms,
  }, cfg);

  return { videosUploaded: videos.length, posted: result };
}

// ---- helpers ---------------------------------------------------------------
function ensureLogsDir() {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function logPublish(entry) {
  ensureLogsDir();
  fs.appendFileSync(HISTORY_FILE, JSON.stringify({ ts: Date.now(), ...entry }) + "\n");
}

// ---- minimal stdio JSON-RPC MCP loop ---------------------------------------
let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch (e) { continue; }
    const respond = (result) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result }) + "\n");
    const respondError = (code, message) =>
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, error: { code, message } }) + "\n");

    try {
      switch (msg.method) {
        case "initialize":
          return respond({ protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "agentika-aitoearn-connector", version: "0.1.0" } });
        case "tools/list":
          return respond({ tools: [
            { name: "list_accounts", description: "Daftar akun terhubung per platform di AiToEarn", inputSchema: { type: "object", properties: {} } },
            { name: "upload_video", description: "Upload MP4 lokal ke AiToEarn", inputSchema: { type: "object", properties: { filePath: { type: "string" } }, required: ["filePath"] } },
            { name: "create_batch_post", description: "Buat satu batch post multi-platform", inputSchema: { type: "object", properties: { videos: { type: "array", items: { type: "object" } }, captions: { type: "object" }, platforms: { type: "array", items: { type: "string" } } } } },
            { name: "auto_post_pipeline", description: "ENTRY POINT: render output -> upload -> cross-post semua platform", inputSchema: { type: "object", properties: { brief: { type: "object" }, platforms: { type: "array" } } } },
          ]});
        case "tools/call": {
          const name = msg.params && msg.params.name;
          const args = (msg.params && msg.params.arguments) || {};
          const cfg = loadConfig();
          let result;
          switch (name) {
            case "list_accounts":           result = await toolListAccounts(args, cfg); break;
            case "upload_video":            result = await toolUploadVideo(args, cfg); break;
            case "create_batch_post":       result = await toolCreateBatchPost(args, cfg); break;
            case "auto_post_pipeline":      result = await toolAutoPostPipeline(args, cfg); break;
            default: return respondError(-32601, "Unknown tool: " + name);
          }
          return respond({ content: [{ type: "text", text: JSON.stringify(result) }] });
        }
        default:
          if (msg.id != null) respondError(-32601, "Method not found: " + msg.method);
      }
    } catch (err) {
      respondError(-32000, err.message || String(err));
    }
  }
});
