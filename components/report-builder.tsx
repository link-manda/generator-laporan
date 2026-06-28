"use client";

import { useState } from "react";
import { SEEDED_REPORT, ReportState, ReportItem } from "@/lib/report";
import ReportEditor from "./report-editor";
import ReportPreview from "./report-preview";
import { Button } from "./ui/button";

export default function ReportBuilder() {
  const [report, setReport] = useState<ReportState>(SEEDED_REPORT);

  const updateMetadata = (key: keyof ReportState["metadata"], value: string) => {
    setReport((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value },
    }));
  };

  const updateIntro = (value: string) => {
    setReport((prev) => ({ ...prev, intro: value }));
  };

  const addSectionItem = (sectionKey: string, item: ReportItem) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.key === sectionKey ? { ...sec, items: [...sec.items, item] } : sec
      ),
    }));
  };

  const updateSectionTitle = (sectionKey: string, newTitle: string) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.key === sectionKey ? { ...sec, title: newTitle } : sec
      ),
    }));
  };

  const updateSectionDescription = (sectionKey: string, newDescription: string) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.key === sectionKey ? { ...sec, description: newDescription } : sec
      ),
    }));
  };

  const updateSectionItem = (sectionKey: string, itemId: string, newText: string) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.key === sectionKey
          ? {
              ...sec,
              items: sec.items.map((it) => (it.id === itemId ? { ...it, text: newText } : it)),
            }
          : sec
      ),
    }));
  };
  
  const updateSectionItemImage = (sectionKey: string, itemId: string, imageUrl: string | undefined) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.key === sectionKey
          ? {
              ...sec,
              items: sec.items.map((it) => {
                if (it.id === itemId) {
                  // Revoke old image URL if changing/removing to prevent memory leak
                  if (it.image && it.image !== imageUrl) {
                    URL.revokeObjectURL(it.image);
                  }
                  return { ...it, image: imageUrl };
                }
                return it;
              }),
            }
          : sec
      ),
    }));
  };

  const updateSectionItemImageSize = (sectionKey: string, itemId: string, width?: string, height?: string) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.key === sectionKey
          ? {
              ...sec,
              items: sec.items.map((it) => {
                if (it.id === itemId) {
                  return { ...it, imageWidth: width, imageHeight: height };
                }
                return it;
              }),
            }
          : sec
      ),
    }));
  };

  const removeSectionItem = (sectionKey: string, itemId: string) => {
    setReport((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.key === sectionKey) {
          // Cleanup image URLs for removed item
          const removedItem = sec.items.find((it) => it.id === itemId);
          if (removedItem?.image) {
            URL.revokeObjectURL(removedItem.image);
          }
          return { ...sec, items: sec.items.filter((it) => it.id !== itemId) };
        }
        return sec;
      }),
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden bg-neutral-100 print:h-auto print:block print:overflow-visible">
      <div className="lg:w-1/3 h-1/2 lg:h-full border-r bg-white p-6 overflow-y-auto no-print">
        <ReportEditor 
          report={report} 
          updateMetadata={updateMetadata} 
          updateIntro={updateIntro}
          updateSectionTitle={updateSectionTitle}
          updateSectionDescription={updateSectionDescription}
          addSectionItem={addSectionItem}
          updateSectionItem={updateSectionItem}
          updateSectionItemImage={updateSectionItemImage}
          updateSectionItemImageSize={updateSectionItemImageSize}
          removeSectionItem={removeSectionItem}
        />
      </div>
      <div className="lg:w-2/3 h-1/2 lg:h-full p-4 lg:p-8 overflow-y-auto bg-neutral-200 print:w-full print:bg-white print:p-0 print:overflow-visible relative">
        <div className="sticky top-0 z-10 flex justify-end mb-4 no-print pointer-events-none">
          <Button onClick={() => window.print()} variant="default" className="flex gap-2 items-center pointer-events-auto shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download / Cetak PDF
          </Button>
        </div>
        <ReportPreview report={report} />
      </div>
    </div>
  );
}
