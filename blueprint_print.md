import React, { useState, useRef } from 'react';
import { Plus, Trash2, Printer, FileText, Settings, User, Image as ImageIcon, X } from 'lucide-react';

export default function App() {
  // State untuk Data Pegawai & Pengesahan
  const [metadata, setMetadata] = useState({
    bulan: 'Mei',
    tahun: '2026',
    nama: 'I Made Brahmanda Setyadi, S.Kom.',
    jabatan: 'Programmer (Full Stack Developer)',
    nip: '',
    tanggalLaporan: '2 Juni 2026',
    namaAtasan: 'Gusti Agung Angga Mulyanta, S.Kom',
    jabatanAtasan: 'Kepala Bidang E-Gov',
    nipAtasan: '19830527 200901 1 006'
  });

  // State untuk Paragraf Pengantar
  const [intro, setIntro] = useState(
    'Pada kinerja bulan ini, fokus pekerjaan masih berada pada pengembangan dan penyempurnaan Sistem E-Hibah. Capaian kerja di bulan ini menitikberatkan pada optimasi pengalaman pengguna (User Experience) serta perbaikan alur validasi data pengajuan. Selain itu, dilakukan peningkatan signifikan pada antarmuka pencarian (Search Interface) bagi pengguna internal dengan menerapkan logika filter hierarkis berbasis wilayah.'
  );

  // State Dinamis untuk Poin-poin Laporan
  const [sections, setSections] = useState({
    persiapan: [
      { id: 1, text: 'Tahap persiapan bulan ini meliputi penelusuran (debugging) terhadap laporan kendala (bug) pada alur pengajuan hibah oleh pemohon, di mana proses sering terhenti akibat field mandatory (wajib) yang tidak bisa diakses/diedit.' },
      { id: 2, text: 'Melakukan analisis kebutuhan perbaikan fungsionalitas filter wilayah pada dashboard admin (Backpack) agar tidak lagi memunculkan opsi kombinasi yang tidak relevan.' }
    ],
    perancangan: [
      { id: 1, text: 'Perancangan Validasi Pre-check Pengajuan: Merancang logika guard pada sisi frontend dan backend yang secara otomatis memeriksa kelengkapan profil lembaga.' },
      { id: 2, text: 'Perancangan Dependent Tree Filter: Merancang konsep antarmuka filter bersarang (dependent filter) pada framework Backpack.' }
    ],
    finalisasi: [
      { id: 1, text: 'Perbaikan Alur Validasi Kepengurusan Pemohon. Telah dilakukan perbaikan pada tombol "Ajukan Sekarang" di menu Dashboard Pemohon. Sistem kini melakukan pre-check terhadap data kepengurusan lembaga.' },
      { id: 2, text: 'Optimasi Dependent Filter Wilayah Hierarkis. Penyempurnaan mekanisme pencarian (filtering) pada menu "Semua Permohonan" bagi role Administrator. Filter wilayah kini menggunakan metode hierarki (Kabupaten > Kecamatan > Desa).' }
    ],
    evaluasi: [
      { id: 1, text: 'Evaluasi bulan ini difokuskan pada uji coba langsung kemudahan operasional (Usability Testing). Implementasi pre-check pada form pengajuan terbukti berhasil mengurangi kebingungan user pemohon.' }
    ]
  });

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionItemChange = (sectionName, id, value) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item =>
        item.id === id ? { ...item, text: value } : item
      )
    }));
  };

  const addSectionItem = (sectionName) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: [...prev[sectionName], { id: Date.now(), text: '' }]
    }));
  };

  const removeSectionItem = (sectionName, id) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].filter(item => item.id !== id)
    }));
  };

  const handleImageUpload = (sectionName, id, file) => {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setSections(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item =>
        item.id === id ? { ...item, image: imageUrl } : item
      )
    }));
  };

  const removeImage = (sectionName, id) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item =>
        item.id === id ? { ...item, image: undefined } : item
      )
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* ========================================================================
        BAGIAN KIRI: FORM INPUT (Tidak ikut tercetak saat diprint)
        ========================================================================
      */}
      <div className="w-1/3 bg-white border-r shadow-lg overflow-y-auto print:hidden flex flex-col">
        <div className="p-4 bg-blue-700 text-white sticky top-0 z-10 shadow-md">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FileText size={24} /> Generator Laporan
          </h1>
          <p className="text-sm text-blue-200">Diskominfo Kab. Badung</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Form Pengaturan Dokumen */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <Settings size={20} className="text-blue-600"/> Pengaturan Dokumen
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                <input type="text" name="bulan" value={metadata.bulan} onChange={handleMetadataChange} className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input type="text" name="tahun" value={metadata.tahun} onChange={handleMetadataChange} className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pengantar Capaian Kinerja</label>
              <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
          </section>

          {/* Form Data Pelapor & Atasan */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600"/> Data Penandatangan
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pembuat Laporan</label>
                <input type="text" name="nama" value={metadata.nama} onChange={handleMetadataChange} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Tanda Tangan</label>
                <input type="text" name="tanggalLaporan" value={metadata.tanggalLaporan} onChange={handleMetadataChange} className="w-full p-2 border rounded text-sm" placeholder="Contoh: 2 Juni 2026" />
              </div>
              <div className="pt-2 border-t border-dashed">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Atasan / Kabid</label>
                <input type="text" name="namaAtasan" value={metadata.namaAtasan} onChange={handleMetadataChange} className="w-full p-2 border rounded text-sm" />
              </div>
            </div>
          </section>

          {/* Form Poin-Poin Pekerjaan */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Isi Laporan (Dinamis)</h2>

            {/* Helper Component untuk merender setiap section */}
            {Object.entries({
              'persiapan': '1. Persiapan',
              'perancangan': '2. Perancangan',
              'finalisasi': '3. Finalisasi',
              'evaluasi': '4. Monitoring dan Evaluasi'
            }).map(([key, label]) => (
              <div key={key} className="mb-6 bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">{label}</h3>
                  <button onClick={() => addSectionItem(key)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-200">
                    <Plus size={14} /> Tambah Poin
                  </button>
                </div>
                <div className="space-y-3">
                  {sections[key].map((item, index) => (
                    <div key={item.id} className="flex flex-col gap-2 border-b border-gray-100 pb-3 mb-2 last:border-0">
                      <div className="flex gap-2 items-start">
                        <span className="text-sm font-medium text-gray-500 mt-2 w-4">{String.fromCharCode(97 + index)}.</span>
                        <textarea
                          value={item.text}
                          onChange={(e) => handleSectionItemChange(key, item.id, e.target.value)}
                          className="flex-1 p-2 text-sm border rounded min-h-[60px]"
                          placeholder="Deskripsi kegiatan..."
                        />
                        <div className="flex flex-col gap-1 mt-1">
                          <button onClick={() => removeSectionItem(key, item.id)} className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded" title="Hapus Poin">
                            <Trash2 size={16} />
                          </button>
                          <label className="text-blue-500 hover:text-blue-700 p-1.5 bg-blue-50 rounded cursor-pointer flex justify-center" title="Tambah Screenshot">
                            <ImageIcon size={16} />
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(key, item.id, e.target.files[0])} />
                          </label>
                        </div>
                      </div>

                      {/* Preview Thumbnail di Form Kiri */}
                      {item.image && (
                        <div className="ml-6 relative inline-block w-fit mt-1">
                          <img src={item.image} alt="Screenshot Thumbnail" className="h-20 w-auto object-cover rounded border shadow-sm" />
                          <button onClick={() => removeImage(key, item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow" title="Hapus Gambar">
                            <X size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {sections[key].length === 0 && <p className="text-xs text-gray-400 italic">Belum ada poin. Klik tambah.</p>}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* ========================================================================
        BAGIAN KANAN: PREVIEW DOKUMEN A4
        ========================================================================
      */}
      <div className="flex-1 bg-gray-300 overflow-y-auto flex justify-center py-8 relative print:py-0 print:bg-white print:block">

        {/* Tombol Print (Mengambang di pojok kanan atas) */}
        <button
          onClick={handlePrint}
          className="fixed top-6 right-8 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 print:hidden z-50 transition-transform hover:scale-105"
        >
          <Printer size={20} /> Cetak ke PDF
        </button>

        {/* Kertas A4 */}
        <div className="bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none print:m-0 print:p-0"
             style={{
               width: '210mm',
               minHeight: '297mm',
               padding: '20mm 20mm 20mm 25mm' // Margin standar laporan (kiri sedikit lebih lebar)
             }}>

          {/* Header Surat (Disederhanakan untuk HTML) */}
          <div className="flex flex-col items-center border-b-[3px] border-black pb-4 mb-6">
            <h2 className="text-lg font-bold text-center leading-snug">PEMERINTAH KABUPATEN BADUNG<br/>DINAS KOMUNIKASI DAN INFORMATIKA</h2>
            <p className="text-sm text-center mt-1">
              PUSAT PEMERINTAHAN MANGUPRAJA MANDALA<br/>
              Jln Raya Sempidi, Mengwi - Kabupaten Badung (80351)<br/>
              Telp. (0361) 419888 Fax (0361) 419888<br/>
              Website: www.diskominfo.badungkab.go.id
            </p>
          </div>

          {/* Konten Utama */}
          <div className="text-justify text-base font-serif leading-relaxed text-gray-900">

            <h3 className="font-bold mb-3 text-lg">A. Capaian Kinerja</h3>

            <p className="indent-8 mb-4">
              Pada kinerja bulan {metadata.bulan} {metadata.tahun} ini, {intro}
            </p>

            <div className="ml-4 space-y-4">
              {/* 1. Persiapan */}
              <div>
                <h4 className="font-bold">1. Persiapan</h4>
                <div className="mt-1">
                  {sections.persiapan.map((item, i) => (
                    <div key={item.id} className="mb-4 break-inside-avoid">
                      <p className="text-justify">
                        {sections.persiapan.length > 1 && <span className="mr-2 inline-block w-4">{String.fromCharCode(97 + i)}.</span>}
                        {sections.persiapan.length === 1 && <span className="mr-2 inline-block w-4">-</span>}
                        <span className={sections.persiapan.length > 1 ? "inline" : ""}>{item.text}</span>
                      </p>
                      {item.image && (
                        <div className="ml-6 mt-2">
                          <img src={item.image} alt="Bukti Persiapan" className="max-w-[90%] max-h-[300px] object-contain border border-gray-400 rounded-sm shadow-sm print:shadow-none" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Perancangan */}
              <div>
                <h4 className="font-bold">2. Perancangan</h4>
                <p className="mb-2">Berdasarkan analisis kendala yang ada, task (tugas) utama pada bulan ini dibagi menjadi beberapa perancangan solusi teknis sebagai berikut:</p>
                <div className="ml-2 mt-1">
                  {sections.perancangan.map((item, i) => (
                    <div key={item.id} className="mb-4 break-inside-avoid">
                      <p className="text-justify flex">
                        <span className="mr-2 w-4 flex-shrink-0">{String.fromCharCode(97 + i)}.</span>
                        <span>{item.text}</span>
                      </p>
                      {item.image && (
                        <div className="ml-6 mt-2">
                          <img src={item.image} alt="Bukti Perancangan" className="max-w-[90%] max-h-[300px] object-contain border border-gray-400 rounded-sm shadow-sm print:shadow-none" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Finalisasi */}
              <div>
                <h4 className="font-bold">3. Finalisasi</h4>
                <p className="mb-2">Tahap implementasi telah diselesaikan dengan rincian pembaruan fitur sebagai berikut:</p>
                <div className="ml-2 mt-1">
                  {sections.finalisasi.map((item, i) => (
                    <div key={item.id} className="mb-4 break-inside-avoid">
                      <p className="text-justify flex">
                        <span className="mr-2 w-4 flex-shrink-0">{String.fromCharCode(97 + i)}.</span>
                        <span>{item.text}</span>
                      </p>
                      {item.image && (
                        <div className="ml-6 mt-2">
                          <img src={item.image} alt="Bukti Finalisasi" className="max-w-[90%] max-h-[300px] object-contain border border-gray-400 rounded-sm shadow-sm print:shadow-none" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Evaluasi */}
              <div>
                <h4 className="font-bold">4. Monitoring dan Evaluasi</h4>
                <div className="mt-1">
                  {sections.evaluasi.map((item, i) => (
                    <div key={item.id} className="mb-4 break-inside-avoid">
                      <p className="text-justify">
                         {item.text}
                      </p>
                      {item.image && (
                        <div className="mt-2">
                          <img src={item.image} alt="Bukti Evaluasi" className="max-w-[90%] max-h-[300px] object-contain border border-gray-400 rounded-sm shadow-sm print:shadow-none" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bagian Tanda Tangan */}
            <div className="mt-12 w-full">
              <div className="flex justify-between">
                <div className="w-1/2 text-center">
                  <p>Disusun Oleh,<br/>{metadata.jabatan}</p>
                  <br/><br/><br/><br/>
                  <p className="font-bold underline">{metadata.nama}</p>
                  {metadata.nip && <p>NIP. {metadata.nip}</p>}
                </div>
                <div className="w-1/2 text-center">
                  <p>Mangupura, {metadata.tanggalLaporan}<br/>Disetujui Oleh,<br/>{metadata.jabatanAtasan}</p>
                  <br/><br/><br/><br/>
                  <p className="font-bold underline">{metadata.namaAtasan}</p>
                  <p>NIP. {metadata.nipAtasan}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CSS Khusus untuk Print (Menyembunyikan form dan mengatur ukuran kertas) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
}