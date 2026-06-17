import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/template-generator", label: "Template Generator", internal: true },
  { to: "https://elemeent.github.io/dao-bail-schedule", label: "Bail Schedule", internal: false },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
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
      </div>
    </nav>
  );
}

export default Navbar;
