import { useEffect, useState } from "react";
import { renderTemplate } from "../../utils/TemplateEngine";
import set from "lodash/set";

interface UseTemplateFormOptions<T> {
  initialData: T;
  template: string;
  transformData?: (data: T) => T;
  onDataChange?: (data: T) => void;
}

export function useTemplateForm<T>({
  initialData,
  template,
  transformData,
  onDataChange,
}: UseTemplateFormOptions<T>) {
  const [isCopied, setIsCopied] = useState(false);
  const [renderedTemplate, setRenderedTemplate] = useState("");
  const [formData, setFormData] = useState<T>(initialData);

  // Render template whenever form data changes
  useEffect(() => {
    const render = async () => {
      let computedData = { ...formData };

      // Apply custom transformation if provided
      if (transformData) {
        computedData = transformData(computedData);
      }

      const output = await renderTemplate(template, computedData);
      setRenderedTemplate(output);
    };

    render();

    // Call optional callback when data changes
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, template, transformData, onDataChange]);

  // Handle input/select changes
  const handleChange = (
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

  // Handle numeric input with optional min/max validation
  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    maxValue?: number,
    minValue?: number,
  ) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");

    let finalValue = numericValue;
    if (numericValue && maxValue !== undefined) {
      const numVal = parseInt(numericValue, 10);
      if (numVal > maxValue) {
        finalValue = String(maxValue);
      }
    }
    if (numericValue && minValue !== undefined) {
      const numVal = parseInt(numericValue, 10);
      if (numVal < minValue) {
        finalValue = "";
      }
    }

    const updated = { ...formData };
    set(updated, fieldName, finalValue);
    setFormData(updated);
  };

  // Add item to array at specified path
  const addItem = (arrayPath: string, newItem: any) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const arr = set(updated, arrayPath, [
        ...(get(prev, arrayPath) as any[]),
        newItem,
      ]);
      return arr;
    });
  };

  // Remove item from array at specified path
  const removeItem = (arrayPath: string, index: number) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const arr = get(prev, arrayPath) as any[];
      set(
        updated,
        arrayPath,
        arr.filter((_, i) => i !== index),
      );
      return updated;
    });
  };

  // Copy to clipboard
  const handleCopyClick = (type: "richtext" | "source") => {
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

  return {
    formData,
    setFormData,
    renderedTemplate,
    isCopied,
    handleChange,
    handleNumericInput,
    addItem,
    removeItem,
    handleCopyClick,
  };
}

// Utility function to get nested value (simple lodash-like alternative)
function get(obj: any, path: string): any {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
}
