import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FEATURE_CARDS = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    label: "Template Generator",
    description: "Draft arraignments, plea agreements, expungements, and motions to dismiss.",
    href: "/template-generator",
    internal: true,
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: "Bail Schedule",
    description: "Public record of bail bond amounts by criminal charge — LEO and DAO schedules.",
    href: "https://elemeent.github.io/dao-bail-schedule",
    internal: false,
  },
];

function Home() {
  const [cat, setCat] = useState("");
  const [catLoading, setCatLoading] = useState(true);

  const fetchCat = async () => {
    setCatLoading(true);
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const [data] = await res.json();
      if (data?.url) setCat(data.url);
      else throw new Error("no url");
    } catch {
      setCat("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&fit=crop");
      // catLoading cleared by onLoad
    }
    // Do NOT clear catLoading here — wait for the image's onLoad so there's no flash
  };

  useEffect(() => { fetchCat(); }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:py-24">

      {/* ── Hero ── */}
      <div className="animate-fade-up text-center">
        <p className="font-mono text-[0.7rem] font-medium tracking-[0.25em] uppercase text-badge/80 mb-4">
          Office of the District Attorney · San Andreas
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          LSDA Workspace
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-base text-slate-400 leading-relaxed">
          Internal tooling for Los Santos District Attorney prosecutors. Draft legal
          documents, reference bail schedules, and manage case filings.
        </p>
      </div>

      {/* ── Feature cards ── */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {FEATURE_CARDS.map(({ icon, label, description, href, internal }) => {
          const inner = (
            <div className="group flex h-full flex-col gap-4 rounded-2xl border border-navy-700/60 bg-navy-900/40 p-6 transition-all duration-200 hover:border-badge/50 hover:bg-navy-900/70 hover:shadow-lg hover:shadow-badge/5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-badge ring-1 ring-navy-700">
                  {icon}
                </div>
                <svg className="h-4 w-4 text-navy-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-badge" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-slate-100">{label}</h2>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>
          );

          return internal ? (
            <Link key={label} to={href} className="block h-full">
              {inner}
            </Link>
          ) : (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
              {inner}
            </a>
          );
        })}
      </div>

      {/* ── Easter egg: morale boost ── */}
      <div className="mt-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-2xl border border-navy-700/40 bg-navy-900/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-navy-600">
                Daily Morale Boost
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-400">
                Courtesy of the People of San Andreas
              </p>
            </div>
            <button
              onClick={fetchCat}
              disabled={catLoading}
              className="rounded-lg border border-navy-700 px-3 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:border-badge/40 hover:text-badge disabled:opacity-40"
            >
              {catLoading ? "Loading…" : "Next →"}
            </button>
          </div>

          <div className="relative rounded-xl bg-navy-950 overflow-hidden" style={{ minHeight: 80 }}>
            {catLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 rounded-full border-2 border-navy-700 border-t-badge" style={{ animation: "spin 0.8s linear infinite" }} />
              </div>
            )}
            {cat && (
              <img
                src={cat}
                alt="Daily morale boost"
                className="w-full rounded-xl object-contain transition-opacity duration-300"
                style={{ opacity: catLoading ? 0 : 1, maxHeight: 400, display: catLoading ? "none" : "block" }}
                onLoad={() => setCatLoading(false)}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
