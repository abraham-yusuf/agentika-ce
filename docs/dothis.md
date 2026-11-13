Bagaimana jika menggunakan ini, apakah bisa membuat kan plugin, konektor, api/MCP yang bisa auto posting cross platform sosial media hasil generate vidio dari tools yang kita bangun. Atau misalnya konektor untuk muse.ai atau agentic ai Lainnya 
Coba kamu deep research tentang project ini, apakah bisa untuk kebutuhan saya sebagai seorang konten kreator dan konten affiliate, dan apakah kamu bisa buatkan konektor nya menurut mu? 
Rencana nya hasil generated vidio dari cli, tools atau agent ai ingin langsung saya post ke aitoearn tanpa menggunakan kredit berbayar di aitoearn. Hanya gunakan fitur auto post ke banyak sosial media sekaligus.
https://github.com/yikart/AiToEarn
https://aitoearn.ai/en

# Desain arsitektur custom connector

Generate video (claude / Antigravity / Remotion / HyperFrames / tools lokal) → Auto post multi-platform lewat AiToEarn (tanpa pakai kredit generate mereka)

Berikut desain arsitektur **custom connector** yang praktis untuk alur kamu:

> Generate video (Antigravity / Remotion / HyperFrames / tools lokal) → Auto post multi-platform lewat AiToEarn (tanpa pakai kredit generate mereka)

---

## 1. Goal Arsitektur

| Tujuan | Detail |
|--------|--------|
| Input | File video lokal (`.mp4`) + metadata (caption, hashtag, platform target, schedule) |
| Proses | Upload → buat publish task → post ke banyak platform |
| Output | Status posting per platform + link hasil |
| Constraint | Minimalkan biaya AiToEarn, full kontrol dari agent/CLI |

---

## 2. High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL / AGENT LAYER                 │
│  Antigravity / Claude Code / Remotion / HyperFrames / CLI   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              CUSTOM CONNECTOR (aitoearn-bridge)             │
│                                                             │
│  1. Video Intake          → terima path video + metadata    │
│  2. Asset Uploader        → upload ke AiToEarn / storage    │
│  3. Caption Engine        → generate/adapt caption per platform
│  4. Publish Orchestrator  → buat task multi-platform        │
│  5. Status Tracker        → polling / webhook status        │
│  6. Result Reporter       → kembalikan link + status        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    AiToEarn LAYER                           │
│  MCP / Open API  →  Publish Engine  →  14+ Social Platforms │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Komponen Utama

### A. `aitoearn-bridge` (Core Connector)

Ini bisa berupa:

| Bentuk | Kapan dipilih |
|--------|----------------|
| **MCP Server lokal** | Paling cocok dengan Antigravity / agent |
| **CLI tool** (`post-video`) | Cocok untuk script & automation |
| **Skill + script hybrid** | Paling cepat diimplementasi dulu |

**Fungsi inti:**
1. Terima input terstruktur
2. Upload video
3. Buat publish task ke banyak platform
4. Kembalikan status

### B. Input Contract (Standar)

Semua tools kamu harus mengeluarkan format yang sama:

```json
{
  "video_path": "/path/to/output.mp4",
  "title": "Judul singkat",
  "caption": "Caption utama...",
  "hashtags": ["affiliate", "review", "tiktok"],
  "platforms": ["tiktok", "youtube_shorts", "instagram_reels", "x"],
  "schedule_at": null,
  "thumbnail_path": null,
  "affiliate_link": "https://...",
  "language": "id"
}
```

### C. Caption Adapter

Setiap platform beda style. Connector harus punya layer adaptasi:

| Platform | Adaptasi |
|----------|----------|
| TikTok | Caption pendek + hashtag banyak + CTA |
| YouTube Shorts | Title terpisah + description lebih panjang |
| Instagram Reels | Caption + hashtag di akhir |
| X/Twitter | Sangat pendek, link hati-hati (ada biaya extra) |
| LinkedIn | Lebih formal, sedikit hashtag |

### D. Publish Flow

```text
1. Validasi video (durasi, resolusi, codec)
2. Upload asset → dapat media_url / asset_id
3. Resolve account_id per platform (dari AiToEarn)
4. Buat publish task (single / batch)
5. Optional: schedule
6. Poll status sampai success/failed
7. Return hasil
```

---

## 4. Arsitektur Detail (Recommended)

### Opsi terbaik untuk kamu: **MCP Server lokal + Skill**

```text
~/aitoearn-bridge/
├── src/
│   ├── server.ts              # MCP server
│   ├── uploader.ts            # upload video
│   ├── publisher.ts           # create publish tasks
│   ├── caption.ts             # adapt caption per platform
│   ├── status.ts              # track hasil
│   └── types.ts
├── skills/
│   └── auto-post/
│       └── SKILL.md           # skill untuk Antigravity
├── config.example.json
└── package.json
```

### Tools yang diekspos ke Agent (MCP Tools)

| Tool Name | Fungsi |
|-----------|--------|
| `list_accounts` | Lihat akun sosial yang sudah terhubung |
| `upload_video` | Upload video lokal → dapat asset_id |
| `create_post` | Buat 1 post ke 1 platform |
| `create_batch_post` | Post ke banyak platform sekaligus |
| `get_task_status` | Cek status publish |
| `auto_post_pipeline` | **All-in-one**: video path + metadata → post semua |

`auto_post_pipeline` adalah yang paling sering dipakai agent.

---

## 5. Alur End-to-End

```text
[1] Agent generate video
    (Remotion / HyperFrames / FFmpeg / dll)
            │
            ▼
[2] Agent panggil tool:
    auto_post_pipeline({
      video_path: "./out/final.mp4",
      caption: "...",
      platforms: ["tiktok", "instagram_reels"],
      affiliate_link: "https://..."
    })
            │
            ▼
[3] Bridge:
    - Validasi file
    - Upload ke AiToEarn
    - Adapt caption per platform
    - Create batch publish task
            │
            ▼
[4] AiToEarn Publish Engine
    → TikTok, IG, YouTube, dll
            │
            ▼
[5] Bridge kembalikan:
    {
      "tiktok": { "status": "success", "url": "..." },
      "instagram_reels": { "status": "queued", "task_id": "..." }
    }
```

---

## 6. Integrasi dengan Stack Kamu

| Layer | Tools | Peran |
|-------|-------|------|
| **Generate** | Antigravity + Remotion / HyperFrames / FFmpeg | Buat video |
| **Orchestrate** | Antigravity Agent + Skill | Putuskan kapan & ke mana post |
| **Connector** | `aitoearn-bridge` (MCP) | Jembatan teknis |
| **Distribute** | AiToEarn | Eksekusi multi-platform |
| **Monetize** | Affiliate link di caption + AiToEarn tasks | Cuan |

---

## 7. Keamanan & Operasional

- API Key AiToEarn disimpan di environment / config lokal, **jangan** di-commit
- Rate limit: jangan spam post (ikuti limit tiap platform)
- Log setiap publish (penting untuk affiliate tracking)
- Retry policy untuk gagal upload / gagal post
- Optional: simpan history post di SQLite/JSON lokal

---

## 8. Roadmap Implementasi (Praktis)

| Fase | Deliverable | Estimasi |
|------|-------------|----------|
| **Fase 1** | MCP server sederhana: `list_accounts` + `upload_video` + `create_batch_post` | Cepat |
| **Fase 2** | Tool `auto_post_pipeline` + caption adapter | Inti yang kamu butuhkan |
| **Fase 3** | Skill Antigravity (`/auto-post`) | Agent tinggal bilang perintah natural |
| **Fase 4** | Schedule + status tracker + logging | Production-ready |
| **Fase 5** | Integrasi Muse.ai / agent lain (opsional) | Scale |

---

## 9. Keputusan Desain yang Disarankan

| Keputusan | Rekomendasi |
|---------|-------------|
| Bentuk connector | **MCP Server lokal** |
| Bahasa | TypeScript (paling cocok ecosystem agent) |
| Entry point agent | Tool `auto_post_pipeline` |
| Caption | Template per platform + override manual |
| Storage video | Upload langsung ke AiToEarn (paling simpel) |
| Self-host AiToEarn | Belum perlu di awal |

---

## Ringkasan

Custom connector ini intinya **bukan mengganti AiToEarn**, tapi menjadi **jembatan pintar** antara:

- Tools generate video kamu (Antigravity, Remotion, dll)
- Mesin publish multi-platform AiToEarn

Dengan begitu kamu tetap bisa:
- Generate video di luar (hemat kredit)
- Post otomatis ke banyak platform
- Kontrol penuh dari agent/CLI

---

**Pengingat opsi terakhir:**

3. **Contoh skill/prompt** yang langsung bisa dipakai di Antigravity untuk “generate video lalu post ke AiToEarn”

Mau lanjut ke opsi 3 sekarang, atau kamu ingin saya breakdown lebih detail salah satu bagian arsitektur di atas dulu (misalnya skema MCP tools atau contoh struktur project-nya)?

Berikut breakdown detail **skema MCP tools** + **struktur project** untuk custom connector `aitoearn-bridge`.

---

## 1. Struktur Project (Recommended)

```text
aitoearn-bridge/
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
│
├── src/
│   ├── index.ts                 # Entry point MCP server
│   ├── server.ts                # MCP server setup
│   │
│   ├── tools/                   # Definisi & handler tiap tool
│   │   ├── index.ts
│   │   ├── list-accounts.ts
│   │   ├── upload-video.ts
│   │   ├── create-post.ts
│   │   ├── create-batch-post.ts
│   │   ├── get-task-status.ts
│   │   └── auto-post-pipeline.ts
│   │
│   ├── services/                # Logic bisnis
│   │   ├── aitoearn-client.ts   # Wrapper API / MCP AiToEarn
│   │   ├── uploader.ts
│   │   ├── publisher.ts
│   │   ├── caption.ts
│   │   └── validator.ts
│   │
│   ├── types/
│   │   ├── input.ts
│   │   ├── aitoearn.ts
│   │   └── results.ts
│   │
│   └── utils/
│       ├── env.ts
│       ├── fs.ts
│       └── logger.ts
│
├── skills/                      # Optional: skill untuk Antigravity
│   └── auto-post/
│       └── SKILL.md
│
└── config/
    └── platforms.json           # Template caption per platform
```

