# Gemini Guide: Generator Laporan

Dokumen ini dibuat oleh Gemini sebagai panduan internal untuk pengembangan proyek **Generator Laporan**. Dokumen ini merangkum pemahaman tentang arsitektur proyek saat ini dan memberikan peta jalan (roadmap) untuk pengembangannya di masa depan.

## 1. Ringkasan Proyek
- **Nama Proyek**: `generator-laporan` (Report Generator)
- **Tujuan**: Aplikasi web modern untuk membuat, mengelola, dan menghasilkan format laporan (kemungkinan laporan data, keuangan, atau operasional).
- **Status Saat Ini**: Proyek baru saja diinisiasi (bootstrapped) dan masih menggunakan halaman template bawaan Next.js, namun infrastruktur dasar seperti font dan konfigurasi UI sudah disiapkan.

## 2. Tech Stack & Dependensi
Proyek ini menggunakan teknologi web modern dan *cutting-edge*:
- **Framework**: Next.js v16.2.9 (App Router)
- **Library UI**: React v19
- **Styling**: Tailwind CSS v4 (menggunakan arsitektur postcss/tailwindcss terbaru)
- **Komponen UI Dasar**: 
  - `shadcn/ui` (sudah ada inisiasi di `components.json`)
  - `radix-ui` (primitif aksesibilitas)
  - `class-variance-authority`, `clsx`, `tailwind-merge` untuk utilitas class.
- **Ikonografi**: `@tabler/icons-react`
- **Tipografi**: Menggunakan `next/font/google` dengan kombinasi font `DM_Sans`, `Geist`, dan `Geist_Mono`.

## 3. Struktur Direktori Utama
- `/app`: Menggunakan Next.js App Router. Terdapat `layout.tsx` utama yang sudah diatur menggunakan font *DM Sans* sebagai font default (sans). `page.tsx` saat ini masih berupa *boilerplate*.
- `/components/ui`: Tempat di mana komponen-komponen UI modular dari Shadcn akan diletakkan.
- `/lib`: Berisi fungsi utilitas, saat ini terdapat `utils.ts` untuk fungsi `cn` (Tailwind class merger).

## 4. Rencana Pengembangan (Roadmap)
Untuk membantu Anda membangun proyek ini, berikut adalah langkah-langkah yang bisa kita lakukan bersama:

### A. Desain & Layout Dasar (Foundation)
- Membersihkan `app/page.tsx` dari *boilerplate* Next.js.
- Membuat komponen *Layout* (Sidebar, Navbar, Footer) untuk antarmuka dashboard atau aplikasi utama.
- Mengatur *Color Palette* dan tema (Dark/Light mode) yang sesuai untuk aplikasi laporan.

### B. Pembuatan UI & Form
- Menginstal dan mengimplementasikan komponen form dari `shadcn/ui` (Input, Select, DatePicker, Table, dll).
- Membuat halaman formulir untuk memasukkan data-data yang akan dijadikan laporan.

### C. Logika Pembuatan Laporan (Report Generation)
- **Tabel Data**: Menampilkan pratinjau data menggunakan komponen Tabel yang interaktif (misalnya dengan pagination dan sorting).
- **Export/Download**: Mengintegrasikan library untuk mengubah data menjadi laporan berformat PDF (misalnya menggunakan `jspdf` atau `react-pdf`) atau Excel (`xlsx`).

### D. Fitur Tambahan (Opsional sesuai Kebutuhan)
- Autentikasi pengguna jika laporan bersifat rahasia.
- Dashboard analitik dengan grafik (menggunakan Recharts atau Chart.js) sebelum laporan dicetak.
- Integrasi ke API atau database (misalnya Prisma, Supabase, atau Firebase) untuk menyimpan data laporan.

---

**Cara Menggunakan Bantuan Saya (Gemini):**
Kapan pun Anda siap, Anda bisa meminta saya untuk:
1. *"Gemini, buatkan desain layout dashboard utama untuk aplikasi ini."*
2. *"Tolong buatkan form input data laporan menggunakan Shadcn UI."*
3. *"Bagaimana cara menambahkan fitur export PDF di Next.js 16?"*

Saya sudah memahami struktur kode Anda, jadi kita bisa langsung coding tanpa perlu mengulangi konteks dasar proyek ini!
