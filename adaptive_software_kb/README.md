# Adaptive Software Agentic Knowledgebase Framework

## 1. Abstract & Overview
Modern software often suffers from feature bloat, degrading performance on resource-constrained hardware. Traditional solutions rely on parallel monitoring processes (Observer tools) that paradoxically consume more CPU/RAM than the bloat they attempt to manage. Also a general tool to debloat all kinds of software simply doesnt cut it. Different software may need different custom patterns to adapt.

This project proposes a **Developer-Driven Adaptive Architecture** managed by an **Autonomous LLM Agent Framework**. Instead of runtime monitoring, the software is built to be intrinsically adaptive via lightweight Feature Flags (The Flipper Module) and batched usage statistics.  This way we can provide inbuilt adaptability with zero runtime overhead, while maintaining 100% stability and instant reversibility, CUSTOMIZED to the specific software's architecture and bottlenecks.

To automate the complex refactoring required for this architecture, we designed an **Agent-Optimized Knowledgebase** utilizing the **Model Workspace Protocol (MWP)** and **Interpretable Context Methodology (ICM)**. This framework allows Large Language Models (LLMs) to implement architectural changes autonomously while guaranteeing O(1) context scaling and near-zero token waste.

---

## 2. How the Framework Saves Tokens
Typical LLM coding agents rely on Retrieval-Augmented Generation (RAG) or massive context windows, leading to severe token waste, hallucination, and overlapping file reads. We solve this via:

1. **Numbered, Sequential Filesystem (MWP):** The knowledgebase is not a flat wiki. It is a deterministic pipeline (`00_Context`, `01_Architecture`, `03_Code_Patterns`). Agents only ingest the specific phase they are working on.
2. **Explicit Routing:** A central `01_router.md` acts as a traffic cop. If an agent is optimizing a UI component, it is explicitly forbidden from loading the knowledgebase files for Backend APIs or Database optimization.
3. **No-Overlap Codebase Scanning:** The system eliminates recursive directory searching (`ls`, `tree`) by maintaining a living Spatial Memory map. 

---

## 3. Multi-Agent Architecture & Execution Flow

To prevent token exhaustion, the system strictly separates the "Thinking" from the "Doing" via an Orchestrator-Subagent model.

### **The Orchestrator (The Manager)**
* **Role:** High-level planning, routing, and memory management.
* **Responsibilities:**
  * Reads the user's prompt and assesses the overarching goal.
  * Consults the `01_router.md` to identify which Knowledgebase Pattern applies.
  * Consults the `codebase_map.md` (Spatial Memory) to locate the exact target files.
  * **Crucial Token-Saving Step:** The Orchestrator does *not* read the source code deeply. It only identifies the file paths and spawns a Subagent, passing *only* the specific target files and the specific Knowledgebase Pattern file. 

### **The Subagents (The Executors)**
* **Role:** Scoped execution and implementation.
* **Responsibilities:**
  * Receives a highly restricted context window (e.g., `Nav.jsx` + `01_frontend_dom.md`).
  * Executes the refactoring (e.g., wrapping components in Feature Gates, stripping stray event listeners).
  * Reads shared memory bootstrap files before execution, and writes memory only when there is a meaningful new outcome (state transition, decision, blocker, or failure).
  * **Benefit:** Because the Orchestrator isolated the files, there are **no overlapping file reads**. Subagent A (UI) and Subagent B (Backend) never ingest each other's code files, saving thousands of tokens.

### **The Execution Flow**
1. **Initialize:** User requests adaptation (e.g., "Make the reporting dashboard adaptive").
2. **Assess State:** Orchestrator reads `action_log.md` and `active_task_state.md` to ensure it isn't repeating work.
3. **Map & Route:** Orchestrator queries `codebase_map.md` -> finds `ReportView.tsx` and `reportController.ts`. 
4. **Dispatch:** * Orchestrator spawns **UI_Agent** with `ReportView.tsx` + `01_frontend_dom.md`.
   * Orchestrator spawns **API_Agent** with `reportController.ts` + `02_backend_api.md`.
5. **Commit:** Subagents write the code, append one concise action-log entry only if outcome changed, and terminate. Orchestrator verifies and closes the task.

---

## 4. Stateful Memory Management (ICM)
Standard agents suffer from "Context Amnesia" or "Context Bloat." Our system implements a persistent, text-based memory file system (`04_Memory_and_Context/`). All agents interface with this memory based on strict permission protocols.

### **A. Working Memory (Short-Term)**
Wiped or archived when a task completes.
* **`active_task_state.md`:** The current checklist. (Read/Write by Orchestrator; Read by Subagents).
* **`inter_agent_scratchpad.md`:** Temporary data handoffs (e.g., UI Agent extracts a required API endpoint and leaves it here for the Backend Agent). Write only when structured data is needed for handoff. (Read/Write by all).
* **`action_log.md` (Episodic Memory):** An immutable ledger of completed milestones `[Timestamp | Agent | Action | Outcome]`. Prevents infinite loops and allows the Orchestrator to resume perfectly if the script crashes. Log only meaningful milestones; avoid no-op entries. (Write by Subagents; Read by Orchestrator).

### **B. Learned Meta-Context (Long-Term)**
Persists across the entire lifecycle of the software.
* **`codebase_map.md` (Spatial Memory):** An O(1) lookup table mapping `Feature_IDs` to exact file paths. Eliminates the need for agents to blindly search directories. (Read by Orchestrator; Updated by Subagents when files are created).
* **`codebase_quirks.md`:** Subagents record architectural deviations here (e.g., "Project uses a custom fetch wrapper, do not use Axios"). Prevents agents from applying generic Stack Overflow patterns to custom code.
* **`error_ledger.md`:** The "Burn Book." Subagents log failed attempts (e.g., "AST parser crashed on Vite chunking"). Prevents future subagents from hallucinating the exact same broken solution.
* **`routing_heuristics.md`:** The Orchestrator records which LLM models succeeded or failed at specific tasks, allowing it to dynamically route complex tasks to smarter models and simple tasks to cheaper models.

---

## 5. Architectural Features (The Adaptation Payload)
When the agents execute, they are building the following infrastructure into the target software:
1. **The Flipper Module:** A synchronous, O(1) logic gate that completely prevents unused components, packages, or background jobs from initializing.
2. **The Monitor Module:** A zero-overhead frontend listener that passively intercepts interactions with tagged `Feature_IDs`.
3. **The Statistics Module:** A backend/local worker that batches usage data and performs a "Weekly Flip"—evaluating usage against utility thresholds and dynamically turning off unused features to free up RAM/CPU.
4. **Deep Memory Cleanup:** Strict patterns ensuring that when a feature is toggled off mid-session, all active intervals, WebGL contexts, and stray event listeners are explicitly severed to allow Garbage Collection.