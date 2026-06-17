import expungementTemplate from "../templates/expungement.hbs?raw";
import { useTemplateForm } from "../useTemplateForm";
import { useAttorney } from "../../../context/AttorneyContext";
import OutputSection from "../OutputSection";
import "./Expungement.css";

interface ExpungementFormData {
  defendant: { name: string };
  prosecutor: { name: string; stateBar: string; rank: string };
  counts: string[];
  fillingDate: { day: string; month: string; year: string };
  fillingNumber: string;
  motion: string;
}

function formatDraftTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Expungement() {
  const { profiles } = useAttorney();
  const today = new Date();
  const initialDay = String(today.getDate()).padStart(2, "0");
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const initialMonth = monthNames[today.getMonth()];
  const initialYear = String(today.getFullYear());

  const initialData: ExpungementFormData = {
    defendant: { name: "" },
    prosecutor: {
      name: localStorage.getItem("prosecutorName") || "",
      stateBar: localStorage.getItem("prosecutorStateBar") || "",
      rank: localStorage.getItem("prosecutorRank") || "",
    },
    counts: [""],
    fillingDate: { day: initialDay, month: initialMonth, year: initialYear },
    fillingNumber: "",
    motion: "",
  };

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
    removeItem,
    handleCopyClick,
  } = useTemplateForm({
    initialData,
    template: expungementTemplate,
    draftKey: "draft_expungement",
    transformData: (data) => ({
      ...data,
      prosecutor: { ...data.prosecutor, name: data.prosecutor.name.toUpperCase() },
    }),
    onDataChange: (data) => {
      localStorage.setItem("prosecutorName", data.prosecutor.name);
      localStorage.setItem("prosecutorStateBar", data.prosecutor.stateBar);
      localStorage.setItem("prosecutorRank", data.prosecutor.rank);
    },
  });

  const fillFromCharacter = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setFormData((prev) => ({
      ...prev,
      prosecutor: { ...prev.prosecutor, name: p.name, stateBar: p.stateBar, rank: p.role },
    }));
  };

  const addCount = () => setFormData((prev) => ({ ...prev, counts: [...prev.counts, ""] }));
  const removeCount = (index: number) => removeItem("counts", index);

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

      <div className="tpl-section">
        <span className="tpl-section-title">Defendant &amp; Prosecutor Information</span>

        <div className="tpl-group">
          <label className="tpl-label">Defendant Name</label>
          <input className="tpl-input" type="text" name="defendant.name" value={formData.defendant.name} onChange={handleChange} />
        </div>

        {profiles.length > 0 && (
          <div className="tpl-fill-row">
            <span className="tpl-fill-label">Fill prosecutor from character →</span>
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
          <label className="tpl-label">Prosecutor Name</label>
          <input className="tpl-input" type="text" name="prosecutor.name" value={formData.prosecutor.name} onChange={handleChange} />
        </div>
        <div className="tpl-group">
          <label className="tpl-label">Prosecutor State Bar</label>
          <input className="tpl-input" type="text" name="prosecutor.stateBar" value={formData.prosecutor.stateBar} onChange={handleChange} />
        </div>
        <div className="tpl-group">
          <label className="tpl-label">Prosecutor Rank</label>
          <select className="tpl-select" name="prosecutor.rank" value={formData.prosecutor.rank} onChange={handleChange}>
            <option value="">Select Rank</option>
            <option value="Deputy District Attorney">Deputy District Attorney</option>
            <option value="Assistant District Attorney">Assistant District Attorney</option>
            <option value="Chief District Attorney">Chief District Attorney</option>
            <option value="District Attorney">District Attorney</option>
          </select>
        </div>
      </div>

      <div className="tpl-section">
        <span className="tpl-section-title">Counts</span>
        {formData.counts.map((_, index) => (
          <div key={index} className="tpl-group">
            <div className="tpl-row">
              <div className="tpl-group">
                <label className="tpl-label">Count {index + 1}</label>
                <input className="tpl-input" type="text" name={`counts[${index}]`} value={formData.counts[index]} onChange={handleChange} placeholder="Enter crime description" />
              </div>
              {formData.counts.length > 1 && (
                <button className="tpl-btn-remove" onClick={() => removeCount(index)} title="Remove">−</button>
              )}
            </div>
          </div>
        ))}
        <button className="tpl-btn-add" onClick={addCount}>+ Add Count</button>
      </div>

      <div className="tpl-section">
        <span className="tpl-section-title">Motion (Reason for Expungement)</span>
        <textarea
          className="tpl-medium-area"
          name="motion"
          value={formData.motion}
          onChange={handleChange}
          placeholder="Enter the motion text here"
        />
      </div>

      <div className="tpl-section">
        <span className="tpl-section-title">Filing Date and Number</span>
        <div className="tpl-grid-3">
          <div className="tpl-group">
            <label className="tpl-label">Month</label>
            <select className="tpl-select" name="fillingDate.month" value={formData.fillingDate.month} onChange={handleChange}>
              <option value="">Select Month</option>
              {monthNames.map((month) => (<option key={month} value={month}>{month}</option>))}
            </select>
          </div>
          <div className="tpl-group">
            <label className="tpl-label">Day</label>
            <input className="tpl-input" type="text" name="fillingDate.day" value={formData.fillingDate.day} onChange={(e) => handleNumericInput(e, "fillingDate.day", 31, 1)} placeholder="DD" maxLength={2} />
          </div>
          <div className="tpl-group">
            <label className="tpl-label">Year</label>
            <input className="tpl-input" type="text" name="fillingDate.year" value={formData.fillingDate.year} onChange={(e) => handleNumericInput(e, "fillingDate.year", 2200, 1)} placeholder="YYYY" maxLength={4} />
          </div>
        </div>
        <div className="tpl-group">
          <label className="tpl-label">Filing Number</label>
          <input className="tpl-input" type="text" name="fillingNumber" value={formData.fillingNumber} onChange={(e) => handleNumericInput(e, "fillingNumber", 99999, 1)} />
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

export default Expungement;
