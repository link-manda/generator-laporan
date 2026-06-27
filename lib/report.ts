export type ReportItem = {
  id: string;
  text: string;
  image?: string; // object URL for local image
};

export type ReportSection = {
  key: "persiapan" | "perancangan" | "finalisasi" | "evaluasi";
  title: string;
  description: string;
  items: ReportItem[];
};

export type ReportMetadata = {
  bulanTahun: string;
  posisi: string;
  nama: string;
  instansi: string;
  daerah: string;
  tahun: string;
  alamatInstansi: string;
  tempatTanggal: string;
  penyusunJabatan: string;
  penyusunNama: string;
  penyetujuJabatan: string;
  penyetujuNama: string;
  penyetujuNip: string;
};

export type ReportState = {
  metadata: ReportMetadata;
  intro: string;
  sections: ReportSection[];
};

// Helpers

export function createEmptyItem(): ReportItem {
  return {
    id: Math.random().toString(36).substring(2, 9),
    text: "",
  };
}

export function getPointLabel(index: number): string {
  if (index < 26) {
    return String.fromCharCode(97 + index) + ".";
  }
  return `${index + 1}.`; // fallback if > 26
}

// Seeded Data

export const SEEDED_REPORT: ReportState = {
  metadata: {
    bulanTahun: "Mei 2026",
    posisi: "Programmer (Full Stack Developer)",
    nama: "I Made Brahmanda Setyadi, S.Kom.",
    instansi: "Dinas Komunikasi dan Informatika",
    daerah: "Kabupaten Badung",
    tahun: "2026",
    alamatInstansi: "PUSAT PEMERINTAHAN MANGUPRAJA MANDALA\nJln Raya Sempidi, Mengwi – Kabupaten Badung (80351)\nTelp. (0361) 419888 Fax (0361) 419888\nWebsite : www.diskominfo.badungkab.go.id",
    tempatTanggal: "Mangupura, 2 Juni 2026",
    penyusunJabatan: "Tenaga Ahli",
    penyusunNama: "I Made Brahmanda Setyadi, S.Kom",
    penyetujuJabatan: "Kepala Bidang E-Gov",
    penyetujuNama: "I Gusti Agung Angga Mulyanta, S.Kom",
    penyetujuNip: "NIP. 19830527 200901 1 006",
  },
  intro: "Pada kinerja bulan Mei 2026 ini, fokus pekerjaan masih berada pada pengembangan dan penyempurnaan Sistem E-Hibah. Capaian kerja di bulan ini menitikberatkan pada optimasi pengalaman pengguna (User Experience) serta perbaikan alur validasi data pengajuan. Selain itu, dilakukan peningkatan signifikan pada antarmuka pencarian (Search Interface) bagi pengguna internal dengan menerapkan logika filter hierarkis berbasis wilayah.",
  sections: [
    {
      key: "persiapan",
      title: "1. Persiapan",
      description: "Tahap persiapan bulan ini meliputi penelusuran (debugging) terhadap laporan kendala (bug) pada alur pengajuan hibah oleh pemohon, di mana proses sering terhenti akibat field mandatory (wajib) yang tidak bisa diakses/diedit. Selain itu, dilakukan analisis kebutuhan perbaikan fungsionalitas filter wilayah pada dashboard admin (Backpack) agar tidak lagi memunculkan opsi kombinasi yang tidak relevan (misal: Kecamatan A berada di luar Kabupaten B).",
      items: [],
    },
    {
      key: "perancangan",
      title: "2. Perancangan",
      description: "Berdasarkan analisis kendala yang ada, task (tugas) utama pada bulan Mei dibagi menjadi dua perancangan solusi teknis sebagai berikut:",
      items: [
        {
          id: "item-2-1",
          text: "**Perancangan Validasi Pre-check Pengajuan**: Merancang logika guard pada sisi frontend dan backend yang secara otomatis memeriksa kelengkapan profil lembaga sebelum memproses form \"Ajukan Sekarang\", serta menyusun pesan peringatan (alert) yang informatif bagi pemohon.",
        },
        {
          id: "item-2-2",
          text: "**Perancangan Dependent Tree Filter**: Merancang konsep antarmuka filter bersarang (dependent filter) pada framework Backpack. Logika dirancang menggunakan Ajax/API endpoint yang sudah ada, sehingga ketika 'Kabupaten' dipilih, sistem akan memuat ulang hanya opsi 'Kecamatan' yang relevan secara otomatis, begitu pula dengan opsi 'Desa'.",
        },
      ],
    },
    {
      key: "finalisasi",
      title: "3. Finalisasi",
      description: "Tahap implementasi telah diselesaikan dengan rincian pembaruan fitur sebagai berikut:",
      items: [
        {
          id: "item-3-1",
          text: "**Perbaikan Alur Validasi Kepengurusan Pemohon**. Telah dilakukan perbaikan pada tombol \"Ajukan Sekarang\" di menu Dashboard Pemohon. Sistem kini melakukan pre-check terhadap data kepengurusan lembaga (No KTP, No Telp, Alamat). Apabila terdeteksi ada data yang kosong atau invalid, sistem akan memblokir pengajuan dan menampilkan notifikasi alert spesifik mengenai field mana yang belum lengkap. Fitur ini juga memberikan instruksi jelas kepada pemohon untuk menghubungi Admin Kesra guna pembaruan data, sehingga menjaga konsistensi kebijakan existing flow Diskominfo. Validasi guard juga ditambahkan pada proses submit backend sebagai keamanan ganda (double layer security).",
        },
        {
          id: "item-3-2",
          text: "**Optimasi Dependent Filter Wilayah Hierarkis**. Penyempurnaan mekanisme pencarian (filtering) pada menu \"Semua Permohonan\" bagi role Administrator, Kesra, Monitor, dan Inspektorat. Filter wilayah kini menggunakan metode hierarki (Kabupaten > Kecamatan > Desa). Pemilihan sebuah wilayah akan membatasi (restrict) opsi pada dropdown di bawahnya (misal: memilih Kecamatan Abiansemal hanya akan memunculkan Desa-desa di dalam Abiansemal). Mekanisme ini bekerja secara dinamis memuat ulang (reload) opsi dan me-reset child filter secara otomatis, sehingga mencegah terjadinya kesalahan kombinasi pencarian tanpa memodifikasi business logic dari vendor Backpack.\n---",
        },
      ],
    },
    {
      key: "evaluasi",
      title: "4. Monitoring dan Evaluasi",
      description: "Evaluasi bulan ini difokuskan pada uji coba langsung kemudahan operasional (Usability Testing). Implementasi pre-check pada form pengajuan terbukti berhasil mengurangi kebingungan user pemohon yang sebelumnya terjebak pada halaman form tanpa kejelasan. Di sisi lain, pengujian fitur dependent filter menunjukkan perbaikan signifikan dalam kecepatan dan ketepatan operator internal dalam mencari data permohonan spesifik per wilayah tanpa menghasilkan query database yang salah. Stabilitas aplikasi E-Hibah semakin meningkat dan semakin siap untuk mengakomodasi tingginya volume pengajuan dari masyarakat.",
      items: [],
    },
  ],
};
