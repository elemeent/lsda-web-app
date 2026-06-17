import appearanceTemplate from "../templates/appearance.hbs?raw";
import { useTemplateForm } from "../useTemplateForm";
import "./Appearance.css";

interface AppearanceFormData {
  caseType: "criminal" | "civil";
  caseNumber: string;
  plaintiff: string;
  defendants: { name: string }[];
  filingDate: { day: string; month: string; year: string };
  attorney: {
    name: string;
    showFirm: boolean;
    firm: string;
    address: string;
  };
  client: {
    name: string;
    honorific: string;
    title: string;
  };
}

interface AppearanceTemplateData extends AppearanceFormData {
  isCriminal: boolean;
  divisionLabel: string;
  defendantLabel: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function Appearance() {
  const today = new Date();
  const initialDay = String(today.getDate()).padStart(2, "0");
  const initialMonth = monthNames[today.getMonth()];
  const initialYear = String(today.getFullYear());

  const savedDefendants = (() => {
    try {
      const raw = localStorage.getItem("appearanceDefendants");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch {
      return null;
    }
  })();

  const initialData: AppearanceFormData = {
    caseType: (localStorage.getItem("appearanceCaseType") as "criminal" | "civil") || "civil",
    caseNumber: localStorage.getItem("appearanceCaseNumber") || "",
    plaintiff: localStorage.getItem("appearancePlaintiff") || "",
    defendants: savedDefendants ?? [{ name: "" }],
    filingDate: { day: initialDay, month: initialMonth, year: initialYear },
    attorney: {
      name: localStorage.getItem("appearanceAttorneyName") || "",
      showFirm: localStorage.getItem("appearanceAttorneyShowFirm") !== "false",
      firm: localStorage.getItem("appearanceAttorneyFirm") || "",
      address: localStorage.getItem("appearanceAttorneyAddress") || "",
    },
    client: {
      name: "",
      honorific: "Ms.",
      title: "the defendant",
    },
  };

  const transformData = (data: AppearanceFormData): AppearanceTemplateData => {
    const activeDefendants = data.defendants.filter((d) => d.name.trim());
    return {
      ...data,
      isCriminal: data.caseType === "criminal",
      divisionLabel: data.caseType === "criminal" ? "CRIMINAL DIVISION" : "CIVIL DIVISION",
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
  } = useTemplateForm<AppearanceFormData, AppearanceTemplateData>({
    initialData,
    template: appearanceTemplate,
    transformData,
    onDataChange: (data) => {
      localStorage.setItem("appearanceCaseType", data.caseType);
      localStorage.setItem("appearanceCaseNumber", data.caseNumber);
      localStorage.setItem("appearancePlaintiff", data.plaintiff);
      localStorage.setItem("appearanceDefendants", JSON.stringify(data.defendants));
      localStorage.setItem("appearanceAttorneyName", data.attorney.name);
      localStorage.setItem("appearanceAttorneyShowFirm", String(data.attorney.showFirm));
      localStorage.setItem("appearanceAttorneyFirm", data.attorney.firm);
      localStorage.setItem("appearanceAttorneyAddress", data.attorney.address);
    },
  });

  const addDefendant = () => addItem("defendants", { name: "" });
  const removeDefendant = (i: number) => removeItem("defendants", i);

  return (
    <div className="tpl-page">

      {/* Case Info */}
      <div className="tpl-section">
        <span className="tpl-section-title">Case Information</span>

        <div className="tpl-group">
          <label className="tpl-label">Case Type</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label className="tpl-check">
              <input type="radio" name="caseType" value="civil" checked={formData.caseType === "civil"} onChange={handleChange} />
              Civil
            </label>
            <label className="tpl-check">
              <input type="radio" name="caseType" value="criminal" checked={formData.caseType === "criminal"} onChange={handleChange} />
              Criminal
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
            placeholder="e.g. 135"
            maxLength={5}
          />
        </div>
      </div>

      {/* Parties */}
      <div className="tpl-section">
        <span className="tpl-section-title">Parties</span>

        <div className="tpl-group">
          <label className="tpl-label">Plaintiff</label>
          <input className="tpl-input" type="text" name="plaintiff" value={formData.plaintiff} onChange={handleChange} placeholder="Enter plaintiff name" />
        </div>

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

      {/* Client */}
      <div className="tpl-section">
        <span className="tpl-section-title">Client Being Represented</span>

        <div className="tpl-group">
          <label className="tpl-label">Full Name</label>
          <input className="tpl-input" type="text" name="client.name" value={formData.client.name} onChange={handleChange} placeholder="e.g. Anastasia Vallarino" />
        </div>
        <div className="tpl-grid-3" style={{ gridTemplateColumns: "1fr 2fr" }}>
          <div className="tpl-group">
            <label className="tpl-label">Honorific</label>
            <select className="tpl-select" name="client.honorific" value={formData.client.honorific} onChange={handleChange}>
              <option value="">None</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mx.">Mx.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>
          <div className="tpl-group">
            <label className="tpl-label">Role in Case</label>
            <select className="tpl-select" name="client.title" value={formData.client.title} onChange={handleChange}>
              <option value="the defendant">the defendant</option>
              <option value="the plaintiff">the plaintiff</option>
              <option value="the respondent">the respondent</option>
              <option value="the petitioner">the petitioner</option>
              <option value="the accused">the accused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attorney */}
      <div className="tpl-section">
        <span className="tpl-section-title">Appearing Attorney</span>

        <div className="tpl-group">
          <label className="tpl-label">Full Name</label>
          <input className="tpl-input" type="text" name="attorney.name" value={formData.attorney.name} onChange={handleChange} placeholder="e.g. Rodrigo Veras" />
        </div>

        <div className="tpl-group">
          <label className="tpl-check" style={{ marginBottom: formData.attorney.showFirm ? "0.75rem" : 0 }}>
            <input type="checkbox" name="attorney.showFirm" checked={formData.attorney.showFirm} onChange={handleChange} />
            Include firm / office
          </label>
          {formData.attorney.showFirm && (
            <input className="tpl-input" type="text" name="attorney.firm" value={formData.attorney.firm} onChange={handleChange} placeholder="e.g. Rodrigo Veras Legal Group" />
          )}
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Address</label>
          <input className="tpl-input" type="text" name="attorney.address" value={formData.attorney.address} onChange={handleChange} placeholder="e.g. Badger Tower Office Complex, Floor 6, Room 1" />
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

export default Appearance;
