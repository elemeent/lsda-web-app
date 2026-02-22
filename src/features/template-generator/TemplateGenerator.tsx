import { useState } from "react";
import Arraignment from "./arraignment/Arraingment";
import TemplatePicker from "./TemplatePicker";
import "./TemplateGenerator.css";
import PleaDeal from "./plea-deal/PleaDeal";
import Expungement from "./expungement/Expungement";

function TemplateGenerator() {
  const [activeTemplate, setActiveTemplate] = useState("none");

  const renderContent = () => {
    switch (activeTemplate) {
      case "arraingment":
        return <Arraignment />;
      case "plea-deal":
        return <PleaDeal />;
      case "expungement":
        return <Expungement />;
      default:
        return <TemplatePicker onSelectTemplate={setActiveTemplate} />;
    }
  };

  return (
    <div className="template-generator">
      {activeTemplate !== "none" && (
        <nav className="template-generator-nav">
          <button onClick={() => setActiveTemplate("none")}>
            ← Back to Templates
          </button>
        </nav>
      )}
      <main className="template-generator-main">{renderContent()}</main>
    </div>
  );
}

export default TemplateGenerator;
