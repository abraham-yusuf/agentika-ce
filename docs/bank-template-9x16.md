# Bank Template 9:16 (Vertical Content Engine — HyperFrames)

Semua template berdimensi **1080 × 1920** sesuai aturan Motion Lab:
durasi tetap deterministik, `data-duration` mencerminkan animasi sebenarnya,
**tidak ada** gradient purple/blue, glow, partikel mendebarkan, semua tengahkan
di satu titik kacau, caption aman di bawah y≈1536.

## Daftar Blok Tersedia (`hyperframes.lock.json` memperbarui setiap penambahan baru)

| # | Block | Sumber / Tujuan | Durasi default | Include snippet |
|---|-------|-----------------|----------------|-----------------|
| 1 | `flash-through-white` | Shader transition anti AI-slop | 4 s | `<div data-composition-id="main" data-composition-src="compositions/flash-through-white.html" data-duration="4" data-width="1920" data-height="1080"></div>` |
| 2 | `instagram-follow` | Social overlay portrait UGC + avatar.jpg | 4.5 s | `<div data-composition-id="instagram-follow" data-composition-src="compositions/instagram-follow.html" data-duration="4.5" data-width="1080" data-height="1920"></div>` |
| 3 | `data-chart` | Statistika produk pendukung affiliate | 15 s | `<div data-composition-id="data-chart" data-composition-src="compositions/data-chart.html" data-duration="15" data-width="1920" data-height="1080"></div>` |
| 4 | `affiliate-product-review` | Pola A — Kartu review produkt utama (saat ini) | 14 s | `<div data-composition-id="main" data-composition-src="compositions/affiliate-product-review.html" data-duration="14" data-width="1080" data-height="1920"></div>` |
| 5 | `voucher-coupon` | Pola B — Kartu voucher diskon + kopling code (VOUCHER500) | 12 s | `<div data-composition-id="voucher-coupon" data-composition-src="compositions/voucher-coupon.html" data-duration="12" data-width="1080" data-height="1920"></div>` |
| 6 | `product-deal-banner` | Pola C — Kartu deal harga promo (was→now + unit list) | 15 s | `<div data-composition-id="product-deal-banner" data-composition-src="compositions/product-deal-banner.html" data-duration="15" data-width="1080" data-height="1920"></div>` |

## Batch Render Strategy (untuk scale ke batch harian)

Untuk N blok terpisah, render jadi host composition multi-slot:

```html
<!-- compositions/_multi/<produk>.html -->
<div data-composition-id="main"
     data-composition-src="compositions/{blok}.html"
     data-duration="{durasi}"
     data-width="1080" data-height="1920"></div>
```

Gunakan folder per-proyek agar tidak bentrok dengan komposisi lain yang punya nama id identik.
Contoh invocation untuk blok nomor 6:

```
npx hyperframes render compositions/<folder> -o out/<nama>.mp4
```

Catatan infrastruktur: headless Chrome belum bisa dipakai di environment ini
(platform dikenali sebagai android arm64); jalankan langkah render pada desktop
Linux/macOS dengan `npx hyperframes browser ensure` dulu.

## QA Loop tiap variasi

1. `npx hyperframes lint <folder>`
2. Ambil contact sheet frame {0, ~72, durasi/2, durasi−3}
3. Setelah perbaikan tulis "frame X–Y", jangan pakai bahasa sentimen
   (lihat contoh feedback efektif di `docs/motionreference.md`)
