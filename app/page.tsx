import ReportBuilder from "@/components/report-builder";
import SecurityWrapper from "@/components/security-wrapper";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SecurityWrapper>
        <ReportBuilder />
      </SecurityWrapper>
    </main>
  );
}
