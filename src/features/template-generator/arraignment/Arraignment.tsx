import { useState } from "react";
import { useTemplateForm } from "../useTemplateForm";
import arraignmentTemplate from "../templates/arraignment.hbs?raw";
import "./Arraignment.css";

interface ArraignmentFormData {
  defendant: { name: string };
  prosecutor: { name: string; stateBar: string; rank: string };
  counts: { crime: string }[];
  exhibits: { number: string; title: string }[];
  sentencing: {
    option: string;
    maxStatutoryObservation: string;
    otherObservation: string;
  };
  bail: {
    option: string;
    upholdStationhouseValue: string;
    imposeValue: string;
    abstainAlcohol: boolean;
    appearCourt: boolean;
    abstainCriminalActivity: boolean;
    wearAnkleMonitor: boolean;
    surrenderFirearms: boolean;
    possessCellPhone: boolean;
    refrainContact: boolean;
    refrainGang: boolean;
    imposeOther: boolean;
    imposeOtherObservation: string;
    felonyViolence: boolean;
    maxSentence: boolean;
    historyViolatingBail: boolean;
    threatenWitness: boolean;
    noBailConditions: boolean;
    orderDetentionOther: boolean;
    orderDetentionOtherObservation: string;
  };
  fillingDate: {
    day: string;
    month: string;
    year: string;
  };
}

