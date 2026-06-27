---
title: feat: Port report generator MVP to Next.js
type: feat
status: active
date: 2026-06-27
---

# feat: Port report generator MVP to Next.js

## Summary

Port `blueprint_print.md` menjadi halaman App Router Next.js yang rapi dengan MVP parity: editor kiri, preview A4 kanan, screenshot per poin, dan print/PDF via browser print pada route yang sama. Implementasi tetap client-local, memakai stack yang sudah ada, dan sengaja menunda persistence, backend upload, serta mobile optimization.

---

## Problem Frame

Repo ini masih memakai starter page bawaan Next.js, sedangkan arah produk sebenarnya sudah jelas di `blueprint_print.md`: generator laporan kinerja dengan format dokumen resmi, editor dinamis, preview A4, dan alur print. Porting perlu menjaga perilaku blueprint tanpa membawa arsitektur berlebih, karena repo saat ini belum punya backend, storage, API route, atau test harness yang akan membenarkan scope lebih besar.

Risiko terbesar bukan struktur app, melainkan kontrak print: preview harus cukup dekat dengan hasil A4, screenshot tetap muncul di dokumen, editor hilang saat print, dan konten panjang tidak merusak heading atau blok tanda tangan.

Untuk plan ini, “MVP parity” berarti parity terhadap perilaku yang memang tertulis di `blueprint_print.md`: split editor/preview, seeded sample data, dynamic sections, satu screenshot lokal per poin, same-page browser print, dan struktur dokumen resmi. Bila blueprint tidak menegaskan perilaku tertentu, plan ini menyatakannya sebagai asumsi implementasi agar parity target tetap stabil selama eksekusi.

Assumsi parity yang dipin di plan ini:
- section kosong disembunyikan dari preview/print agar dokumen resmi tidak berisi heading kosong
- print tidak diblok oleh field kosong; seeded defaults dipakai sebagai baseline usable
- screenshot tetap client-local untuk MVP dan tidak dipersist lintas reload
- viewport sempit boleh jatuh ke single-column fallback demi keterbacaan
- browser target utama untuk validasi print adalah desktop Chrome, dengan Safari sebagai spot-check sekunder

Jika stakeholder kemudian menginginkan perilaku berbeda pada salah satu poin di atas, perubahan itu dianggap revisi scope produk, bukan bug implementasi parity.

Browser header/footer bawaan print dianggap di luar kendali CSS aplikasi; implementasi cukup menambahkan guidance singkat agar user mematikan header/footer di dialog print bila hasil formal dibutuhkan.

Screenshot tetap berbasis object URL lokal untuk MVP. Karena ini load-bearing terhadap bukti per poin, verifikasi manual harus mencakup apakah screenshot benar-benar muncul di print preview/PDF pada browser target sebelum pekerjaan dianggap selesai.

---

## Requirements

**Core product parity**

- R1. Route root (`app/page.tsx`) menampilkan composer laporan dengan dua area utama: editor di kiri dan preview dokumen di kanan.
- R2. Composer memuat seeded sample data yang mengikuti struktur dan isi dasar `blueprint_print.md`, sehingga parity bisa diverifikasi tanpa setup tambahan.
- R3. Perubahan metadata, intro, dan isi poin memperbarui preview secara live dari satu source of truth state.

**Dynamic report editing**

- R4. Empat section tetap dipertahankan: `persiapan`, `perancangan`, `finalisasi`, dan `evaluasi`.
- R5. User dapat menambah, mengubah, dan menghapus poin dalam setiap section; urutan label poin dirender ulang otomatis setelah perubahan.
- R6. Setiap poin mendukung tepat satu screenshot lokal untuk MVP, dengan alur upload, preview, hapus, dan upload ulang file yang sama tanpa reload halaman.

**Preview and print contract**

