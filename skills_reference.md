# 🧠 Skills Reference

Skills are instruction sets that tell Antigravity **exactly how to behave** for specific types of tasks. Before starting any task, Antigravity checks whether a relevant skill exists and follows it.

There are **16 skills** installed across 3 plugins.

---

## How Skills Work

- Each skill lives in a `SKILL.md` file inside a plugin folder
- Skills are **triggered automatically** by Antigravity when the task type matches
- On phone: you can request a skill by name, e.g. *"Use the brainstorming skill before we build this"*
- Skills enforce process — they prevent skipping steps (no coding before planning, no merging before review)

---

## 📦 Superpowers Plugin — 14 Skills

Path: `C:\Users\nimro\.gemini\config\plugins\superpowers\skills\`

| Skill | When Antigravity Uses It |
|---|---|
| `using-superpowers` | **Every conversation start** — checks which skills apply before responding to anything, even clarifying questions |
| `brainstorming` | **Before any creative work** — new features, UI components, new functionality. Explores requirements and design intent before a single line of code |
| `writing-plans` | **Before touching code** on any multi-step task — creates `implementation_plan.md` with full technical design |
| `executing-plans` | When running an approved implementation plan in a **separate session** with review checkpoints |
| `subagent-driven-development` | When executing a plan with **independent parallel tasks** in the current session — dispatches multiple subagents |
| `dispatching-parallel-agents` | When 2+ tasks can be worked on simultaneously without shared state — splits work across agents |
| `test-driven-development` | **Before writing any implementation code** — enforces Red → Green → Refactor cycle. Writes failing tests first |
| `systematic-debugging` | When hitting **any bug, test failure, or unexpected behavior** — diagnoses root cause before proposing a fix |
| `requesting-code-review` | When completing a feature or major change — verifies work meets requirements before merging |
| `receiving-code-review` | When getting review feedback — requires technical rigor and evidence, not blind agreement |
| `using-git-worktrees` | Before feature work that needs **isolation** from the current workspace — sets up a git worktree |
| `finishing-a-development-branch` | When implementation is complete and tests pass — guides merge, PR creation, or cleanup |
| `verification-before-completion` | **Before claiming anything is "done" or "fixed"** — must run verification commands and show output as evidence |
| `writing-skills` | When creating or editing skills for the plugin system |

---

## 📦 Android CLI Plugin — 1 Skill

Path: `C:\Users\nimro\.gemini\config\plugins\android-cli-plugin\skills\`

| Skill | When Antigravity Uses It |
|---|---|
| `android-cli` | Any Android development task — project creation, APK deployment, SDK management, environment diagnostics |

---

## 📦 Google Workspace Guide — 1 Skill

Path: `C:\Users\nimro\.gemini\config\plugins\google-workspace-guide\skills\`

| Skill | When Antigravity Uses It |
|---|---|
| `google-workspace` | Any task using Gmail, Google Sheets, Drive, or Docs via the MCP server — provides best practices, troubleshooting patterns, and correct tool call formats |

---

## 🔑 Quick Reference — Which Skill for What

| Situation | Skill to use |
|---|---|
| Starting a new conversation | `using-superpowers` |
| Designing a new feature or UI | `brainstorming` |
| Got a spec or task list | `writing-plans` |
| Running an approved plan | `executing-plans` or `subagent-driven-development` |
| Implementing any feature | `test-driven-development` |
| Something broke or tests fail | `systematic-debugging` |
| About to say "it's done" | `verification-before-completion` |
| Finished a feature, time to merge | `requesting-code-review` → `finishing-a-development-branch` |
| Got review comments back | `receiving-code-review` |
| Need to work on 2+ things at once | `dispatching-parallel-agents` |
| Android SDK or app work | `android-cli` |
| Gmail/Sheets MCP issues | `google-workspace` |

---

## 📍 Skill File Locations

```
C:\Users\nimro\.gemini\config\plugins\
├── superpowers\skills\
│   ├── brainstorming\SKILL.md
│   ├── dispatching-parallel-agents\SKILL.md
│   ├── executing-plans\SKILL.md
│   ├── finishing-a-development-branch\SKILL.md
│   ├── receiving-code-review\SKILL.md
│   ├── requesting-code-review\SKILL.md
│   ├── subagent-driven-development\SKILL.md
│   ├── systematic-debugging\SKILL.md
│   ├── test-driven-development\SKILL.md
│   ├── using-git-worktrees\SKILL.md
│   ├── using-superpowers\SKILL.md
│   ├── verification-before-completion\SKILL.md
│   ├── writing-plans\SKILL.md
│   └── writing-skills\SKILL.md
├── android-cli-plugin\skills\SKILL.md
└── google-workspace-guide\skills\SKILL.md
```
