import pleaDealTemplate from "../templates/plea-deal.hbs?raw";
import { useTemplateForm } from "../useTemplateForm";
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

function PleaDeal() {
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
    isCopied,
    handleChange,
    removeItem,
    handleCopyClick,
  } = useTemplateForm({
    initialData,
    template: pleaDealTemplate,
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

  const addGuiltyCharge = () => setFormData((prev) => ({ ...prev, guiltyCharges: [...prev.guiltyCharges, ""] }));
  const addDismissedCharge = () => setFormData((prev) => ({ ...prev, dismissedCharges: [...prev.dismissedCharges, ""] }));
  const addSentencingRecommendation = () => setFormData((prev) => ({ ...prev, sentencingRecommendations: [...prev.sentencingRecommendations, ""] }));

  const removeGuiltyCharge = (index: number) => removeItem("guiltyCharges", index);
  const removeDismissedCharge = (index: number) => removeItem("dismissedCharges", index);
  const removeSentencingRecommendation = (index: number) => removeItem("sentencingRecommendations", index);

  return (
    <div className="tpl-page">

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
            <label className="tpl-label">Defense Attorney Name</label>
            <input className="tpl-input" type="text" name="defenseAttorney.name" value={formData.defenseAttorney.name} onChange={handleChange} />
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

export default PleaDeal;
