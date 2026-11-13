# https://github.com/veragent/Agentika-canvas
Kalau project ini bagaimana, coba kamu analisa

## Analisis: `veragent/Agentika-canvas`

**Repo:** [https://github.com/veragent/Agentika-canvas](https://github.com/veragent/Agentika-canvas)  
**Posisi:** Framework **programmatic video generation** 100% di browser (HTML5 Canvas + WebCodecs), bukan platform blog Agentika yang lama.

---

### 1. Apa ini sebenarnya?

Ini **bukan** “canvas untuk desain agent” secara umum.  
Ini **engine pembuat video berbasis kode**, mirip semangat Remotion, tapi dengan paradigma berbeda:

| Remotion (umum) | Agentika-canvas |
|-----------------|-----------------|
| React/DOM + server render (sering) | Canvas murni + encode di browser |
| FFmpeg / headless Chromium | WebCodecs + Mediabunny |
| Biaya cloud sering ada | Klaim **$0 server cost** |
| z-index DOM terbatas | `SceneGraph` + `focusWindow()` dinamis |

Intinya: tulis scene TypeScript → preview di Studio → export MP4 lokal di browser.

---

### 2. Arsitektur inti (yang kuat)

**Core**
- `Engine` — loop render, timing mikrodetik
- `SceneGraph` — layer + z-index dinamis
- `Timeline` — interpolasi deterministik per frame
- `Camera` — handheld shake terkontrol
- `Capabilities` — cek support codec (H.264/VP9/AV1)

**Kits visual (anti “AI slop”)**
- macOS desktop/window/cursor/webcam overlay
- GitHub UI realistis + animasi stars
- Quiz template
- External video ingest

**Media pipeline**
- Export lewat Web Worker + OffscreenCanvas
- Demux/decode aset eksternal (Mediabunny + web-demuxer WASM)

**Studio**
- Editor 1080p, scrubber frame-by-frame
- FrameInspector → catat revisi → copy prompt ke Antigravity/Claude

**Agent-native**
- `AGENTS.md`, `CLAUDE.md`, `.antigravity/rules.md`
- Skill EGM (`agentika_canvas_elephant`)
- CLI: generate scene dari naskah markdown, batch quiz, render mission

Ini jelas dirancang untuk **kerja bareng agent coding**, bukan cuma library render.

---

### 3. Fitur yang menonjol

1. **$0 server render**  
   Cocok kalau kamu sering render banyak short video dan tidak mau bayar Lambda/Railway.

2. **Quality gate (Render Mission / Phase 8)**  
   Scene sebagai direktori (`IDENTITY.md` + `scene.ts` + `report.md`).  
   Ada check deterministik; export dikunci sampai mission passed. Ini bagus untuk menghindari “fire-and-hope”.

3. **Anti-AI-slop kit**  
   Fokus ke detail visual “manusiawi”: cursor path, camera shake mikro, UI realistis. Sejalan dengan diskusi motion design / directed prompting sebelumnya.

4. **Integrasi Antigravity + EGM**  
   Bukan sekadar README; ada workflow spec-driven (`/egm:...`) yang cocok dengan stack kamu (Google Pro + Antigravity CLI).

---

### 4. Kematangan proyek (realistis)

| Aspek | Penilaian |
|------|-----------|
| Visi & dokumentasi | Kuat (PRD, ROADMAP, CHANGELOG, agent rules) |
| Stack teknis | Modern & masuk akal (Vite, React 19, TS, WebCodecs) |
| Umur repo | Masih sangat awal (sedikit commit) |
| Produksi massal | Belum terbukti di scale publik |
| Dependensi | Ringan (`mediabunny`, `web-demuxer`, `three`) |

**Kesimpulan kematangan:** promising prototype / early framework, belum “battle-tested Remotion killer”. Bagus untuk eksperimen dan pipeline lokal, belum untuk menggantungkan seluruh produksi tanpa uji sendiri.

---

### 5. Cocok tidak untuk kebutuhan kamu?

Konteks kamu: content creator + affiliate, generate video lokal, lalu auto-post via AiToEarn.

| Kebutuhan kamu | Cocok? | Catatan |
|----------------|--------|---------|
| Generate video tanpa kredit cloud mahal | **Ya** | Render di browser lokal |
| Integrasi Antigravity | **Ya** | Rules + skill sudah ada |
| Short video TikTok/Reels/Shorts | **Potensial tinggi** | Perlu template vertical 9:16 |
| Affiliate product review harian | **Belum out-of-the-box** | Kit sekarang lebih “desktop/GitHub/demo tech” |
| Sambungan ke AiToEarn auto-post | **Belum built-in** | Bisa digabung manual: export MP4 → `auto_post_pipeline` |
| Termux/Android sebagai primary env | **Ragu** | WebCodecs + GPU browser di Android sering terbatas |

**Paling cocok** untuk:
- video edukasi/tech demo bergaya screen + presenter
- konten “bedah repo / tutorial UI”
- eksperimen pipeline agent → scene → MP4 lokal

**Kurang langsung** untuk:
- unboxing produk Shopee bergaya UGC murni
- footage kamera nyata tanpa banyak compositing
- batch harian affiliate tanpa kamu buat kit/template dulu

---

### 6. Perbandingan singkat vs opsi lain

| Tool | Kelebihan | Kekurangan vs Agentika-canvas |
|------|-----------|--------------------------------|
| **Remotion** | Ekosistem matang, komunitas besar | Biaya/server & kompleksitas ops sering lebih tinggi |
| **HyperFrames / HTML-to-video** | Cepat untuk agent | Kontrol motion/z-index bisa lebih terbatas |
| **CapCut / editor manual** | Hasil UGC natural | Sulit diotomatisasi agent end-to-end |
| **Agentika-canvas** | $0 render, agent-native, quality gate | Masih muda, kit belum fokus affiliate UGC |

---

### 7. Celah & risiko

1. **Browser dependency** — butuh Chromium modern + WebCodecs; tidak semua device stabil.
2. **Template affiliate belum ada** — kamu perlu bikin kit sendiri (product card, price tag, CTA, 9:16).
3. **Headless/CI export** — pipeline browser-first; otomatisasi server-side belum sejelas Remotion Lambda.
4. **Audio/narasi** — ada jalur media, tapi workflow voiceover affiliate belum terlihat sebagai first-class.
5. **Repo muda** — breaking change & API scene masih mungkin berubah.

---

### 8. Rekomendasi praktis untukmu

**Jangan ganti seluruh stack sekaligus.**  
Pakai sebagai **layer generate video lokal**, lalu tetap tembak AiToEarn untuk distribusi.

Alur ideal:

```text
Naskah / brief affiliate
   → Antigravity + Agentika-canvas (generate scene + export MP4)
   → aitoearn-bridge.auto_post_pipeline
   → get_task_status
```

**Urutan adopsi yang masuk akal**
1. Clone & `npm run dev` — uji Studio + export 1 video pendek.
2. Cek apakah device/browser kamu encode H.264 stabil.
3. Buat 1 template **vertical 1080x1920** untuk review produk.
4. Sambungkan output `./out/*.mp4` ke skill affiliate yang sudah kita desain.
5. Baru skala batch harian kalau kualitas & stabilitas oke.

---

### 9. Skor ringkas (subjektif)

| Kriteria | Skor |
|----------|------|
| Inovasi teknis | 9/10 |
| Kesiapan produksi | 5/10 |
| Cocok agent workflow kamu | 8/10 |
| Cocok affiliate UGC langsung | 5/10 |
| Potensi jangka menengah | 8/10 |

**Verdict:**  
Project ini **sangat relevan** dengan arah kamu (Antigravity, video programmatic, hemat biaya, anti-AI-slop). Posasinya tepat sebagai **mesin generate video lokal**, bukan pengganti AiToEarn. Untuk affiliate harian, value-nya muncul setelah kamu punya 1–2 template vertical sendiri.

---

Kalau mau lanjut, saya bisa bantu salah satu ini:
1. **Blueprint template affiliate 9:16** di atas Agentika-canvas (layer product card + CTA + caption safe area)
2. **Diagram integrasi** Agentika-canvas → `aitoearn-bridge`
3. **Checklist uji cepat 30 menit** setelah clone repo


# Blueprint template

Berikut **blueprint template affiliate 9:16** untuk Agentika-canvas: product card + CTA + caption safe area.

---

## 1) Target output

| Item | Value |
|------|--------|
| Aspect | **9:16 vertical** |
| Resolution | **1080 × 1920** |
| FPS | **30** (stabil untuk short) |
| Durasi default | **12–20 detik** |
| Codec target | H.264 (`avc1`) |
| Safe caption zone | bawah ~20% (area UI TikTok/Reels) |

---

## 2) Struktur scene-as-directory

```text
src/scenes/affiliate-review-9x16/
├── IDENTITY.md
├── scene.ts
├── theme.ts
├── layers/
│   ├── BackgroundLayer.ts
│   ├── ProductCardLayer.ts
│   ├── CTAButtonLayer.ts
│   ├── CaptionSafeAreaLayer.ts
│   ├── HookTextLayer.ts
│   └── ProgressBarLayer.ts
├── data/
│   └── sample-product.json
└── report.md          # diisi Render Mission
```

---

## 3) `IDENTITY.md`

```markdown
# affiliate-review-9x16

- id: affiliate-review-9x16
- version: 0.1.0
- aspect: 9:16
- width: 1080
- height: 1920
- fps: 30
- duration_frames: 450   # 15 detik
- tags: [affiliate, review, vertical, product-card]
- kits: [affiliate]
- style: clean-commerce, high-contrast, mobile-first
- safe_areas:
  - top_ui: 120px
  - bottom_caption: 380px
  - side_margin: 48px
- inputs:
  - product_name
  - price_text
  - benefit_points[]
  - cta_text
  - affiliate_note (optional)
  - product_image_url (optional)
  - brand_accent
```

---

## 4) Layout wireframe (1080×1920)

```text
┌──────────────────────────── 1080 ────────────────────────────┐
│ top safe (status/UI) ~120px                                  │
│                                                              │
│   HOOK TEXT (besar, 1–2 baris)                               │
│   y ≈ 160–360                                                │
│                                                              │
│   ┌────────────── PRODUCT CARD ──────────────┐               │
│   │  image / placeholder                      │               │
│   │  product name                             │               │
│   │  price                                    │               │
│   │  3 benefit bullets                        │               │
│   └───────────────────────────────────────────┘               │
│   card center y ≈ 420–1250                                   │
│                                                              │
│   CTA BUTTON (tinggi ~96–112)                                │
│   y ≈ 1320–1450                                              │
│                                                              │
│   CAPTION SAFE AREA (jangan taruh teks penting)              │
│   y ≈ 1540–1920  (~380px)                                    │
│   boleh progress bar tipis di atas zona ini                  │
└──────────────────────────────────────────────────────────────┘
```

**Aturan ketat**
- Teks penting **jangan** masuk bottom 380px.
- Margin kiri/kanan minimal **48px**.
- CTA harus di atas caption safe area.

---

## 5) Kontrak data produk

`src/scenes/affiliate-review-9x16/data/sample-product.json`

```json
{
  "productName": "Nama Produk",
  "priceText": "Rp129.000",
  "compareAtText": "Rp199.000",
  "benefitPoints": [
    "Ringkas dibawa",
    "Cocok daily use",
    "Value bagus di kelasnya"
  ],
  "hookText": "Worth it nggak sih?",
  "ctaText": "Cek link di bio",
  "affiliateNote": "Shopee Affiliate",
  "accent": "#FF2D55",
  "background": "#0B0B0F",
  "productImageUrl": ""
}
```

---

## 6) Theme tokens

`theme.ts`

```ts
export const affiliateTheme = {
  width: 1080,
  height: 1920,
  fps: 30,

  colors: {
    bg: "#0B0B0F",
    card: "#16161C",
    cardBorder: "rgba(255,255,255,0.08)",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.72)",
    accent: "#FF2D55",
    accentText: "#FFFFFF",
    safeGuide: "rgba(255,80,80,0.25)", // debug only
  },

  safe: {
    top: 120,
    bottom: 380,
    side: 48,
  },

  typography: {
    hookPx: 64,
    titlePx: 44,
    pricePx: 40,
    bodyPx: 28,
    ctaPx: 30,
  },

  radii: {
    card: 28,
    button: 999,
    image: 20,
  },
};
```

---

## 7) Blueprint layer (sesuai pola `CanvasLayer`)

### Interface acuan

```ts
export interface RenderContext {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  frame: number;
  fps: number;
  timestampUs: number;
  width: number;
  height: number;
}

export interface CanvasLayer {
  id: string;
  zIndex: number;
  visible: boolean;
  update(rc: RenderContext): void;
  draw(rc: RenderContext): void;
}
```

### Z-index map

| Layer | zIndex | Fungsi |
|------|--------|--------|
| BackgroundLayer | 0 | solid/gradient bg |
| ProductCardLayer | 20 | kartu produk |
| HookTextLayer | 30 | hook atas |
| CTAButtonLayer | 40 | tombol CTA |
| ProgressBarLayer | 50 | progress tipis |
| CaptionSafeAreaLayer | 90 | guide/debug (off di export) |

---

### `BackgroundLayer` (ringkas)

- Full canvas `fillRect`
- Optional gradient vertikal halus
- Tidak ada teks

### `ProductCardLayer` (inti)

**Isi kartu**
1. Image area (atas kartu) / placeholder
2. Product name (max 2 baris)
3. Price + compare-at (coret)
4. 3 benefit bullets

**Animasi disarankan**
- Enter: `frame 0–18` scale 0.92→1.0 + fade
- Idle: sangat halus (hindari goyang berlebih)
- Highlight price: pulse opacity ringan `frame 60–90`

**Geometri default**

```ts
const card = {
  x: 48,
  y: 420,
  w: 1080 - 48 * 2,
  h: 780,
};
```

### `HookTextLayer`

- 1–2 baris, center/left-safe
- Masuk lebih dulu (`frame 0–12`)
- Font besar, high contrast
- Jangan tembus top safe area

### `CTAButtonLayer`

- Pill button
- Text: `Cek link di bio` / `Lihat di Shopee`
- Animasi:
  - muncul `frame 24–40`
  - micro-pulse tiap ~2 detik (scale 1→1.04→1)
- Posisi aman:

```ts
const cta = {
  x: 120,
  y: 1340,
  w: 1080 - 240,
  h: 104,
};
```

### `CaptionSafeAreaLayer` (debug)

- Hanya `visible` saat `debugSafeArea=true`
- Gambar rectangle semi-transparan di bottom 380px
- Label kecil: `CAPTION SAFE — no important text`
- **Wajib OFF saat export mission**

### `ProgressBarLayer` (opsional)

- Garis tipis di atas safe area (`y ≈ 1520`)
- Width = progress `frame / totalFrames`
- Membantu feel native short video

---

## 8) Timeline 15 detik (450 frame @30fps)

| Detik | Frame | Beat |
|------:|------:|------|
| 0.0–0.4 | 0–12 | Hook muncul |
| 0.4–0.8 | 12–24 | Product card enter |
| 0.8–1.3 | 24–40 | CTA muncul |
| 1.3–8.0 | 40–240 | Hold + benefit readable |
| 8.0–10.0 | 240–300 | Price highlight |
| 10.0–13.0 | 300–390 | CTA pulse 2× |
| 13.0–15.0 | 390–450 | End hold (siap cut) |

Prinsip: **teks sempat dibaca**, bukan flash cepat.

---

## 9) Skeleton `scene.ts`

```ts
import type { CanvasLayer } from "../../core/SceneGraph";
import { affiliateTheme } from "./theme";
import { BackgroundLayer } from "./layers/BackgroundLayer";
import { ProductCardLayer } from "./layers/ProductCardLayer";
import { HookTextLayer } from "./layers/HookTextLayer";
import { CTAButtonLayer } from "./layers/CTAButtonLayer";
import { ProgressBarLayer } from "./layers/ProgressBarLayer";
import { CaptionSafeAreaLayer } from "./layers/CaptionSafeAreaLayer";
import sample from "./data/sample-product.json";

export interface AffiliateSceneInput {
  productName: string;
  priceText: string;
  compareAtText?: string;
  benefitPoints: string[];
  hookText: string;
  ctaText: string;
  accent?: string;
  debugSafeArea?: boolean;
}

export function createScene(fps = affiliateTheme.fps) {
  const data: AffiliateSceneInput = {
    ...sample,
    debugSafeArea: false,
  };

  const layers: CanvasLayer[] = [
    new BackgroundLayer({ id: "bg", zIndex: 0, color: affiliateTheme.colors.bg }),
    new ProductCardLayer({ id: "card", zIndex: 20, data, theme: affiliateTheme }),
    new HookTextLayer({ id: "hook", zIndex: 30, text: data.hookText, theme: affiliateTheme }),
    new CTAButtonLayer({ id: "cta", zIndex: 40, text: data.ctaText, theme: affiliateTheme }),
    new ProgressBarLayer({ id: "progress", zIndex: 50, theme: affiliateTheme }),
    new CaptionSafeAreaLayer({
      id: "safe",
      zIndex: 90,
      theme: affiliateTheme,
      visible: !!data.debugSafeArea,
    }),
  ];

  return {
    id: "affiliate-review-9x16",
    width: affiliateTheme.width,
    height: affiliateTheme.height,
    fps,
    durationFrames: 450,
    layers,
  };
}
```

---

## 10) Aturan anti-AI-slop khusus affiliate

1. Jangan taruh CTA di bottom 250px terbawah.
2. Maksimal **1 aksen warna** kuat (biasanya CTA/price).
3. Benefit max **3 bullets**, masing-masing pendek.
4. Hindari terlalu banyak shadow/glow.
5. Animasi: easing cubic, durasi enter 250–400ms.
6. Jangan auto-klaim “terbaik/original/garansi” dari template.
7. `debugSafeArea` hanya untuk review frame, bukan export final.

---

## 11) Integrasi ke workflow kamu

```text
sample-product.json / brief affiliate
   → Antigravity generate/edit scene affiliate-review-9x16
   → Studio preview + FrameInspector
   → Render Mission passed
   → Export MP4 (1080x1920)
   → aitoearn-bridge.auto_post_pipeline
   → get_task_status
```

Prompt agent yang cocok:

```text
Pakai scene affiliate-review-9x16.
Product: [nama]
Price: [harga]
Hook: [hook]
Benefits:
- ...
- ...
- ...
CTA: Cek link di bio
Debug safe area off.
Export MP4 lalu siapkan path untuk auto_post_pipeline.
```

---

## 12) Checklist implementasi (urutan)

1. Buat folder scene + `IDENTITY.md` + `theme.ts`
2. Implement `BackgroundLayer` + `CaptionSafeAreaLayer` (debug)
3. Implement `ProductCardLayer` (static dulu)
4. Implement `HookTextLayer` + `CTAButtonLayer`
5. Tambah enter animation sederhana
6. Preview di Studio, scrub frame 0 / 30 / 120 / 400
7. Pastikan tidak ada teks di bottom safe area
8. Jalankan render mission → export
9. Tes 1x post lewat AiToEarn

---

## 13) Variasi template berikutnya

| Variant | Bedanya |
|---------|---------|
| `affiliate-unboxing-9x16` | slot footage atas, card lebih kecil |
| `affiliate-compare-9x16` | 2 mini-card A/B |
| `affiliate-softsell-9x16` | hook story, CTA lebih rendah kontras |
| `affiliate-price-drop-9x16` | fokus price strike + badge hemat |

---

## implementasi penuh 1 layer dulu (ProductCardLayer.ts lengkap

Berikut implementasi penuh **`ProductCardLayer.ts`** yang siap ditempel dan diuji di Agentika-canvas.

---

### Path

```text
src/scenes/affiliate-review-9x16/layers/ProductCardLayer.ts
```

Kalau folder scene belum ada, buat dulu struktur minimalnya.

---

### `ProductCardLayer.ts`

```ts
/**
 * ProductCardLayer — affiliate product card for 9:16 vertical scenes.
 * Compatible with agentika-canvas CanvasLayer contract.
 */

export interface RenderContext {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  frame: number;
  fps: number;
  timestampUs: number;
  width: number;
  height: number;
}

export interface CanvasLayer {
  id: string;
  zIndex: number;
  visible: boolean;
  update(rc: RenderContext): void;
  draw(rc: RenderContext): void;
}

export interface ProductCardData {
  productName: string;
  priceText: string;
  compareAtText?: string;
  benefitPoints?: string[];
  productImageUrl?: string;
  accent?: string;
}

export interface ProductCardTheme {
  width: number;
  height: number;
  colors: {
    card: string;
    cardBorder: string;
    text: string;
    muted: string;
    accent: string;
  };
  safe: {
    top: number;
    bottom: number;
    side: number;
  };
  typography: {
    titlePx: number;
    pricePx: number;
    bodyPx: number;
  };
  radii: {
    card: number;
    image: number;
  };
}

export interface ProductCardLayerOptions {
  id?: string;
  zIndex?: number;
  visible?: boolean;
  data: ProductCardData;
  theme: ProductCardTheme;
  /** frame range for enter animation */
  enterFrames?: [number, number];
  /** frame range for price pulse */
  pricePulseFrames?: [number, number];
}

type CardLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
  pad: number;
  imageH: number;
};

const DEFAULT_ENTER: [number, number] = [12, 30];
const DEFAULT_PRICE_PULSE: [number, number] = [60, 90];

export class ProductCardLayer implements CanvasLayer {
  id: string;
  zIndex: number;
  visible: boolean;

  private data: ProductCardData;
  private theme: ProductCardTheme;
  private enterFrames: [number, number];
  private pricePulseFrames: [number, number];

  private imageEl: HTMLImageElement | null = null;
  private imageStatus: "idle" | "loading" | "loaded" | "error" = "idle";

  /** runtime visual state */
  private opacity = 0;
  private scale = 0.92;
  private pricePulse = 1;

  constructor(opts: ProductCardLayerOptions) {
    this.id = opts.id ?? "product-card";
    this.zIndex = opts.zIndex ?? 20;
    this.visible = opts.visible ?? true;
    this.data = opts.data;
    this.theme = opts.theme;
    this.enterFrames = opts.enterFrames ?? DEFAULT_ENTER;
    this.pricePulseFrames = opts.pricePulseFrames ?? DEFAULT_PRICE_PULSE;

    if (this.data.productImageUrl) {
      this.loadImage(this.data.productImageUrl);
    }
  }

  update(rc: RenderContext): void {
    if (!this.visible) return;

    // Enter animation
    const [enterStart, enterEnd] = this.enterFrames;
    const enterT = clamp01(
      inverseLerp(rc.frame, enterStart, Math.max(enterStart + 1, enterEnd)),
    );
    const enterEased = easeOutCubic(enterT);
    this.opacity = enterEased;
    this.scale = lerp(0.92, 1, enterEased);

    // Price pulse (subtle)
    const [pulseStart, pulseEnd] = this.pricePulseFrames;
    if (rc.frame >= pulseStart && rc.frame <= pulseEnd) {
      const local = inverseLerp(rc.frame, pulseStart, pulseEnd);
      // single soft bump
      this.pricePulse = 1 + 0.04 * Math.sin(local * Math.PI);
    } else {
      this.pricePulse = 1;
    }
  }

  draw(rc: RenderContext): void {
    if (!this.visible || this.opacity <= 0.001) return;

    const { ctx, width, height } = rc;
    const layout = this.computeLayout(width, height);

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Scale from card center
    const cx = layout.x + layout.w / 2;
    const cy = layout.y + layout.h / 2;
    ctx.translate(cx, cy);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-cx, -cy);

    this.drawCardChrome(ctx, layout);
    this.drawImageArea(ctx, layout);
    this.drawTextBlock(ctx, layout);

    ctx.restore();
  }

  /** Allow live data swap from scene/controller */
  setData(data: Partial<ProductCardData>): void {
    this.data = { ...this.data, ...data };
    if (data.productImageUrl) {
      this.loadImage(data.productImageUrl);
    }
  }

  // ─── layout ─────────────────────────────────────────────

  private computeLayout(width: number, height: number): CardLayout {
    const side = this.theme.safe.side;
    const topSafe = this.theme.safe.top;
    const bottomSafe = this.theme.safe.bottom;

    const w = width - side * 2;
    // Keep card away from caption safe area
    const maxBottom = height - bottomSafe - 24;
    const y = Math.max(topSafe + 280, Math.floor(height * 0.22));
    const h = Math.min(780, maxBottom - y);
    const pad = 28;
    const imageH = Math.floor(h * 0.42);

    return { x: side, y, w, h, pad, imageH };
  }

  // ─── drawing helpers ────────────────────────────────────

  private drawCardChrome(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    layout: CardLayout,
  ): void {
    const r = this.theme.radii.card;

    // soft shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 10;

    roundRectPath(ctx, layout.x, layout.y, layout.w, layout.h, r);
    ctx.fillStyle = this.theme.colors.card;
    ctx.fill();
    ctx.restore();

    // border
    roundRectPath(ctx, layout.x, layout.y, layout.w, layout.h, r);
    ctx.strokeStyle = this.theme.colors.cardBorder;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private drawImageArea(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    layout: CardLayout,
  ): void {
    const x = layout.x + layout.pad;
    const y = layout.y + layout.pad;
    const w = layout.w - layout.pad * 2;
    const h = layout.imageH;
    const r = this.theme.radii.image;

    ctx.save();
    roundRectPath(ctx, x, y, w, h, r);
    ctx.clip();

    if (this.imageEl && this.imageStatus === "loaded") {
      // cover-fit
      const img = this.imageEl;
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = x + (w - dw) / 2;
      const dy = y + (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      // placeholder
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = this.theme.colors.muted;
      ctx.font = `600 28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label =
        this.imageStatus === "loading"
          ? "Loading image…"
          : this.imageStatus === "error"
            ? "Image unavailable"
            : "Product image";
      ctx.fillText(label, x + w / 2, y + h / 2);
    }

    ctx.restore();
  }

  private drawTextBlock(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    layout: CardLayout,
  ): void {
    const x = layout.x + layout.pad;
    let y = layout.y + layout.pad + layout.imageH + 26;
    const maxW = layout.w - layout.pad * 2;

    // Product name
    ctx.fillStyle = this.theme.colors.text;
    ctx.font = `700 ${this.theme.typography.titlePx}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    y = drawWrappedText(
      ctx,
      sanitizeText(this.data.productName),
      x,
      y,
      maxW,
      this.theme.typography.titlePx * 1.2,
      2,
    );

    y += 18;

    // Price row
    const accent = this.data.accent || this.theme.colors.accent;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(this.pricePulse, this.pricePulse);

    ctx.fillStyle = accent;
    ctx.font = `800 ${this.theme.typography.pricePx}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(sanitizeText(this.data.priceText), 0, 0);

    if (this.data.compareAtText) {
      const priceWidth = ctx.measureText(sanitizeText(this.data.priceText)).width;
      const gap = 16;
      ctx.fillStyle = this.theme.colors.muted;
      ctx.font = `500 ${Math.round(this.theme.typography.pricePx * 0.7)}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      const compare = sanitizeText(this.data.compareAtText);
      ctx.fillText(compare, priceWidth + gap, 8);

      // strike-through
      const cw = ctx.measureText(compare).width;
      const cy = 8 + Math.round(this.theme.typography.pricePx * 0.35);
      ctx.strokeStyle = this.theme.colors.muted;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(priceWidth + gap, cy);
      ctx.lineTo(priceWidth + gap + cw, cy);
      ctx.stroke();
    }
    ctx.restore();

    y += this.theme.typography.pricePx + 26;

    // Benefits
    const points = (this.data.benefitPoints || []).slice(0, 3);
    if (points.length > 0) {
      ctx.font = `500 ${this.theme.typography.bodyPx}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      for (const point of points) {
        // bullet
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x + 8, y + this.theme.typography.bodyPx * 0.55, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.theme.colors.text;
        const usedH = drawWrappedText(
          ctx,
          sanitizeText(point),
          x + 28,
          y,
          maxW - 28,
          this.theme.typography.bodyPx * 1.25,
          2,
        );
        y = usedH + 12;

        // stop if overflowing card
        if (y > layout.y + layout.h - layout.pad) break;
      }
    }
  }

  // ─── image loading ──────────────────────────────────────

  private loadImage(url: string): void {
    if (typeof Image === "undefined") {
      this.imageStatus = "error";
      return;
    }
    this.imageStatus = "loading";
    const img = new Image();
    img.decoding = "async";
    // only set crossOrigin for remote urls
    if (/^https?:\/\//i.test(url)) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      this.imageEl = img;
      this.imageStatus = "loaded";
    };
    img.onerror = () => {
      this.imageEl = null;
      this.imageStatus = "error";
    };
    img.src = url;
  }
}

