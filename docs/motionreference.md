# Motion Lab — Template Prompt Directed

**Sumber:** Lab notebook @flxrnc  
https://x.com/flxrnc/status/2105311836190978392

---

## Prinsip Utama

Claude Opus 5.5 **tidak menghasilkan pixel**. Ia menulis **kode** yang kemudian menggambar setiap frame. Karena itu, semakin spesifik angka dan aturannya, semakin bagus hasilnya.

Aturan emas:
> Setiap kata sifat yang diganti dengan angka = satu keputusan yang kamu ambil alih dari model.

---

## Template Prompt Directed

Salin dan isi setiap baris sebelum menekan Enter:

```text
GOAL:
[Satu kalimat: apa yang harus dirasakan atau dilakukan penonton setelah melihat ini]

TIME:
- Durasi total: [contoh: 6 detik]
- Frame rate: [24 / 30 / 60] fps
- Total frame: [hitung: detik × fps]

SHOTS:
- Shot 1 (frame X–Y): [satu hero move + cara transisi ke shot berikutnya]
- Shot 2 (frame X–Y): [...]
- Shot 3 (frame X–Y): [...]

ENGINE:
[Remotion / Three.js / HyperFrames / HTML+GSAP / dll]
- Resolusi: [1920×1080 / 1080×1920 / 1080×1080]
- Format output: [MP4 / GIF]

STYLE & MATERIAL:
- Material utama: [contoh: satin ceramic roughness 0.38 + clearcoat 0.35]
- Material sekunder: [contoh: chrome roughness 0.05]
- Warna aksen: [kode warna spesifik]
- Background: [deskripsi + larangan glow/particle]

CAMERA:
- Field of view: [30–50 derajat]
- Pergerakan kamera: [orbit / push-in / static + detail frame]
- Lighting: [key, fill, rim — warna dan intensitas]

MOTION NUMBERS:
- BPM / beat grid: [contoh: 120 BPM → 12 frame per beat di 24fps]
- Easing: [ease-out untuk masuk, ease-in untuk keluar, ease-in-out untuk bergerak]
- Spring: damping ratio [0.7–0.85 = premium, 0.4–0.6 = playful]
- Stagger: [berapa frame antar elemen]
- Hold text: minimal 0.3 detik per kata + 0.5 detik

BAN LIST (wajib diisi):
- Jangan pakai: purple/blue gradient, glow, lens flare, floating particles, fade-and-slide-up, centered everything, text bergerak saat dibaca

QA:
- Sebelum render penuh, tampilkan contact sheet (12 frame) dan tunggu konfirmasi
- Setiap perbaikan harus menyebut nomor frame yang bermasalah
```

---

## Angka-Angka Penting (Cheat Sheet)

### Easing
| Situasi              | Easing yang Disarankan      |
|----------------------|-----------------------------|
| Elemen masuk         | ease-out / ease-out-quint   |
| Elemen keluar        | ease-in (40–50% lebih cepat)|
| Bergerak di layar    | ease-in-out                 |
| Rotasi / progress bar| linear                      |

### Spring (Damping Ratio)
| Nilai     | Karakter          |
|-----------|-------------------|
| 1.0       | Tidak memantul    |
| 0.7–0.85  | Premium           |
| 0.4–0.6   | Playful           |
| < 0.3     | Kartun / berlebihan|

### Durasi & Stagger
| Jenis Gerakan       | Durasi yang Disarankan |
|---------------------|------------------------|
| Feedback UI         | 100–200 ms             |
| Gerakan UI biasa    | 200–500 ms             |
| Hero reveal         | 600–900 ms             |
| Huruf per huruf     | 1 frame                |
| Kata per kata       | 60–120 ms              |
| Item list           | 40–80 ms               |

Mulai elemen berikutnya saat elemen sebelumnya sudah 30–50% selesai.

### Camera
- FOV ideal: 35–50 derajat
- Parallax: foreground 1.0x, middle 0.5x, background 0.2x
- Camera movement pakai easing paling lembut (ease-in-out-quart)

---

## Contoh Feedback yang Efektif

Gunakan nomor frame, bukan perasaan:

- “Punch di frame 84 terlambat 2 frame, majukan.”
- “Glint menghapus huruf P di frame 112–118.”
- “Bevel membuat huruf menyatu di frame 60.”
- “Scale naik dari 1.0 → 1.08 → 1.0 dalam 6 frame, puncak tepat di beat.”

Terjemahan perasaan → angka:
| Perasaan              | Instruksi Angka                                      |
|-----------------------|------------------------------------------------------|
| “Make it pop”         | Scale 1.0 → 1.08 → 1.0 dalam 6 frame, puncak di beat |
| “Terasa premium”      | ease-out-quint + damping ratio 0.8, tanpa overshoot di teks |
| “Terasa lambat”       | Kurangi hold 12 frame (1 beat di 120 BPM / 24fps)    |
| “Terlalu ramai”       | Satu hero move saja, elemen lain mulai 150ms kemudian dengan 60% jarak |
| “Kelihatan AI”        | Sebutkan default yang muncul, masukkan ke Ban List, render ulang |

---

## Render Contract (Wajib Disisipkan)

Tambahkan baris ini di setiap prompt motion:

```text
RENDER CONTRACT:
- Setiap frame adalah pure function dari waktu (t). Tidak ada Date.now() atau Math.random() tanpa seed.
- Render frame N dari loop N frame (jangan sampai frame 0 muncul dua kali).
- Gunakan frame number, bukan wall-clock time.
- Sediakan frame counter di sudut saat iterasi (hapus sebelum final).
```

---

## Alur Kerja Lab (The Lab Loop)

1. Tulis prompt directed lengkap
2. Minta Claude generate kode
3. Render contact sheet (frame 0, 24, 48, 72, 96…)
4. Tulis catatan perbaikan **dengan nomor frame**
5. Minta Claude perbaiki hanya yang disebutkan
6. Ulangi 2–4 putaran sampai bersih
7. Baru kerjakan sound (sinkron 1 frame setelah visual)

---

**Catatan:**  
Semakin banyak angka dan larangan spesifik yang kamu berikan di prompt pertama, semakin sedikit follow-up yang dibutuhkan.

Simpan file ini sebagai referensi setiap kali membuat motion design dengan Claude.