---

## 2. Skema MCP Tools

### Ringkasan Tools

| Tool | Wajib | Fungsi |
|------|-------|--------|
| `list_accounts` | Ya | Lihat akun sosial yang sudah terhubung |
| `upload_video` | Ya | Upload video lokal → dapat `asset_id` / URL |
| `create_post` | Ya | Post ke 1 platform |
| `create_batch_post` | Ya | Post ke banyak platform sekaligus |
| `get_task_status` | Ya | Cek status publish |
| `auto_post_pipeline` | **Utama** | All-in-one: video + metadata → post multi platform |

---

### 2.1 `list_accounts`

**Input:**
```ts
{
  platform?: "tiktok" | "youtube" | "instagram" | "x" | "facebook" | "threads" | "linkedin" | "pinterest" | "all"
}
```

**Output:**
```ts
{
  accounts: Array<{
    account_id: string
    platform: string
    display_name: string
    username?: string
    status: "active" | "expired" | "error"
  }>
}
```

---

### 2.2 `upload_video`

**Input:**
```ts
{
  video_path: string          // path absolut/relatif lokal
  title?: string
  description?: string
}
```

**Output:**
```ts
{
  asset_id: string
  media_url?: string
  duration_sec?: number
  size_bytes?: number
}
```

---

### 2.3 `create_post`

**Input:**
```ts
{
  account_id: string
  asset_id: string
  caption: string
  title?: string              // untuk YouTube dll
  schedule_at?: string        // ISO datetime, null = langsung post
  cover_path?: string
  extra?: Record<string, any> // platform-specific
}
```

**Output:**
```ts
{
  task_id: string
  status: "queued" | "publishing" | "success" | "failed"
  platform: string
  publish_url?: string
}
```

---

### 2.4 `create_batch_post`

**Input:**
```ts
{
  asset_id: string
  posts: Array<{
    account_id: string
    caption: string
    title?: string
    schedule_at?: string | null
  }>
}
```

**Output:**
```ts
{
  results: Array<{
    account_id: string
    platform: string
    task_id: string
    status: string
    publish_url?: string
    error?: string
  }>
}
```

---

### 2.5 `get_task_status`

**Input:**
```ts
{
  task_id: string
}
```

**Output:**
```ts
{
  task_id: string
  status: "queued" | "publishing" | "success" | "failed"
  platform?: string
  publish_url?: string
  error_message?: string
  updated_at?: string
}
```

---

### 2.6 `auto_post_pipeline` (Tool Utama)

Ini yang paling sering dipanggil agent.

**Input:**
```ts
{
  video_path: string
  title?: string
  caption: string
  hashtags?: string[]
  platforms: Array<
    "tiktok" | "youtube_shorts" | "instagram_reels" | "x" | "facebook" | "threads" | "linkedin" | "pinterest"
  >
  schedule_at?: string | null
  affiliate_link?: string
  language?: "id" | "en"
  account_map?: Record<string, string>  // optional: platform → account_id
}
```

**Output:**
```ts
{
  asset_id: string
  results: Array<{
    platform: string
    account_id: string
    task_id: string
    status: string
    final_caption: string
    publish_url?: string
    error?: string
  }>
  summary: {
    total: number
    success: number
    failed: number
    queued: number
  }
}
```

---

## 3. TypeScript Types (Contoh)

```ts
// src/types/input.ts

export type Platform =
  | "tiktok"
  | "youtube_shorts"
  | "instagram_reels"
  | "x"
  | "facebook"
  | "threads"
  | "linkedin"
  | "pinterest";

export interface AutoPostInput {
  video_path: string;
  title?: string;
  caption: string;
  hashtags?: string[];
  platforms: Platform[];
  schedule_at?: string | null;
  affiliate_link?: string;
  language?: "id" | "en";
  account_map?: Partial<Record<Platform, string>>;
}

export interface PostResult {
  platform: Platform;
  account_id: string;
  task_id: string;
  status: "queued" | "publishing" | "success" | "failed";
  final_caption: string;
  publish_url?: string;
  error?: string;
}
```

---

## 4. Contoh Definisi Tool (MCP)

```ts
// src/tools/auto-post-pipeline.ts (konsep)

export const autoPostPipelineTool = {
  name: "auto_post_pipeline",
  description:
    "Upload a local video and publish it to multiple social platforms via AiToEarn in one step.",
  inputSchema: {
    type: "object",
    properties: {
      video_path: { type: "string", description: "Local path to the video file" },
      title: { type: "string" },
      caption: { type: "string" },
      hashtags: {
        type: "array",
        items: { type: "string" }
      },
      platforms: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "tiktok",
            "youtube_shorts",
            "instagram_reels",
            "x",
            "facebook",
            "threads",
            "linkedin",
            "pinterest"
          ]
        }
      },
      schedule_at: { type: ["string", "null"] },
      affiliate_link: { type: "string" },
      language: { type: "string", enum: ["id", "en"] },
      account_map: {
        type: "object",
        additionalProperties: { type: "string" }
      }
    },
    required: ["video_path", "caption", "platforms"]
  }
};
```

---

## 5. Alur Internal `auto_post_pipeline`

```text
1. Validasi
   - file exists?
   - format video ok?
   - platforms tidak kosong?

2. Resolve accounts
   - pakai account_map jika ada
   - kalau tidak, ambil default account per platform dari list_accounts

3. Upload video
   - upload_video(video_path) → asset_id

4. Caption adaptation
   - untuk tiap platform:
     - sesuaikan panjang
     - sisipkan hashtag
     - sisipkan affiliate_link (kalau cocok)

5. Create batch tasks
   - create_batch_post(asset_id, posts[])

6. Optional polling singkat
   - get_task_status untuk task yang penting

7. Return summary + detail per platform
```

---

## 6. Caption Adapter (Konsep)

```ts
// src/services/caption.ts (konsep)

export function adaptCaption(params: {
  platform: Platform;
  caption: string;
  hashtags?: string[];
  affiliate_link?: string;
  language?: "id" | "en";
}): string {
  // aturan kasar:
  // - tiktok / reels: caption + hashtag di akhir
  // - x: sangat pendek, link hati-hati
  // - youtube_shorts: title terpisah, description lebih panjang
  // - linkedin: lebih formal, hashtag sedikit
}
```

Contoh aturan sederhana:

| Platform | Max panjang (kasar) | Hashtag | Link |
|----------|----------------------|---------|------|
| TikTok | sedang | banyak | boleh |
| Instagram Reels | sedang | banyak | hati-hati |
| YouTube Shorts | description panjang | sedang | boleh |
| X | sangat pendek | sedikit | mahal/berisiko |
| LinkedIn | panjang | sedikit | boleh |

---

## 7. `package.json` (Skeleton)

```json
{
  "name": "aitoearn-bridge",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.23.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0"
  }
}
```

---

## 8. Env Config

```bash
# .env.example
AITOEARN_API_KEY=your_api_key_here
AITOEARN_BASE_URL=https://aitoearn.ai
AITOEARN_MCP_URL=https://aitoearn.ai/api/unified/mcp
DEFAULT_LANGUAGE=id
```

---

## 9. Cara Agent Memanggil (Contoh Natural Language)

Setelah MCP terpasang, agent cukup dipanggil seperti ini:

```text
Post video ./output/final.mp4 ke TikTok dan Instagram Reels.
Caption: "Review produk ini worth it banget!"
Hashtag: affiliate, review, fyp
Sertakan link: https://shopee.co.id/xxx
```

Agent akan memetakan perintah itu ke:

```ts
auto_post_pipeline({
  video_path: "./output/final.mp4",
  caption: "Review produk ini worth it banget!",
  hashtags: ["affiliate", "review", "fyp"],
  platforms: ["tiktok", "instagram_reels"],
  affiliate_link: "https://shopee.co.id/xxx",
  language: "id"
})
```

---

## 10. Prioritas Implementasi

Kalau kamu bangun bertahap:

1. **Minimal viable**
   - `list_accounts`
   - `upload_video`
   - `create_batch_post`

2. **Core value**
   - `auto_post_pipeline`
   - caption adapter sederhana

3. **Production**
   - `get_task_status`
   - logging
   - retry
   - validasi video lebih ketat

---

## Ringkasan

- **Struktur project**: modular (`tools/`, `services/`, `types/`)
- **Tool utama**: `auto_post_pipeline`
- **Tools pendukung**: list accounts, upload, create post/batch, cek status
- **Fokus desain**: input stabil dari agent → output status jelas per platform

---

Kalau mau lanjut, saya bisa buatkan salah satu dari ini berikutnya:

1. **Skeleton kode siap jalan** (`src/index.ts` + 1–2 tool dulu)
2. **Isi lengkap `SKILL.md`** untuk Antigravity
3. **Mapping konkret** field AiToEarn API/MCP ke schema di atas

Mau lanjut yang mana?


Berikut **mapping konkret** field AiToEarn API/MCP ke schema custom connector kita.

---

## 1. Alur Resmi AiToEarn (yang harus diikuti)

```text
1. List platforms          → GET /api/v2/channels/platforms
2. List accounts           → GET /api/v2/channels/accounts
3. Upload asset (lokal)    → uploadSign → PUT file → confirm
4. Create publishing flow  → POST /api/v2/channels/publish-flows
5. Query status            → GET /api/v2/channels/publish-flows/{flowId}
                           → GET /api/v2/channels/publish-records/{recordId}
```

