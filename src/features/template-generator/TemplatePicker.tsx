const TEMPLATES = [
  {
    id: "arraignment",
    label: "Arraignment",
    description: "Formal charge presentation with sentencing options and bail recommendations.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    tag: "Criminal",
  },
  {
    id: "expungement",
    label: "Expungement",
    description: "Motion to seal or expunge prior criminal record with supporting motion text.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    ),
    tag: "Post-Conviction",
  },
  {
    id: "plea-deal",
    label: "Plea Agreement",
    description: "Negotiated plea with guilty charges, dismissals, and sentencing terms.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    tag: "Plea",
  },
  {
    id: "nolle-prosequi",
    label: "Motion to Dismiss",
    description: "Nolle prosequi filing with dismissal reasoning and supporting grounds.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    tag: "Dismissal",
  },
];

interface TemplatePickerProps {
  onSelectTemplate: (id: string) => void;
}

function TemplatePicker({ onSelectTemplate }: TemplatePickerProps) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 animate-fade-up">
      <div className="mb-10">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-badge/80">
          District Attorney's Office
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
          Document Templates
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Select a template to begin drafting a legal document.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TEMPLATES.map(({ id, label, description, icon, tag }) => (
          <button
            key={id}
            onClick={() => onSelectTemplate(id)}
            className="group relative flex items-start gap-4 rounded-xl border border-navy-700/60 bg-navy-900/40 p-5 text-left transition-all duration-200 hover:border-badge/40 hover:bg-navy-900/70 hover:shadow-lg hover:shadow-black/20 active:scale-[0.99]"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-badge ring-1 ring-navy-700/80 transition-colors group-hover:bg-badge/10 group-hover:ring-badge/30">
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100">{label}</span>
                <span className="rounded-full border border-navy-700 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider uppercase text-slate-500">
                  {tag}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
            <svg
              className="mt-1 h-4 w-4 shrink-0 text-navy-600 transition-all group-hover:translate-x-0.5 group-hover:text-badge"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplatePicker;
