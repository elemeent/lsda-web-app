import pleaDealTemplate from "../templates/plea-deal.hbs?raw";
import { useTemplateForm } from "../useTemplateForm";
import { useAttorney } from "../../../context/AttorneyContext";
import OutputSection from "../OutputSection";
import "./PleaDeal.css";

interface PleaDealFormData {
  defendant: { name: string };
  prosecutor: { name: string; stateBar: string; rank: string };
  defenseAttorney: { name: string };
  guiltyCharges: string[];
  dismissedCharges: string[];
  sentencingRecommendations: string[];
  hasCounsel: boolean;
}

function formatDraftTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function PleaDeal() {
  const { profiles } = useAttorney();

  const initialData: PleaDealFormData = {
    defendant: { name: "" },
    prosecutor: {
      name: localStorage.getItem("prosecutorName") || "",
      stateBar: localStorage.getItem("prosecutorStateBar") || "",
      rank: localStorage.getItem("prosecutorRank") || "",
    },
    defenseAttorney: { name: "" },
    guiltyCharges: [""],
    dismissedCharges: [],
    sentencingRecommendations: [""],
    hasCounsel: true,
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
    removeItem,
    handleCopyClick,
  } = useTemplateForm({
    initialData,
    template: pleaDealTemplate,
    draftKey: "draft_plea_deal",
    transformData: (data) => ({
      ...data,
      prosecutor: { ...data.prosecutor, name: data.prosecutor.name.toUpperCase() },
      defendant: { ...data.defendant, name: data.defendant.name.toUpperCase() },
      defenseAttorney: { ...data.defenseAttorney, name: data.defenseAttorney.name.toUpperCase() },
    }),
    onDataChange: (data) => {
      localStorage.setItem("prosecutorName", data.prosecutor.name);
      localStorage.setItem("prosecutorStateBar", data.prosecutor.stateBar);
      localStorage.setItem("prosecutorRank", data.prosecutor.rank);
    },
  });

  const fillProsecutorFromCharacter = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setFormData((prev) => ({
      ...prev,
      prosecutor: { ...prev.prosecutor, name: p.name, stateBar: p.stateBar, rank: p.role },
    }));
  };

  const fillDefenseFromCharacter = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setFormData((prev) => ({
      ...prev,
      defenseAttorney: { name: p.name },
    }));
  };

  const addGuiltyCharge = () => setFormData((prev) => ({ ...prev, guiltyCharges: [...prev.guiltyCharges, ""] }));
  const addDismissedCharge = () => setFormData((prev) => ({ ...prev, dismissedCharges: [...prev.dismissedCharges, ""] }));
  const addSentencingRecommendation = () => setFormData((prev) => ({ ...prev, sentencingRecommendations: [...prev.sentencingRecommendations, ""] }));

  const removeGuiltyCharge = (index: number) => removeItem("guiltyCharges", index);
  const removeDismissedCharge = (index: number) => removeItem("dismissedCharges", index);
  const removeSentencingRecommendation = (index: number) => removeItem("sentencingRecommendations", index);

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
        <span className="tpl-section-title">
          Defendant{formData.hasCounsel && ", Defense Attorney"} &amp; Prosecutor Information
        </span>

        <div className="tpl-group">
          <label className="tpl-label">Defendant Name</label>
          <input className="tpl-input" type="text" name="defendant.name" value={formData.defendant.name} onChange={handleChange} />
        </div>

        <div className="tpl-group">
          <label className="tpl-check">
            <input type="checkbox" name="hasCounsel" checked={formData.hasCounsel} onChange={handleChange} />
            Defendant has counsel
          </label>
        </div>

        {formData.hasCounsel && (
          <div className="tpl-group">
            {profiles.length > 0 && (
              <div className="tpl-fill-row" style={{ marginBottom: "0.5rem" }}>
                <span className="tpl-fill-label">Fill defense from character →</span>
                <select
                  className="tpl-fill-select"
                  value=""
                  onChange={(e) => fillDefenseFromCharacter(e.target.value)}
                >
                  <option value="" disabled>— select character —</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}
            <label className="tpl-label">Defense Attorney Name</label>
            <input className="tpl-input" type="text" name="defenseAttorney.name" value={formData.defenseAttorney.name} onChange={handleChange} />
          </div>
        )}

        {profiles.length > 0 && (
          <div className="tpl-fill-row">
            <span className="tpl-fill-label">Fill prosecutor from character →</span>
            <select
              className="tpl-fill-select"
              value=""
              onChange={(e) => fillProsecutorFromCharacter(e.target.value)}
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
        <span className="tpl-section-title">Guilty Charges</span>
        {formData.guiltyCharges.map((_, index) => (
          <div key={index} className="tpl-group">
            <div className="tpl-row">
              <div className="tpl-group">
                <label className="tpl-label">Guilty Charge #{index + 1}</label>
                <input className="tpl-input" type="text" name={`guiltyCharges[${index}]`} value={formData.guiltyCharges[index]} onChange={handleChange} placeholder="Enter charge description" />
              </div>
              {formData.guiltyCharges.length > 1 && (
                <button className="tpl-btn-remove" onClick={() => removeGuiltyCharge(index)} title="Remove">−</button>
              )}
            </div>
          </div>
        ))}
        <button className="tpl-btn-add" onClick={addGuiltyCharge}>+ Add Guilty Charge</button>
      </div>

      <div className="tpl-section">
        <span className="tpl-section-title">Dismissed Charges</span>
        {formData.dismissedCharges.map((_, index) => (
          <div key={index} className="tpl-group">
            <div className="tpl-row">
              <div className="tpl-group">
                <label className="tpl-label">Dismissed Charge #{index + 1}</label>
                <input className="tpl-input" type="text" name={`dismissedCharges[${index}]`} value={formData.dismissedCharges[index]} onChange={handleChange} placeholder="Enter charge description" />
              </div>
              {formData.dismissedCharges.length > 0 && (
                <button className="tpl-btn-remove" onClick={() => removeDismissedCharge(index)} title="Remove">−</button>
              )}
            </div>
          </div>
        ))}
        <button className="tpl-btn-add" onClick={addDismissedCharge}>+ Add Dismissed Charge</button>
      </div>

      <div className="tpl-section">
        <span className="tpl-section-title">Sentencing Recommendations</span>
        {formData.sentencingRecommendations.map((_, index) => (
          <div key={index} className="tpl-group">
            <div className="tpl-row">
              <div className="tpl-group">
                <label className="tpl-label">Sentencing Recommendation #{index + 1}</label>
                <input className="tpl-input" type="text" name={`sentencingRecommendations[${index}]`} value={formData.sentencingRecommendations[index]} onChange={handleChange} placeholder="Enter sentencing recommendation" />
              </div>
              {formData.sentencingRecommendations.length > 1 && (
                <button className="tpl-btn-remove" onClick={() => removeSentencingRecommendation(index)} title="Remove">−</button>
              )}
            </div>
          </div>
        ))}
        <button className="tpl-btn-add" onClick={addSentencingRecommendation}>+ Add Sentencing Recommendation</button>
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

export default PleaDeal;
