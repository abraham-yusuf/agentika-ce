# Auto Post Pipeline Checklist (HyperFrames Lapisan)

Urutan kerja dari brief affiliate ke publish multi-platform:

1. Tulis brief produk di `brief/<produk>.md`
2. Pilih salah satu blok vertical di bank 1080x1920 (lihat DAFTAR BANK DI BAWAH)
   lalu paste include-snippetnya ke host composition:
     compositions/{nama}.html → data-composition-src="compositions/{nama}.html"
3. Tambahkan blok baru ke `hyperframes.lock.json` (hash SHA-256) sebelum batch render
3. Render: `npx hyperframes render compositions/<nama>.html -o out/<nama>.mp4`
   (durasi sesuai `data-duration`; codec H.264 `avc1`)
4. QA frame sheet: ambil frame 0/36/72/... lewat `--frame` atau studio sebelum full render
5. Upload ke AiToEarn via konsolidasi MCP `auto_post_pipeline`
6. Log publish di `logs/post-history.jsonl` dengan timestamp, platform & url
7. Gagal upload? retry policy (max 3 percobaan, backoff eksponen 2^n x 5 detik)

Catatan: API Key AiToEarn dimasukkan HANYA via environment lokal,
jangan ditulis di repo (ditambahkan ke `.gitignore`).
