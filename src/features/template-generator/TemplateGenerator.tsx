import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Arraignment from "./arraignment/Arraignment";
import NewArraignment from "./new-arraignment/NewArraignment";
import TemplatePicker from "./TemplatePicker";
import PleaDeal from "./plea-deal/PleaDeal";
import Expungement from "./expungement/Expungement";
import NolleProsequi from "./nolle-prosequi/NolleProsequi";
import Motion from "./motion/Motion";
import Appearance from "./appearance/Appearance";
import Appeal from "./appeal/Appeal";

const TEMPLATE_LABELS: Record<string, string> = {
  arraignment: "Arraignment",
  "new-arraignment": "Criminal Complaint",
  "plea-deal": "Plea Agreement",
  expungement: "Expungement",
  "nolle-prosequi": "Motion to Dismiss",
  motion: "Generic Motion",
  appearance: "Notice of Appearance",
  appeal: "Appeal Brief",
};

const VALID_TEMPLATES = Object.keys(TEMPLATE_LABELS);

function TemplateGenerator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramTemplate = searchParams.get("template") ?? "";

  const [activeTemplate, setActiveTemplate] = useState<string>(
    () => (VALID_TEMPLATES.includes(paramTemplate) ? paramTemplate : "none")
  );

  const selectTemplate = (id: string) => {
    setActiveTemplate(id);
    if (id === "none") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ template: id }, { replace: true });
    }
  };

  const renderContent = () => {
    switch (activeTemplate) {
      case "arraignment":       return <Arraignment />;
      case "new-arraignment":   return <NewArraignment />;
      case "plea-deal":         return <PleaDeal />;
      case "expungement":     return <Expungement />;
      case "nolle-prosequi":  return <NolleProsequi />;
      case "motion":          return <Motion />;
      case "appearance":      return <Appearance />;
      case "appeal":          return <Appeal />;
      default:                return <TemplatePicker onSelectTemplate={selectTemplate} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {activeTemplate !== "none" && (
        <div className="sticky top-14 z-40 border-b border-navy-800/60 bg-navy-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-11 max-w-5xl items-center gap-3 px-5">
            <button
              onClick={() => selectTemplate("none")}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Templates
            </button>
            <span className="text-navy-700">/</span>
            <span className="text-xs font-medium text-slate-300">
              {TEMPLATE_LABELS[activeTemplate]}
            </span>
          </div>
        </div>
      )}
      <div className="animate-fade-in">{renderContent()}</div>
    </div>
  );
}

export default TemplateGenerator;
