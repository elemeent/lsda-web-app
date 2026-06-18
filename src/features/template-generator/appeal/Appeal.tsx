import appealTemplate from "../templates/appeal.hbs?raw";
import { useTemplateForm } from "../useTemplateForm";
import { useAttorney } from "../../../context/AttorneyContext";
import OutputSection from "../OutputSection";

interface AppealFormData {
  caseNumber: string;
  caseName: string;
  appellants: { name: string }[];
  appellantRole: string;
  respondents: { name: string }[];
  respondentRole: string;
  appealType: string;
  trialCourt: string;
  trialJudge: string;
  briefType: string;
  filingDate: { day: string; month: string; year: string };
  sections: { title: string; body: string }[];
  conclusion: string;
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

interface AppealTemplateData extends AppealFormData {
  appellantDisplay: string;
  respondentDisplay: string;
  conclusionRoman: string;
}

function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDraftTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Appeal() {
  const { profiles } = useAttorney();
  const today = new Date();
  const initialDay = String(today.getDate()).padStart(2, "0");
  const initialMonth = monthNames[today.getMonth()];
  const initialYear = String(today.getFullYear());

  const savedAppellants = (() => {
    try {
      const raw = localStorage.getItem("appealAppellants");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch { return null; }
  })();

  const savedRespondents = (() => {
    try {
      const raw = localStorage.getItem("appealRespondents");
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch { return null; }
  })();

  const initialData: AppealFormData = {
    caseNumber: localStorage.getItem("appealCaseNumber") || "",
    caseName: localStorage.getItem("appealCaseName") || "",
    appellants: savedAppellants ?? [{ name: "" }],
    appellantRole: localStorage.getItem("appealAppellantRole") || "Defendant-Appellant",
    respondents: savedRespondents ?? [{ name: "" }],
    respondentRole: localStorage.getItem("appealRespondentRole") || "Plaintiff-Respondent",
    appealType: localStorage.getItem("appealType") || "Appeal from an Order",
    trialCourt: localStorage.getItem("appealTrialCourt") || "The Superior Court, County of Los Santos",
    trialJudge: localStorage.getItem("appealTrialJudge") || "",
    briefType: localStorage.getItem("appealBriefType") || "APPELLANT'S OPENING BRIEF",
    filingDate: { day: initialDay, month: initialMonth, year: initialYear },
    sections: [{ title: "", body: "" }],
    conclusion: "",
    undersigned: {
      name: localStorage.getItem("appealAttorneyName") || "",
      stateBar: localStorage.getItem("appealAttorneyStateBar") || "",
      showFirm: localStorage.getItem("appealAttorneyShowFirm") !== "false",
      firm: localStorage.getItem("appealAttorneyFirm") || "",
      showAddress: localStorage.getItem("appealAttorneyShowAddress") === "true",
      address: localStorage.getItem("appealAttorneyAddress") || "",
      role: localStorage.getItem("appealAttorneyRole") || "",
    },
  };

  const transformData = (data: AppealFormData): AppealTemplateData => ({
    ...data,
    appellantDisplay: data.appellants
      .map((a) => a.name.trim())
      .filter(Boolean)
      .join(" AND "),
    respondentDisplay: data.respondents
      .map((r) => r.name.trim())
      .filter(Boolean)
      .join(" AND "),
    conclusionRoman: toRoman(data.sections.length + 1),
  });

  const {
    formData,
    setFormData,
    renderedTemplate,
    copiedKey,
    draftBanner,
    restoreDraft,
    dismissDraft,
    handleChange,
    handleNumericInput,
    addItem,
    removeItem,
    handleCopyClick,
  } = useTemplateForm<AppealFormData, AppealTemplateData>({
    initialData,
    template: appealTemplate,
    transformData,
    draftKey: "draft_appeal",
    onDataChange: (data) => {
      localStorage.setItem("appealCaseNumber", data.caseNumber);
      localStorage.setItem("appealCaseName", data.caseName);
      localStorage.setItem("appealAppellants", JSON.stringify(data.appellants));
      localStorage.setItem("appealAppellantRole", data.appellantRole);
      localStorage.setItem("appealRespondents", JSON.stringify(data.respondents));
      localStorage.setItem("appealRespondentRole", data.respondentRole);
      localStorage.setItem("appealType", data.appealType);
      localStorage.setItem("appealTrialCourt", data.trialCourt);
      localStorage.setItem("appealTrialJudge", data.trialJudge);
      localStorage.setItem("appealBriefType", data.briefType);
      localStorage.setItem("appealAttorneyName", data.undersigned.name);
      localStorage.setItem("appealAttorneyStateBar", data.undersigned.stateBar);
      localStorage.setItem("appealAttorneyShowFirm", String(data.undersigned.showFirm));
      localStorage.setItem("appealAttorneyFirm", data.undersigned.firm);
      localStorage.setItem("appealAttorneyShowAddress", String(data.undersigned.showAddress));
      localStorage.setItem("appealAttorneyAddress", data.undersigned.address);
      localStorage.setItem("appealAttorneyRole", data.undersigned.role);
    },
  });

  const fillFromCharacter = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setFormData((prev) => ({
      ...prev,
      undersigned: {
        ...prev.undersigned,
        name: p.name,
        stateBar: p.stateBar,
        showFirm: p.showFirm,
        firm: p.firm,
        showAddress: p.showAddress,
        address: p.address,
        role: p.role,
      },
    }));
  };

  const addAppellant = () => addItem("appellants", { name: "" });
  const removeAppellant = (i: number) => removeItem("appellants", i);
  const addRespondent = () => addItem("respondents", { name: "" });
  const removeRespondent = (i: number) => removeItem("respondents", i);

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

      {draftBanner && (
        <div className="tpl-draft-banner">
          <span>Unsaved draft from {formatDraftTime(draftBanner.savedAt)} — restore?</span>
          <div className="tpl-draft-banner-actions">
            <button className="tpl-draft-btn-restore" onClick={restoreDraft}>Restore</button>
            <button className="tpl-draft-btn-dismiss" onClick={dismissDraft}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Case Info */}
      <div className="tpl-section">
        <span className="tpl-section-title">Case Information</span>

        <div className="tpl-group">
          <label className="tpl-label">Case Number</label>
          <input
            className="tpl-input"
            type="text"
            name="caseNumber"
            value={formData.caseNumber}
            onChange={(e) => handleNumericInput(e, "caseNumber", 99999, 1)}
            placeholder="e.g. 4"
            maxLength={5}
          />
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Case Short Name</label>
          <input
            className="tpl-input"
            type="text"
            name="caseName"
            value={formData.caseName}
            onChange={handleChange}
            placeholder="e.g. Hayes v. Slattery"
          />
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Brief Type</label>
          <select
            className="tpl-select"
            name="briefType"
            value={formData.briefType}
            onChange={handleChange}
          >
            <option value="APPELLANT'S OPENING BRIEF">Appellant's Opening Brief</option>
            <option value="RESPONDENT'S BRIEF">Respondent's Brief</option>
            <option value="APPELLANT'S REPLY BRIEF">Appellant's Reply Brief</option>
            <option value="AMICUS CURIAE BRIEF">Amicus Curiae Brief</option>
          </select>
        </div>
      </div>

      {/* Parties */}
      <div className="tpl-section">
        <span className="tpl-section-title">Parties</span>

        <div className="tpl-group">
          <label className="tpl-label">Appellant(s)</label>
          {formData.appellants.map((_, i) => (
            <div key={i} className="tpl-row" style={{ marginBottom: "0.5rem" }}>
              <div className="tpl-group">
                <input
                  className="tpl-input"
                  type="text"
                  name={`appellants[${i}].name`}
                  value={formData.appellants[i].name}
                  onChange={handleChange}
                  placeholder={`Appellant ${i + 1} full name`}
                />
              </div>
              {formData.appellants.length > 1 && (
                <button className="tpl-btn-remove" onClick={() => removeAppellant(i)} title="Remove">−</button>
              )}
            </div>
          ))}
          <button className="tpl-btn-add" onClick={addAppellant}>+ Add Appellant</button>
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Appellant Role</label>
          <input
            className="tpl-input"
            type="text"
            name="appellantRole"
            value={formData.appellantRole}
            onChange={handleChange}
            placeholder="e.g. Defendant-Appellant"
          />
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Respondent(s)</label>
          {formData.respondents.map((_, i) => (
            <div key={i} className="tpl-row" style={{ marginBottom: "0.5rem" }}>
              <div className="tpl-group">
                <input
                  className="tpl-input"
                  type="text"
                  name={`respondents[${i}].name`}
                  value={formData.respondents[i].name}
                  onChange={handleChange}
                  placeholder={`Respondent ${i + 1} full name`}
                />
              </div>
              {formData.respondents.length > 1 && (
                <button className="tpl-btn-remove" onClick={() => removeRespondent(i)} title="Remove">−</button>
              )}
            </div>
          ))}
          <button className="tpl-btn-add" onClick={addRespondent}>+ Add Respondent</button>
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Respondent Role</label>
          <input
            className="tpl-input"
            type="text"
            name="respondentRole"
            value={formData.respondentRole}
            onChange={handleChange}
            placeholder="e.g. Plaintiff-Respondent"
          />
        </div>
      </div>

      {/* Trial Court */}
      <div className="tpl-section">
        <span className="tpl-section-title">Trial Court</span>

        <div className="tpl-group">
          <label className="tpl-label">Appeal Type</label>
          <input
            className="tpl-input"
            type="text"
            name="appealType"
            value={formData.appealType}
            onChange={handleChange}
            placeholder="e.g. Appeal from an Order"
          />
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Trial Court</label>
          <input
            className="tpl-input"
            type="text"
            name="trialCourt"
            value={formData.trialCourt}
            onChange={handleChange}
            placeholder="e.g. The Superior Court, County of Los Santos"
          />
        </div>

        <div className="tpl-group">
          <label className="tpl-label">Trial Judge</label>
          <input
            className="tpl-input"
            type="text"
            name="trialJudge"
            value={formData.trialJudge}
            onChange={handleChange}
            placeholder="e.g. Jay Teller"
          />
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
                  placeholder="Section title (e.g. I. INTRODUCTION)"
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

      {/* Conclusion */}
      <div className="tpl-section">
        <span className="tpl-section-title">Conclusion</span>
        <div className="tpl-group">
          <label className="tpl-label">Conclusion Paragraph</label>
          <textarea
            className="tpl-medium-area"
            name="conclusion"
            value={formData.conclusion}
            onChange={handleChange}
            placeholder="e.g. For the foregoing reasons, Appellant respectfully requests that this Court reverse the order below and remand with instructions to enter judgment in their favor."
          />
        </div>
      </div>

      {/* Undersigned */}
      <div className="tpl-section">
        <span className="tpl-section-title">Undersigned Attorney</span>

        {profiles.length > 0 && (
          <div className="tpl-fill-row">
            <span className="tpl-fill-label">Fill from character →</span>
            <select
              className="tpl-fill-select"
              value=""
              onChange={(e) => fillFromCharacter(e.target.value)}
            >
              <option value="" disabled>— select character —</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        )}

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
          <input className="tpl-input" type="text" name="undersigned.role" value={formData.undersigned.role} onChange={handleChange} placeholder="e.g. Counsel for Appellant Marlon Hayes" />
        </div>
      </div>

      <OutputSection
        renderedTemplate={renderedTemplate}
        copiedKey={copiedKey}
        onCopy={handleCopyClick}
        onPrint={() => window.print()}
      />

    </div>
  );
}

export default Appeal;