- R7. Preview kanan memakai kontrak “Approx A4”: tampil seperti kertas A4 dan scrollable di layar, tetapi pagination final didelegasikan ke browser saat print/PDF.
- R8. Tombol print memakai route yang sama dan memanggil browser print flow; editor serta kontrol non-dokumen tidak ikut tercetak.
- R9. Dokumen print mempertahankan elemen formal blueprint: header instansi, struktur section, screenshot per poin, dan blok tanda tangan.
- R10. Layout print harus mengurangi pecah jelek dengan menjaga heading/item/screenshot sedapat mungkin tetap utuh dan membiarkan browser memindahkan blok ke halaman berikutnya bila perlu.
- R11. Screenshot harus diskalakan agar tetap terbaca di preview dan print: tidak melampaui lebar konten dokumen, memakai fit yang menjaga rasio, dan dibatasi tinggi wajarnya agar tidak merusak alur halaman.

**Technical scope discipline**

- R12. Implementasi tetap di App Router dengan boundary client yang eksplisit untuk state, file input, object URL, dan `window.print()`.
- R13. Implementasi reuse stack yang sudah ada: Next.js 16, React 19, Tailwind v4, shadcn setup, `@tabler/icons-react`, dan `cn()`; tidak menambah backend, storage, auth, route print khusus, atau dependency export/PDF baru.
- R14. MVP sengaja tetap ephemeral: state hilang saat reload/tab close, screenshot tidak dipersist, dan layout dioptimalkan desktop-first.
- R15. Saat viewport tidak lagi nyaman untuk split-pane, halaman boleh turun ke single-column fallback dengan editor lebih dulu dan preview di bawah; ini fallback keterbacaan, bukan mobile optimization penuh.

---

## Key Technical Decisions

- KTD1. `app/page.tsx` tetap tipis sebagai Server Component yang hanya merender subtree client untuk composer laporan. Rationale: sejalan dengan App Router default, membatasi area yang perlu `"use client"`, dan cocok dengan guidance Next.js 16 untuk browser APIs hanya di Client Components.
- KTD2. Semua state editor memakai model client-local tunggal yang mengikuti blueprint: `metadata`, `intro`, dan `sections`. Rationale: parity tercepat, tidak butuh backend, dan menghindari pecah state lintas komponen terlalu dini.
- KTD3. Preview memakai kontrak Approx A4 pada halaman yang sama; pagination final dibiarkan ke browser print engine. Rationale: pilihan ini sudah dikonfirmasi user, paling dekat ke blueprint, dan menghindari layout engine multi-page custom.
- KTD4. Screenshot per poin ditangani sebagai satu object URL lokal per item, bukan upload permanen. Rationale: repo belum punya storage/API, blueprint juga mengarah ke flow lokal berbasis file input, dan risiko print dari object URL ditutup lewat verifikasi manual eksplisit pada browser target.
- KTD5. Struktur UI dipecah menjadi builder client + editor + preview, dengan `section-editor.tsx` diekstrak hanya bila pengulangan form membuat file utama terlalu ramai. Rationale: tetap rapi tanpa over-abstraction.
- KTD6. Empty section disembunyikan dari preview/print bila tidak memiliki item, tetapi tetap bisa diedit dari panel kiri. Rationale: menghindari heading kosong pada dokumen resmi sambil mempertahankan fleksibilitas editor.
- KTD7. Print tidak diblok oleh field kosong; field opsional yang kosong cukup tidak dirender bila memang blueprint sudah kondisional, sedangkan seeded defaults memberi baseline usable. Rationale: menjaga parity dan menghindari validasi produk baru yang belum diminta.
- KTD8. Scope responsive dibatasi desktop-first untuk MVP, tetapi viewport yang terlalu sempit untuk split-pane boleh jatuh ke single-column fallback dengan editor di atas preview. Rationale: blueprint dan kontrak A4 lebih cocok ke layar lebar; fallback ini menjaga keterbacaan tanpa mengubah scope menjadi mobile optimization penuh.
- KTD9. Implementasi menambahkan guidance print singkat untuk mematikan browser header/footer bila user membutuhkan hasil formal. Rationale: elemen itu di luar kendali CSS aplikasi tetapi memengaruhi persepsi dokumen resmi.

---

