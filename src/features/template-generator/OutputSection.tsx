import { useState } from "react";

interface OutputSectionProps {
  renderedTemplate: string;
  copiedKey: string | null;
  onCopy: (type: "richtext" | "source") => void;
  onPrint: () => void;
}

export default function OutputSection({ renderedTemplate, copiedKey, onCopy, onPrint }: OutputSectionProps) {
  const [tab, setTab] = useState<"source" | "preview">("preview");

  return (
    <div className="tpl-section tpl-section--output">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span className="tpl-section-title" style={{ marginBottom: 0 }}>Generated Template</span>
        <div className="tpl-tab-bar">
          <button className={`tpl-tab${tab === "preview" ? " active" : ""}`} onClick={() => setTab("preview")}>
            Preview
          </button>
          <button className={`tpl-tab${tab === "source" ? " active" : ""}`} onClick={() => setTab("source")}>
            Source
          </button>
        </div>
      </div>

      {tab === "source" ? (
        <textarea className="tpl-output" value={renderedTemplate} readOnly />
      ) : (
        <div
          className="tpl-output-preview"
          dangerouslySetInnerHTML={{ __html: renderedTemplate || "<p style='color:#aaa;font-family:sans-serif;text-align:center;margin-top:3rem'>Fill in the form above to see a preview</p>" }}
        />
      )}

      <div className="tpl-copy-row">
        <button
          className={`tpl-btn-copy${copiedKey === "richtext" ? " copied" : ""}`}
          onClick={() => onCopy("richtext")}
        >
          {copiedKey === "richtext" ? "✓ Copied!" : "Copy Rich Text"}
        </button>
        <button
          className={`tpl-btn-copy${copiedKey === "source" ? " copied" : ""}`}
          onClick={() => onCopy("source")}
        >
          {copiedKey === "source" ? "✓ Copied!" : "Copy Source HTML"}
        </button>
        <button className="tpl-btn-print" onClick={onPrint}>
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
