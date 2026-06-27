"use client";

import { ReportState, getPointLabel } from "@/lib/report";

const renderRichText = (text: string) => {
  if (!text) return { __html: "" };
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>");
  return { __html: html };
};

const renderParagraphs = (text: string, isIndent: boolean = false) => {
  if (!text) return null;
  return text.split('\n').map((paragraph, idx) => {
    const trimmed = paragraph.trim();
    if (trimmed === '---') {
      return <div key={idx} className="break-after-page w-full h-2" style={{ pageBreakAfter: 'always' }} />;
    }
    if (trimmed === '') {
      return <div key={idx} className="h-5 w-full" />;
    }
    return (
      <p 
        key={idx} 
        className={isIndent ? "indent-8" : (idx > 0 ? "mt-1" : "")} 
        dangerouslySetInnerHTML={renderRichText(paragraph)} 
      />
    );
  });
};

export default function ReportPreview({ report }: { report: ReportState }) {
  return (
    <div id="report-preview-content" className="flex flex-col gap-8 print:gap-0">
      
      {/* COVER PAGE */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg print:shadow-none print:w-auto print:min-h-0 print:h-[calc(297mm-5.08cm)] print:mx-0 p-[2.54cm] print:p-0 text-black font-sans flex flex-col justify-between break-after-page" style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}>
        
        <div className="w-full text-center mt-8">
          <h1 className="text-2xl font-bold mb-6">
            Laporan Periodik {report.metadata.bulanTahun}
          </h1>
          <h2 className="text-xl font-bold">
            Laporan Pelaksanaan Kegiatan Sebagai {report.metadata.posisi}
          </h2>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center w-full my-8">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVJhbrB5vVGVDnX0BDtsMByzrf05DyhXUOMe2bOeEUFQ&s=10" alt="Logo Instansi" className="w-[280px] h-[280px] object-contain" />
        </div>

        <div className="w-full text-center mb-8">
          <div className="font-bold text-lg mb-16">
            <p className="mb-2">Oleh:</p>
            <p className="text-xl">{report.metadata.nama}</p>
            <p className="font-normal italic">{report.metadata.posisi}</p>
          </div>

          <div className="font-bold text-xl">
            <p>{report.metadata.instansi}</p>
            <p>{report.metadata.daerah}</p>
            <p>Tahun {report.metadata.tahun}</p>
          </div>
        </div>
      </div>

      {/* CONTENT PAGES */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full print:min-h-0 print:mx-0 p-[2.54cm] print:p-0 text-black font-sans leading-relaxed">
        
        {/* HEADER KOP SURAT */}
        <div className="flex items-center justify-center mb-6 border-b-[6px] border-black pb-2 print:border-b-[6px] print:border-black gap-2">
          <div className="w-[110px] h-[110px] shrink-0 flex items-center justify-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVJhbrB5vVGVDnX0BDtsMByzrf05DyhXUOMe2bOeEUFQ&s=10" alt="Logo Instansi" className="w-full h-full object-contain" />
          </div>
          <div className="text-center flex-1 leading-tight text-[11pt]">
            <h1 className="font-bold uppercase">PEMERINTAH {report.metadata.daerah}</h1>
            <h2 className="font-bold uppercase">{report.metadata.instansi}</h2>
            <div className="leading-tight">
              {report.metadata.alamatInstansi.split('\n').map((line, idx) => {
                if (idx === 0) {
                  return <div key={idx} className="font-bold uppercase">{line}</div>;
                }
                
                if (line.includes('www.')) {
                  const parts = line.split(/(www\.[^\s]+)/);
                  return (
                    <div key={idx}>
                      {parts.map((p, i) => p.startsWith('www.') ? <span key={i} className="text-blue-600 underline">{p}</span> : p)}
                    </div>
                  );
                }
                
                return <div key={idx}>{line}</div>;
              })}
            </div>
          </div>
        </div>

        {/* INTRO */}
        <div className="mb-6 text-justify text-[11pt]">
          <span className="font-bold block mb-2">A. Capaian Kinerja</span>
          <div className="space-y-1">
            {renderParagraphs(report.intro, true)}
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-6">
          {report.sections.map((section) => {
            if (section.items.length === 0 && !section.description) return null;

            return (
              <div key={section.key} className="mb-4 pl-4 relative text-[11pt]">
                <div className="absolute left-0 top-0 font-medium">{section.title.split('.')[0]}.</div>
                <h3 className="font-medium text-[11pt] mb-2 pl-2">
                  {section.title.substring(section.title.indexOf('.') + 1).trim()}
                </h3>

                {section.description && (
                  <div className="mb-4 pl-2 text-justify space-y-1">
                    {renderParagraphs(section.description, true)}
                  </div>
                )}
                
                <div className="space-y-4 pl-2">
                  {section.items.map((item, index) => (
                    <div key={item.id} className="flex flex-col mb-4 break-inside-avoid">
                      <div className="flex gap-2">
                        <span className="font-medium shrink-0 w-6">{getPointLabel(index)}</span>
                        <div className="flex-1 text-justify">
                          {renderParagraphs(item.text, false)}
                        </div>
                      </div>
                      {item.image && (
                        <div className="mt-4 mb-2 ml-8 flex justify-center">
                          <img 
                            src={item.image} 
                            alt="Lampiran" 
                            className="max-w-full print:max-w-[80%]"
                            style={{ maxHeight: '350px', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* TANDA TANGAN */}
        <div className="mt-20 pt-8 break-inside-avoid text-[11pt]">
          <div className="text-center mb-8">
            <p>{report.metadata.tempatTanggal}</p>
          </div>
          
          <div className="flex justify-between px-8">
            <div className="text-center w-64 flex flex-col items-center">
              <p>Disusun Oleh,</p>
              <p className="mb-24">{report.metadata.penyusunJabatan}</p>
              
              <div className="inline-block">
                <p className="font-bold underline leading-tight m-0 p-0 whitespace-nowrap">{report.metadata.penyusunNama}</p>
              </div>
            </div>
            
            <div className="text-center w-64 flex flex-col items-center">
              <p>Disetujui Oleh,</p>
              <p className="mb-24">{report.metadata.penyetujuJabatan}</p>
              
              <div className="inline-block">
                <p className="font-bold underline leading-tight m-0 p-0 whitespace-nowrap">{report.metadata.penyetujuNama}</p>
                <p className="leading-tight m-0 p-0 whitespace-nowrap">{report.metadata.penyetujuNip}</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
