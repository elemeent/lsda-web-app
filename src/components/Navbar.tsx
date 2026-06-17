import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AttorneyProfileModal from "./AttorneyProfileModal";

const NAV_LINKS = [
  { to: "/template-generator", label: "Template Generator", internal: true },
  { to: "https://elemeent.github.io/dao-bail-schedule", label: "Bail Schedule", internal: false },
];

function Navbar() {
  const { pathname } = useLocation();
  const [showProfiles, setShowProfiles] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 h-14 border-b border-navy-800/60 bg-navy-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-8 px-5">
          <Link to="/" className="flex items-baseline gap-1.5 shrink-0">
            <span className="font-mono text-[0.7rem] font-medium tracking-[0.2em] uppercase text-badge">
              LSDA
            </span>
            <span className="text-[0.95rem] font-semibold text-slate-100 tracking-tight">
              Workspace
            </span>
          </Link>

          <div className="h-4 w-px bg-navy-700" />

          <ul className="flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map(({ to, label, internal }) => {
              const active = internal && pathname === to;
              const cls = [
                "rounded-md px-3 py-1.5 transition-colors",
                active
                  ? "text-badge bg-badge/10"
                  : "text-slate-400 hover:text-slate-100 hover:bg-navy-800/60",
              ].join(" ");

              return (
                <li key={to}>
                  {internal ? (
                    <Link to={to} className={cls}>{label}</Link>
                  ) : (
                    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
                      {label}
                      <span className="ml-1 text-[0.65rem] opacity-50">↗</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="ml-auto">
            <button
              onClick={() => setShowProfiles(true)}
              title="Characters"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-navy-800/60 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              Characters
            </button>
          </div>
        </div>
      </nav>

      {showProfiles && <AttorneyProfileModal onClose={() => setShowProfiles(false)} />}
    </>
  );
}

export default Navbar;
