import ReportBuilder from "@/components/report-builder";
import SecurityWrapper from "@/components/security-wrapper";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-neutral-100">
      
      {/* Mobile Warning Overlay */}
      <div className="md:hidden fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xl text-white p-8 text-center">
        <div className="bg-rose-500/20 p-4 rounded-full mb-6 border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight text-white">Layar Terlalu Kecil</h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
          Aplikasi <strong>LaporPro</strong> memiliki tata letak dokumen kompleks yang tidak cocok untuk *Handphone*. 
          <br/><br/>
          Silakan buka tautan ini melalui <strong>PC, Laptop, atau Tablet (iPad)</strong> untuk mulai menggunakan editor.
        </p>
      </div>

      {/* Main Content (Blurred on Mobile) */}
      <div className="w-full blur-xl pointer-events-none select-none h-screen overflow-hidden md:blur-none md:pointer-events-auto md:select-auto md:h-auto md:overflow-visible transition-all">
        <SecurityWrapper>
          <ReportBuilder />
        </SecurityWrapper>
      </div>
      
    </main>
  );
}