Auth header: `X-Api-Key: <API_KEY>`

Base URL:
- Internasional: `https://aitoearn.ai`
- China: `https://aitoearn.cn`

---

## 2. Mapping Tool → API AiToEarn

| Tool Bridge Kita | API / Endpoint AiToEarn | Keterangan |
|------------------|-------------------------|------------|
| `list_accounts` | `GET /api/v2/channels/accounts` | Ambil `accountId`, platform, status |
| `upload_video` | `POST /api/assets/uploadSign` → `PUT uploadUrl` → `POST /api/assets/{id}/confirm` | Hasil akhir = **public URL** |
| `create_post` / `create_batch_post` | `POST /api/v2/channels/publish-flows` | 1 flow bisa multi-platform |
| `get_task_status` | `GET /api/v2/channels/publish-flows/{flowId}` + `GET /api/v2/channels/publish-records/{recordId}` | Status per platform |
| `auto_post_pipeline` | kombinasi semua di atas | Orchestrator |

---

## 3. Mapping Field Detail

### A. `list_accounts`

**Response AiToEarn (konsep):**
```json
{
  "data": [
    {
      "accountId": "acc_xxx",
      "platform": "tiktok",
      "displayName": "...",
      "username": "...",
      "status": "active"
    }
  ]
}
```

**Mapping ke schema kita:**

| AiToEarn | Bridge |
|----------|--------|
| `accountId` | `account_id` |
| `platform` | `platform` |
| `displayName` | `display_name` |
| `username` | `username` |
| `status` | `status` |

---

### B. `upload_video` (Asset Upload)

**Step resmi AiToEarn:**

1. **Generate sign**
```http
POST /api/assets/uploadSign
Body:
{
  "filename": "final.mp4",
  "type": "publishMedia",
  "size": 10485760
}
```

Response penting:
- `data.id`
- `data.uploadUrl`
- `data.url` (sementara)

2. **PUT file** ke `uploadUrl` (tanpa API key)

3. **Confirm**
```http
POST /api/assets/{id}/confirm
```

Response penting:
- `data.url` → **ini yang dipakai di publish**

**Mapping:**

| Bridge Input | AiToEarn |
|--------------|----------|
| `video_path` | dibaca lokal → di-upload sebagai file |
| `title` (opsional) | tidak wajib di upload stage |

| Bridge Output | AiToEarn |
|---------------|----------|
| `asset_id` | `data.id` (dari sign/confirm) |
| `media_url` | `data.url` (setelah confirm) |

> Catatan: Publish flow AiToEarn **membutuhkan URL publik**, bukan path lokal. Jadi `upload_video` wajib menghasilkan `media_url`.

---

### C. Create Publish Flow (inti)

**Request resmi AiToEarn:**

```json
{
  "content": {
    "title": "Judul video",
    "body": "Caption utama...",
    "media": [
      { "url": "https://assets.aitoearn.ai/xxx.mp4" }
    ],
    "cover": {
      "url": "https://assets.aitoearn.ai/cover.jpg"
    }
  },
  "items": [
    {
      "platform": "tiktok",
      "accountId": "acc_xxx",
      "option": {},
      "overrides": {
        "title": "Judul khusus platform",
        "body": "Caption khusus platform"
      }
    }
  ]
}
```

**Mapping dari schema bridge:**

| Bridge (`auto_post_pipeline`) | AiToEarn Publish Flow |
|-------------------------------|------------------------|
| `title` | `content.title` |
| `caption` + hashtags (setelah adapt) | `content.body` |
| `media_url` (hasil upload) | `content.media[0].url` |
| `thumbnail_path` → upload dulu | `content.cover.url` |
| `platforms[]` + `account_map` | `items[].platform` + `items[].accountId` |
| caption per platform | `items[].overrides.body` / `overrides.title` |
| platform-specific (boardId, tid, dll) | `items[].option` |
| `schedule_at` | (cek field schedule di API versi terbaru; sering di item/option) |

**Response penting:**
- `flowId` → dipakai untuk tracking

---

### D. `get_task_status`

| Bridge | AiToEarn |
|--------|----------|
| `task_id` (bisa `flowId` atau `recordId`) | `flowId` / `recordId` |
| `status` | status dari flow detail / publish record |
| `publish_url` | link karya dari publish record (jika ada) |
| `error` | error message dari record gagal |

Status kasar yang perlu di-map:
- queued / publishing / success / failed  
- untuk Douyin: ada state “menunggu user action” (short link)

---

## 4. Mapping Platform Name

Schema bridge kita memakai nama ramah agent. AiToEarn memakai kode platform internal.

| Bridge `platforms` | AiToEarn `platform` (perkiraan / cek via API) |
|--------------------|-----------------------------------------------|
| `tiktok` | `tiktok` |
| `youtube_shorts` | `youtube` (tipe short di option/konten) |
| `instagram_reels` | `instagram` |
| `x` | `twitter` / `x` |
| `facebook` | `facebook` |
| `threads` | `threads` |
| `linkedin` | `linkedin` |
| `pinterest` | `pinterest` |
| (China) `douyin` | `douyin` |
| (China) `xiaohongshu` | `xhs` |

**Wajib:** panggil dulu `GET /api/v2/channels/platforms` dan pakai nilai `platform` resmi dari response, jangan hardcode buta.

---

## 5. Mapping `auto_post_pipeline` → Urutan Call

```text
auto_post_pipeline(input)
│
├─ 1. Validasi video_path
├─ 2. list_accounts (atau pakai account_map)
├─ 3. upload_video
│     POST /api/assets/uploadSign
│     PUT  uploadUrl
│     POST /api/assets/{id}/confirm
│     → media_url
│
├─ 4. Adapt caption per platform
│     → final_caption[platform]
│
├─ 5. Build body:
│     content.title
│     content.body
│     content.media[0].url = media_url
│     items[] = { platform, accountId, overrides, option }
│
├─ 6. POST /api/v2/channels/publish-flows
│     → flowId
│
└─ 7. (opsional) poll publish-flows / publish-records
      → results[]
```

---

## 6. Contoh Transform Konkret

**Input agent:**
```json
{
  "video_path": "./out/final.mp4",
  "title": "Review produk X",
  "caption": "Worth it banget!",
  "hashtags": ["affiliate", "review"],
  "platforms": ["tiktok", "instagram_reels"],
  "affiliate_link": "https://shopee.co.id/xxx",
  "language": "id"
}
```

**Setelah upload:**
```text
media_url = https://assets.aitoearn.ai/..../final.mp4
```

**Body ke AiToEarn:**
```json
{
  "content": {
    "title": "Review produk X",
    "body": "Worth it banget!\n\nhttps://shopee.co.id/xxx\n\n#affiliate #review",
    "media": [
      { "url": "https://assets.aitoearn.ai/..../final.mp4" }
    ]
  },
  "items": [
    {
      "platform": "tiktok",
      "accountId": "acc_tiktok_1",
      "overrides": {
        "body": "Worth it banget! 🔥\n\nLink di bio / https://shopee.co.id/xxx\n\n#affiliate #review #fyp"
      }
    },
    {
      "platform": "instagram",
      "accountId": "acc_ig_1",
      "overrides": {
        "body": "Worth it banget!\n\nLink: https://shopee.co.id/xxx\n\n#affiliate #review #reels"
      }
    }
  ]
}
```

---

## 7. Field yang Perlu Diingat (Penting)

| Hal | Detail |
|-----|--------|
| Media | Harus **URL publik**, bukan path lokal |
| `accountId` | Wajib per item; ambil dari list accounts |
| `option` | Platform-specific (Pinterest `boardId`, Bilibili `tid`, dll) |
| `overrides` | Caption/title beda per platform |
| Free quota | ~1000 publish call/bulan (shared); X punya biaya ekstra |
| Douyin / XHS / Channels | Sering lebih cocok lewat **browser extension**, bukan pure API |

---

## 8. Rekomendasi Implementasi Bridge

Di `aitoearn-client.ts` buat method setara:

```ts
listPlatforms()
listAccounts()
uploadPublishMedia(filePath)  // sign → put → confirm → url
createPublishFlow(content, items)
getFlowDetail(flowId)
getPublishRecord(recordId)
```

Lalu tool MCP hanya menjadi thin layer di atas client itu.

---

## Ringkasan Mapping

| Konsep Bridge | Konsep AiToEarn |
|---------------|-----------------|
| `account_id` | `accountId` |
| `media_url` / asset hasil upload | `content.media[].url` |
| `caption` | `content.body` (+ `overrides.body`) |
| `title` | `content.title` (+ `overrides.title`) |
| `platforms` | `items[].platform` |
| `task_id` | `flowId` / `recordId` |
| batch post | 1x `publish-flows` dengan banyak `items` |

---

Kalau mau lanjut, langkah paling natural berikutnya:
1. **Skeleton kode** (`aitoearn-client` + 2 tool dulu: `list_accounts` + `upload_video`)
2. Atau **SKILL.md** Antigravity yang memakai mapping ini



Skeleton TypeScript siap lanjut: `aitoearn-client` + 2 tool (`list_accounts`, `upload_video`).

---

### Struktur minimal

```text
aitoearn-bridge/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── index.ts
    ├── server.ts
    ├── types.ts
    ├── utils/
    │   └── env.ts
    ├── services/
    │   └── aitoearn-client.ts
    └── tools/
        ├── list-accounts.ts
        └── upload-video.ts
```

---

### `package.json`

```json
{
  "name": "aitoearn-bridge",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.6.1",
    "dotenv": "^16.4.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^22.13.10",
    "tsx": "^4.19.3",
    "typescript": "^5.8.2"
  }
}
```

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

