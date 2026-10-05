import { RESUME_URL, SITE, SOCIAL_LINKS } from "./constants";

/**
 * Merge the saved Settings document over the defaults in constants.js.
 * When a Settings document exists it is the source of truth, so clearing a
 * field in the admin hides it on the site.
 */
export function buildSite(profile) {
  if (!profile) {
    return {
      ...SITE,
      about: "",
      profileImage: "",
      resumeUrl: RESUME_URL,
      socialLinks: SOCIAL_LINKS,
    };
  }

  const socialLinks = [
    profile.githubUrl && { id: "github", label: "GitHub", href: profile.githubUrl },
    profile.linkedinUrl && { id: "linkedin", label: "LinkedIn", href: profile.linkedinUrl },
    profile.email && { id: "email", label: "Email", href: `mailto:${profile.email}` },
    ...(profile.additionalLinks || []).map((link, index) => ({
      id: `extra-${index}`,
      label: link.label,
      href: link.url,
    })),
  ].filter(Boolean);

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
    socialLinks,
  };
}