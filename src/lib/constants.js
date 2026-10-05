// Central place for site-wide values. Edit the placeholders below with your
// real details, or later load them from Firestore (siteSettings/public).

export const SITE = {
  name: "Shekhar Rawal",
  role: "Quality Assurance",
  location: "Nepal, Kanchanpur",
  shortBio:
    "I'm a developer interested in building useful software, intelligent systems, and practical solutions to real-world problems.",
  tagline: "Building useful software.",
  email: "shekharrawal96@gmail.com",
  url: "https://www.shekharrawal.com.np/",
};

// Path or URL of your resume PDF. Leave empty until you have one.
// Example: "/resume.pdf" (file placed in the /public folder)
export const RESUME_URL = "";

// Turn the blog on later by setting this to true.
export const FEATURES = {
  blog: false,
};

export const ROUTES = {
  home: "/",
  projects: "/projects",
  blog: "/blog",
  contact: "/contact",
  resume: "/resume",
  privacy: "/privacy",
  admin: "/admin",
  adminLogin: "/admin/login",
};

// FEATURES and ROUTES must be declared above this point.
export const NAV_LINKS = [
  { label: "Home", to: ROUTES.home },
  { label: "Projects", to: ROUTES.projects },
  { label: "Blog", to: ROUTES.blog },
  { label: "Contact", to: ROUTES.contact },
  { label: "Resume", to: ROUTES.resume },
].filter((link) => link.to !== ROUTES.blog || FEATURES.blog);

export const FOOTER_LINKS = NAV_LINKS;

// Leave `href` empty to hide a link. SocialLinks will only render entries
// that have a real href.
export const SOCIAL_LINKS = [
  { id: "github", label: "GitHub", href: "https://github.com/Shekhar969" },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shekhar-singh-rawal-726324271/",
  },
  { id: "email", label: "Email", href: "mailto:shekharrawal96@gmail.com" },
];

export const PROJECT_CATEGORIES = [
  "All",
  "Web",
  "Frontend",
  "Backend",
  "AI",
  "Computer Vision",
  "Hardware",
  "IoT",
  "Open Source",
  "Academic",
];

export const PROJECT_STATUSES = {
  completed: "Completed",
  "in-progress": "In progress",
  planned: "Planned",
  archived: "Archived",
};

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
];

export const BLOG_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export const THEMES = {
  light: "light",
  dark: "dark",
  system: "system",
};

export const THEME_STORAGE_KEY = "portfolio-theme";

// Form limits (used by validation.js and the form inputs)
export const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 2000,
};

// Approximate reading speed for blog posts
export const WORDS_PER_MINUTE = 200;

// Debounce delay (ms) for search inputs
export const SEARCH_DEBOUNCE_MS = 250;

// Contact form states
export const FORM_STATUS = {
  idle: "idle",
  submitting: "submitting",
  success: "success",
  error: "error",
};