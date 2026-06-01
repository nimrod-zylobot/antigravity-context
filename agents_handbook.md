# 🤖 Antigravity Subagents Handbook

This document serves as the guide for the specialized autonomous agents and subagents available in Nimrod's PC environment. 

Claude can refer to this handbook to decide when to delegate tasks, how to structure prompt boundaries, and when to request Nimrod to launch specific agents locally on his PC.

---

## 1. Native Platform Subagents
These are built-in subagents supported directly by the Antigravity engine. They are invoked using the `invoke_subagent` tool.

### 🔍 Research Agent (`research`)
* **Role:** Read-only Codebase Researcher.
* **Capabilities:** Equipped with read-only tools to list directories, search files, read url contents, and search the web. It cannot run commands or edit files.
* **When to use:** Delegate to this agent when you need to research wide API behaviors, read long logs, or browse files without modifying the system state, allowing the main agent to keep working in parallel.
* **How to trigger (PC prompt):** 
  *"Invoke research subagent to search the workspace for Klaviyo integration patterns and document findings."*

### ⚙️ Self-Mirror Agent (`self`)
* **Role:** Inherits the parent agent's full system prompt, model configurations, and tool permissions (read, write, execute commands, MCP access).
* **Capabilities:** Full-stack coding and system automation.
* **When to use:** Use when you need to run a complex, multi-step execution task in a separate conversation context to prevent cluttering the main active session history.
* **How to trigger (PC prompt):** 
  *"Invoke self subagent to refactor verify_email.js logic using TDD."*

---

## 2. Superpowers Engineering Agents
These are role-specific agent templates loaded from the `superpowers` plugin. They enforce engineering-grade code quality by running sequentially on task execution checklists.

```
                  ┌─────────────────────────┐
                  │ 1. Implementer Agent     │
                  └────────────┬────────────┘
                               │ (done)
                               ▼
                  ┌─────────────────────────┐
                  │ 2. Spec Reviewer Agent  │
                  └────────────┬────────────┘
                               │ (spec checks out)
                               ▼
                  ┌─────────────────────────┐
                  │ 3. Code Quality Agent   │
                  └─────────────────────────┘
```

### 💻 Implementer Agent (`implementer`)
* **Role:** Task Execution Engineer.
* **Directives:** Writes complete, production-grade code. Enforces strict Test-Driven Development (TDD) cycles (Red-Green-Refactor).
* **Model Strategy:** Uses fast, cheap models (like Gemini 3.5 Flash) for mechanical, 1-2 file edits. Uses advanced models for complex, multi-file integration tasks.

### 📐 Spec Reviewer Agent (`spec-reviewer`)
* **Role:** Requirement Validator.
* **Directives:** Reviews the implementer's commits. Validates if the implementation matches 100% of the spec requirements (no under-building, and strictly no over-building/adding unrequested features).

### 🔍 Code Quality Reviewer (`code-quality-reviewer`)
* **Role:** Code Quality Auditor.
* **Directives:** Evaluates formatting, design patterns, testing coverage, safety concerns, and potential performance leaks. Proposes edits to clean up code before final branch merge.

---

## 💡 Claude Mobile Handoff Guide
If you are chatting with Claude on your phone, Claude cannot execute these PC agents directly. 

Instead, Claude should write a **Handoff Command** for you to copy-paste into your PC chat:

* **Example Handoff:**
  > *"Nimrod, please run this prompt on your PC: 'Invoke a research subagent to parse the recent email logs in outreach_tracker.csv and locate the bounced domains.'"*
