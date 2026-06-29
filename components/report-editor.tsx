"use client";

import { ChangeEvent, useRef } from "react";
import { ReportState, ReportItem, createEmptyItem, getPointLabel } from "@/lib/report";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  IconId,
  IconSignature,
  IconQuote,
  IconListCheck,
  IconPlus,
  IconTrash
} from "@tabler/icons-react";

interface ReportEditorProps {
  report: ReportState;
  updateMetadata: (key: keyof ReportState["metadata"], value: string) => void;
  updateIntro: (value: string) => void;
  updateSectionTitle: (sectionKey: string, newTitle: string) => void;
  updateSectionDescription: (sectionKey: string, newDescription: string) => void;
  addSectionItem: (sectionKey: string, item: ReportItem) => void;
  updateSectionItem: (sectionKey: string, itemId: string, newText: string) => void;
  updateSectionItemImage: (sectionKey: string, itemId: string, imageUrl: string | undefined) => void;
  updateSectionItemImageSize: (sectionKey: string, itemId: string, width?: string, height?: string) => void;
  removeSectionItem: (sectionKey: string, itemId: string) => void;
}

export default function ReportEditor({
  report,
  updateMetadata,
  updateIntro,
  updateSectionTitle,
  updateSectionDescription,
  addSectionItem,
  updateSectionItem,
  updateSectionItemImage,
  updateSectionItemImageSize,
  removeSectionItem,
}: ReportEditorProps) {
  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col space-y-8 pb-12">
      <div className="-mx-6 -mt-6 p-6 mb-2 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center gap-4 text-white shadow-md">
        <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg shadow-sm border border-white/20">
          <img src="/android-chrome-192x192.png" alt="Logo Aplikasi" className="w-10 h-10 object-contain rounded-md" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight leading-none text-white">LaporPro</h2>
          <p className="text-slate-300 text-xs mt-1.5 font-medium">Generator Laporan Kominfo</p>
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-lg bg-neutral-50">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-700">
          <IconId size={20} />
          Informasi Metadata
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bulan / Tahun</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 text-sm"
            value={report.metadata.bulanTahun}
            onChange={(e) => updateMetadata("bulanTahun", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Posisi Pekerjaan</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 text-sm"
            value={report.metadata.posisi}
            onChange={(e) => updateMetadata("posisi", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Pegawai</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 text-sm"
            value={report.metadata.nama}
            onChange={(e) => updateMetadata("nama", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Instansi</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 text-sm"
            value={report.metadata.instansi}
            onChange={(e) => updateMetadata("instansi", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Daerah (Kabupaten/Kota)</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 text-sm"
            value={report.metadata.daerah}
            onChange={(e) => updateMetadata("daerah", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tahun Dokumen</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 text-sm"
            value={report.metadata.tahun}
            onChange={(e) => updateMetadata("tahun", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Alamat Instansi / Kop Surat</label>
          <textarea
            className="w-full border rounded-md p-2 text-sm min-h-[80px]"
            value={report.metadata.alamatInstansi}
            onChange={(e) => updateMetadata("alamatInstansi", e.target.value)}
          />
        </div>

        <div className="border-t pt-4 mt-4 space-y-4">
          <h4 className="font-medium text-md flex items-center gap-2 text-blue-700">
            <IconSignature size={18} />
            Tanda Tangan
          </h4>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tempat, Tanggal Laporan</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 text-sm"
              value={report.metadata.tempatTanggal}
              onChange={(e) => updateMetadata("tempatTanggal", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Kiri (Penyusun)</label>
              <input
                type="text" placeholder="Jabatan"
                className="w-full border rounded-md p-2 text-sm mb-2"
                value={report.metadata.penyusunJabatan}
                onChange={(e) => updateMetadata("penyusunJabatan", e.target.value)}
              />
              <input
                type="text" placeholder="Nama"
                className="w-full border rounded-md p-2 text-sm mb-2"
                value={report.metadata.penyusunNama}
                onChange={(e) => updateMetadata("penyusunNama", e.target.value)}
              />
              <div className="border rounded-md p-2 bg-white">
                <label className="text-xs font-medium text-neutral-500 mb-2 block">Upload TTD (Opsional)</label>
                {report.metadata.penyusunTTD ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <img src={report.metadata.penyusunTTD} alt="TTD Penyusun" className="h-10 w-auto object-contain border bg-neutral-50 rounded" />
                      <Button variant="outline" size="sm" onClick={() => updateMetadata("penyusunTTD", "")} className="text-red-600 h-8 px-2 text-xs">Hapus</Button>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-[10px] text-neutral-500 shrink-0">Skala:</span>
                      <input 
                        type="range" min="10" max="100" step="5" 
                        value={parseInt(report.metadata.penyusunTTDWidth || "100")} 
                        onChange={(e) => updateMetadata("penyusunTTDWidth", `${e.target.value}%`)}
                        className="w-full min-w-0 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="file" accept="image/*"
                    className="text-xs w-full cursor-pointer file:cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, (base64) => updateMetadata("penyusunTTD", base64));
                      }
                      e.target.value = '';
                    }}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Kanan (Penyetuju)</label>
              <input
                type="text" placeholder="Jabatan"
                className="w-full border rounded-md p-2 text-sm mb-2"
                value={report.metadata.penyetujuJabatan}
                onChange={(e) => updateMetadata("penyetujuJabatan", e.target.value)}
              />
              <input
                type="text" placeholder="Nama"
                className="w-full border rounded-md p-2 text-sm mb-2"
                value={report.metadata.penyetujuNama}
                onChange={(e) => updateMetadata("penyetujuNama", e.target.value)}
              />
              <input
                type="text" placeholder="NIP"
                className="w-full border rounded-md p-2 text-sm mb-2"
                value={report.metadata.penyetujuNip}
                onChange={(e) => updateMetadata("penyetujuNip", e.target.value)}
              />
              <div className="border rounded-md p-2 bg-white">
                <label className="text-xs font-medium text-neutral-500 mb-2 block">Upload TTD (Opsional)</label>
                {report.metadata.penyetujuTTD ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <img src={report.metadata.penyetujuTTD} alt="TTD Penyetuju" className="h-10 w-auto object-contain border bg-neutral-50 rounded" />
                      <Button variant="outline" size="sm" onClick={() => updateMetadata("penyetujuTTD", "")} className="text-red-600 h-8 px-2 text-xs">Hapus</Button>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-[10px] text-neutral-500 shrink-0">Skala:</span>
                      <input 
                        type="range" min="10" max="100" step="5" 
                        value={parseInt(report.metadata.penyetujuTTDWidth || "100")} 
                        onChange={(e) => updateMetadata("penyetujuTTDWidth", `${e.target.value}%`)}
                        className="w-full min-w-0 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="file" accept="image/*"
                    className="text-xs w-full cursor-pointer file:cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, (base64) => updateMetadata("penyetujuTTD", base64));
                      }
                      e.target.value = '';
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 border p-4 rounded-lg bg-neutral-50">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-700">
          <IconQuote size={20} />
          Kata Pengantar
        </h3>
        <textarea
          className="w-full border rounded-md p-2 text-sm min-h-[100px]"
          value={report.intro}
          onChange={(e) => updateIntro(e.target.value)}
        />
      </div>

      {report.sections.map((section) => (
        <div key={section.key} className="space-y-4 border p-4 rounded-lg bg-neutral-50">
          <div className="flex items-center gap-2 text-blue-700">
            <IconListCheck size={20} />
            <input
              type="text"
              className="font-semibold text-lg bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-blue-500 focus:outline-none w-full pb-1 transition-colors text-black"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.key, e.target.value)}
              placeholder="Judul Bagian..."
            />
          </div>
          <textarea
            className="w-full bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-blue-500 focus:outline-none min-h-[40px] text-sm resize-y"
            value={section.description || ""}
            onChange={(e) => updateSectionDescription(section.key, e.target.value)}
            placeholder="Tulis paragraf penjelasan (opsional)..."
          />

          {(section.items.length === 0 && !section.description) ? (
            <p className="text-sm text-neutral-500 italic">Belum ada poin di bagian ini.</p>
          ) : (
            <div className="space-y-4">
              {section.items.map((item, index) => (
                <div key={item.id} className="border-l-2 border-blue-500 pl-4 py-2 space-y-3 relative group">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-sm w-6 shrink-0">{getPointLabel(index)}</span>
                    <textarea
                      className="w-full border rounded-md p-2 text-sm min-h-[80px]"
                      value={item.text}
                      onChange={(e) => updateSectionItem(section.key, item.id, e.target.value)}
                      placeholder="Deskripsi kegiatan..."
                    />
                  </div>

                  <div className="ml-8">
                    {item.image ? (
                      <div className="flex flex-col gap-3 p-3 border rounded-md bg-white">
                        <div className="flex items-start justify-between">
                          <img src={item.image} alt="Preview" className="h-20 w-auto border rounded object-cover" />
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => updateSectionItemImage(section.key, item.id, undefined)}
                          >
                            Hapus Gambar
                          </Button>
                        </div>
                        <div className="flex gap-4 pt-2 border-t">
                          <div className="flex-1 space-y-1">
                            <label className="text-xs text-neutral-500 font-medium">Skala Lebar Gambar (%)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={parseInt(item.imageWidth || "100")}
                                onChange={(e) => updateSectionItemImageSize(section.key, item.id, `${e.target.value}%`, item.imageHeight)}
                                className="flex-1 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-xs font-mono w-10 text-right">{item.imageWidth || "100%"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer file:cursor-pointer max-w-sm"
                          id={`file-${item.id}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (base64) => updateSectionItemImage(section.key, item.id, base64));
                            }
                            e.target.value = '';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                    onClick={() => removeSectionItem(section.key, item.id)}
                    title="Hapus Poin"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full mt-4 border-dashed flex items-center gap-2"
            onClick={() => addSectionItem(section.key, createEmptyItem())}
          >
            <IconPlus size={16} />
            Tambah Poin Baru
          </Button>
        </div>
      ))}

      <div className="text-xs text-neutral-500 mt-8 pb-8 space-y-2 text-center px-4">
        <p>Tips: Matikan opsi &quot;Headers and Footers&quot; pada dialog cetak browser Anda untuk hasil laporan formal yang bersih.</p>
        <p>Tips Format: Gunakan <strong>**teks tebal**</strong> untuk bold dan <em>*teks miring*</em> atau <em>_teks miring_</em> untuk italic.</p>
        <p>Tips Spasi: Ketik <strong>---</strong> (3 strip) untuk memaksa ganti halaman (Page Break). Tekan <strong>Enter</strong> dua kali untuk memberi jarak baris kosong.</p>
      </div>
    </div>
  );
}
