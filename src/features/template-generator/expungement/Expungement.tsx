import expungementTemplate from "../templates/expungement.hbs?raw";
import { useTemplateForm } from "../useTemplateForm";
import "./Expungement.css";

interface ExpungementFormData {
  defendant: { name: string };
  prosecutor: { name: string; stateBar: string; rank: string };
  counts: string[];
  fillingDate: {
    day: string;
    month: string;
    year: string;
  };
  fillingNumber: string;
  motion: string;
}

function Expungement() {
  const today = new Date();
  const initialDay = String(today.getDate()).padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
    fillingDate: {
      day: initialDay,
      month: initialMonth,
      year: initialYear,
    },
    fillingNumber: "",
    motion: "",
  };

  const {
    formData,
    setFormData,
    renderedTemplate,
    isCopied,
    handleChange,
    handleNumericInput,
    removeItem,
    handleCopyClick,
  } = useTemplateForm({
    initialData,
    template: expungementTemplate,
    transformData: (data) => ({
      ...data,
      prosecutor: {
        ...data.prosecutor,
        name: data.prosecutor.name.toUpperCase(),
      },
    }),
    onDataChange: (data) => {
      localStorage.setItem("prosecutorName", data.prosecutor.name);
      localStorage.setItem("prosecutorStateBar", data.prosecutor.stateBar);
      localStorage.setItem("prosecutorRank", data.prosecutor.rank);
    },
  });

  // Semantic wrapper functions for clarity
  const addCount = () => {
    setFormData((prev) => ({
      ...prev,
      counts: [...prev.counts, ""],
    }));
  };

  const removeCount = (index: number) => {
    removeItem("counts", index);
  };

  return (
    <div className="main-template-page-container">
      <div className="form-section">
        <span className="form-section-title">
          Defendant & Prosecutor Information
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
        <span className="form-section-title">Counts</span>
        {formData.counts.map((_, index) => (
          <div key={index} className="form-group">
            <div className="form-group-with-button">
              <div>
                <label>Count {index + 1}:</label>
                <input
                  type="text"
                  name={`counts[${index}]`}
                  value={formData.counts[index]}
                  onChange={handleChange}
                  placeholder="Enter crime description"
                />
              </div>
              {formData.counts.length > 1 && (
                <button
                  className="remove-button"
                  onClick={() => removeCount(index)}
                  title="Remove this crime"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addCount}>+ Add Count</button>
      </div>

      <div className="form-section">
        <span className="form-section-title">
          Motion (Reason for Expungement)
        </span>
        <textarea
          className="medium-text-area"
          name="motion"
          value={formData.motion}
          onChange={handleChange}
          placeholder="Enter the motion text here"
        />
      </div>

      <div className="form-section">
        <span className="form-section-title">Filing Date and Number</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          <div className="form-group">
            <label>Month:</label>
            <select
              name="fillingDate.month"
              value={formData.fillingDate.month}
              onChange={handleChange}
            >
              <option value="">Select Month</option>
              {monthNames.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Day:</label>
            <input
              type="text"
              name="fillingDate.day"
              value={formData.fillingDate.day}
              onChange={(e) => handleNumericInput(e, "fillingDate.day", 31, 1)}
              placeholder="DD"
              maxLength={2}
            />
          </div>
          <div className="form-group">
            <label>Year:</label>
            <input
              type="text"
              name="fillingDate.year"
              value={formData.fillingDate.year}
              onChange={(e) =>
                handleNumericInput(e, "fillingDate.year", 2200, 1)
              }
              placeholder="YYYY"
              maxLength={4}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Filling Number:</label>
          <input
            type="text"
            name="fillingNumber"
            value={formData.fillingNumber}
            onChange={(e) => handleNumericInput(e, "fillingNumber", 99999, 1)}
          />
        </div>
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

export default Expungement;
