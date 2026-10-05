import { COLLECTIONS } from "../firebase/firestore";
import {
  EMPLOYMENT_TYPES,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
} from "../lib/constants";

const statusOptions = Object.entries(PROJECT_STATUSES).map(([value, label]) => ({
  value,
  label,
}));
const categoryOptions = PROJECT_CATEGORIES.filter((c) => c !== "All");
const employmentOptions = [
  { value: "", label: "Not specified" },
  ...EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t })),
];

const projectFields = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "slug",
    label: "Slug (web address)",
    type: "text",
    required: true,
    slug: true,
    help: "Used in the page address, e.g. /projects/argus. Changing it later changes the link.",
  },
  { name: "subtitle", label: "Subtitle", type: "text", placeholder: "e.g. Visual Intelligence" },
  { name: "summary", label: "Summary", type: "textarea", rows: 3, required: true },
  { name: "category", label: "Categories", type: "multicheck", options: categoryOptions, required: true },
  { name: "technologies", label: "Technologies", type: "tags", help: "Separate with commas." },
  { name: "year", label: "Year", type: "text", placeholder: "e.g. 2026" },
  { name: "status", label: "Status", type: "select", options: statusOptions },
  { name: "githubUrl", label: "GitHub link", type: "text", url: true, placeholder: "https://github.com/…" },
  { name: "liveUrl", label: "Live demo link", type: "text", url: true, placeholder: "https://…" },
  {
    name: "gallery",
    label: "Screenshots",
    type: "gallery",
    rows: 4,
    placeholder: "/images/shot-1.webp | Description of the screenshot",
    help: "One image per line: the image path or link, then | and a short description. Put files in public/images/ and use /images/name.webp.",
  },
  {
    name: "caseStudy",
    label: "Case study (optional)",
    type: "group",
    fields: [
      { name: "problem", label: "The problem", type: "textarea", rows: 3 },
      { name: "goals", label: "Goals", type: "lines", help: "One per line." },
      { name: "solution", label: "The solution", type: "textarea", rows: 3 },
      { name: "architecture", label: "Architecture steps", type: "lines", help: "One step per line, in order." },
      { name: "implementedFeatures", label: "Implemented features", type: "lines", help: "Only list what is actually built." },
      { name: "plannedFeatures", label: "Planned features", type: "lines", help: "Things not built yet." },
      { name: "implementation", label: "Implementation", type: "textarea", rows: 4 },
      { name: "challenges", label: "Challenges", type: "lines" },
      { name: "tradeoffs", label: "Trade-offs", type: "lines" },
      { name: "results", label: "Results", type: "textarea", rows: 3 },
      { name: "lessons", label: "Lessons learned", type: "lines" },
      { name: "future", label: "Future work", type: "lines" },
    ],
  },
  { name: "featured", label: "Featured on the home page", type: "checkbox" },
  { name: "published", label: "Published (visible to visitors)", type: "checkbox" },
];

const experienceFields = [
  { name: "organization", label: "Organization", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "employmentType", label: "Employment type", type: "select", options: employmentOptions },
  { name: "dateLabel", label: "Dates", type: "text", required: true, placeholder: "e.g. 2025 — Present" },
  { name: "description", label: "Description", type: "textarea", rows: 4 },
  { name: "achievements", label: "Achievements", type: "lines", help: "One per line." },
  { name: "technologies", label: "Technologies", type: "tags", help: "Separate with commas." },
  { name: "sortOrder", label: "Order (1 is shown first)", type: "number" },
  { name: "published", label: "Published (visible to visitors)", type: "checkbox" },
];

const educationFields = [
  { name: "institution", label: "Institution", type: "text", required: true },
  { name: "qualification", label: "Degree / program", type: "text", required: true },
  { name: "dateLabel", label: "Dates", type: "text", required: true, placeholder: "e.g. 2021 — 2025" },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
  { name: "achievements", label: "Achievements", type: "lines", help: "One per line." },
  { name: "sortOrder", label: "Order (1 is shown first)", type: "number" },
  { name: "published", label: "Published (visible to visitors)", type: "checkbox" },
];

export const RESOURCES = {
  projects: {
    collection: COLLECTIONS.projects,
    singular: "project",
    plural: "Projects",
    titleKey: "title",
    subtitleKey: "subtitle",
    featuredToggle: true,
    reorder: false,
    slugFrom: "title",
    fields: projectFields,
    defaults: () => ({ status: "planned", category: [], featured: false, published: false }),
  },
  experience: {
    collection: COLLECTIONS.experience,
    singular: "experience entry",
    plural: "Experience",
    titleKey: "organization",
    subtitleKey: "role",
    featuredToggle: false,
    reorder: true,
    fields: experienceFields,
    defaults: (items) => ({ sortOrder: items.length + 1, published: false }),
  },
  education: {
    collection: COLLECTIONS.education,
    singular: "education entry",
    plural: "Education",
    titleKey: "institution",
    subtitleKey: "qualification",
    featuredToggle: false,
    reorder: true,
    fields: educationFields,
    defaults: (items) => ({ sortOrder: items.length + 1, published: false }),
  },
};