// ─── pure helpers ───────────────────────────────────────────

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function inverseLerp(v: number, a: number, b: number): number {
  if (b === a) return 0;
  return clamp01((v - a) / (b - a));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function sanitizeText(input: string): string {
  return String(input ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function roundRectPath(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Draw wrapped text; returns next y (below last line).
 */
function drawWrappedText(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  // ellipsis if truncated
  if (words.join(" ") !== lines.join(" ") && lines.length > 0) {
    let last = lines[lines.length - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length > 0) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last}…`;
  }

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
  return y + lines.length * lineHeight;
}
```

---

### Cara uji cepat (tanpa full scene)

Buat file sementara, misalnya `src/scenes/affiliate-review-9x16/dev-product-card.ts`:

```ts
import { ProductCardLayer } from "./layers/ProductCardLayer";

export const testTheme = {
  width: 1080,
  height: 1920,
  colors: {
    card: "#16161C",
    cardBorder: "rgba(255,255,255,0.08)",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.72)",
    accent: "#FF2D55",
  },
  safe: { top: 120, bottom: 380, side: 48 },
  typography: { titlePx: 44, pricePx: 40, bodyPx: 28 },
  radii: { card: 28, image: 20 },
};

export function createTestProductCardLayer() {
  return new ProductCardLayer({
    id: "product-card",
    zIndex: 20,
    theme: testTheme,
    data: {
      productName: "Wireless Earbuds Pro Max",
      priceText: "Rp129.000",
      compareAtText: "Rp199.000",
      benefitPoints: [
        "Bass lebih dalam",
        "Battery 24 jam",
        "Cocok kerja & olahraga",
      ],
      // productImageUrl: "https://...", // opsional
      accent: "#FF2D55",
    },
  });
}
```

Lalu di scene/engine yang sudah ada, masukkan layer ini ke `SceneGraph` / daftar layers scene 1080×1920.

---

### Checklist uji di Studio

1. Frame `0–11` → card masih belum penuh (opacity rendah)
2. Frame `12–30` → card scale-in
3. Frame `60–90` → harga pulse pelan
4. Pastikan card **tidak** masuk bottom safe area 380px
5. Nama panjang terpotong rapi (ellipsis)
6. Tanpa image → placeholder tampil

---

### Catatan integrasi Agentika-canvas

- Kalau repo sudah punya `CanvasLayer` / `RenderContext` resmi di `src/core/SceneGraph.ts`, **hapus duplikat interface** di file ini dan import dari core.
- `HTMLImageElement` bekerja di browser Studio. Untuk worker/export, pastikan image sudah loaded sebelum render mission (atau bake image ke local asset dulu).
- Untuk affiliate harian, ganti data lewat `setData()` atau reconstruct layer dari JSON produk.

---

Lanjut yang mana?
1. **`CTAButtonLayer.ts` lengkap**, atau  
2. **`scene.ts` minimal** yang langsung memuat `ProductCardLayer` + background?

Berikut urutannya: **`CTAButtonLayer.ts` lengkap**, lalu **`scene.ts` minimal** (+ background sederhana) yang memuat `ProductCardLayer`.

---

## 1) `CTAButtonLayer.ts`

Path:

```text
src/scenes/affiliate-review-9x16/layers/CTAButtonLayer.ts
```

```ts
/**
 * CTAButtonLayer — affiliate CTA pill button for 9:16 vertical scenes.
 * Compatible with agentika-canvas CanvasLayer contract.
 */

export interface RenderContext {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  frame: number;
  fps: number;
  timestampUs: number;
  width: number;
  height: number;
}

export interface CanvasLayer {
  id: string;
  zIndex: number;
  visible: boolean;
  update(rc: RenderContext): void;
  draw(rc: RenderContext): void;
}

export interface CTAButtonTheme {
  width: number;
  height: number;
  colors: {
    accent: string;
    accentText?: string;
    text?: string;
  };
  safe: {
    top: number;
    bottom: number;
    side: number;
  };
  typography: {
    ctaPx: number;
  };
  radii?: {
    button?: number;
  };
}

export interface CTAButtonLayerOptions {
  id?: string;
  zIndex?: number;
  visible?: boolean;
  text: string;
  theme: CTAButtonTheme;
  /** Optional explicit accent override */
  accent?: string;
  /** Enter animation frames [start, end] */
  enterFrames?: [number, number];
  /** Pulse period in frames (e.g. 60 = tiap ~2s @30fps) */
  pulsePeriodFrames?: number;
  /** First frame when pulse is allowed */
  pulseFromFrame?: number;
}

const DEFAULT_ENTER: [number, number] = [24, 40];

export class CTAButtonLayer implements CanvasLayer {
  id: string;
  zIndex: number;
  visible: boolean;

  private text: string;
  private theme: CTAButtonTheme;
  private accent?: string;
  private enterFrames: [number, number];
  private pulsePeriodFrames: number;
  private pulseFromFrame: number;

  private opacity = 0;
  private scale = 0.96;

  constructor(opts: CTAButtonLayerOptions) {
    this.id = opts.id ?? "cta-button";
    this.zIndex = opts.zIndex ?? 40;
    this.visible = opts.visible ?? true;
    this.text = opts.text;
    this.theme = opts.theme;
    this.accent = opts.accent;
    this.enterFrames = opts.enterFrames ?? DEFAULT_ENTER;
    this.pulsePeriodFrames = opts.pulsePeriodFrames ?? 60;
    this.pulseFromFrame = opts.pulseFromFrame ?? 40;
  }

  update(rc: RenderContext): void {
    if (!this.visible) return;

    const [enterStart, enterEnd] = this.enterFrames;
    const t = clamp01(
      inverseLerp(rc.frame, enterStart, Math.max(enterStart + 1, enterEnd)),
    );
    const eased = easeOutCubic(t);
    this.opacity = eased;

    // base enter scale
    let scale = lerp(0.96, 1, eased);

    // soft pulse after enter
    if (rc.frame >= this.pulseFromFrame && this.pulsePeriodFrames > 0) {
      const local =
        ((rc.frame - this.pulseFromFrame) % this.pulsePeriodFrames) /
        this.pulsePeriodFrames;
      // bump near the beginning of each period
      const bump = Math.sin(clamp01(local / 0.35) * Math.PI); // only first 35% of period
      scale *= 1 + 0.035 * bump;
    }

    this.scale = scale;
  }

  draw(rc: RenderContext): void {
    if (!this.visible || this.opacity <= 0.001) return;

    const { ctx, width, height } = rc;
    const layout = this.computeLayout(width, height);
    const bg = this.accent || this.theme.colors.accent;
    const fg =
      this.theme.colors.accentText ||
      this.theme.colors.text ||
      "#FFFFFF";
    const radius =
      this.theme.radii?.button ??
      Math.min(layout.h / 2, 999);

    ctx.save();
    ctx.globalAlpha = this.opacity;

    const cx = layout.x + layout.w / 2;
    const cy = layout.y + layout.h / 2;
    ctx.translate(cx, cy);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-cx, -cy);

    // shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    roundRectPath(ctx, layout.x, layout.y, layout.w, layout.h, radius);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.restore();

    // solid button (no shadow bleed)
    roundRectPath(ctx, layout.x, layout.y, layout.w, layout.h, radius);
    ctx.fillStyle = bg;
    ctx.fill();

    // label
    const label = sanitizeText(this.text);
    ctx.fillStyle = fg;
    ctx.font = `700 ${this.theme.typography.ctaPx}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ensure text fits
    const maxTextW = layout.w - 48;
    let fontSize = this.theme.typography.ctaPx;
    while (fontSize > 18 && ctx.measureText(label).width > maxTextW) {
      fontSize -= 1;
      ctx.font = `700 ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    }
    ctx.fillText(label, cx, cy + 1);

    ctx.restore();
  }

  setText(text: string): void {
    this.text = text;
  }

  setAccent(accent: string): void {
    this.accent = accent;
  }

  private computeLayout(width: number, height: number) {
    const side = Math.max(this.theme.safe.side, 120);
    const bottomSafe = this.theme.safe.bottom;

    const w = width - side * 2;
    const h = 104;
    // sit above caption safe area
    const y = height - bottomSafe - h - 36;
    const x = side;

    return { x, y, w, h };
  }
}

// ─── helpers ────────────────────────────────────────────────

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function inverseLerp(v: number, a: number, b: number): number {
  if (b === a) return 0;
  return clamp01((v - a) / (b - a));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function sanitizeText(input: string): string {
  return String(input ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function roundRectPath(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
```

---

## 2) Background layer mini + `scene.ts` minimal

### `BackgroundLayer.ts`

Path:

```text
src/scenes/affiliate-review-9x16/layers/BackgroundLayer.ts
```

```ts
export interface RenderContext {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  frame: number;
  fps: number;
  timestampUs: number;
  width: number;
  height: number;
}

export interface CanvasLayer {
  id: string;
  zIndex: number;
  visible: boolean;
  update(rc: RenderContext): void;
  draw(rc: RenderContext): void;
}

export class BackgroundLayer implements CanvasLayer {
  id: string;
  zIndex: number;
  visible: boolean;
  private color: string;

  constructor(opts: { id?: string; zIndex?: number; color?: string }) {
    this.id = opts.id ?? "background";
    this.zIndex = opts.zIndex ?? 0;
    this.visible = true;
    this.color = opts.color ?? "#0B0B0F";
  }

  update(_rc: RenderContext): void {}

  draw(rc: RenderContext): void {
    if (!this.visible) return;
    const { ctx, width, height } = rc;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
```

---

### `theme.ts` (minimal, dipakai scene)

Path:

```text
src/scenes/affiliate-review-9x16/theme.ts
```

```ts
export const affiliateTheme = {
  width: 1080,
  height: 1920,
  fps: 30,
  colors: {
    bg: "#0B0B0F",
    card: "#16161C",
    cardBorder: "rgba(255,255,255,0.08)",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.72)",
    accent: "#FF2D55",
    accentText: "#FFFFFF",
  },
  safe: {
    top: 120,
    bottom: 380,
    side: 48,
  },
  typography: {
    titlePx: 44,
    pricePx: 40,
    bodyPx: 28,
    ctaPx: 30,
  },
  radii: {
    card: 28,
    image: 20,
    button: 999,
  },
};
```

---

### `scene.ts` minimal

Path:

```text
src/scenes/affiliate-review-9x16/scene.ts
```

```ts
import { BackgroundLayer } from "./layers/BackgroundLayer";
import { ProductCardLayer } from "./layers/ProductCardLayer";
import { CTAButtonLayer } from "./layers/CTAButtonLayer";
import { affiliateTheme } from "./theme";

export interface AffiliateSceneBundle {
  id: string;
  width: number;
  height: number;
  fps: number;
  durationFrames: number;
  layers: Array<{
    id: string;
    zIndex: number;
    visible: boolean;
    update: (rc: any) => void;
    draw: (rc: any) => void;
  }>;
}

export function createScene(fps = affiliateTheme.fps): AffiliateSceneBundle {
  const productData = {
    productName: "Wireless Earbuds Pro Max",
    priceText: "Rp129.000",
    compareAtText: "Rp199.000",
    benefitPoints: [
      "Bass lebih dalam",
      "Battery 24 jam",
      "Cocok kerja & olahraga",
    ],
    accent: affiliateTheme.colors.accent,
    // productImageUrl: "", // isi jika ada
  };

  const layers = [
    new BackgroundLayer({
      id: "bg",
      zIndex: 0,
      color: affiliateTheme.colors.bg,
    }),
    new ProductCardLayer({
      id: "product-card",
      zIndex: 20,
      theme: affiliateTheme,
      data: productData,
      enterFrames: [12, 30],
      pricePulseFrames: [60, 90],
    }),
    new CTAButtonLayer({
      id: "cta",
      zIndex: 40,
      text: "Cek link di bio",
      theme: affiliateTheme,
      accent: affiliateTheme.colors.accent,
      enterFrames: [24, 40],
      pulseFromFrame: 40,
      pulsePeriodFrames: 60,
    }),
  ];

  return {
    id: "affiliate-review-9x16",
    width: affiliateTheme.width,
    height: affiliateTheme.height,
    fps,
    durationFrames: 450, // 15s @30fps
    layers,
  };
}

export default createScene;
```

---

## 3) Cara sambungkan ke engine Agentika-canvas

Tergantung wiring scene di repo, pola umumnya:

```ts
import { createScene } from "./scenes/affiliate-review-9x16/scene";

const scene = createScene(30);

// contoh:
// sceneGraph.setLayers(scene.layers)
// engine.configure({ width: scene.width, height: scene.height, fps: scene.fps, durationFrames: scene.durationFrames })
```

Kalau `SceneGraph` / `RenderContext` resmi sudah ada di `src/core/`, sebaiknya:

- hapus interface duplikat di tiap layer
- ganti dengan:

```ts
import type { CanvasLayer, RenderContext } from "../../../core/SceneGraph";
```

(sesuaikan path relatif)

---

## 4) Urutan uji cepat

1. Pastikan 3 file layer + `theme.ts` + `scene.ts` masuk repo  
2. Load `createScene()` di Studio  
3. Scrub:
   - frame 0–11: mostly background
   - 12–30: card masuk
   - 24–40: CTA masuk
   - 60–90: price pulse
   - >40: CTA pulse periodik
4. Cek CTA **di atas** bottom safe area (380px)

---

## 5) Struktur file saat ini

```text
src/scenes/affiliate-review-9x16/
├── theme.ts
├── scene.ts
└── layers/
    ├── BackgroundLayer.ts
    ├── ProductCardLayer.ts
    └── CTAButtonLayer.ts
```

---

Lanjut berikutnya yang paling natural:
1. **`HookTextLayer.ts`**, atau  
2. **adapter `createScene()` ke API SceneGraph asli repo** (setelah kamu paste isi `SceneGraph.ts` / cara register scene di project).



