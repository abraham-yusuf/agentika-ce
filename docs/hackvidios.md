# 10 Prompt Claude Code Gratis untuk Membuat Video Viral di TikTok & YouTube Shorts

**Sumber:** [Theo (@theoxmotion) di X](https://x.com/theoxmotion/status/2116684286837330374)  
**Tanggal Postingan:** 1 November 2026  
**Views:** 175.445+ | **Bookmarks:** 2.861+ | **Likes:** 1.141+

---

Sebuah video "backyard yang dibelah" berhasil mendapatkan **13,1 juta views**. Itu adalah video **pertama** dari akun TikTok baru. Karena itu, saya membangun ulang formatnya menjadi **satu prompt Claude gratis**, lalu melakukan hal yang sama untuk cerita stickman dan explainer berbentuk kuliah.

Ini adalah yang asli, diposting oleh **You Built It** pada 11 Oktober:

Lalu saya mencari semua orang lain yang membagikan hal semacam ini secara gratis, dan **7 di antaranya lolos seleksi**. Semuanya gratis di postingan atau di repo terbuka, tanpa perlu komentar apa pun.

**Isi di dalamnya:**  
3D backyard, cerita stickman, lecture reel, UI motion reel, space explainer, kartun 2D "what if", canvas animation skill, 66 film styles, motion library, dan free b-roll.

**Semua 10 tool ini berjalan di Claude Code.** Satu-satunya yang perlu dibayar adalah Claude plan (satu di antaranya menggunakan free plan ElevenLabs untuk suaranya).

Saya menjalankan 3 buatan saya sendiri dari awal sampai akhir dengan penilaian buta dari Claude. Saya tidak menjalankan 7 lainnya, jadi anggap "terbaik" di sini sebagai yang paling banyak di-save.

### 1. The 3D "What If" Backyard
Video Short 3D berdurasi 60–75 detik. Sebuah rumah berdiri di atas blok tanah yang dibelah seperti kue, sementara narator yang tenang membangun sesuatu sehari-hari, satu masalah pada satu waktu.

48 video TikTok milik You Built It sudah mengumpulkan **58,6 juta views** sejak 11 Oktober. YouTube Shorts-nya (diurutkan berdasarkan views pada 30 Oktober):

Short terbesar keduanya (jalur tanah yang menjadi jalan) memiliki **5.257.944 views**.

**Cara kerjanya:** Halaman tidak menjelaskan. Di layar terlihat 3D semi-real, blok tanah dibelah seperti kue, dan satu kata caption muncul per waktu di atas narator yang tenang dan cepat.

Guide kami membangun ulang format ini sebagai **satu paste**. Claude Code menulis script, mengisi suara di PC kamu, membangun halaman di Blender (gratis), lalu menambahkan caption.

Contoh kerjanya adalah kolam ini — menjalankan prompt-nya akan menghasilkan video yang persis sama (termasuk ikannya).

Penilai buta memberi skor **59/70**, sementara video asli You Built It mendapat skor 55 dan 61 (penilai ini memang ketat). Kelemahan utamanya ada di tampilan visual, karena ikan kami lebih sederhana.

**Cara mulai:**
- Simpan `whatif_guide.md` sebagai `CLAUDE.md` di folder kosong
- Buka Claude Code di sana dan ketik: `"make one video, you pick the topic"`

Butuh sekitar **2,5–3 jam** di PC gaming, sebagian besar tanpa pengawasan. Formatnya milik You Built It, ini adalah rebuild independen.

**Guide:** https://github.com/Theoxmotion/whatif-3d-studio

### 2. The Stickman Survival Story
Cerita survival orang kedua yang dibagi per bagian, setiap bagian diakhiri dengan voting di komentar. Reel pertama itsquarkboi (GRIDLOCK Day 1) punya **1,7 juta views**, dan 12 dari 13 reel-nya tembus 100K views.

Cara dibuat menurut bio-nya: *"animated stickman survival stories, in parts"*. Di layar: tokoh stick figure datar, caption pendek, dan HUD berisi hari, waktu, serta baterai HP.

drawn.tosurvive juga punya versi Instagram dengan **1,7 juta views** di "10th Floor Part 1". Caption-nya menyebut mereka sebagai *"animated apocalypse stories based on real survival facts"*. Setiap bagian menampilkan rule card dan fact card.

Saya membangun ulang format ini dalam **3D**, di mana stickman 2D datar bergerak di dalam ruangan low-poly dengan pencahayaan dan bayangan nyata, dilengkapi HUD hari dan jam.

Setiap frame adalah kode. Tidak ada AI image atau AI video di dalamnya.

**UNDER THE RIVER** dibuat dengan prompt ini. Penilai buta memberi skor **100/120**. Series 10th Floor milik drawn.tosurvive mendapat skor 96–99 di penilai yang sama.

Sesi baru di folder kosong yang hanya diberi perintah `"you pick"` menghasilkan video dengan skor **104/120**.

**Cara mulai:**
- Paste `story_video_prompt.md` ke Claude Code di folder kosong
- Jawab `"you pick"` di setiap langkah, atau berikan catatan sendiri

Claude bekerja sendiri sekitar **1–2 jam**. Dengarkan hasilnya sekali sebelum posting (Claude tidak bisa mendengar mix audio).

**Guide:** https://github.com/Theoxmotion/story-video-studio

### 3. The Lecture Explainer Reel
Format ini berdasarkan prompt publik milik @finnardley. Dia mempostingnya pada 30 Oktober dan langsung mendapat **926 bookmarks** di malam yang sama.

Reel berdurasi 45–60 detik yang terasa seperti kuliah singkat. Seorang guru kartun berbicara di kanan bawah layar, sementara judul dan kartu muncul tepat pada kata yang sedang diucapkan.

Saya mempertahankan feel kuliahnya dengan guru, warna, dan font sendiri. Satu contoh menjelaskan Claude skills, yang lain menjelaskan 70 halaman App Store ekstra yang diberikan Apple ke setiap aplikasi.

Penilai buta memberi skor **65/80** dan **71/80**, dengan semua baris di angka 7 atau lebih. Suara dijalankan di komputer kamu, jadi hanya butuh Claude.

Format talking-teacher ini juga bekerja untuk channel besar. ByteByteGo punya video "How Big Tech Ships Code to Production" dengan **1.990.658 views**. Jeff Su punya "AI Agents explained in 3 steps" dengan **877.283 views** (sekitar 36x median Short channel-nya).

**Cara mulai:**
- Simpan `explainer_prompt.md` sebagai `CLAUDE.md` di folder kosong
- Buka Claude Code dan ketik `"make a reel"` + topikmu

**Guide:** https://github.com/Theoxmotion/explainer-reel-studio

---

Itu 3 buatan saya. 7 berikutnya berasal dari creator lain (semua angka dibaca pada 30 Oktober).

### 4. UI Motion Reel milik @twoclipping
Satu bentuk bermorfosis melalui 8–12 state UI sambil cursor mengklik setiap perubahan, semuanya dipotong ke lagunya 120 BPM.

**1.179.689 views** dan **21.077 bookmarks** — prompt video gratis yang paling banyak di-save yang saya temukan.

Template lengkap ada di postingan (tidak ada yang perlu di-unlock). Hanya butuh Claude + lagu Mixkit gratis.

### 5. Space Explainer milik @finnardley
Explainer gaya Kurzgesagt berdurasi 30 detik ("what if the Sun vanished?") yang digambar dengan kode, dilengkapi WebGL Earth, maskot astronot, dan narasi yang sinkron per kata.

**249.422 views** dan **5.219 bookmarks** sejak 25 Oktober. Prompt lengkap ada di postingan. ElevenLabs opsional (tanpa key akan pakai voice gratis di komputer).

### 6. 2D "What If" Cartoons milik @kelanoo
Kartun "What If" berdurasi 15–25 detik dengan gaya stick-figure pencahayaan senja. Karakter digambar dengan kode, jadi hero-nya tidak pernah berubah antar shot.

Postingannya punya **1.689 bookmarks**. Skill-nya: https://github.com/kelano86/what-if-animation  
Butuh ElevenLabs (free plan cukup untuk ±40 episode/bulan) dan Remotion (gratis untuk individu & tim ≤3 orang).

### 7. Animate Skill milik Chase AI
Video animasi pendek yang digambar di satu canvas dengan kode, tersedia 7 style bawaan (cut paper sampai pixel art) atau style dari referensi sendiri.

Tutorial gratis 14 menit-nya sudah **202.795 views**.  
Skill (1.149 stars): https://github.com/cth9191/animate

### 8. 66 Film Styles milik lemo-opuscar
Film pendek dengan narasi dan musik dalam 66 style siap pakai.  
**9.749 stars** — library video Claude Code gratis paling banyak bintang yang saya temukan.  
Repo: https://github.com/lemomo-ai/lemo-opuscar  
Satu film butuh 30–60 menit + cukup banyak token, plus download awal >1 GB.

### 9. 120 Moving Samples milik motion-prompt
Library 120 sample gerakan (camera move, UI, efek web) yang bisa dicentang, lalu Claude Code membangunnya ke dalam videomu.  
**63.063 views** dan **1.636 bookmarks**.  
Repo: https://github.com/showheyohtaki/motion-prompt  
Bisa digunakan secara komersial selama tetap menyertakan kredit.

### 10. Free B-roll Line milik @ElliotPadfield
Satu instruksi yang membuat Claude mengambil film domain publik, rekaman 78 rpm, dan rekaman konser dari archive.org API (tanpa key).  
**240.722 views** dan **8.285 bookmarks**.  
Cukup berikan baris instruksi ini sebelum tahap editing.

---

### Yang Tidak Saya Uji
Saya menjalankan 3 buatan saya sendiri sampai akhir dengan penilaian buta Claude. 7 lainnya hanya saya baca, cek apakah ada gerbang, dan hitung angkanya. Bookmark menunjukkan orang menginginkannya — bukan bahwa outputnya bagus.

### Mana yang Harus Dicoba Duluan?
- **Agar orang kembali lagi:** Stickman Survival Story
- **Format paling terbukti:** 3D Backyard (58,6 juta views di TikTok sejak 11 Oktober)
- **Satu pelajaran dalam <1 menit:** Lecture Reel atau Space Explainer Finn
- **Kemenangan cepat pertama:** UI Prompt milik @twoclipping
- **Motion lebih baik atau free clip untuk semua format di atas:** motion-prompt + baris Elliot

Simpan ini sebelum membuat video berikutnya. Semua link sudah ada di dalam.

---

**Catatan tambahan dari Theo:**  
"Let me know if you want more guides like this, you can also suggest ideas on what to do a guide on next."

**Sumber asli:**  
https://x.com/theoxmotion/status/2116684286837330374
