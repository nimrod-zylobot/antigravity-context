# 🔌 Mapped Model Context Protocol (MCP) Servers

These are the active integrations configured in Nimrod's PC environment. 

---

### 1. Google Workspace (`google-workspace`)
* **What it does:** Connects directly to Google Calendars, Sheets, Drive, Gmail, Docs, Meet, and Tasks.
* **Core Operations:**
  - Gmail: `search`, `read`, `send`, `reply`, `getThread`
  - Sheets: `getValues`, `updateValues`, `append`, `create`
  - Drive: `search`, `upload`, `download`, `share`
* **Use Cases:** Researching lead logs, sending cold emails directly via Nimrod's address, updating sheet cells.
* **Triggering:** Ask Nimrod's PC agent to run sheet/gmail scripts or perform workspace search operations.

### 2. GitHub Client (`github`)
* **What it does:** Syncs code repos, registers branches, pushes code, and tracks PRs.
* **Core Operations:** `push_files`, `create_repository`, `create_or_update_file`, `list_commits`
* **Use Cases:** Managing code deployments and updating the active context repository.
* **Triggering:** Ask Nimrod's PC agent to push updates or create new repositories.

### 3. AgentMemory Vector DB (`agentmemory`)
* **What it does:** Interface for the local vector database (`iii-engine`) running at `http://localhost:3113`.
* **Core Operations:** `memory_recall`, `memory_save`, `memory_smart_search`
* **Use Cases:** Searching conversation logs, storing key notes, and checking historical metrics.
* **Triggering:** Ask Nimrod's PC agent to query local database memory.

### 4. Stitch (`StitchMCP`)
* **What it does:** Remote workspace client.
* **Core Operations:** `get_project`, `list_screens`, `generate_screen_from_text`
* **Use Cases:** Dynamic layout generation.

### 5. Notion (`notion-mcp-server`)
* **What it does:** Integration to read/write Notion blocks, databases, and pages.
* **Core Operations:** `API-retrieve-a-database`, `API-post-page`
* **Use Cases:** Documenting CRM task details.
