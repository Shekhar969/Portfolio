// Temporary placeholder content. Shapes mirror the Firestore collections
// (experience, education, projects, blogPosts). In Phase 9 these are replaced
// by the service layer. Replace the [BRACKETED] values with real information.

export const sampleExperience = [
  {
    id: "exp-placeholder",
    organization: "[COMPANY]",
    role: "[ROLE]",
    employmentType: "[EMPLOYMENT TYPE]",
    dateLabel: "[START] — [END]",
    description: "[DESCRIPTION OF WHAT YOU DID AND WHY IT MATTERED]",
    achievements: ["[ACHIEVEMENT]", "[ACHIEVEMENT]"],
    technologies: [],
    isPlaceholder: true,
  },
];

export const sampleEducation = [
  {
    id: "edu-placeholder",
    institution: "[INSTITUTION]",
    qualification: "[DEGREE / PROGRAM]",
    dateLabel: "[START] — [END]",
    description: "[SHORT DESCRIPTION]",
    achievements: [],
    isPlaceholder: true,
  },
];

export const sampleProjects = [
  {
    id: "proj-argus",
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
    },
    isPlaceholder: true,
  },
  {
    id: "proj-nfc",
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
    caseStudyContent: "",
    isPlaceholder: true,
  },
];

export const samplePosts = [
  {
    id: "post-placeholder",
    slug: "sample-post",
    title: "Sample post title",
    excerpt:
      "This is a placeholder. Real posts will appear here once you publish them from the admin panel.",
    tags: ["Sample"],
    publishedAt: null,
    readingTime: 1,
    published: true,
    isPlaceholder: true,
  },
];