## High-Level Technical Design

```mermaid
flowchart TB
  A[app/page.tsx<br/>Server Component] --> B[components/report-builder.tsx<br/>Client state owner]
  B --> C[components/report-editor.tsx]
  B --> D[components/report-preview.tsx]
  C -->|metadata intro section edits| B
  C -->|file input| E[object URL lifecycle]
  E -->|image URL per item| B
  B -->|single report state| D
  D -->|print button| F[window.print]
  F --> G[@media print in app/globals.css]
```

Design shape:
- Route shell tetap server-first.
- Semua browser-only behavior hidup di builder client subtree.
- Editor dan preview membaca/menulis source of truth state yang sama.
- Print styling global berada di `app/globals.css` karena Tailwind repo ini berbasis CSS imports, bukan `tailwind.config.*`.

---

## Output Structure

```text
app/
  page.tsx
  globals.css
  layout.tsx
components/
  report-builder.tsx
  report-editor.tsx
  report-preview.tsx
  section-editor.tsx          # optional; only if extraction improves readability
  ui/
    button.tsx
lib/
  report.ts
  utils.ts
```

`section-editor.tsx` dan pemisahan type/default helper tetap opsional; implementer boleh menggabungkan bila diff lebih kecil dan tetap terbaca.

---

## Scope Boundaries

**In scope now**

- Port perilaku inti blueprint ke route root Next.js.
- Seeded sample data, editing dinamis, screenshot lokal, preview Approx A4, dan print same-page.
- Rapikan boundary komponen agar implementasi mudah dipelihara.

**Deferred to Follow-Up Work**

- Draft persistence (`localStorage`, server draft, autosave).
- Upload permanen atau sinkronisasi screenshot ke backend/cloud.
- Exact multi-page preview yang benar-benar memecah halaman A4 di UI.
- Mobile/tablet optimization di luar desktop-first baseline.
- Validasi bisnis yang memblok print berdasarkan kelengkapan field.
- Export selain browser print/PDF bawaan.
- Automated test harness baru bila repo memang memutuskan menambahnya.

**Outside this MVP**

- Authentication/authorization.
- Database, ORM, API routes, server actions, atau document storage.
- Feature manajemen laporan multi-user, histori, atau approval workflow.

---

## System-Wide Impact

- `app/globals.css` akan menjadi lokasi aturan print global. Perubahan di sini memengaruhi seluruh app, jadi selector print harus spesifik agar tidak merusak halaman lain bila app berkembang.
- Object URL untuk screenshot membawa lifecycle concern: URL perlu direvoke saat gambar diganti, dihapus, atau subtree builder unmount.
- Composer client akan menjadi pusat JS interaktif terbesar di repo ini; menjaga `app/page.tsx` dan `app/layout.tsx` tetap tipis penting untuk membatasi client surface.

---

## Risks & Dependencies

- **Print engine variance:** Chrome, Safari, dan PDF preview bisa memecah layout berbeda. MVP harus memilih target verifikasi utama desktop Chrome, lalu cek manual di browser kedua bila sempat.
- **Long content behavior:** item panjang atau screenshot besar bisa tetap memaksa page split meski memakai `break-inside` guards. Plan harus menerima “best effort” print integrity, bukan exact pagination engine.
- **No automated harness:** repo belum punya test runner. Implementasi harus mengandalkan `npm run lint`, `npx tsc --noEmit`, dan verifikasi manual yang eksplisit sampai harness ditambahkan di pekerjaan terpisah.
- **Framework dependency:** implementer harus mematuhi guidance Next.js 16 di `node_modules/next/dist/docs/` sebelum coding detail client/server boundary.

---

## Sources & Research

- Product behavior source: `blueprint_print.md`
- Repo guidance: `AGENTS.md`, `CLAUDE.md`
- Current app shell: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Existing UI/util pattern: `components/ui/button.tsx`, `lib/utils.ts`, `components.json`
- Next.js version-specific guidance consulted via Context7 for `/vercel/next.js/v16.2.9`: App Router pages/layouts default to Server Components; browser APIs and interactive state belong in explicit Client Components.

