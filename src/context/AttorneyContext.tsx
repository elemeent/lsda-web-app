import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

export interface AttorneyProfile {
  id: string;
  label: string;
  name: string;
  stateBar: string;
  firm: string;
  showFirm: boolean;
  address: string;
  showAddress: boolean;
  role: string;
}

const STORAGE_KEY = "characterProfiles";

function loadProfiles(): AttorneyProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface AttorneyContextValue {
  profiles: AttorneyProfile[];
  addProfile: (profile: Omit<AttorneyProfile, "id">) => void;
  updateProfile: (profile: AttorneyProfile) => void;
  deleteProfile: (id: string) => void;
}

const AttorneyContext = createContext<AttorneyContextValue>({
  profiles: [],
  addProfile: () => {},
  updateProfile: () => {},
  deleteProfile: () => {},
});

export function AttorneyProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<AttorneyProfile[]>(loadProfiles);

  const persist = (updated: AttorneyProfile[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addProfile = useCallback((profile: Omit<AttorneyProfile, "id">) => {
    setProfiles((prev) => {
      const updated = [...prev, { ...profile, id: crypto.randomUUID() }];
      persist(updated);
      return updated;
    });
  }, []);

  const updateProfile = useCallback((profile: AttorneyProfile) => {
    setProfiles((prev) => {
      const updated = prev.map((p) => (p.id === profile.id ? profile : p));
      persist(updated);
      return updated;
    });
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  return (
    <AttorneyContext.Provider value={{ profiles, addProfile, updateProfile, deleteProfile }}>
      {children}
    </AttorneyContext.Provider>
  );
}

export const useAttorney = () => useContext(AttorneyContext);
