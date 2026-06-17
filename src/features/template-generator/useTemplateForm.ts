import { useEffect, useRef, useState } from "react";
import { renderTemplate } from "../../utils/TemplateEngine";
import set from "lodash/set";

interface UseTemplateFormOptions<T extends object, U = T> {
  initialData: T;
  template: string;
  transformData?: (data: T) => U;
  onDataChange?: (data: T) => void;
  draftKey?: string;
  draftTtlMs?: number;
}

export function useTemplateForm<T extends object, U = T>({
  initialData,
  template,
  transformData,
  onDataChange,
  draftKey,
  draftTtlMs = 3_600_000,
}: UseTemplateFormOptions<T, U>) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [renderedTemplate, setRenderedTemplate] = useState("");
  const [formData, setFormData] = useState<T>(initialData);

  // Draft autosave state
  const [draftBanner, setDraftBanner] = useState<{ savedAt: string } | null>(null);
  const pendingDraftRef = useRef<T | null>(null);
  const isInitialMount = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On mount: check for an unexpired draft
  useEffect(() => {
    if (!draftKey) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const { data, savedAt } = JSON.parse(raw) as { data: T; savedAt: string };
      const age = Date.now() - new Date(savedAt).getTime();
      if (age < draftTtlMs) {
        pendingDraftRef.current = data;
        setDraftBanner({ savedAt });
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // ignore corrupt drafts
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const restoreDraft = () => {
    if (pendingDraftRef.current) {
      setFormData(pendingDraftRef.current);
    }
    setDraftBanner(null);
    pendingDraftRef.current = null;
  };

  const dismissDraft = () => {
    if (draftKey) localStorage.removeItem(draftKey);
    setDraftBanner(null);
    pendingDraftRef.current = null;
  };

  // Render template whenever form data changes
  useEffect(() => {
    const render = async () => {
      let computedData: any = { ...formData } as any;
      if (transformData) {
        computedData = transformData(formData);
      }
      const output = await renderTemplate(template, computedData);
      setRenderedTemplate(output);
    };

    render();

    if (onDataChange) {
      onDataChange(formData);
    }

    // Debounced autosave (skip the very first run so we don't overwrite a valid draft)
    if (draftKey) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          localStorage.setItem(
            draftKey,
            JSON.stringify({ data: formData, savedAt: new Date().toISOString() })
          );
        }, 1000);
      }
    }

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [formData, template, transformData, onDataChange, draftKey]);

  // Handle input/select changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      const updated = { ...prev } as any;
      set(updated, arrayPath, [...(get(prev, arrayPath) as any[]), newItem]);
      return updated as T;
    });
  };

  // Remove item from array at specified path
  const removeItem = (arrayPath: string, index: number) => {
    setFormData((prev) => {
      const updated = { ...prev } as any;
      const arr = get(prev, arrayPath) as any[];
      set(
        updated,
        arrayPath,
        arr.filter((_, i) => i !== index),
      );
      return updated as T;
    });
  };

  // Copy to clipboard — key discriminates which button is in "copied" state
  const handleCopyClick = (type: "richtext" | "source", key: string = type) => {
    const textToCopy = renderedTemplate;

    const showCopiedMessage = () => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
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
    copiedKey,
    draftBanner,
    restoreDraft,
    dismissDraft,
    handleChange,
    handleNumericInput,
    addItem,
    removeItem,
    handleCopyClick,
  };
}

function get(obj: any, path: string): any {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
}