---

## Implementation Units

### U1. Define report domain contract and seeded defaults

- **Goal:** Menetapkan bentuk state tunggal yang stabil untuk composer dan memindahkan seeded sample data blueprint ke helper reusable.
- **Requirements:** R2, R3, R4.
- **Dependencies:** None.
- **Files:** `lib/report.ts`.
- **Approach:** Simpan type/shape report, label section, seeded metadata/intro/items, serta helper kecil untuk membuat item baru dan merender label poin. Usahakan satu file helper lebih dulu; pecah jadi file types terpisah hanya bila helper menjadi padat.
- **Patterns to follow:** `lib/utils.ts` untuk helper kecil yang reusable; alias import dari `tsconfig.json`; seeded values dan shape dari `blueprint_print.md`.
- **Test scenarios:**
  - Seeded report menghasilkan empat section dengan key yang tepat dan sample content terisi.
  - Helper penambahan item membuat `id` unik dan item baru berisi `text` kosong tanpa `image`.
  - Label poin untuk item pertama sampai item kesepuluh tetap berurutan; fallback setelah `z` tidak meledak pada index lebih dari 25.
  - Empty section state tetap valid untuk editor walau preview nantinya boleh menyembunyikannya.
- **Verification:** Implementer dapat mengimpor satu shape report yang sama dari semua komponen tanpa duplikasi literal key atau seeded data.

### U2. Replace starter route with thin page and client builder shell

- **Goal:** Mengganti starter landing page dengan route root yang memuat builder client dan metadata halaman yang sesuai produk.
- **Requirements:** R1, R12.
- **Dependencies:** U1.
- **Files:** `app/page.tsx`; `app/layout.tsx`; `components/report-builder.tsx`.
- **Approach:** `app/page.tsx` hanya menjadi entry route yang merender builder client. `app/layout.tsx` merapikan metadata/title/lang dari scaffold default tanpa memindahkan state ke layout. Builder memegang source of truth state dan handler tingkat atas, tetapi UI detail belum final di unit ini.
- **Patterns to follow:** App Router shell di `app/layout.tsx`; server-first page import pattern dari docs Next.js 16; `@/lib/*` alias imports.
- **Test scenarios:**
  - Route root tidak lagi menampilkan konten scaffold bawaan Next.js.
  - Builder dirender dari subtree client tanpa memaksa seluruh layout menjadi Client Component.
  - Metadata halaman tidak lagi memakai judul/deskripsi default create-next-app.
  - State seeded tersedia ke subtree builder pada initial render.
- **Verification:** Route root membuka composer shell baru dan boundary `"use client"` hanya ada di komponen interaktif, bukan di layout global.

### U3. Build editor pane for metadata, intro, and dynamic section editing

- **Goal:** Menyediakan panel kiri yang bisa mengubah metadata, intro, serta daftar poin tiap section sesuai blueprint.
- **Requirements:** R1, R3, R4, R5, R12, R15.
- **Dependencies:** U1, U2.
- **Files:** `components/report-builder.tsx`; `components/report-editor.tsx`; `components/section-editor.tsx` (optional).
- **Approach:** Editor menerima report state dan callback mutasi dari builder. Ekstrak `section-editor.tsx` bila pengulangan block per section mengganggu keterbacaan; bila tidak, pertahankan di builder/editor untuk diff yang lebih kecil. Mutasi add/remove/edit harus selalu berbasis section key dan item id, bukan index mentah, agar preview tetap sinkron. Untuk narrow viewport fallback, unit ini juga menetapkan perilaku layout dasar: split-pane di lebar nyaman, single-column editor-then-preview saat lebar terlalu sempit.
- **Patterns to follow:** Reuse `components/ui/button.tsx` apa adanya; class composition via `cn()`; layout utility patterns di `app/globals.css`.
- **Test scenarios:**
  - Mengubah bulan/tahun/nama/jabatan/tanggal memperbarui state tanpa memengaruhi section lain.
  - Mengubah intro memperbarui string yang sama yang nanti dipakai preview.
  - Menambah poin di `persiapan` hanya menambah item pada section itu.
  - Menghapus poin tengah di section multi-item merender ulang label sehingga tidak ada gap urutan.
  - Section yang menjadi kosong tetap menampilkan affordance jelas untuk menambah item lagi dari editor.
  - Jika semua poin section dihapus, panel kiri masih punya placeholder/CTA yang membuat recovery path terlihat.
  - Pada viewport sempit, halaman turun ke single-column fallback yang tetap usable tanpa preview menimpa editor.
  - Input text panjang dan multiline tidak membuat editor kehilangan nilai saat rerender.
