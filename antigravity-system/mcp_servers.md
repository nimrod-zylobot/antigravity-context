# 🔌 MCP Servers Reference

These are all the active Model Context Protocol (MCP) servers configured in Nimrod's Antigravity 2.0 environment on his PC.

> **For Claude on phone:** You cannot trigger these directly. Write the exact instruction for Nimrod to run on his PC, e.g. *"Ask Antigravity to: read the Shopify Leads sheet using the google-workspace MCP"*

---

## 1. Google Workspace (`google-workspace`)

**Connects to:** Gmail, Google Sheets, Drive, Calendar, Docs, Meet, Tasks

| Operation | Tool Name | Example Use |
|---|---|---|
| Read emails | `manage_email` | Fetch today's inbox, find replies from leads |
| Send email | `manage_email` | Send cold outreach via nimrod@zylobot.com |
| Read sheet | `manage_sheets` | Read Shopify Leads tracker (range: `Leads!A4:K100`) |
| Update sheet | `manage_sheets` | Update lead status cell to "Replied" |
| Search Drive | `manage_drive` | Find specific Google Docs or files |
| Read calendar | `manage_calendar` | Check scheduled tasks or meetings |

**When to use:** Any task involving Gmail, the Shopify Leads tracker, or Drive files.

**Trigger phrase for PC:** *"Use google-workspace MCP to read the Shopify Leads sheet"*

---

## 2. GitHub (`github`)

**Connects to:** GitHub repositories under `nimrod-zylobot` org

| Operation | Tool Name | Example Use |
|---|---|---|
| Push files | `push_files` | Deploy code updates to a repo |
| Create/update file | `create_or_update_file` | Update a single file in a repo |
| Read file | `get_file_contents` | Read a file from any GitHub repo |
| List commits | `list_commits` | Check recent changes |
| Create issue | `create_issue` | Log a bug or task |

**When to use:** Deploying code, reading repo files, syncing context.

**Active repos:** `antigravity-context`, `outreach-analytics-dashboard`

---

## 3. AgentMemory Vector DB (`agentmemory`)

**Connects to:** Local vector database running at `http://localhost:3113`

| Operation | Tool Name | What it does |
|---|---|---|
| Save memory | `memory_save` | Store a note, fact, or session summary |
| Recall memory | `memory_recall` | Retrieve stored memories by topic |
| Smart search | `memory_smart_search` | Semantic search across all stored memories |
| List sessions | `memory_sessions` | List all previous memory sessions |

**When to use:** Storing key decisions, recalling past work context, cross-session continuity.

**Trigger phrase for PC:** *"Save this to agentmemory: [note]"* or *"Search agentmemory for [topic]"*

---

## 4. Composio (`composio`)

**Connects to:** 250+ SaaS platforms including Slack, Gmail, HubSpot, Shopify, Notion, Linear, and more

| Operation | Tool Name | What it does |
|---|---|---|
| Search tools | `COMPOSIO_SEARCH_TOOLS` | Find available integrations by keyword |
| Get tool schema | `COMPOSIO_GET_TOOL_SCHEMAS` | Read the input/output schema for any tool |
| Execute tool | `COMPOSIO_MULTI_EXECUTE_TOOL` | Run any Composio-connected app action |
| Manage connections | `COMPOSIO_MANAGE_CONNECTIONS` | Connect/disconnect apps |
| Remote bash | `COMPOSIO_REMOTE_BASH_TOOL` | Run shell commands on remote environments |

**When to use:** Cross-platform integrations that aren't covered by native MCPs. Especially useful for Shopify, Slack, or HubSpot operations.

**Trigger phrase for PC:** *"Use Composio to search for Shopify tools"*

---

## 5. Notion (`notion-mcp-server`)

**Connects to:** Notion workspace pages, databases, and blocks

| Operation | Tool Name | What it does |
|---|---|---|
| Read page | `API-retrieve-a-page` | Get content of a Notion page |
| Create page | `API-post-page` | Add a new page to a database |
| Query database | `API-query-data-source` | Search records in a Notion DB |
| Update block | `API-update-a-block` | Edit a specific block in a page |

**When to use:** Reading CRM documentation, adding task notes, or querying project databases stored in Notion.

---

## 6. StitchMCP (`StitchMCP`)

**Connects to:** Remote workspace layout and screen generation service

| Operation | Tool Name | What it does |
|---|---|---|
| Generate screen | `generate_screen_from_text` | Create UI screen from text prompt |
| Get project | `get_project` | Read a Stitch project |
| List screens | `list_screens` | List all screens in a project |

**When to use:** Generating UI mockups or layouts from text descriptions.
