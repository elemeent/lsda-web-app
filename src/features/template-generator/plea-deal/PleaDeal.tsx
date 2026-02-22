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
      prosecutor: {
        ...data.prosecutor,
        name: data.prosecutor.name.toUpperCase(),
      },
      defendant: {
        ...data.defendant,
        name: data.defendant.name.toUpperCase(),
      },
      defenseAttorney: {
        ...data.defenseAttorney,
        name: data.defenseAttorney.name.toUpperCase(),
      },
    }),
    onDataChange: (data) => {
      localStorage.setItem("prosecutorName", data.prosecutor.name);
      localStorage.setItem("prosecutorStateBar", data.prosecutor.stateBar);
      localStorage.setItem("prosecutorRank", data.prosecutor.rank);
    },
  });

  // Semantic wrapper functions for clarity
  const addGuiltyCharge = () => {
    setFormData((prev) => ({
      ...prev,
      guiltyCharges: [...prev.guiltyCharges, ""],
    }));
  };

  const addDismissedCharge = () => {
    setFormData((prev) => ({
      ...prev,
      dismissedCharges: [...prev.dismissedCharges, ""],
    }));
  };

  const addSentencingRecommendation = () => {
    setFormData((prev) => ({
      ...prev,
      sentencingRecommendations: [...prev.sentencingRecommendations, ""],
    }));
  };

  const removeGuiltyCharge = (index: number) => {
    removeItem("guiltyCharges", index);
  };

  const removeDismissedCharge = (index: number) => {
    removeItem("dismissedCharges", index);
  };

  const removeSentencingRecommendation = (index: number) => {
    removeItem("sentencingRecommendations", index);
  };

  return (
    <div className="main-template-page-container">
      <div className="form-section">
        <span className="form-section-title">
          Defendant{formData.hasCounsel && ", Defense Attorney"} & Prosecutor
          Information
        </span>

        <div className="form-group">
          <label>Defendant Name:</label>
          <input
            type="text"
            name="defendant.name"
            value={formData.defendant.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="hasCounsel"
              checked={formData.hasCounsel}
              onChange={handleChange}
            />
            Defendant has counsel
          </label>
        </div>

        {formData.hasCounsel && (
          <div className="form-group">
            <label>Defense Attorney Name:</label>
            <input
              type="text"
              name="defenseAttorney.name"
              value={formData.defenseAttorney.name}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="form-group">
          <label>Prosecutor Name:</label>
          <input
            type="text"
            name="prosecutor.name"
            value={formData.prosecutor.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Prosecutor State Bar:</label>
          <input
            type="text"
            name="prosecutor.stateBar"
            value={formData.prosecutor.stateBar}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Prosecutor Rank:</label>
          <select
            name="prosecutor.rank"
            value={formData.prosecutor.rank}
            onChange={handleChange}
          >
            <option value="">Select Rank</option>
            <option value="Deputy District Attorney">
              Deputy District Attorney
            </option>
            <option value="Assistant District Attorney">
              Assistant District Attorney
            </option>
            <option value="Chief District Attorney">
              Chief District Attorney
            </option>
            <option value="District Attorney">District Attorney</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <span className="form-section-title">Guilty Charges</span>
        {formData.guiltyCharges.map((_, index) => (
          <div key={index} className="form-group">
            <div className="form-group-with-button">
              <div>
                <label>Guilty Charge #{index + 1}:</label>
                <input
                  type="text"
                  name={`guiltyCharges[${index}]`}
                  value={formData.guiltyCharges[index]}
                  onChange={handleChange}
                  placeholder="Enter charge description"
                />
              </div>
              {formData.guiltyCharges.length > 1 && (
                <button
                  className="remove-button"
                  onClick={() => removeGuiltyCharge(index)}
                  title="Remove this charge"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addGuiltyCharge}>+ Add Guilty Charge</button>
      </div>

      <div className="form-section">
        <span className="form-section-title">Dismissed Charges</span>
        {formData.dismissedCharges.map((_, index) => (
          <div key={index} className="form-group">
            <div className="form-group-with-button">
              <div>
                <label>Dismissed Charge #{index + 1}:</label>
                <input
                  type="text"
                  name={`dismissedCharges[${index}]`}
                  value={formData.dismissedCharges[index]}
                  onChange={handleChange}
                  placeholder="Enter charge description"
                />
              </div>
              {formData.dismissedCharges.length > 0 && (
                <button
                  className="remove-button"
                  onClick={() => removeDismissedCharge(index)}
                  title="Remove this charge"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addDismissedCharge}>+ Add Dismissed Charge</button>
      </div>

      <div className="form-section">
        <span className="form-section-title">Sentencing Recommendations</span>
        {formData.sentencingRecommendations.map((_, index) => (
          <div key={index} className="form-group">
            <div className="form-group-with-button">
              <div>
                <label>Sentencing Recommendation #{index + 1}:</label>
                <input
                  type="text"
                  name={`sentencingRecommendations[${index}]`}
                  value={formData.sentencingRecommendations[index]}
                  onChange={handleChange}
                  placeholder="Enter sentencing recommendation"
                />
              </div>
              {formData.sentencingRecommendations.length > 1 && (
                <button
                  className="remove-button"
                  onClick={() => removeSentencingRecommendation(index)}
                  title="Remove this recommendation"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addSentencingRecommendation}>
          + Add Sentencing Recommendation
        </button>
      </div>

      <div className="form-section">
        <span className="form-section-title">Generated Template</span>
        <textarea
          className="template-output"
          value={renderedTemplate}
          readOnly
        />
        <div className="copy-buttons-container">
          <button
            className="copy-button"
            onClick={handleCopyClick.bind(null, "richtext")}
          >
            {isCopied ? "✓ Copied!" : "📋 Copy Rich Text"}
          </button>
          <button
            className="copy-button"
            onClick={handleCopyClick.bind(null, "source")}
          >
            {isCopied ? "✓ Copied!" : "📋 Copy Source HTML"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PleaDeal;