- **Verification:** Semua input editor mengubah satu source of truth state dan tidak ada duplikasi state lokal per section yang berisiko desinkron.

### U4. Add screenshot lifecycle to report items

- **Goal:** Menambahkan dukungan upload, preview, remove, dan re-upload screenshot lokal per poin laporan.
- **Requirements:** R6, R11, R12, R14.
- **Dependencies:** U1, U3.
- **Files:** `components/report-builder.tsx`; `components/report-editor.tsx`; `components/section-editor.tsx` (optional).
- **Approach:** Gunakan satu field `image` lokal per item yang menyimpan object URL. Reset value file input setelah selection handling agar file yang sama bisa dipilih ulang. Revoke URL lama saat replace/remove/unmount untuk mencegah leak. Tetap pakai `<img>` biasa karena source bersifat object URL lokal, bukan optimized remote asset.
- **Patterns to follow:** Browser-only API handling di explicit Client Component; blueprint behavior di `blueprint_print.md`.
- **Test scenarios:**
  - Memilih file gambar pada satu item menambahkan thumbnail editor dan URL image pada item yang benar saja.
  - Menghapus gambar menghilangkan thumbnail dan preview image tanpa menghapus text item.
  - Menghapus gambar lalu memilih file yang sama lagi tetap memicu update.
  - Mengganti gambar dengan file baru merevoke URL lama dan hanya menyimpan URL terbaru.
  - Item lain dalam section yang sama tidak ikut berubah saat satu item menerima image.
  - File non-image ditolak sesuai kontrak input browser dan tidak merusak state.
- **Verification:** Satu item hanya pernah memegang satu image URL aktif; remove/replace/unmount tidak meninggalkan URL yatim secara logis.

### U5. Render document preview from shared report state

- **Goal:** Membangun preview kanan yang menampilkan dokumen resmi berdasarkan state builder yang sama dengan editor.
- **Requirements:** R1, R3, R4, R7, R9, R11, R15.
- **Dependencies:** U1, U3, U4.
- **Files:** `components/report-preview.tsx`; `components/report-builder.tsx`; `app/globals.css`.
- **Approach:** Preview merender header instansi, paragraf pengantar, empat section laporan, screenshot per poin, dan blok tanda tangan dari state tunggal. Empty section tidak dirender di preview. Approx A4 berarti preview menjaga lebar dan visual kertas, tetapi tidak mencoba memecah halaman virtual di UI. Jika viewport terlalu sempit, preview boleh pindah ke bawah editor dalam satu alur scroll halaman.
- **Patterns to follow:** Structural content dari `blueprint_print.md`; theme tokens dan global font setup dari `app/layout.tsx` dan `app/globals.css`.
- **Test scenarios:**
  - Mengubah metadata di editor memperbarui blok tanda tangan dan kalimat pembuka preview secara live.
  - Section kosong tidak menampilkan heading kosong di preview.
  - Jika semua section kosong, preview tetap menampilkan kerangka dokumen yang masuk akal tanpa area rusak atau heading yatim.
  - Section multi-item merender label poin berurutan dan text tiap item sesuai state.
  - Screenshot item tampil di bawah poin yang benar dan tidak bocor ke section lain.
  - Intro multiline dirender dengan whitespace yang masih terbaca, bukan satu gumpalan tak terkontrol.
  - Konten panjang tetap membuat preview scrollable tanpa memotong konten secara visual di layar.