function Arraignment() {
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

  const [exhibitPattern, setExhibitPattern] = useState<"numbers" | "letters">(
    "numbers",
  );

  const initialData: ArraignmentFormData = {
    defendant: { name: "" },
    prosecutor: {
      name: localStorage.getItem("prosecutorName") || "",
      stateBar: localStorage.getItem("prosecutorStateBar") || "",
      rank: localStorage.getItem("prosecutorRank") || "",
    },
    counts: [{ crime: "" }],
    exhibits: [{ number: "", title: "" }],
    sentencing: {
      option: "",
      maxStatutoryObservation: "",
      otherObservation: "",
    },
    bail: {
      option: "",
      upholdStationhouseValue: "",
      imposeValue: "",
      abstainAlcohol: false,
      appearCourt: false,
      abstainCriminalActivity: false,
      wearAnkleMonitor: false,
      surrenderFirearms: false,
      possessCellPhone: false,
      refrainContact: false,
      refrainGang: false,
      imposeOther: false,
      imposeOtherObservation: "",
      felonyViolence: false,
      maxSentence: false,
      historyViolatingBail: false,
      threatenWitness: false,
      noBailConditions: false,
      orderDetentionOther: false,
      orderDetentionOtherObservation: "",
    },
    fillingDate: {
      day: initialDay,
      month: initialMonth,
      year: initialYear,
    },
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
    template: arraignmentTemplate,
    transformData: (data) => {
      const computedData = {
        ...data,
        exhibits: data.exhibits.map((exhibit, index) => ({
          ...exhibit,
          number:
            exhibitPattern === "letters"
              ? String.fromCharCode(65 + index)
              : String(index + 1),
        })),
        prosecutor: {
          ...data.prosecutor,
          name: data.prosecutor.name.toUpperCase(),
        },
        sentencing: {
          capitalPunishment: data.sentencing.option === "capitalPunishment",
          lifeWithoutParole: data.sentencing.option === "lifeWithoutParole",
          lifeWithParole: data.sentencing.option === "lifeWithParole",
          maxStatutory:
            data.sentencing.option === "maxStatutory"
              ? data.sentencing.maxStatutoryObservation || " "
              : false,
          timeServed: data.sentencing.option === "timeServed",
          other:
            data.sentencing.option === "other"
              ? data.sentencing.otherObservation || " "
              : false,
        },
        bail: {
          upholdStationhouse: {
            selected: data.bail.option === "upholdStationhouse",
            value:
              data.bail.option === "upholdStationhouse"
                ? data.bail.upholdStationhouseValue || "AMOUNT"
                : false,
          },
          imposeBail: {
            selected: data.bail.option === "imposeBail",
            value:
              data.bail.option === "imposeBail"
                ? data.bail.imposeValue || "AMOUNT"
                : false,
            abstainAlcohol:
              data.bail.option === "imposeBail"
                ? data.bail.abstainAlcohol
                : false,
            appearCourt:
              data.bail.option === "imposeBail" ? data.bail.appearCourt : false,
            abstainCriminalActivity:
              data.bail.option === "imposeBail"
                ? data.bail.abstainCriminalActivity
                : false,
            wearAnkleMonitor:
              data.bail.option === "imposeBail"
                ? data.bail.wearAnkleMonitor
                : false,
            surrenderFirearms:
              data.bail.option === "imposeBail"
                ? data.bail.surrenderFirearms
                : false,
            possessCellPhone:
              data.bail.option === "imposeBail"
                ? data.bail.possessCellPhone
                : false,
            refrainContact:
              data.bail.option === "imposeBail"
                ? data.bail.refrainContact
                : false,
            refrainGang:
              data.bail.option === "imposeBail" ? data.bail.refrainGang : false,
            other:
              data.bail.imposeOther && data.bail.option === "imposeBail"
                ? data.bail.imposeOtherObservation || " "
                : false,
          },
          orderDetention: {
            selected: data.bail.option === "orderDetention",
            felonyViolence:
              data.bail.option === "orderDetention"
                ? data.bail.felonyViolence
                : false,
            maxSentence:
              data.bail.option === "orderDetention"
                ? data.bail.maxSentence
                : false,
            historyViolatingBail:
              data.bail.option === "orderDetention"
                ? data.bail.historyViolatingBail
                : false,
            threatenWitness:
              data.bail.option === "orderDetention"
                ? data.bail.threatenWitness
                : false,
            noBailConditions:
              data.bail.option === "orderDetention"
                ? data.bail.noBailConditions
                : false,
            other:
              data.bail.orderDetentionOther &&
              data.bail.option === "orderDetention"
                ? data.bail.orderDetentionOtherObservation || " "
                : false,
          },
        },
      };

      return computedData;
    },
    onDataChange: (data) => {
      localStorage.setItem("prosecutorName", data.prosecutor.name);
      localStorage.setItem("prosecutorStateBar", data.prosecutor.stateBar);
      localStorage.setItem("prosecutorRank", data.prosecutor.rank);
    },
  });

  const handleExhibitPatternChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setExhibitPattern(e.target.value as "numbers" | "letters");
  };

  const addCrime = () => {
    setFormData((prev) => ({
      ...prev,
      counts: [...prev.counts, { crime: "" }],
    }));
  };

  const addExhibit = () => {
    setFormData((prev) => ({
      ...prev,
      exhibits: [...prev.exhibits, { number: "", title: "" }],
    }));
  };

  const removeCrime = (index: number) => {
    removeItem("counts", index);
  };

  const removeExhibit = (index: number) => {
    removeItem("exhibits", index);
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
                <label>Count {index + 1} - Crime:</label>
                <input
                  type="text"
                  name={`counts[${index}].crime`}
                  value={formData.counts[index].crime}
                  onChange={handleChange}
                  placeholder="Enter crime description"
                />
              </div>
              {formData.counts.length > 1 && (
                <button
                  className="remove-button"
                  onClick={() => removeCrime(index)}
                  title="Remove this crime"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addCrime}>+ Add Crime</button>
      </div>

      <div className="form-section">
        <span className="form-section-title">Exhibits</span>
        {formData.exhibits.map((_, index) => (
          <div key={index} className="form-group">
            <div className="form-group-with-button">
              <div>
                <label>Exhibit {index + 1} - Title:</label>
                <input
                  type="text"
                  name={`exhibits[${index}].title`}
                  value={formData.exhibits[index].title}
                  onChange={handleChange}
                  placeholder="Enter exhibit title"
                />
              </div>
              {formData.exhibits.length > 1 && (
                <button
                  className="remove-button"
                  onClick={() => removeExhibit(index)}
                  title="Remove this exhibit"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addExhibit}>+ Add Exhibit</button>

        <div className="option-group" style={{ marginTop: "1.5rem" }}>
          <span className="option-group-title">Exhibit Numbering Pattern</span>
          <label className="radio-label">
            <input
              type="radio"
              name="exhibitPattern"
              value="numbers"
              checked={exhibitPattern === "numbers"}
              onChange={handleExhibitPatternChange}
            />
            Numbers (1, 2, 3...)
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="exhibitPattern"
              value="letters"
              checked={exhibitPattern === "letters"}
              onChange={handleExhibitPatternChange}
            />
            Letters (A, B, C...)
          </label>
        </div>
      </div>

      <div className="form-section">
        <span className="form-section-title">Sentencing Options</span>

        <div className="option-group">
          <label className="radio-label">
            <input
              type="radio"
              name="sentencing.option"
              value="capitalPunishment"
              checked={formData.sentencing.option === "capitalPunishment"}
              onChange={handleChange}
            />
            Capital Punishment
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="sentencing.option"
              value="lifeWithoutParole"
              checked={formData.sentencing.option === "lifeWithoutParole"}
              onChange={handleChange}
            />
            Life Without Parole
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="sentencing.option"
              value="lifeWithParole"
              checked={formData.sentencing.option === "lifeWithParole"}
              onChange={handleChange}
            />
            Life With Parole
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="sentencing.option"
              value="maxStatutory"
              checked={formData.sentencing.option === "maxStatutory"}
              onChange={handleChange}
            />
            Max Statutory
          </label>

          {formData.sentencing.option === "maxStatutory" && (
            <div className="option-input form-group">
              <label>Observation:</label>
              <input
                type="text"
                name="sentencing.maxStatutoryObservation"
                value={formData.sentencing.maxStatutoryObservation}
                onChange={handleChange}
                placeholder="Enter observation"
              />
            </div>
          )}

          <label className="radio-label">
            <input
              type="radio"
              name="sentencing.option"
              value="timeServed"
              checked={formData.sentencing.option === "timeServed"}
              onChange={handleChange}
            />
            Time Served
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="sentencing.option"
              value="other"
              checked={formData.sentencing.option === "other"}
              onChange={handleChange}
            />
            Other
          </label>

          {formData.sentencing.option === "other" && (
            <div className="option-input form-group">
              <label>Observation:</label>
              <input
                type="text"
                name="sentencing.otherObservation"
                value={formData.sentencing.otherObservation}
                onChange={handleChange}
                placeholder="Enter observation"
              />
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <span className="form-section-title">Bail Recommendations</span>

        <div className="option-group">
          <label className="radio-label">
            <input
              type="radio"
              name="bail.option"
              value="upholdStationhouse"
              checked={formData.bail.option === "upholdStationhouse"}
              onChange={handleChange}
            />
            Uphold Stationhouse Bail
          </label>

          {formData.bail.option === "upholdStationhouse" && (
            <div className="option-input form-group">
              <input
                type="text"
                name="bail.upholdStationhouseValue"
                value={formData.bail.upholdStationhouseValue}
                onChange={handleChange}
                placeholder="Enter bail amount"
              />
            </div>
          )}
        </div>

        <div className="option-group">
          <label className="radio-label">
            <input
              type="radio"
              name="bail.option"
              value="imposeBail"
              checked={formData.bail.option === "imposeBail"}
              onChange={handleChange}
            />
            Impose Bail
          </label>

          {formData.bail.option === "imposeBail" && (
            <>
              <div className="option-input form-group">
                <label>Bail Amount:</label>
                <input
                  type="text"
                  name="bail.imposeValue"
                  value={formData.bail.imposeValue}
                  onChange={handleChange}
                  placeholder="Enter bail amount"
                />
              </div>

              <div style={{ marginLeft: "1.75rem", marginTop: "1rem" }}>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    color: "#374151",
                  }}
                >
                  Conditions:
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.abstainAlcohol"
                    checked={formData.bail.abstainAlcohol}
                    onChange={handleChange}
                  />
                  Abstain from excessive use of alcohol and any use of a
                  controlled substance without a prescription.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.appearCourt"
                    checked={formData.bail.appearCourt}
                    onChange={handleChange}
                  />
                  Appear before the court on each date the case is assigned to
                  call.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.abstainCriminalActivity"
                    checked={formData.bail.abstainCriminalActivity}
                    onChange={handleChange}
                  />
                  Abstain from criminal activity while subject to the bail
                  order.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.wearAnkleMonitor"
                    checked={formData.bail.wearAnkleMonitor}
                    onChange={handleChange}
                  />
                  Wear an ankle monitor at all times.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.surrenderFirearms"
                    checked={formData.bail.surrenderFirearms}
                    onChange={handleChange}
                  />
                  Surrender any illegal or legally owned firearms to the
                  respective agency.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.possessCellPhone"
                    checked={formData.bail.possessCellPhone}
                    onChange={handleChange}
                  />
                  Possess and keep on at all times an active cell phone with its
                  number registered to Defendant.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.refrainContact"
                    checked={formData.bail.refrainContact}
                    onChange={handleChange}
                  />
                  Refrain from contact with any victim/witness relating to this
                  arrest.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.refrainGang"
                    checked={formData.bail.refrainGang}
                    onChange={handleChange}
                  />
                  Refrain from associating with known gang members or violent
                  felons.
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="bail.imposeOther"
                    checked={formData.bail.imposeOther}
                    onChange={handleChange}
                  />
                  Other
                </label>

                {formData.bail.imposeOther === true && (
                  <div
                    className="form-group"
                    style={{ marginLeft: "1.75rem", marginTop: "0.75rem" }}
                  >
                    <input
                      type="text"
                      name="bail.imposeOtherObservation"
                      value={formData.bail.imposeOtherObservation}
                      onChange={handleChange}
                      placeholder="Enter other conditions"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="option-group">
          <label className="radio-label">
            <input
              type="radio"
              name="bail.option"
              value="orderDetention"
              checked={formData.bail.option === "orderDetention"}
              onChange={handleChange}
            />
            Order Defendant's Detention
          </label>

          {formData.bail.option === "orderDetention" && (
            <div style={{ marginLeft: "1.75rem", marginTop: "1rem" }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bail.felonyViolence"
                  checked={formData.bail.felonyViolence}
                  onChange={handleChange}
                />
                The defendant is charged with a felony crime of violence and has
                over 30 criminal points on record.
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bail.maxSentence"
                  checked={formData.bail.maxSentence}
                  onChange={handleChange}
                />
                The defendant is charged with an offense for which the maximum
                sentence is life imprisonment or death.
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bail.historyViolatingBail"
                  checked={formData.bail.historyViolatingBail}
                  onChange={handleChange}
                />
                The defendant has a history of violating bail conditions.
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bail.threatenWitness"
                  checked={formData.bail.threatenWitness}
                  onChange={handleChange}
                />
                There exists a serious risk that the defendant will threaten,
                injure, or intimidate a prospective witness.
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bail.noBailConditions"
                  checked={formData.bail.noBailConditions}
                  onChange={handleChange}
                />
                The People believe that no condition or combination of
                conditions will reasonably assure the defendant's appearance as
                required and the safety of any person or the community.
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bail.orderDetentionOther"
                  checked={formData.bail.orderDetentionOther}
                  onChange={handleChange}
                />
                Other
              </label>

              {formData.bail.orderDetentionOther === true && (
                <div
                  className="form-group"
                  style={{ marginLeft: "1.75rem", marginTop: "0.75rem" }}
                >
                  <input
                    type="text"
                    name="bail.orderDetentionOtherObservation"
                    value={formData.bail.orderDetentionOtherObservation}
                    onChange={handleChange}
                    placeholder="Enter other reasons"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <span className="form-section-title">Filing Date</span>
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

export default Arraignment;