---

### `.env.example`

```bash
AITOEARN_API_KEY=your_api_key_here
AITOEARN_BASE_URL=https://aitoearn.ai
```

---

### `src/utils/env.ts`

```ts
import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export const env = {
  apiKey: required("AITOEARN_API_KEY"),
  baseUrl: (process.env.AITOEARN_BASE_URL || "https://aitoearn.ai").replace(/\/$/, ""),
};
```

---

### `src/types.ts`

```ts
export type AccountStatus = "active" | "expired" | "error" | "unknown";

export interface ChannelAccount {
  accountId: string;
  platform: string;
  displayName?: string;
  username?: string;
  status: AccountStatus;
}

export interface UploadVideoResult {
  assetId: string;
  mediaUrl: string;
  sizeBytes?: number;
}
```

---

### `src/services/aitoearn-client.ts`

```ts
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { env } from "../utils/env.js";
import type { ChannelAccount, UploadVideoResult } from "../types.js";

type Json = Record<string, unknown>;

export class AiToEarnClient {
  constructor(
    private readonly apiKey = env.apiKey,
    private readonly baseUrl = env.baseUrl,
  ) {}

  private async request<T = Json>(
    method: string,
    endpoint: string,
    options?: {
      body?: unknown;
      headers?: Record<string, string>;
      raw?: boolean;
    },
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "X-Api-Key": this.apiKey,
        ...(options?.body ? { "Content-Type": "application/json" } : {}),
        ...(options?.headers || {}),
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      throw new Error(
        `AiToEarn ${method} ${endpoint} failed (${res.status}): ${text.slice(0, 500)}`,
      );
    }

    // Banyak endpoint AiToEarn memakai envelope { code, message, data }
    if (typeof data?.code === "number" && data.code !== 0) {
      throw new Error(data.message || `AiToEarn error code=${data.code}`);
    }

    return (options?.raw ? data : data.data ?? data) as T;
  }

  async listAccounts(params?: {
    page?: number;
    pageSize?: number;
    platform?: string;
  }): Promise<ChannelAccount[]> {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.pageSize) q.set("pageSize", String(params.pageSize));
    if (params?.platform) q.set("platform", params.platform);

    const query = q.toString() ? `?${q.toString()}` : "";
    const data = await this.request<any>("GET", `/api/v2/channels/accounts${query}`);

    // Bentuk response bisa list langsung atau { list: [...] }
    const rows: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.list)
        ? data.list
        : Array.isArray(data?.items)
          ? data.items
          : [];

    return rows.map((row) => ({
      accountId: String(row.accountId ?? row.id ?? ""),
      platform: String(row.platform ?? row.channel ?? "unknown"),
      displayName: row.displayName ?? row.nickname ?? row.name,
      username: row.username ?? row.handle,
      status: normalizeStatus(row.status),
    })).filter((a) => a.accountId);
  }

  async uploadPublishMedia(videoPath: string): Promise<UploadVideoResult> {
    const abs = path.resolve(videoPath);
    const fileStat = await stat(abs);
    const filename = path.basename(abs);
    const buffer = await readFile(abs);

    // 1) minta signed upload URL
    const sign = await this.request<any>("POST", "/api/assets/uploadSign", {
      body: {
        filename,
        type: "publishMedia",
        size: fileStat.size,
      },
    });

    const assetId = String(sign.id ?? sign.assetId ?? "");
    const uploadUrl = String(sign.uploadUrl ?? "");
    if (!assetId || !uploadUrl) {
      throw new Error("uploadSign response missing id/uploadUrl");
    }

    // 2) PUT file ke object storage (tanpa X-Api-Key)
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": guessContentType(filename),
      },
      body: buffer,
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Upload PUT failed (${putRes.status}): ${errText.slice(0, 300)}`);
    }

    // 3) confirm
    const confirmed = await this.request<any>("POST", `/api/assets/${assetId}/confirm`);
    const mediaUrl = String(confirmed?.url ?? sign.url ?? "");
    if (!mediaUrl) {
      throw new Error("confirm upload did not return media url");
    }

    return {
      assetId,
      mediaUrl,
      sizeBytes: fileStat.size,
    };
  }
}

function normalizeStatus(status: unknown): ChannelAccount["status"] {
  const s = String(status ?? "unknown").toLowerCase();
  if (["active", "ok", "success", "authorized"].includes(s)) return "active";
  if (["expired", "expire", "token_expired"].includes(s)) return "expired";
  if (["error", "failed", "invalid"].includes(s)) return "error";
  return "unknown";
}

function guessContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".webm") return "video/webm";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  return "application/octet-stream";
}
```

---

### `src/tools/list-accounts.ts`

```ts
import { z } from "zod";
import { AiToEarnClient } from "../services/aitoearn-client.js";

