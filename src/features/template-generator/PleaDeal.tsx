import { useEffect, useState } from "react";
import { renderTemplate } from "../../utils/TemplateEngine";
import pleaDealTemplate from "./templates/plea-deal.hbs?raw";
import set from "lodash/set";
import "./PleaDeal.css";

function PleaDeal() {
  const [isCopied, setIsCopied] = useState(false);
  const [renderedTemplate, setRenderedTemplate] = useState("");

  const [formData, setFormData] = useState<{
    defendant: { name: string };
    prosecutor: { name: string; stateBar: string; rank: string };
    defenseAttorney: { name: string };
    guiltyCharges: string[];
    dismissedCharges: string[];
    sentencingRecommendations: string[];
    hasCounsel: boolean;
  }>({
    defendant: {
      name: "",
    },
    prosecutor: {
      name: localStorage.getItem("prosecutorName") || "",
      stateBar: localStorage.getItem("prosecutorStateBar") || "",
      rank: localStorage.getItem("prosecutorRank") || "",
    },
    defenseAttorney: {
      name: "",
    },
    guiltyCharges: [""],
    dismissedCharges: [],
    sentencingRecommendations: [""],
    hasCounsel: true,
  });

  useEffect(() => {
    const render = async () => {
      const computedData = {
        ...formData,
        prosecutor: {
          ...formData.prosecutor,
          name: formData.prosecutor.name.toUpperCase(),
        },
        defendant: {
          ...formData.defendant,
          name: formData.defendant.name.toUpperCase(),
        },
        defenseAttorney: {
          ...formData.defenseAttorney,
          name: formData.defenseAttorney.name.toUpperCase(),
        },
      };

      const output = await renderTemplate(pleaDealTemplate, computedData);

      setRenderedTemplate(output);
    };

    render();

    localStorage.setItem("prosecutorName", formData.prosecutor.name);
    localStorage.setItem("prosecutorStateBar", formData.prosecutor.stateBar);
    localStorage.setItem("prosecutorRank", formData.prosecutor.rank);
  }, [formData]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    const updated = { ...formData };

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      set(updated, name, e.target.checked);
    } else {
      set(updated, name, value);
    }

    setFormData(updated);
  };

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
    setFormData((prev) => ({
      ...prev,
      guiltyCharges: prev.guiltyCharges.filter((_, i) => i !== index),
    }));
  };

  const removeDismissedCharge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dismissedCharges: prev.dismissedCharges.filter((_, i) => i !== index),
    }));
  };

  const removeSentencingRecommendation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sentencingRecommendations: prev.sentencingRecommendations.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleCopyClick = (type: string) => {
    const textToCopy = renderedTemplate;

    const showCopiedMessage = () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    const copyPromise =
      type === "richtext"
        ? navigator.clipboard.write([
            new ClipboardItem({
              "text/html": new Blob([textToCopy], { type: "text/html" }),
            }),
          ])
        : navigator.clipboard.writeText(textToCopy);

    copyPromise.then(showCopiedMessage).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
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
        <textarea value={renderedTemplate} readOnly />
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