- **Verification:** Preview sepenuhnya derived from props/state, tanpa copy state kedua atau template statis yang bisa drift dari editor.

### U6. Apply print contract and final visual cleanup

- **Goal:** Menjadikan preview siap untuk browser print/PDF dengan kontrak same-page print dan aturan A4 yang eksplisit.
- **Requirements:** R7, R8, R9, R10, R11, R13, R14.
- **Dependencies:** U2, U4, U5.
- **Files:** `app/globals.css`; `components/report-builder.tsx`; `components/report-preview.tsx`.
- **Approach:** Tambahkan tombol print di subtree client yang memanggil `window.print()`. Aturan `@media print` di `app/globals.css` harus menyembunyikan editor/control surface, memusatkan area dokumen, menetapkan kontrak A4, dan memberi `break-inside` / spacing guards pada blok penting seperti item, screenshot, dan signature area. Tambahkan sizing policy untuk screenshot: fit ke lebar konten, tinggi dibatasi wajar, dan gambar sangat tinggi boleh lanjut best-effort tanpa merusak lebar halaman. Jangan buat route print terpisah. Tambahkan guidance singkat bahwa browser header/footer sebaiknya dimatikan untuk hasil formal.
- **Patterns to follow:** Print CSS shape dan A4 sizing dari `blueprint_print.md`; Tailwind v4 global CSS pattern di `app/globals.css`.
- **Test scenarios:**
  - Klik tombol print memanggil browser print flow dari halaman yang sama.
  - Saat print preview dibuka, editor kiri dan tombol utilitas tidak ikut muncul di dokumen.
  - Dokumen memakai lebar A4 yang stabil dan header/tanda tangan tetap terbaca di print preview desktop Chrome.
  - Item dengan screenshot mencoba stay together; bila tidak muat, blok berpindah halaman secara utuh sejauh kemampuan browser.
  - Screenshot sangat lebar atau tinggi tetap diskalakan agar tidak melampaui lebar konten dokumen dan tidak menghancurkan alur halaman.
  - Signature block tidak pecah menjadi dua kolom yang terpotong di tengah saat konten panjang mendorongnya ke bawah.
  - Reload halaman mengembalikan composer ke seeded defaults, menegaskan bahwa MVP memang ephemeral.
  - Print guidance tentang header/footer browser terlihat sebelum user masuk ke dialog print.
- **Verification:** Lint dan type-check lolos, lalu manual print preview di target browser utama menunjukkan editor tersembunyi, screenshot masih muncul, dan dokumen masih menyerupai format resmi blueprint.

---

## Verification Matrix

- Machine checks: `npm run lint`, `npx tsc --noEmit`.
- Manual checks on desktop Chrome:
  - edit metadata dan intro -> preview live berubah
  - add/remove poin -> urutan label tetap benar
  - upload/remove/re-upload screenshot -> editor dan preview sinkron
  - empty section -> hilang dari preview/print
  - viewport sempit -> layout jatuh ke single-column fallback tanpa editor/preview saling menimpa
  - screenshot besar -> tetap diskalakan wajar di preview dan print
  - print preview -> editor tersembunyi, screenshot masih muncul, dan signature block tetap terbaca
  - guidance header/footer browser terlihat sebelum print
  - reload page -> state reset ke seeded defaults sesuai kontrak MVP ephemeral
- Secondary browser spot-check: Safari desktop untuk mendeteksi perbedaan print besar pada screenshot dan page break.
- Plan ini tidak mengasumsikan penambahan automated test harness; skenario di atas adalah target verifikasi manual sampai pekerjaan terpisah menambah test stack.

---

## Documentation Notes

- `CLAUDE.md` sudah memuat arah produk dan blueprint root; tidak perlu diubah lagi kecuali implementasi nyata nanti mengubah struktur file atau command workflow.
- Setelah implementasi selesai, keputusan praktis tentang print CSS dan object URL lifecycle layak dicatat di `docs/solutions/` bila repo mulai memakai folder itu.
