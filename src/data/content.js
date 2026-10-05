// ---------------------------------------------------------------------------
// Your portfolio content. Edit this file, commit, and push to update the site.
// Only add information that is true. Leave a list empty ([]) to hide it.
// ---------------------------------------------------------------------------

// ---------- Experience ----------
// Dates are plain text, so write them however you like ("2025 — Present").
export const experience = [
  {
    id: "exp-1",
    organization: "[COMPANY]",
    role: "[ROLE]",
    employmentType: "Internship", // e.g. Full-time, Part-time, Internship
    dateLabel: "[START] — [END]",
    description: "[WHAT YOU DID AND WHY IT MATTERED]",
    achievements: [
      // "Something you actually did or achieved",
    ],
    technologies: [
      // "Selenium", "Postman",
    ],
  },
];

// ---------- Education ----------
export const education = [
  {
    id: "edu-1",
    institution: "[INSTITUTION]",
    qualification: "[DEGREE / PROGRAM]",
    dateLabel: "[START] — [END]",
    description: "",
    achievements: [],
  },
];

// ---------- Projects ----------
// status: "completed" | "in-progress" | "planned" | "archived"
// category: any of Web, Frontend, Backend, AI, Computer Vision, Hardware,
//           IoT, Open Source, Academic
// Only list a feature under implementedFeatures if it is really built.
export const projects = [
  {
    id: "argus",
    slug: "argus",
    title: "ARGUS",
    subtitle: "Visual Intelligence",
    summary:
      "An intelligent CCTV monitoring concept exploring real-time person detection, restricted-zone verification, evidence capture, and alerts.",
    category: ["AI", "Computer Vision", "Web"],
    technologies: ["Python", "FastAPI", "YOLO", "OpenCV", "React", "WebSocket"],
    year: "",
    status: "planned",
    featured: true,
    githubUrl: "",
    liveUrl: "",
    gallery: [
      // { url: "/images/argus-1.webp", alt: "Describe the screenshot" },
    ],
    caseStudy: {
      problem:
        "Traditional CCTV systems primarily record footage and require humans to continuously monitor or manually review events.",
      solution:
        "An intelligent computer-vision monitoring concept that detects people, evaluates restricted-zone intrusion, captures evidence, and generates alerts.",
      architecture: [
        "Camera",
        "Video Stream",
        "Object Detection",
        "Person Tracking",
        "Restricted Zone",
        "Intrusion Verification",
        "Evidence Capture",
        "Alert",
      ],
      implementedFeatures: [],
      plannedFeatures: [
        "Real-time person detection",
        "Restricted-zone verification",
        "Evidence capture",
        "Alerts",
      ],
      // Optional extra sections (each hides itself when missing):
      // goals: [], implementation: "", challenges: [], tradeoffs: [],
      // results: "", lessons: [], future: [],
    },
  },
  {
    id: "nfc-smart-attendance",
    slug: "nfc-smart-attendance",
    title: "NFC Smart Attendance System",
    subtitle: "IoT / Hardware / Full Stack",
    summary:
      "A smart attendance system concept using NFC/RFID identification, an ESP32-based edge device, local offline storage, and centralized attendance management.",
    category: ["IoT", "Hardware", "Web"],
    technologies: ["ESP32", "RFID/NFC", "React", "Firebase", "Firestore"],
    year: "",
    status: "planned",
    featured: true,
    githubUrl: "",
    liveUrl: "",
    gallery: [],
    caseStudy: null,
  },
];

// ---------- Blog (hidden while FEATURES.blog is false) ----------
export const posts = [];