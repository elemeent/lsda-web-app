import "./TemplatePicker.css";

interface TemplatePickerProps {
  onSelectTemplate: (templateId: string) => void;
}

function TemplatePicker({ onSelectTemplate }: TemplatePickerProps) {
  const templates = [
    {
      id: "arraingment",
      title: "Arraignment",
      description:
        "Generate arraignment documents with defendant information, charges, and bail recommendations.",
      icon: "⚖️",
    },
    {
      id: "expungement",
      title: "Expungement",
      description:
        "Generate expungement documents with defendant information, charges, and motion information.",
      icon: "🧹",
    },
    {
      id: "plea-deal",
      title: "Plea Agreement",
      description:
        "Generate plea agreement documents with defendant information, charges, and sentencing recommendations.",
      icon: "🤝",
    },
    {
      id: "nolle-prosequi",
      title: "Motion to Dismiss",
      description:
        "Generate motion to dismiss documents with defendant information, charges, and motion information.",
      icon: "🚮",
    },
  ];

  return (
    <div className="template-picker">
      <div className="template-picker-header">
        <h1>Document Templates</h1>
        <p>Select a template to get started</p>
      </div>

      <div className="template-cards">
        {templates.map((template) => (
          <button
            key={template.id}
            className="template-card"
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="template-card-icon">{template.icon}</div>
            <h2 className="template-card-title">{template.title}</h2>
            <p className="template-card-description">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplatePicker;
