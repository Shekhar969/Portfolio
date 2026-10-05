import { createContext, useEffect, useMemo, useState } from "react";
import { getPublicProfile } from "../services/profileService";
import { buildSite } from "../lib/site";

export const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPublicProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        // Keep the defaults from constants.js if settings can't be loaded.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ site: buildSite(profile) }), [profile]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}