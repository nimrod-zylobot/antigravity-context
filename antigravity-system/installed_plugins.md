# 🔌 Installed Plugins & Skills

These are all the plugins loaded into Nimrod's Antigravity 2.0 environment. Each plugin extends what the AI agent can do.

---

## 1. Superpowers (`superpowers`)

**What it is:** A complete agentic software engineering methodology framework, adapted from [obra/superpowers](https://github.com/obra/superpowers). Enforces TDD, systematic planning, and code quality gates.

**Skills available:**

| Skill | When to use |
|---|---|
| `using-superpowers` | Use at the start of every conversation — checks which skills are relevant before responding |
| `brainstorming` | Use **before any creative work** — features, UI, new functionality. Explores requirements first |
| `writing-plans` | Use when given a spec or multi-step task **before touching code** |
| `executing-plans` | Use when running an approved implementation plan in a separate session with checkpoints |
| `subagent-driven-development` | Use when executing plans with independent parallel tasks in the current session |
| `test-driven-development` | Use **before writing any implementation code** — enforces Red-Green-Refactor cycles |
| `systematic-debugging` | Use when hitting any bug, test failure, or unexpected behavior — diagnose before fixing |
| `requesting-code-review` | Use when completing a feature or major change — verify work before merging |
| `receiving-code-review` | Use when getting review feedback — requires rigor, not blind agreement |
| `dispatching-parallel-agents` | Use when 2+ independent tasks can run without shared state dependencies |
| `using-git-worktrees` | Use before feature work needing isolation from current workspace |
| `finishing-a-development-branch` | Use when implementation is complete — guides merge, PR, or cleanup decisions |
| `verification-before-completion` | Use before claiming anything is "done" or "passing" — requires evidence from commands |
| `writing-skills` | Use when creating or editing new skills for the plugin system |

---

## 2. Android CLI (`android-cli-plugin`)

**What it is:** Orchestrates Android development tasks from the command line.

**Skills available:**

| Skill | What it does |
|---|---|
| `android-cli` | Creates Android projects, deploys APKs, manages SDK, diagnoses environment issues |

**When to use:** Any Android app development, testing, or SDK management task.

---

## 3. Chrome DevTools (`chrome-devtools-plugin`)

**What it is:** Protocol wrappers for browser automation using Chrome DevTools Protocol.

**When to use:** Browser automation, scraping DOM elements, intercepting network requests, debugging web apps in a live browser session.

---

## 4. Firebase (`firebase`)

**What it is:** Firebase project integration plugin.

**When to use:** Firebase Authentication, Firestore, Realtime Database, or Firebase Hosting tasks.

---

## 5. Google Workspace Guide (`google-workspace-guide`)

**What it is:** A skill guide for using and troubleshooting the Google Workspace MCP server, including custom APIs.

**Skills available:**

| Skill | What it does |
|---|---|
| `google-workspace` | Best practices for using Gmail, Sheets, Drive, and Docs via MCP. Includes troubleshooting patterns. |

---

## 6. Modern Web Guidance (`modern-web-guidance-plugin`)

**What it is:** Web development best practices and UI/UX guidance plugin.

**When to use:** Building web apps — enforces modern design patterns (dark mode, glassmorphism, animations, responsive layouts, SEO best practices).

---

## 7. Google Antigravity SDK (`google-antigravity-sdk`)

**What it is:** Google SDK integrations specific to the Antigravity platform.

**When to use:** Google API integrations beyond what the Workspace MCP covers.

---

## 📍 Plugin Directory

All plugins are installed at: `C:\Users\nimro\.gemini\config\plugins\`

Each plugin folder contains:
- `plugin.json` — plugin manifest and metadata
- `skills/` — one folder per skill, each with a `SKILL.md` instruction file
