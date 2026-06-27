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
    bulanTahun: "Bulan Mei 2026",
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
  intro: "Pada kinerja bulan Mei 2026 ini, fokus pekerjaan masih berada pada pengembangan dan penyempurnaan Sistem E-Hibah. Capaian kerja di bulan ini menitikberatkan pada optimasi pengalaman pengguna (User Experience) serta perbaikan alur validasi data pengajuan.",
  sections: [
    {
      key: "persiapan",
      title: "1. Persiapan",
      description: "",
      items: [
        {
          id: "item-1",
          text: "Melakukan pengumpulan kebutuhan dan analisis sistem dengan stakeholder terkait.",
        },
      ],
    },
    {
      key: "perancangan",
      title: "2. Perancangan",
      description: "",
      items: [
        {
          id: "item-2",
          text: "Membuat desain wireframe dan prototipe antarmuka menggunakan figma.",
        },
        {
          id: "item-3",
          text: "Merancang skema database dan relasi antar tabel.",
        },
      ],
    },
    {
      key: "finalisasi",
      title: "3. Finalisasi",
      description: "",
      items: [
        {
          id: "item-4",
          text: "Menyelesaikan implementasi frontend dengan Next.js dan Tailwind CSS.",
        },
      ],
    },
    {
      key: "evaluasi",
      title: "4. Monitoring dan Evaluasi",
      description: "Pada tahap ini, hanya dilakukan satu proses evaluasi utama secara menyeluruh.",
      items: [],
    },
  ],
};
