# AiToEarn Connector — Local MCP Bridge

Jembatan antara **Agentika Content Engine** (generate video lokal via HyperFrames/Remotion)
dan **AiToEarn** (mesin publish ke banyak platform). Arsitektur didesain di `docs/dothis.md`.

## Keputusan desain (referensi `dothis.md`)
- Connector bentuk: **MCP Server lokal**
- Bahasa: TypeScript (ini awalnya di-implementasikan sebagai JS runnable tanpa build;
  migrasi ke `tsc` sebelum release produksi)
- Entry point tool: `auto_post_pipeline`
- Caption: template per platform (lihat `aitoeearn.config.example.json`) + override manual
- Penyimpanan video: upload langsung ke AiToEarn (tanpa staging pribadi di awal)
- Self-host AiToEarn: belum diperlukan di fase ini

## Tools (Fase 1 MVP)
| Tool | Argumen | Tanggung jawab |
|---|---|---|
| `list_accounts` | `{}` | daftar akun terhubung per platform |
| `upload_video` | `{ filePath }` | upload MP4 dari path lokal → url unduhan |
| `create_batch_post` | `{ videos[], captions{}, platforms[] }` | buat satu batch post cross-platform |
| `auto_post_pipeline` *(entry)* | `{ brief, platforms?, captionOverrides? }` | generate kompositi -> render -> upload -> post |

## Setup (lokal saja)
```bash
cp aitoearn.config.example.json aitoearn.config.local.json  # pakai ENV AITOEARN_API_KEY lebih direkomendasikan
export AITOEARN_API_KEY=sk_...
node src/index.cjs            # jalankan sebagai MCP server (stdio transport)
```

## Keamanan & operasional
- API Key disimpan `AITOEARN_API_KEY` di environment / aitoearn.config.local.json di luar repo — ditambahkan otomatis ke `.gitignore`.
- Log setiap publish di `./logs/post-history.jsonl` (penting untuk tracking affiliate).
- Rate limit: hindari spam publikasi per platform.
- Retry: maks 3 percobaan dengan backoff eksponen (2^n × 5detik).

## Roadmap (Fase 2+)
Fase 2: caption adapter selesai + status tracker; Fase 3: skill Antigravity `/auto-post`; Fase 4: scheduler + logging produksi; Fase 5: optional Muse.ai integrasi.