export const listAccountsInputSchema = z.object({
  platform: z.string().optional().describe("Filter by platform code, e.g. tiktok"),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

export type ListAccountsInput = z.infer<typeof listAccountsInputSchema>;

export async function listAccountsTool(input: ListAccountsInput) {
  const client = new AiToEarnClient();
  const accounts = await client.listAccounts(input);

  return {
    count: accounts.length,
    accounts,
  };
}

export const listAccountsToolDef = {
  name: "list_accounts",
  description:
    "List social accounts connected to AiToEarn that can be used for publishing.",
  inputSchema: {
    type: "object",
    properties: {
      platform: {
        type: "string",
        description: "Optional platform filter, e.g. tiktok, instagram, youtube",
      },
      page: { type: "number" },
      pageSize: { type: "number" },
    },
  },
};
```

---

### `src/tools/upload-video.ts`

```ts
import { z } from "zod";
import { AiToEarnClient } from "../services/aitoearn-client.js";

export const uploadVideoInputSchema = z.object({
  video_path: z.string().min(1).describe("Local path to video file"),
});

export type UploadVideoInput = z.infer<typeof uploadVideoInputSchema>;

export async function uploadVideoTool(input: UploadVideoInput) {
  const client = new AiToEarnClient();
  const result = await client.uploadPublishMedia(input.video_path);

  return {
    asset_id: result.assetId,
    media_url: result.mediaUrl,
    size_bytes: result.sizeBytes,
  };
}

export const uploadVideoToolDef = {
  name: "upload_video",
  description:
    "Upload a local video file to AiToEarn and return a public media URL usable for publishing.",
  inputSchema: {
    type: "object",
    properties: {
      video_path: {
        type: "string",
        description: "Absolute or relative local path to the video file",
      },
    },
    required: ["video_path"],
  },
};
```

---

### `src/server.ts`

```ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  listAccountsInputSchema,
  listAccountsTool,
  listAccountsToolDef,
} from "./tools/list-accounts.js";
import {
  uploadVideoInputSchema,
  uploadVideoTool,
  uploadVideoToolDef,
} from "./tools/upload-video.js";

export async function startServer() {
  const server = new Server(
    { name: "aitoearn-bridge", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [listAccountsToolDef, uploadVideoToolDef],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const name = req.params.name;
    const args = req.params.arguments ?? {};

    try {
      if (name === "list_accounts") {
        const input = listAccountsInputSchema.parse(args);
        const result = await listAccountsTool(input);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      if (name === "upload_video") {
        const input = uploadVideoInputSchema.parse(args);
        const result = await uploadVideoTool(input);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: message }],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

---

### `src/index.ts`

```ts
import { startServer } from "./server.js";

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

---

## Cara jalanin cepat

```bash
cd aitoearn-bridge
cp .env.example .env
# isi AITOEARN_API_KEY

npm install
npm run dev
```

### Tes tanpa MCP dulu (opsional)

Tambah file sementara `src/smoke.ts`:

```ts
import { AiToEarnClient } from "./services/aitoearn-client.js";

const client = new AiToEarnClient();

const accounts = await client.listAccounts();
console.log("accounts:", accounts);

// const uploaded = await client.uploadPublishMedia("./sample.mp4");
// console.log("uploaded:", uploaded);
```

```bash
npx tsx src/smoke.ts
```

---

## Catatan implementasi

1. **Shape response akun** bisa beda antar versi — client sudah toleran (`list` / `items` / array langsung).
2. **Upload** mengikuti flow resmi: `uploadSign` → `PUT` → `confirm` → pakai `url`.
3. Tool output sengaja JSON text biar gampang dibaca agent.
4. Langkah berikutnya natural:
   - `create_batch_post` / `create_publish_flow`
   - `auto_post_pipeline`
   - caption adapter

---

Kalau mau, langkah berikutnya saya lanjutkan langsung ke:
1. **`create_publish_flow` tool**, atau  
2. **`auto_post_pipeline` skeleton** di atas 2 tool ini.

Skeleton `auto_post_pipeline` di atas `list_accounts` + `upload_video`.

---

### File baru / update

```text
src/
├── services/
│   ├── aitoearn-client.ts   # tambah createPublishFlow + getFlowDetail
│   └── caption.ts           # baru
├── tools/
│   └── auto-post-pipeline.ts # baru
├── types.ts                 # update
└── server.ts                # register tool baru
```

---

### 1) Update `src/types.ts`

```ts
export type AccountStatus = "active" | "expired" | "error" | "unknown";

export type Platform =
  | "tiktok"
  | "youtube_shorts"
  | "instagram_reels"
  | "x"
  | "facebook"
  | "threads"
  | "linkedin"
  | "pinterest"
  | string;

export interface ChannelAccount {
  accountId: string;
  platform: string;
  displayName?: string;
  username?: string;
  status: AccountStatus;
}

export interface UploadVideoResult {
  assetId: string;
  mediaUrl: string;
  sizeBytes?: number;
}

export interface AutoPostInput {
  video_path: string;
  title?: string;
  caption: string;
  hashtags?: string[];
  platforms: Platform[];
  schedule_at?: string | null;
  affiliate_link?: string;
  language?: "id" | "en";
  account_map?: Partial<Record<string, string>>; // platform -> accountId
  cover_path?: string;
}

export interface PostResult {
  platform: string;
  account_id: string;
  task_id?: string;
  status: "queued" | "publishing" | "success" | "failed" | "unknown";
  final_caption: string;
  publish_url?: string;
  error?: string;
}

export interface AutoPostOutput {
  asset_id: string;
  media_url: string;
  flow_id?: string;
  results: PostResult[];
  summary: {
    total: number;
    success: number;
    failed: number;
    queued: number;
  };
}
```

---

### 2) `src/services/caption.ts`

```ts
import type { Platform } from "../types.js";

export function adaptCaption(params: {
  platform: Platform;
  caption: string;
  hashtags?: string[];
  affiliate_link?: string;
  language?: "id" | "en";
}): string {
  const tags = (params.hashtags || [])
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");

  let body = params.caption.trim();

  // sisipkan affiliate link
  if (params.affiliate_link) {
    if (params.platform === "x") {
      // X sensitif URL / bisa berbayar — taruh hemat
      body = `${body}\n\n${params.affiliate_link}`;
    } else {
      body = `${body}\n\n${params.affiliate_link}`;
    }
  }

  // hashtag strategy sederhana
  if (tags) {
    if (params.platform === "linkedin") {
      // linkedin: hashtag sedikit
      const few = tags.split(/\s+/).slice(0, 3).join(" ");
      body = `${body}\n\n${few}`;
    } else if (params.platform === "x") {
      const few = tags.split(/\s+/).slice(0, 2).join(" ");
      body = `${body}\n\n${few}`;
    } else {
      body = `${body}\n\n${tags}`;
    }
  }

  // hard limit kasar biar aman
  const limits: Record<string, number> = {
    x: 260,
    threads: 480,
    tiktok: 2200,
    instagram_reels: 2100,
    youtube_shorts: 4500,
    linkedin: 2800,
    facebook: 4500,
    pinterest: 480,
  };

  const max = limits[params.platform] ?? 2000;
  if (body.length > max) body = body.slice(0, max - 1) + "…";

  return body;
}

/** Map nama ramah agent -> kode platform AiToEarn (sesuaikan setelah cek /platforms) */
export function toAiToEarnPlatform(platform: Platform): string {
  const map: Record<string, string> = {
    tiktok: "tiktok",
    youtube_shorts: "youtube",
    instagram_reels: "instagram",
    x: "twitter", // kadang "x" — verifikasi via GET /platforms
    facebook: "facebook",
    threads: "threads",
    linkedin: "linkedin",
    pinterest: "pinterest",
  };
  return map[platform] || String(platform);
}
```

---

### 3) Tambah method di `src/services/aitoearn-client.ts`

Tambahkan method ini di class `AiToEarnClient`:

```ts
  async createPublishFlow(payload: {
    content: {
      title?: string;
      body: string;
      media: Array<{ url: string }>;
      cover?: { url: string };
    };
    items: Array<{
      platform: string;
      accountId: string;
      option?: Record<string, unknown>;
      overrides?: {
        title?: string;
        body?: string;
      };
    }>;
    // schedule field bisa beda antar versi API — taruh di root dulu
    scheduleAt?: string | null;
  }): Promise<{ flowId: string; raw: any }> {
    const body: Record<string, unknown> = {
      content: payload.content,
      items: payload.items,
    };

    // kalau API support schedule di root
    if (payload.scheduleAt) {
      body.scheduleAt = payload.scheduleAt;
    }

    const data = await this.request<any>("POST", "/api/v2/channels/publish-flows", {
      body,
    });

    const flowId = String(data.flowId ?? data.id ?? "");
    if (!flowId) {
      throw new Error("createPublishFlow response missing flowId");
    }

    return { flowId, raw: data };
  }

  async getFlowDetail(flowId: string): Promise<any> {
    return this.request<any>("GET", `/api/v2/channels/publish-flows/${flowId}`);
  }
```

> `uploadPublishMedia` & `listAccounts` tetap seperti skeleton sebelumnya.

---

### 4) `src/tools/auto-post-pipeline.ts`

```ts
import { z } from "zod";
import { AiToEarnClient } from "../services/aitoearn-client.js";
import { adaptCaption, toAiToEarnPlatform } from "../services/caption.js";
import type { AutoPostOutput, PostResult } from "../types.js";

export const autoPostInputSchema = z.object({
  video_path: z.string().min(1),
  title: z.string().optional(),
  caption: z.string().min(1),
  hashtags: z.array(z.string()).optional(),
  platforms: z.array(z.string()).min(1),
  schedule_at: z.string().nullable().optional(),
  affiliate_link: z.string().optional(),
  language: z.enum(["id", "en"]).optional(),
  account_map: z.record(z.string()).optional(),
  cover_path: z.string().optional(),
});

export type AutoPostPipelineInput = z.infer<typeof autoPostInputSchema>;

export async function autoPostPipelineTool(
  input: AutoPostPipelineInput,
): Promise<AutoPostOutput> {
  const client = new AiToEarnClient();

  // 1) resolve accounts
  const allAccounts = await client.listAccounts();
  const activeAccounts = allAccounts.filter((a) => a.status === "active" || a.status === "unknown");

  const selected: Array<{ platform: string; accountId: string; finalCaption: string }> = [];

  for (const p of input.platforms) {
    const apiPlatform = toAiToEarnPlatform(p);

    // prioritas account_map
    let accountId = input.account_map?.[p] || input.account_map?.[apiPlatform];

    if (!accountId) {
      const found = activeAccounts.find(
        (a) =>
          a.platform.toLowerCase() === apiPlatform.toLowerCase() ||
          a.platform.toLowerCase() === String(p).toLowerCase(),
      );
      accountId = found?.accountId;
    }

    if (!accountId) {
      selected.push({
        platform: p,
        accountId: "",
        finalCaption: "",
      });
      continue;
    }

    const finalCaption = adaptCaption({
      platform: p,
      caption: input.caption,
      hashtags: input.hashtags,
      affiliate_link: input.affiliate_link,
      language: input.language,
    });

    selected.push({ platform: p, accountId, finalCaption });
  }

  // 2) upload video
  const uploaded = await client.uploadPublishMedia(input.video_path);

  // optional cover
  let coverUrl: string | undefined;
  if (input.cover_path) {
    const cover = await client.uploadPublishMedia(input.cover_path);
    coverUrl = cover.mediaUrl;
  }

  // 3) build items (skip yang tidak ketemu account)
  const items = selected
    .filter((s) => s.accountId)
    .map((s) => ({
      platform: toAiToEarnPlatform(s.platform),
      accountId: s.accountId,
      overrides: {
        title: input.title,
        body: s.finalCaption,
      },
      option: {}, // isi nanti kalau perlu boardId/tid/dll
    }));

  const results: PostResult[] = [];

  if (items.length === 0) {
    for (const s of selected) {
      results.push({
        platform: s.platform,
        account_id: "",
        status: "failed",
        final_caption: s.finalCaption || input.caption,
        error: "No connected account found for platform",
      });
    }

    return {
      asset_id: uploaded.assetId,
      media_url: uploaded.mediaUrl,
      results,
      summary: summarize(results),
    };
  }

  // 4) create publish flow
  let flowId: string | undefined;
  try {
    const created = await client.createPublishFlow({
      content: {
        title: input.title || input.caption.slice(0, 80),
        body: input.caption,
        media: [{ url: uploaded.mediaUrl }],
        ...(coverUrl ? { cover: { url: coverUrl } } : {}),
      },
      items,
      scheduleAt: input.schedule_at ?? null,
    });

    flowId = created.flowId;

    // baseline result: queued
    for (const s of selected) {
      if (!s.accountId) {
        results.push({
          platform: s.platform,
          account_id: "",
          status: "failed",
          final_caption: s.finalCaption || input.caption,
          error: "No connected account found for platform",
        });
      } else {
        results.push({
          platform: s.platform,
          account_id: s.accountId,
          task_id: flowId,
          status: "queued",
          final_caption: s.finalCaption,
        });
      }
    }

    // 5) optional: soft poll flow detail (best-effort)
    try {
      const detail = await client.getFlowDetail(flowId);
      // mapping detail sangat bergantung shape API; biarkan best-effort
      // kalau ada records, bisa enrich status di sini nanti
      void detail;
    } catch {
      // ignore polling errors di skeleton
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    for (const s of selected) {
      results.push({
        platform: s.platform,
        account_id: s.accountId || "",
        status: "failed",
        final_caption: s.finalCaption || input.caption,
        error: message,
      });
    }
  }

  return {
    asset_id: uploaded.assetId,
    media_url: uploaded.mediaUrl,
    flow_id: flowId,
    results,
    summary: summarize(results),
  };
}

function summarize(results: PostResult[]) {
  return {
    total: results.length,
    success: results.filter((r) => r.status === "success").length,
    failed: results.filter((r) => r.status === "failed").length,
    queued: results.filter((r) => r.status === "queued" || r.status === "publishing").length,
  };
}

export const autoPostPipelineToolDef = {
  name: "auto_post_pipeline",
  description:
    "Upload a local video and publish it to multiple social platforms via AiToEarn in one step.",
  inputSchema: {
    type: "object",
    properties: {
      video_path: { type: "string", description: "Local path to video file" },
      title: { type: "string" },
      caption: { type: "string" },
      hashtags: {
        type: "array",
        items: { type: "string" },
      },
      platforms: {
        type: "array",
        items: { type: "string" },
        description: "e.g. tiktok, instagram_reels, youtube_shorts, x",
      },
      schedule_at: {
        type: ["string", "null"],
        description: "ISO datetime or null for immediate publish",
      },
      affiliate_link: { type: "string" },
      language: { type: "string", enum: ["id", "en"] },
      account_map: {
        type: "object",
        additionalProperties: { type: "string" },
        description: "Optional map of platform -> accountId",
      },
      cover_path: { type: "string" },
    },
    required: ["video_path", "caption", "platforms"],
  },
};
```

---

### 5) Update `src/server.ts` (register tool)

Tambahkan import + list tools + handler:

```ts
import {
  autoPostInputSchema,
  autoPostPipelineTool,
  autoPostPipelineToolDef,
} from "./tools/auto-post-pipeline.js";

// di ListToolsRequestSchema:
tools: [listAccountsToolDef, uploadVideoToolDef, autoPostPipelineToolDef],

// di CallToolRequestSchema:
if (name === "auto_post_pipeline") {
  const input = autoPostInputSchema.parse(args);
  const result = await autoPostPipelineTool(input);
  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
}
```

---

### Contoh pemanggilan agent

```text
auto_post_pipeline
video_path: ./out/final.mp4
caption: Review produk ini worth it banget
hashtags: ["affiliate", "review", "fyp"]
platforms: ["tiktok", "instagram_reels"]
affiliate_link: https://shopee.co.id/xxx
language: id
```

### Output (bentuk)

```json
{
  "asset_id": "ast_123",
  "media_url": "https://assets.aitoearn.ai/....mp4",
  "flow_id": "flow_abc",
  "results": [
    {
      "platform": "tiktok",
      "account_id": "acc_1",
      "task_id": "flow_abc",
      "status": "queued",
      "final_caption": "Review produk ini worth it banget\n\nhttps://shopee.co.id/xxx\n\n#affiliate #review #fyp"
    }
  ],
  "summary": {
    "total": 1,
    "success": 0,
    "failed": 0,
    "queued": 1
  }
}
```

---

## Urutan jalan internal

```text
validate input
  → list accounts / account_map
  → upload video (+ optional cover)
  → adapt caption per platform
  → create publish flow (multi items)
  → return flow_id + per-platform results
```

---

## Yang masih skeleton (lanjutan berikutnya)

1. **Mapping status akurat** dari `publish-flows` / `publish-records`
2. **Platform option** (Pinterest `boardId`, Bilibili `tid`, dll)
3. **Schedule field** sesuai schema resmi terbaru
4. **Retry** upload / create flow
5. Validasi ketat lewat `GET /api/v2/channels/platforms`

---

Kalau mau lanjut, langkah paling berguna berikutnya:
1. **enrich status polling** (`get_task_status` + map record status), atau  
2. **SKILL.md Antigravity** yang memanggil `auto_post_pipeline` dengan prompt natural language.


Enrichment status polling: `get_task_status` + mapping record/flow status, lalu digabung ke pipeline.

---

### 1) Tambah types status

Update `src/types.ts`:

```ts
export type PublishStatus =
  | "queued"
  | "publishing"
  | "waiting_user_action"
  | "success"
  | "failed"
  | "cancelled"
  | "unknown";

export interface TaskStatusResult {
  task_id: string;          // flowId atau recordId
  kind: "flow" | "record";
  status: PublishStatus;
  platform?: string;
  account_id?: string;
  publish_url?: string;
  error_message?: string;
  raw_status?: string | number;
  updated_at?: string;
  records?: TaskStatusResult[]; // kalau task_id = flowId
}
```

---

### 2) Status mapper `src/services/status.ts`

```ts
import type { PublishStatus } from "../types.js";

/**
 * Normalisasi status dari berbagai bentuk response AiToEarn.
 * Beberapa API pakai string, sebagian (terutama Douyin record) pakai kode angka.
 */
export function mapPublishStatus(input: unknown): PublishStatus {
  if (input == null) return "unknown";

  // numeric codes (terlihat di flow Douyin docs)
  if (typeof input === "number" || /^[-]?\d+$/.test(String(input))) {
    const code = Number(input);
    // heuristic dari docs publik:
    // 0,2,6 = masih proses
    // 8 = menunggu user action (short link / app confirm)
    // -1,5,9 = gagal/cancel
    if ([0, 2, 6].includes(code)) return "publishing";
    if (code === 8) return "waiting_user_action";
    if ([-1, 5, 9].includes(code)) return code === 9 ? "cancelled" : "failed";
    if ([1, 3, 4, 7, 10].includes(code)) {
      // cadangan umum: anggap success/publishing tergantung ekosistem
      // lebih aman unknown kalau tidak yakin
      return "unknown";
    }
  }

  const s = String(input).toLowerCase();

  if (["queued", "pending", "created", "waiting"].includes(s)) return "queued";
  if (["publishing", "processing", "running", "in_progress", "uploading"].includes(s)) {
    return "publishing";
  }
  if (
    ["waiting_user_action", "user_action", "need_user_action", "awaiting_user"].includes(s)
  ) {
    return "waiting_user_action";
  }
  if (["success", "succeeded", "published", "done", "completed", "ok"].includes(s)) {
    return "success";
  }
  if (["failed", "fail", "error", "rejected"].includes(s)) return "failed";
  if (["cancelled", "canceled", "aborted"].includes(s)) return "cancelled";

  return "unknown";
}

export function isTerminal(status: PublishStatus): boolean {
  return status === "success" || status === "failed" || status === "cancelled";
}
```

---

### 3) Method client: flow + record

Tambah di `src/services/aitoearn-client.ts`:

```ts
  async getFlowDetail(flowId: string): Promise<any> {
    return this.request<any>("GET", `/api/v2/channels/publish-flows/${flowId}`);
  }

  async getPublishRecord(recordId: string): Promise<any> {
    return this.request<any>("GET", `/api/v2/channels/publish-records/${recordId}`);
  }

  /**
   * Best-effort extract records dari flow detail.
   * Shape API bisa { records: [] } / { items: [] } / { tasks: [] }.
   */
  extractRecordsFromFlow(flowDetail: any): any[] {
    if (!flowDetail) return [];
    if (Array.isArray(flowDetail.records)) return flowDetail.records;
    if (Array.isArray(flowDetail.items)) return flowDetail.items;
    if (Array.isArray(flowDetail.tasks)) return flowDetail.tasks;
    if (Array.isArray(flowDetail.data?.records)) return flowDetail.data.records;
    if (Array.isArray(flowDetail.list)) return flowDetail.list;
    return [];
  }
```

---

### 4) Tool `src/tools/get-task-status.ts`

```ts
import { z } from "zod";
import { AiToEarnClient } from "../services/aitoearn-client.js";
import { mapPublishStatus } from "../services/status.js";
import type { TaskStatusResult } from "../types.js";

export const getTaskStatusInputSchema = z.object({
  task_id: z.string().min(1).describe("flowId atau recordId"),
  kind: z.enum(["auto", "flow", "record"]).optional().default("auto"),
});

export type GetTaskStatusInput = z.infer<typeof getTaskStatusInputSchema>;

export async function getTaskStatusTool(
  input: GetTaskStatusInput,
): Promise<TaskStatusResult> {
  const client = new AiToEarnClient();
  const kind = input.kind || "auto";

  // 1) coba sebagai flow dulu (default auto)
  if (kind === "auto" || kind === "flow") {
    try {
      const flow = await client.getFlowDetail(input.task_id);
      const recordsRaw = client.extractRecordsFromFlow(flow);

      const records: TaskStatusResult[] = [];
      for (const rec of recordsRaw) {
        const recordId = String(rec.recordId ?? rec.id ?? "");
        // kalau ada id record, optional fetch detail lebih dalam
        let detail = rec;
        if (recordId) {
          try {
            detail = await client.getPublishRecord(recordId);
          } catch {
            // pakai data dari flow saja
          }
        }
        records.push(mapRecord(detail, recordId || input.task_id));
      }

      const aggregate = aggregateStatus(records, flow);
      return {
        task_id: input.task_id,
        kind: "flow",
        status: aggregate,
        raw_status: flow.status ?? flow.state,
        updated_at: flow.updatedAt ?? flow.updated_at,
        records,
      };
    } catch (err) {
      if (kind === "flow") throw err;
      // auto mode: fallback ke record
    }
  }

  // 2) sebagai record
  const rec = await client.getPublishRecord(input.task_id);
  return mapRecord(rec, input.task_id);
}

function mapRecord(rec: any, fallbackId: string): TaskStatusResult {
  const statusValue =
    rec?.status ??
    rec?.state ??
    rec?.publishStatus ??
    rec?.recordStatus ??
    rec?.code;

  return {
    task_id: String(rec?.recordId ?? rec?.id ?? fallbackId),
    kind: "record",
    status: mapPublishStatus(statusValue),
    platform: rec?.platform ?? rec?.channel,
    account_id: rec?.accountId ?? rec?.account_id,
    publish_url:
      rec?.publishUrl ??
      rec?.shareLink ??
      rec?.workUrl ??
      rec?.url ??
      rec?.permalink,
    error_message:
      rec?.errorMessage ??
      rec?.failReason ??
      rec?.error ??
      rec?.message,
    raw_status: statusValue,
    updated_at: rec?.updatedAt ?? rec?.updated_at,
  };
}

function aggregateStatus(
  records: TaskStatusResult[],
  flow: any,
): TaskStatusResult["status"] {
  if (records.length === 0) {
    return mapPublishStatus(flow?.status ?? flow?.state);
  }
  if (records.every((r) => r.status === "success")) return "success";
  if (records.every((r) => r.status === "failed" || r.status === "cancelled")) {
    return "failed";
  }
  if (records.some((r) => r.status === "waiting_user_action")) {
    return "waiting_user_action";
  }
  if (records.some((r) => r.status === "publishing" || r.status === "queued")) {
    return "publishing";
  }
  if (records.some((r) => r.status === "success")) return "publishing"; // partial
  return "unknown";
}

export const getTaskStatusToolDef = {
  name: "get_task_status",
  description:
    "Get publish status for an AiToEarn flowId or recordId, including per-platform records when available.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "flowId or publish recordId",
      },
      kind: {
        type: "string",
        enum: ["auto", "flow", "record"],
        description: "Default auto: try flow first, then record",
      },
    },
    required: ["task_id"],
  },
};
```

---

### 5) Poller utility `src/services/poll.ts`

```ts
import { getTaskStatusTool } from "../tools/get-task-status.js";
import { isTerminal, type PublishStatus } from "./status.js";
import type { TaskStatusResult } from "../types.js";

export async function pollTaskStatus(params: {
  taskId: string;
  kind?: "auto" | "flow" | "record";
  timeoutMs?: number;
  intervalMs?: number;
}): Promise<TaskStatusResult> {
  const timeoutMs = params.timeoutMs ?? 45_000;
  const intervalMs = params.intervalMs ?? 5_000;
  const start = Date.now();

  let last: TaskStatusResult | null = null;

  while (Date.now() - start < timeoutMs) {
    last = await getTaskStatusTool({
      task_id: params.taskId,
      kind: params.kind || "auto",
    });

    if (isTerminal(last.status as PublishStatus)) return last;

    // waiting_user_action juga bisa dianggap "perlu stop & report"
    if (last.status === "waiting_user_action") return last;

    await sleep(intervalMs);
  }

  return (
    last || {
      task_id: params.taskId,
      kind: "flow",
      status: "unknown",
      error_message: "Polling timeout",
    }
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

> Catatan: `isTerminal` export dari `status.ts` — pastikan di-export.

Update `status.ts`:

```ts
export type { PublishStatus } from "../types.js";
// atau biarkan PublishStatus di types saja, dan:
export function isTerminal(status: PublishStatus): boolean {
  return status === "success" || status === "failed" || status === "cancelled";
}
```

Kalau `PublishStatus` hanya di `types.ts`, import begini di `poll.ts`:

```ts
import { isTerminal } from "./status.js";
import type { PublishStatus, TaskStatusResult } from "../types.js";
```

Dan di `status.ts` import type:

```ts
import type { PublishStatus } from "../types.js";
```

---

### 6) Integrasi ke `auto_post_pipeline`

Di `auto-post-pipeline.ts`, ganti bagian “soft poll” jadi:

```ts
import { pollTaskStatus } from "../services/poll.js";
import { mapPublishStatus } from "../services/status.js";

// ... setelah createPublishFlow sukses:

flowId = created.flowId;

// seed results queued
for (const s of selected) {
  if (!s.accountId) {
    results.push({
      platform: s.platform,
      account_id: "",
      status: "failed",
      final_caption: s.finalCaption || input.caption,
      error: "No connected account found for platform",
    });
  } else {
    results.push({
      platform: s.platform,
      account_id: s.accountId,
      task_id: flowId,
      status: "queued",
      final_caption: s.finalCaption,
    });
  }
}

// enrich status (best-effort, jangan terlalu lama)
try {
  const polled = await pollTaskStatus({
    taskId: flowId,
    kind: "flow",
    timeoutMs: 20_000,  // pendek untuk agent UX
    intervalMs: 4_000,
  });

  if (polled.records && polled.records.length > 0) {
    // map record -> results by platform/account
    for (const rec of polled.records) {
      const idx = results.findIndex(
        (r) =>
          (rec.account_id && r.account_id === rec.account_id) ||
          (rec.platform &&
            r.platform.toLowerCase().includes(String(rec.platform).toLowerCase())),
      );
      if (idx >= 0) {
        results[idx] = {
          ...results[idx],
          task_id: rec.task_id || flowId,
          status: rec.status as any,
          publish_url: rec.publish_url,
          error: rec.error_message,
        };
      }
    }
  } else {
    // fallback: set semua non-failed ke status aggregate
    for (let i = 0; i < results.length; i++) {
      if (results[i].status !== "failed") {
        results[i].status = polled.status as any;
      }
    }
  }
} catch {
  // biarkan queued kalau polling gagal
}
```

---

### 7) Register tool di `server.ts`

```ts
import {
  getTaskStatusInputSchema,
  getTaskStatusTool,
  getTaskStatusToolDef,
} from "./tools/get-task-status.js";

// ListTools:
tools: [
  listAccountsToolDef,
  uploadVideoToolDef,
  autoPostPipelineToolDef,
  getTaskStatusToolDef,
],

// CallTool:
if (name === "get_task_status") {
  const input = getTaskStatusInputSchema.parse(args);
  const result = await getTaskStatusTool(input);
  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
}
```

---

### Contoh output `get_task_status`

```json
{
  "task_id": "flow_abc",
  "kind": "flow",
  "status": "publishing",
  "records": [
    {
      "task_id": "rec_1",
      "kind": "record",
      "status": "success",
      "platform": "tiktok",
      "account_id": "acc_1",
      "publish_url": "https://..."
    },
    {
      "task_id": "rec_2",
      "kind": "record",
      "status": "waiting_user_action",
      "platform": "douyin",
      "account_id": "acc_2",
      "error_message": null
    }
  ]
}
```

---

### Perilaku yang diinginkan

| Kondisi | Hasil |
|--------|--------|
| Semua record success | `status: success` |
| Ada yang masih proses | `publishing` / `queued` |
| Ada waiting user action | `waiting_user_action` (stop poll, report) |
| Semua failed/cancelled | `failed` |
| Timeout poll | kembalikan status terakhir / `unknown` |

---

### Catatan penting

1. **Numeric status Douyin** di mapper masih heuristic — verifikasi terhadap response nyata akunmu.
2. Poll di `auto_post_pipeline` sengaja **pendek** (20s) biar agent tidak hang.
3. Untuk job panjang, agent bisa panggil `get_task_status` terpisah dengan `flow_id`.
4. Kalau mau production-ready, tambah:
   - endpoint user-action short link untuk Douyin
   - exponential backoff
   - persist `flow_id` ke log lokal

---

Berikut **SKILL.md** end-to-end untuk Antigravity: generate video → `auto_post_pipeline` → `get_task_status`.

---

### Letakkan file

```text
aitoearn-bridge/
└── skills/
    └── auto-post/
        └── SKILL.md
```

Atau di skill dir Antigravity kamu, misalnya:

```text
~/.agents/skills/aitoearn-auto-post/SKILL.md
```

(sesuaikan path skill loader yang kamu pakai)

---

### `SKILL.md`

```markdown
---
name: aitoearn-auto-post
description: Generate or take a local video, publish it to multiple social platforms via AiToEarn bridge tools, then check publish status. Use when user asks to post/upload/publish video to TikTok, Instagram, YouTube, X, or multi-platform social media.
---

# AiToEarn Auto Post

## Purpose
Automate this workflow:
1. Prepare / generate a local video (if needed)
2. Publish via `auto_post_pipeline`
3. Verify result via `get_task_status`

## When to use
Use this skill when the user wants to:
- post a video to one or more social platforms
- auto-publish affiliate / content creator video
- check status of a previous publish flow

Required MCP tools (from aitoearn-bridge):
- `list_accounts`
- `upload_video` (optional direct use)
- `auto_post_pipeline`
- `get_task_status`

## Preconditions
Before publishing:
1. Confirm AiToEarn MCP/bridge is connected.
2. Call `list_accounts` once if account mapping is unknown.
3. Ensure target platforms have active connected accounts.
4. Video must be a local file path (e.g. `./out/final.mp4`).

If no accounts are connected, stop and tell the user to authorize accounts on aitoearn.ai / aitoearn.cn.

## Standard workflow

### A. User already has a video file
1. Extract:
   - `video_path`
   - `caption` / title
   - target `platforms`
   - optional `hashtags`, `affiliate_link`, `schedule_at`, `account_map`
2. Call `auto_post_pipeline` with those fields.
3. From the result, read `flow_id`.
4. Call `get_task_status` with `task_id = flow_id`.
5. Report per-platform status and links.

### B. User asks to generate then post
1. Generate/render video first with available local tools (Remotion, FFmpeg, HyperFrames, project scripts, etc.).
2. Save output to a known path (prefer `./out/`).
3. Continue from workflow A.

### C. User only asks status
1. Use provided `flow_id` / `record_id`.
2. Call `get_task_status`.
3. Summarize status; if `waiting_user_action`, tell user manual confirmation may be required (especially Douyin).

## Tool call recipes

### 1) List accounts
```json
{
  "name": "list_accounts",
  "arguments": {}
}
```

### 2) Auto post
```json
{
  "name": "auto_post_pipeline",
  "arguments": {
    "video_path": "./out/final.mp4",
    "title": "Optional title",
    "caption": "Main caption text",
    "hashtags": ["affiliate", "review", "fyp"],
    "platforms": ["tiktok", "instagram_reels"],
    "affiliate_link": "https://example.com/aff",
    "language": "id",
    "schedule_at": null
  }
}
```

### 3) Check status
```json
{
  "name": "get_task_status",
  "arguments": {
    "task_id": "FLOW_ID_HERE",
    "kind": "flow"
  }
}
```

## Platform naming
Prefer these values in `platforms`:
- `tiktok`
- `instagram_reels`
- `youtube_shorts`
- `x`
- `facebook`
- `threads`
- `linkedin`
- `pinterest`

If user says “IG Reels” → `instagram_reels`.  
If user says “YT Shorts” → `youtube_shorts`.  
If user says “Twitter” → `x`.

## Response style to user
Always report:
1. What was uploaded (`asset_id` / media url if useful)
2. `flow_id`
3. Per platform result table:
   - platform
   - status
   - publish url (if any)
   - error (if any)
4. Next action:
   - success → done
   - queued/publishing → suggest recheck with `get_task_status`
   - waiting_user_action → user may need mobile/app confirmation
   - failed → show error and propose retry

## Failure handling
- Missing video file: ask for valid local path or generate first.
- No account for platform: skip that platform and report clearly.
- Upload failure: do not call publish; show error.
- Partial success: present succeeded vs failed platforms separately.
- Never claim “posted successfully” unless status is actually `success` or a publish URL exists.

## Guardrails
- Do not use AiToEarn paid generation just to publish local videos.
- Do not spam many platforms repeatedly in one session without user intent.
- Keep captions platform-safe; include affiliate links only if user provided them.
- Prefer explicit user-provided caption over inventing marketing claims.

## Example natural-language intents
- “Post ./out/final.mp4 ke TikTok dan IG Reels dengan caption …”
- “Generate video review ini, lalu auto post ke TikTok”
- “Cek status flow_abc”
- “Publish ke semua akun yang aktif”
```

---

### Cara pakai di Antigravity (ringkas)

1. Pastikan MCP `aitoearn-bridge` sudah jalan dan tool-nya keliatan.
2. Install/copy skill ke lokasi skills Antigravity.
3. Di chat agent, cukup bilang natural, misalnya:

```text
Pakai skill auto-post.
Post video ./out/final.mp4 ke TikTok dan Instagram Reels.
Caption: Review produk ini worth it banget
Hashtag: affiliate, review, fyp
Link: https://shopee.co.id/xxx
Lalu cek statusnya.
```

Agent seharusnya:
1. `list_accounts` (jika perlu)
2. `auto_post_pipeline`
3. `get_task_status`
4. ringkas hasilnya

---

### Checklist verifikasi

- [ ] MCP tools: `list_accounts`, `auto_post_pipeline`, `get_task_status` available  
- [ ] Ada minimal 1 akun aktif di AiToEarn  
- [ ] File video lokal exists  
- [ ] Skill terbaca Antigravity  
- [ ] Test perintah natural language end-to-end  

---

Berikut versi **SKILL.md bilingual (ID-first)** yang lebih ketat untuk workflow affiliate.

---

### Path

```text
skills/aitoearn-auto-post-affiliate/SKILL.md
```

---

### `SKILL.md`

```markdown
---
name: aitoearn-auto-post-affiliate
description: Alur ketat untuk konten affiliate — siapkan/generate video lokal, publish multi-platform lewat AiToEarn bridge, lalu cek status. Pakai saat user minta post video affiliate ke TikTok, IG Reels, YouTube Shorts, Shopee-related content, atau multi sosial media.
---

# AiToEarn Auto Post (Affiliate) — ID-first

## Tujuan
Otomatiskan alur affiliate creator:

1. Siapkan / generate video lokal
2. Publish lewat `auto_post_pipeline`
3. Verifikasi lewat `get_task_status`
4. Laporkan hasil per platform + link affiliate yang dipakai

## Kapan dipakai
Pakai skill ini jika user ingin:
- post video affiliate / review produk / promo link
- auto publish ke TikTok, IG Reels, YT Shorts, X, dll
- cek status publish sebelumnya
- sebar konten Shopee / TikTok Shop / affiliate link multi-platform

Jangan pakai skill ini untuk:
- generate video berbayar di dalam AiToEarn (kecuali user minta eksplisit)
- spam massal tanpa instruksi jelas
- klaim produk yang tidak diberikan user

## Tool yang wajib tersedia
Dari MCP `aitoearn-bridge`:
- `list_accounts`
- `auto_post_pipeline`
- `get_task_status`
- `upload_video` (opsional, biasanya cukup lewat pipeline)

## Aturan ketat (Affiliate Guardrails)

1. **Jangan mengarang klaim produk**
   - Jangan menambah “terbaik”, “jaminan”, “100% original”, “cod terbaik”, dll kecuali ada di brief user.
   - Caption hanya boleh memakai fakta yang user berikan.

2. **Affiliate link wajib eksplisit**
   - Hanya sisipkan link jika user memberikan link.
   - Jangan mengganti / memendekkan link sembarangan kecuali user minta.
   - Jika user tidak kasih link, tanyakan dulu sebelum post.

3. **Platform harus cocok dengan akun aktif**
   - Sebelum post, pastikan platform target punya akun terhubung.
   - Jika belum ada akun, jangan memaksa publish ke platform itu.

4. **Jangan klaim sukses palsu**
   - Status `queued` / `publishing` ≠ sudah tayang.
   - Baru bilang sukses jika `status=success` atau ada `publish_url`.

5. **Hindari spam**
   - Jangan post berulang ke platform sama dalam sesi yang sama tanpa permintaan user.
   - Default: 1 video → 1 batch publish.

6. **Bahasa caption**
   - Default bahasa Indonesia jika user berbahasa Indonesia.
   - Jangan campur style clickbait berlebihan.

## Pre-check (wajib)
Sebelum `auto_post_pipeline`:

1. Cek file video lokal ada (`video_path`).
2. Call `list_accounts` jika `account_map` belum diketahui.
3. Pastikan minimal 1 akun aktif untuk platform target.
4. Pastikan ada:
   - `caption` atau bahan caption dari user
   - `platforms`
   - `affiliate_link` (untuk konten affiliate)

Jika salah satu wajib kurang, tanyakan dulu. Jangan menebak.

## Workflow standar

### A. Sudah ada video lokal
1. Ambil parameter:
   - `video_path`
   - `caption` / `title`
   - `platforms`
   - `hashtags` (opsional)
   - `affiliate_link` (sangat disarankan untuk affiliate)
   - `schedule_at` (opsional)
   - `account_map` (opsional)
2. Jalankan `auto_post_pipeline`
3. Ambil `flow_id`
4. Jalankan `get_task_status` (`kind: flow`)
5. Laporkan hasil per platform

### B. Generate dulu, lalu post
1. Generate/render video dulu (Remotion / FFmpeg / tool lokal user)
2. Simpan ke path jelas, contoh: `./out/affiliate-YYYYMMDD.mp4`
3. Lanjut workflow A

### C. Cek status saja
1. Pakai `flow_id` atau `record_id` dari user
2. Call `get_task_status`
3. Jelaskan status + next action

## Mapping istilah user → platform
- “IG” / “Instagram” / “Reels” → `instagram_reels`
- “YT” / “Shorts” → `youtube_shorts`
- “Twitter” / “X” → `x`
- “TikTok” → `tiktok`
- “FB” → `facebook`

## Resep pemanggilan tool

### 1) List akun
```json
{
  "name": "list_accounts",
  "arguments": {}
}
```

### 2) Auto post affiliate
```json
{
  "name": "auto_post_pipeline",
  "arguments": {
    "video_path": "./out/final.mp4",
    "title": "Review produk singkat",
    "caption": "Ringkas, jujur, sesuai brief user",
    "hashtags": ["affiliate", "review", "fyp"],
    "platforms": ["tiktok", "instagram_reels"],
    "affiliate_link": "https://s.shopee.co.id/xxx",
    "language": "id",
    "schedule_at": null
  }
}
```

### 3) Cek status
```json
{
  "name": "get_task_status",
  "arguments": {
    "task_id": "FLOW_ID_HERE",
    "kind": "flow"
  }
}
```

## Format laporan ke user (wajib)
Jawab ringkas dalam Bahasa Indonesia, urut:

1. **Ringkasan**
   - video apa yang dipost
   - platform target
2. **ID tracking**
   - `flow_id`
   - `asset_id` (jika ada)
3. **Tabel hasil**
   - platform | status | link post | error
4. **Link affiliate yang dipakai**
5. **Next action**
   - sukses → selesai
   - queued/publishing → “bisa cek ulang nanti”
   - waiting_user_action → minta user konfirmasi di app (umum di Douyin)
   - failed → tampilkan error + opsi retry

## Template caption affiliate (hanya jika user tidak memberi caption penuh)
Pakai struktur ini, tetap jangan menambah klaim baru:

```text
{ringkasan produk dari user}

{poin singkat 1-3, hanya dari brief}

Link:
{affiliate_link}

{hashtags terbatas}
```

Jika brief user kurang, tanya dulu, jangan mengisi dari asumsi.

## Penanganan error
- File video tidak ada → minta path valid / generate dulu
- Tidak ada akun platform → skip platform itu + laporkan
- Upload gagal → jangan create publish flow
- Partial success → pisahkan platform sukses vs gagal
- Status belum final → jangan bilang “sudah tayang”

## Contoh intent user
- “Post ./out/final.mp4 ke TikTok dan IG, ini link Shopee-nya …”
- “Generate video review produk ini, lalu auto post affiliate”
- “Cek status flow_abc”
- “Publish ke semua akun aktif, caption ini … link ini …”

## Gaya bahasa agent
- Prioritas Bahasa Indonesia
- Jelas, to the point, tanpa overclaim
- Sampaikan ketidakpastian status jika masih `queued` / `publishing`
```

---

### Perbedaan vs skill umum

| Aspek | Skill umum | Skill affiliate (ini) |
|------|-------------|------------------------|
| Bahasa | campur | **ID-first** |
| Affiliate link | opsional | **wajib ditanya jika kosong** |
| Klaim produk | longgar | **dilarang mengarang** |
| Laporan | umum | **wajib sebut link affiliate + status per platform** |
| Success criteria | longgar | **ketat: success / publish_url** |

---

### Contoh perintah siap pakai

```text
Pakai skill aitoearn-auto-post-affiliate.
Post video ./out/review-produk.mp4 ke TikTok dan IG Reels.
Caption: ringkas sesuai script saya.
Hashtag: affiliate, review, fyp
Link: https://s.shopee.co.id/xxx
Lalu cek statusnya.
```

---

