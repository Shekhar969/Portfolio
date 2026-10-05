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

export const samplePostsadmin = [
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

const sampleBodyOne = [
  "This is a **sample post** that shows how articles render. Replace it by publishing a real post from the admin panel.",
  "",
  "## Headings and text",
  "",
  "Paragraphs support *emphasis*, **bold text**, `inline code`, and [links](https://react.dev).",
  "",
  "> Blockquotes are supported too.",
  "",
  "## Lists",
  "",
  "- First item",
  "- Second item",
  "",
  "1. Numbered item",
  "2. Another numbered item",
  "",
  "## Code",
  "",
  "```js",
  "const greet = (name) => `Hello, ${name}!`;",
  "console.log(greet(\"world\"));",
  "```",
  "",
  "```python",
  "def add(a, b):",
  "    return a + b",
  "```",
  "",
  "```bash",
  "yarn dev",
  "```",
  "",
  "## Table",
  "",
  "| Tool | Purpose |",
  "| --- | --- |",
  "| Vite | Dev server and build |",
  "| Firebase | Backend services |",
  "",
  "### A third-level heading",
  "",
  "Text under a smaller heading.",
].join("\n");

const sampleBodyTwo = [
  "Another **sample post**, used to test related posts and previous/next navigation.",
  "",
  "## Section one",
  "",
  "Some placeholder text.",
  "",
  "## Section two",
  "",
  "```json",
  "{ \"sample\": true }",
  "```",
].join("\n");

export const samplePosts = [
  {
    id: "post-sample-1",
    slug: "sample-post",
    title: "Sample post: formatting showcase",
    excerpt:
      "A placeholder article showing headings, lists, tables, and code blocks. Real posts appear here once published from the admin panel.",
    content: sampleBodyOne,
    tags: ["Sample"],
    author: "",
    coverImageUrl: "",
    publishedAt: "2026-09-01",
    updatedAt: "2026-09-10",
    readingTime: 2,
    published: true,
    isPlaceholder: true,
  },
  {
    id: "post-sample-2",
    slug: "sample-post-two",
    title: "Sample post: a second placeholder",
    excerpt: "Another placeholder, used to test sorting, related posts, and navigation.",
    content: sampleBodyTwo,
    tags: ["Sample", "Notes"],
    author: "",
    coverImageUrl: "",
    publishedAt: "2026-09-20",
    updatedAt: null,
    readingTime: 1,
    published: true,
    isPlaceholder: true,
  },
];