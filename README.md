# Antigravity ↔ Claude Context Bridge

This repository is the **live context sync** between Nimrod's local Antigravity 2.0 AI agent (PC) and Claude (phone/web). Every file here is kept up to date so Claude always has full situational awareness without needing to ask for background.

---

## 📁 File Directory

| File / Folder | Purpose |
|---|---|
| `master_workspace_profile.md` | Who Nimrod is, his business goals, outreach strategy, and operating guidelines for Claude |
| `projects_inventory.md` | All active code projects on the PC with paths and descriptions |
| `automations_handbook.md` | Every automation script — what it does, how it works, and the exact terminal command to run it |
| `agents_handbook.md` | All Antigravity subagents — roles, capabilities, and when to invoke each |
| `power_commands.md` | **Shorthand trigger commands** — type `@outreach`, `@status`, `@draft-email` etc. for instant responses |
| `pc_path_map.md` | **Exact absolute paths** for every key file, folder, and script on Nimrod's PC |
| `antigravity-system/mcp_servers.md` | All MCP server integrations — what each does and how to trigger them |
| `antigravity-system/installed_plugins.md` | All installed plugins and their available skills |
| `active-session/checklist.md` | Current active task list (updated after each work session) |
| `active-session/walkthrough.md` | Summary of recent completed work |
| `active-session/chat_history.md` | Recent conversation highlights from the Antigravity session |

---

## 🎯 Current Business Focus

Nimrod's **#1 priority** is signing Klaviyo email marketing clients from the Shopify ecosystem to hit a **$10,000 revenue target**.

- Cold outreach via Gmail to Shopify brand founders/owners
- Personalized pitches referencing their review app (Judge.me, Loox, Yotpo) and free shipping threshold
- Selling Abandoned Cart recovery email flows as the core service
- All tracked in a Google Sheet (Shopify Leads tracker)

Everything else (dashboards, tools, apps) is secondary infrastructure supporting this outreach engine.

---

## ⚡ How Claude Should Use This Repo

1. **On first load** → Read `master_workspace_profile.md` to get full context on who Nimrod is and how to respond
2. **For any task** → Check `power_commands.md` for shorthand triggers Nimrod might use
3. **For script commands** → Use `pc_path_map.md` for exact paths and `automations_handbook.md` for trigger commands
4. **For current status** → Check `active-session/checklist.md` and `walkthrough.md`
5. **For agent/MCP use** → Refer to `agents_handbook.md` and `antigravity-system/mcp_servers.md`

> **Note:** Claude on phone cannot run commands directly. When Nimrod needs a script run, Claude should write the exact command for him to paste into his PC terminal or Antigravity chat.
