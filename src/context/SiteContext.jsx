import { createContext, useEffect, useMemo, useState } from "react";
import { RESUME_URL, SITE, SOCIAL_LINKS } from "../lib/constants";
import { getPublicProfile } from "../services/profileService";

/** Merge saved Settings over the defaults in constants.js. */
export function buildSite(profile) {
  if (!profile) {
    return {
      ...SITE,
      socialLinks: SOCIAL_LINKS,
      resumeUrl: RESUME_URL,
      profileImage: "",
      about: "",
    };
  }
  return {
    ...SITE,
    name: profile.name || SITE.name,
    role: profile.role || SITE.role,
    location: profile.location || "",
    shortBio: profile.shortBio || SITE.shortBio,
    about: profile.about || "",
    email: profile.email || "",
    profileImage: profile.profileImage || "",
    resumeUrl: profile.resumeUrl || "",
    socialLinks: [
      { id: "github", label: "GitHub", href: profile.githubUrl || "" },
      { id: "linkedin", label: "LinkedIn", href: profile.linkedinUrl || "" },
      {
        id: "email",
        label: "Email",
        href: profile.email ? `mailto:${profile.email}` : "",
      },
      ...(profile.additionalLinks || []).map((link, index) => ({
        id: `extra-${index}`,
        label: link.label,
        href: link.url,
      })),
    ],
  };
}

export const SiteContext = createContext(buildSite(null));

export function SiteProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPublicProfile()
      .then((data) => !cancelled && setProfile(data))
      .catch(() => {}); // keep the defaults if the read fails
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => buildSite(profile), [profile]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}