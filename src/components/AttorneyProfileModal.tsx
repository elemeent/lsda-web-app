import { useState } from "react";
import { useAttorney } from "../context/AttorneyContext";
import type { AttorneyProfile } from "../context/AttorneyContext";

const BLANK: Omit<AttorneyProfile, "id"> = {
  label: "",
  name: "",
  stateBar: "",
  firm: "",
  showFirm: true,
  address: "",
  showAddress: false,
  role: "",
};

interface ProfileFormProps {
  initial: Omit<AttorneyProfile, "id">;
  onSave: (data: Omit<AttorneyProfile, "id">) => void;
  onCancel: () => void;
  saveLabel: string;
}

function ProfileForm({ initial, onSave, onCancel, saveLabel }: ProfileFormProps) {
  const [data, setData] = useState(initial);
  const set = (field: keyof typeof BLANK, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="mt-3 rounded-xl border border-slate-700/60 bg-navy-900/60 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-xs font-medium text-slate-500">Character label</label>
          <input
            className="w-full rounded-lg border border-slate-700/60 bg-navy-950/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-badge/50 focus:outline-none focus:ring-2 focus:ring-badge/10"
            placeholder="e.g. ADA Ramirez"
            value={data.label}
            onChange={(e) => set("label", e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium text-slate-500">Full name</label>
          <input
            className="w-full rounded-lg border border-slate-700/60 bg-navy-950/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-badge/50 focus:outline-none focus:ring-2 focus:ring-badge/10"
            placeholder="e.g. RODRIGO VERAS"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-xs font-medium text-slate-500">State Bar No.</label>
          <input
            className="w-full rounded-lg border border-slate-700/60 bg-navy-950/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-badge/50 focus:outline-none focus:ring-2 focus:ring-badge/10"
            placeholder="e.g. 129049"
            value={data.stateBar}
            onChange={(e) => set("stateBar", e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium text-slate-500">Role / Rank</label>
          <input
            className="w-full rounded-lg border border-slate-700/60 bg-navy-950/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-badge/50 focus:outline-none focus:ring-2 focus:ring-badge/10"
            placeholder="e.g. Deputy District Attorney"
            value={data.role}
            onChange={(e) => set("role", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none mb-2">
          <input
            type="checkbox"
            className="accent-badge"
            checked={data.showFirm}
            onChange={(e) => set("showFirm", e.target.checked)}
          />
          Include firm / office
        </label>
        {data.showFirm && (
          <input
            className="w-full rounded-lg border border-slate-700/60 bg-navy-950/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-badge/50 focus:outline-none focus:ring-2 focus:ring-badge/10 mb-2"
            placeholder="e.g. Veras Legal Group"
            value={data.firm}
            onChange={(e) => set("firm", e.target.value)}
          />
        )}
        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none mb-2">
          <input
            type="checkbox"
            className="accent-badge"
            checked={data.showAddress}
            onChange={(e) => set("showAddress", e.target.checked)}
          />
          Include address
        </label>
        {data.showAddress && (
          <input
            className="w-full rounded-lg border border-slate-700/60 bg-navy-950/80 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-badge/50 focus:outline-none focus:ring-2 focus:ring-badge/10"
            placeholder="e.g. 1 Pershing Square, Los Santos, SA"
            value={data.address}
            onChange={(e) => set("address", e.target.value)}
          />
        )}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(data)}
          disabled={!data.label.trim()}
          className="rounded-lg bg-badge/10 border border-badge/25 px-4 py-1.5 text-sm font-semibold text-badge hover:bg-badge/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export default function AttorneyProfileModal({ onClose }: Props) {
  const { profiles, addProfile, updateProfile, deleteProfile } = useAttorney();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-navy-700/60 bg-navy-950 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800/60 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Characters</h2>
            <p className="text-xs text-slate-500 mt-0.5">Save your characters to quickly fill forms</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-navy-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
          {profiles.length === 0 && !addingNew && (
            <p className="text-sm text-slate-600 text-center py-6">
              No characters saved yet. Add your first one below.
            </p>
          )}

          {profiles.map((profile) => (
            <div key={profile.id}>
              {editingId === profile.id ? (
                <ProfileForm
                  initial={profile}
                  saveLabel="Save changes"
                  onSave={(data) => { updateProfile({ ...data, id: profile.id }); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-navy-700/50 bg-navy-900/40 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{profile.label}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {[profile.name, profile.stateBar && `Bar #${profile.stateBar}`, profile.role]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => { setEditingId(profile.id); setAddingNew(false); }}
                      className="rounded-md px-2.5 py-1 text-xs text-slate-500 hover:text-slate-200 hover:bg-navy-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProfile(profile.id)}
                      className="rounded-md px-2.5 py-1 text-xs text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {addingNew && (
            <ProfileForm
              initial={BLANK}
              saveLabel="Add character"
              onSave={(data) => { addProfile(data); setAddingNew(false); }}
              onCancel={() => setAddingNew(false)}
            />
          )}
        </div>

        {/* Footer */}
        {!addingNew && (
          <div className="px-6 py-4 border-t border-navy-800/60 shrink-0">
            <button
              onClick={() => { setAddingNew(true); setEditingId(null); }}
              className="w-full rounded-xl border border-dashed border-badge/30 py-2.5 text-sm font-medium text-badge/80 hover:bg-badge/5 hover:border-badge/50 transition-colors"
            >
              + Add character
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
