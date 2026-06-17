import { useState } from "react";
import daoMotionTemplate from "../templates/dao-motion.hbs?raw";
import ogMotionTemplate from "../templates/og-motion.hbs?raw";
import { useTemplateForm } from "../useTemplateForm";
import "./Motion.css";

interface MotionFormData {
  caseType: "criminal" | "civil";
  caseNumber: string;
  plaintiff: string;
  defendants: { name: string }[];
  motionTitle: string;
  filingDate: { day: string; month: string; year: string };
  opening: string;
  sections: { title: string; body: string }[];
  undersigned: {
    name: string;
    stateBar: string;
    showFirm: boolean;
    firm: string;
    showAddress: boolean;
    address: string;
    role: string;
  };
}

interface MotionTemplateData extends MotionFormData {
  isCriminal: boolean;
  divisionLabel: string;
  plaintiffDisplay: string;
  defendantLabel: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function Motion() {
  const today = new Date();
  const initialDay = String(today.getDate()).padStart(2, "0");
  const initialMonth = monthNames[today.getMonth()];
  const initialYear = String(today.getFullYear());

  const [motionStyle, setMotionStyle] = useState<"dao" | "classic">(
    (localStorage.getItem("motionStyle") as "dao" | "classic") || "dao",
  );

  const template = motionStyle === "dao" ? daoMotionTemplate : ogMotionTemplate;

  const savedDefendants = (() => {
    try {
      const raw = localStorage.getItem("motionDefendants");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch {
      return null;
    }
  })();

  const initialData: MotionFormData = {
    caseType: (localStorage.getItem("motionCaseType") as "criminal" | "civil") || "criminal",
    caseNumber: localStorage.getItem("motionCaseNumber") || "",
    plaintiff: localStorage.getItem("motionPlaintiff") || "",
    defendants: savedDefendants ?? [{ name: "" }],
    motionTitle: "",
    filingDate: { day: initialDay, month: initialMonth, year: initialYear },
    opening: "",
    sections: [{ title: "", body: "" }],
    undersigned: {
      name: localStorage.getItem("motionAttorneyName") || "",
      stateBar: localStorage.getItem("motionAttorneyStateBar") || "",
      showFirm: localStorage.getItem("motionAttorneyShowFirm") !== "false",
      firm: localStorage.getItem("motionAttorneyFirm") || "",
      showAddress: localStorage.getItem("motionAttorneyShowAddress") === "true",
      address: localStorage.getItem("motionAttorneyAddress") || "",
      role: localStorage.getItem("motionAttorneyRole") || "",
    },
  };

  const transformData = (data: MotionFormData): MotionTemplateData => {
    const activeDefendants = data.defendants.filter((d) => d.name.trim());
    return {
      ...data,
      isCriminal: data.caseType === "criminal",
      divisionLabel: data.caseType === "criminal" ? "CRIMINAL DIVISION" : "CIVIL DIVISION",
      plaintiffDisplay:
        data.caseType === "criminal"
          ? "People of the State of San Andreas"
          : data.plaintiff,
      defendantLabel: activeDefendants.length > 1 ? "Defendants" : "Defendant",
    };
  };

  const {
    formData,
    setFormData,
    renderedTemplate,
    isCopied,
    handleChange,
    handleNumericInput,
    addItem,
    removeItem,
    handleCopyClick,
  } = useTemplateForm<MotionFormData, MotionTemplateData>({
    initialData,
    template,
    transformData,
    onDataChange: (data) => {
      localStorage.setItem("motionCaseType", data.caseType);
      localStorage.setItem("motionCaseNumber", data.caseNumber);
      localStorage.setItem("motionPlaintiff", data.plaintiff);
      localStorage.setItem("motionDefendants", JSON.stringify(data.defendants));
      localStorage.setItem("motionAttorneyName", data.undersigned.name);
      localStorage.setItem("motionAttorneyStateBar", data.undersigned.stateBar);
      localStorage.setItem("motionAttorneyShowFirm", String(data.undersigned.showFirm));
      localStorage.setItem("motionAttorneyFirm", data.undersigned.firm);
      localStorage.setItem("motionAttorneyShowAddress", String(data.undersigned.showAddress));
      localStorage.setItem("motionAttorneyAddress", data.undersigned.address);
      localStorage.setItem("motionAttorneyRole", data.undersigned.role);
    },
  });

  const addDefendant = () => addItem("defendants", { name: "" });
  const removeDefendant = (i: number) => removeItem("defendants", i);

  const addSection = () => addItem("sections", { title: "", body: "" });
  const removeSection = (i: number) => removeItem("sections", i);
  const moveSection = (from: number, to: number) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const [moved] = sections.splice(from, 1);
      sections.splice(to, 0, moved);
      return { ...prev, sections };
    });
  };

  return (
    <div className="tpl-page">

      {/* Case Info */}
      <div className="tpl-section">
        <span className="tpl-section-title">Case Information</span>

        <div className="tpl-group">
          <label className="tpl-label">Motion Style</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label className="tpl-check">
              <input type="radio" checked={motionStyle === "dao"} onChange={() => { setMotionStyle("dao"); localStorage.setItem("motionStyle", "dao"); }} />
              DAO
            </label>
            <label className="tpl-check">
              <input type="radio" checked={motionStyle === "classic"} onChange={() => { setMotionStyle("classic"); localStorage.setItem("motionStyle", "classic"); }} />
              Classic
            </label>
          </div>
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Case Type</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label className="tpl-check">
              <input type="radio" name="caseType" value="criminal" checked={formData.caseType === "criminal"} onChange={handleChange} />
              Criminal
            </label>
            <label className="tpl-check">
              <input type="radio" name="caseType" value="civil" checked={formData.caseType === "civil"} onChange={handleChange} />
              Civil
            </label>
          </div>
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Case Number</label>
          <input
            className="tpl-input"
            type="text"
            name="caseNumber"
            value={formData.caseNumber}
            onChange={(e) => handleNumericInput(e, "caseNumber", 99999, 1)}
            placeholder="e.g. 458"
            maxLength={5}
          />
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Motion Title</label>
          <input
            className="tpl-input"
            type="text"
            name="motionTitle"
            value={formData.motionTitle}
            onChange={handleChange}
            placeholder="e.g. MOTION TO DISMISS"
          />
        </div>
      </div>

      {/* Parties */}
      <div className="tpl-section">
        <span className="tpl-section-title">Parties</span>

        {formData.caseType === "civil" && (
          <div className="tpl-group">
            <label className="tpl-label">Plaintiff</label>
            <input className="tpl-input" type="text" name="plaintiff" value={formData.plaintiff} onChange={handleChange} placeholder="Enter plaintiff name" />
          </div>
        )}

        <div className="tpl-group">
          <label className="tpl-label">Defendant(s)</label>
          {formData.defendants.map((_, i) => (
            <div key={i} className="tpl-row" style={{ marginBottom: "0.5rem" }}>
              <div className="tpl-group">
                <input
                  className="tpl-input"
                  type="text"
                  name={`defendants[${i}].name`}
                  value={formData.defendants[i].name}
                  onChange={handleChange}
                  placeholder={`Defendant ${i + 1} full name`}
                />
              </div>
              {formData.defendants.length > 1 && (
                <button className="tpl-btn-remove" onClick={() => removeDefendant(i)} title="Remove">−</button>
              )}
            </div>
          ))}
          <button className="tpl-btn-add" onClick={addDefendant}>+ Add Defendant</button>
        </div>
      </div>

      {/* Filing Date */}
      <div className="tpl-section">
        <span className="tpl-section-title">Filing Date</span>
        <div className="tpl-grid-3">
          <div className="tpl-group">
            <label className="tpl-label">Month</label>
            <select className="tpl-select" name="filingDate.month" value={formData.filingDate.month} onChange={handleChange}>
              <option value="">Select Month</option>
              {monthNames.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="tpl-group">
            <label className="tpl-label">Day</label>
            <input className="tpl-input" type="text" name="filingDate.day" value={formData.filingDate.day} onChange={(e) => handleNumericInput(e, "filingDate.day", 31, 1)} placeholder="DD" maxLength={2} />
          </div>
          <div className="tpl-group">
            <label className="tpl-label">Year</label>
            <input className="tpl-input" type="text" name="filingDate.year" value={formData.filingDate.year} onChange={(e) => handleNumericInput(e, "filingDate.year", 2200, 1)} placeholder="YYYY" maxLength={4} />
          </div>
        </div>
      </div>

      {/* Opening */}
      <div className="tpl-section">
        <span className="tpl-section-title">Opening</span>
        <div className="tpl-group">
          <label className="tpl-label">Opening Paragraph</label>
          <textarea
            className="tpl-medium-area"
            name="opening"
            value={formData.opening}
            onChange={handleChange}
            placeholder="Brief opening statement that appears below the case caption…"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="tpl-section">
        <span className="tpl-section-title">Sections</span>
        {formData.sections.map((section, i) => (
          <div key={i} className="tpl-option-group">
            <div className="tpl-row" style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <button className="tpl-btn-reorder" onClick={() => moveSection(i, i - 1)} disabled={i === 0} title="Move up">↑</button>
                <button className="tpl-btn-reorder" onClick={() => moveSection(i, i + 1)} disabled={i === formData.sections.length - 1} title="Move down">↓</button>
              </div>
              <span className="tpl-index">{i + 1}</span>
              <div className="tpl-group" style={{ flex: 1, marginBottom: 0 }}>
                <input
                  className="tpl-input"
                  type="text"
                  name={`sections[${i}].title`}
                  value={section.title}
                  onChange={handleChange}
                  placeholder="Section title (e.g. FACTUAL BACKGROUND)"
                />
              </div>
              {formData.sections.length > 1 && (
                <button className="tpl-btn-remove" onClick={() => removeSection(i)} title="Remove">−</button>
              )}
            </div>
            <textarea
              className="tpl-medium-area"
              name={`sections[${i}].body`}
              value={section.body}
              onChange={handleChange}
              placeholder="Section body…"
            />
          </div>
        ))}
        <button className="tpl-btn-add" onClick={addSection}>+ Add Section</button>
      </div>

      {/* Undersigned */}
      <div className="tpl-section">
        <span className="tpl-section-title">Undersigned Attorney</span>

        <div className="tpl-group">
          <label className="tpl-label">Full Name</label>
          <input className="tpl-input" type="text" name="undersigned.name" value={formData.undersigned.name} onChange={handleChange} placeholder="e.g. RODRIGO VERAS" />
        </div>
        <div className="tpl-group">
          <label className="tpl-label">State Bar No.</label>
          <input className="tpl-input" type="text" name="undersigned.stateBar" value={formData.undersigned.stateBar} onChange={handleChange} placeholder="e.g. 129049" />
        </div>
        <div className="tpl-group">
          <label className="tpl-check" style={{ marginBottom: formData.undersigned.showFirm ? "0.75rem" : 0 }}>
            <input type="checkbox" name="undersigned.showFirm" checked={formData.undersigned.showFirm} onChange={handleChange} />
            Include firm / office
          </label>
          {formData.undersigned.showFirm && (
            <>
              <input className="tpl-input" type="text" name="undersigned.firm" value={formData.undersigned.firm} onChange={handleChange} placeholder="e.g. Veras Legal Group" style={{ marginBottom: "0.5rem" }} />
              <label className="tpl-check" style={{ marginBottom: formData.undersigned.showAddress ? "0.75rem" : 0 }}>
                <input type="checkbox" name="undersigned.showAddress" checked={formData.undersigned.showAddress} onChange={handleChange} />
                Include address
              </label>
              {formData.undersigned.showAddress && (
                <input className="tpl-input" type="text" name="undersigned.address" value={formData.undersigned.address} onChange={handleChange} placeholder="e.g. 1 Pershing Square, Los Santos, SA" />
              )}
            </>
          )}
        </div>
        <div className="tpl-group">
          <label className="tpl-label">Role / Capacity</label>
          <input className="tpl-input" type="text" name="undersigned.role" value={formData.undersigned.role} onChange={handleChange} placeholder="e.g. Counsel for Defendant Andre Lewis" />
        </div>
      </div>

      {/* Output */}
      <div className="tpl-section">
        <span className="tpl-section-title">Generated Template</span>
        <textarea className="tpl-output" value={renderedTemplate} readOnly />
        <div className="tpl-copy-row">
          <button className={`tpl-btn-copy${isCopied ? " copied" : ""}`} onClick={handleCopyClick.bind(null, "richtext")}>
            {isCopied ? "✓ Copied!" : "Copy Rich Text"}
          </button>
          <button className={`tpl-btn-copy${isCopied ? " copied" : ""}`} onClick={handleCopyClick.bind(null, "source")}>
            {isCopied ? "✓ Copied!" : "Copy Source HTML"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default Motion;
