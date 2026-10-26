# Shekhar Rawal — Portfolio

A modern, responsive developer portfolio built with **React 19, Vite, Tailwind CSS, and JavaScript**, designed to showcase professional information, technical skills, experience, projects, and contact links.

**Repository:** Shekhar969/Portfolio


## Installation

**Prerequisites:** Git, a compatible Node.js version, Corepack, and Yarn 4.9.1.

bash

```
git clone https://github.com/Shekhar969/Portfolio.git
cd Portfolio

yarn install

# Start development server
yarn dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## Features

- Responsive, component-based portfolio interface.
- Professional profile, skills, experience, projects, and contact links.
- Client-side routing through React Router DOM.
- Utility-first styling with Tailwind CSS.
- Markdown rendering, GitHub Flavored Markdown, and syntax highlighting.
- Sanitization support for rendered content.
- SEO metadata management and sitemap generation.
- Firebase SDK integration where configured.
- Production builds and GitHub Pages deployment scripts.

## Architecture

text

```
Browser
  │
  ▼
Static Hosting (HTML / CSS / JS)
  │
  ▼
React Application
  ├── Components & UI
  ├── React Router
  ├── Tailwind CSS
  ├── Markdown Rendering
  ├── SEO Metadata
  └── Configured Firebase Services
          │
          ▼
     External Services

Build Pipeline:
Sitemap Generation → Vite Build → dist/ → Deployment
```

The application uses React for UI rendering, Vite for development and bundling, Tailwind CSS for styling, and optional external services for configured functionality. Vite generates deployable static assets in `dist/`.

## Project Structure

text

```
Portfolio/
├── public/                  # Static assets
├── src/                     # React application source
├── script/
│   └── generate-sitemap.js  # Sitemap generator
├── index.html               # HTML entry template
├── package.json             # Dependencies and scripts
├── yarn.lock                # Dependency lockfile
├── .yarnrc.yml              # Yarn configuration
├── .oxlintrc.json           # Lint configuration
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # CSS processing
├── projectargus.mp4         # Video asset
└── README.md
```

## How It Works

1. **Initialization:** The browser loads `index.html` and the generated JavaScript/CSS assets.
2. **Rendering:** React initializes the application and renders the configured component tree.
3. **Navigation:** React Router maps configured URL paths to their respective views.
4. **Styling:** Tailwind utilities and processed CSS define layout, appearance, and responsive behavior.
5. **Content:** Markdown plugins support formatted content, heading IDs, syntax highlighting, and sanitization where implemented.
6. **Services:** Firebase operations depend on the configured SDK initialization and application modules.
7. **Build:** The sitemap script runs before Vite compiles the production application into `dist/`.


## Build & Deployment

bash

```
# Validate code
yarn lint

# Generate sitemap and build
yarn build

# Test production output
yarn preview

# Prepare and deploy to GitHub Pages
yarn predeploy
yarn deploy
```

The build runs `node script/generate-sitemap.js && vite build`. The deployment preparation script copies `dist/index.html` to `dist/404.html` for fallback handling.

**Deployment checklist:** Verify the Vite base path, GitHub Pages settings, sitemap URL, asset paths, route fallback behavior, and any required external-service configuration.

## Configuration & Customization

- **Content:** Update the relevant components and data modules in `src/`.
- **Styling:** Modify Tailwind utilities, application styles, or `tailwind.config.js`.
- **Routing:** Update the configured React Router routes.
- **SEO:** Configure page metadata and maintain `script/generate-sitemap.js`.
- **Firebase:** Verify service initialization, configuration, and access rules before using Firebase-backed features.
- **Assets:** Add or replace public assets in `public/` or the appropriate source directory.

## Security & Best Practices

- Never commit secrets, private keys, or credentials.
- Enforce Firebase permissions through service-side security rules.
- Sanitize untrusted Markdown content and validate URLs.
- Keep dependencies and `yarn.lock` synchronized.
- Use semantic HTML, accessible controls, optimized assets, and responsive layouts.
- Run `yarn lint` and `yarn build` before deployment.


## Author

**Shekhar Rawal** · GitHub

**License:** No repository license has been verified. Add a `LICENSE` file to define reuse and distribution permissions.
