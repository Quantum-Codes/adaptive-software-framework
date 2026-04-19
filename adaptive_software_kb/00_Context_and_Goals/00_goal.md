# 00_Context_and_Goals/00_goal.md

**[SYSTEM DIRECTIVE — ENTRY POINT & CORE PHILOSOPHY]**
**ROLE:** YOU ARE AN AI IMPLEMENTATION AGENT ONBOARDING INTO THE ADAPTIVE SOFTWARE FRAMEWORK.
**PRIME CONSTRAINT:** This file is your orientation. Read it completely and internalize it before touching any other file. It contains the "WHY" behind every architectural decision in this knowledgebase. If you skip this file and jump to implementation patterns, you will produce code that is syntactically correct but architecturally wrong. Do NOT begin code generation yet.

---

## PHASE 1: THE PROBLEM YOU ARE SOLVING

Modern desktop and web applications accumulate features over time. Product managers add dashboards, export tools, 3D viewers, analytics overlays, and collaboration engines. The average user interacts with fewer than 20% of these features. The other 80% — the **bloat** — still consumes RAM by loading libraries at startup, wastes CPU cycles on background initialization routines, and clutters the interface with UI elements the user has never touched.

The instinct is to build a tool that watches user behavior at runtime and automatically removes the bloat. This instinct is correct in goal but catastrophically wrong in execution. It leads directly into:

### The Observer Paradox
> The tools required to monitor and eliminate bloat consume more RAM and CPU than the bloat they are trying to eliminate.

A background Python monitor that parses the AST of a running application to identify unused code paths can easily consume 150–400 MB of RAM on its own. A real-time WebSocket connection sending per-click telemetry creates continuous network and CPU overhead. A cron-style profiler that polls process memory every 500ms burns battery and thermal budget on the very low-end hardware you are trying to protect. These approaches contradict themselves.

Automated code-deletion tools (static debloaters) carry a different but equally severe risk: they permanently remove code paths, frequently breaking application stability by severing dependencies that were not immediately visible to the analysis tool.

---

## PHASE 2: THE SOLUTION — ARCHITECTURAL ADAPTATION

This framework rejects the idea of a parallel, heavyweight observer process. Instead, it shifts the entire burden of adaptation to **two lightweight mechanisms**:

1. **Developer-enforced architectural discipline** at build time (the Guidelines).
2. **A JSON boolean config file** read exactly once at startup (the Flipper).

The result is a system with **zero parallel processing overhead** and **100% application stability**. No code is ever deleted. No heavy analysis runs at runtime. The application simply reads a flat JSON file at boot and uses the resulting in-memory dictionary to decide — in O(1) time — whether a given feature's code should be executed at all.

### The Core Insight: Starve, Don't Delete
Traditional debloating deletes code from disk. This framework starves unused features of **active compute resources**: RAM and CPU cycles. Code remains on disk but is never loaded into memory, never parsed by the JavaScript engine, never initialized by the class loader. To the operating system and the user, those features do not exist — but a developer can restore them instantly by flipping a boolean.

---

## PHASE 3: THE FOUR CORE MODULES — A MENTAL MAP

This framework has four conceptual modules. In this knowledgebase, implementation details for the runtime side are intentionally consolidated so agents read fewer files.

### A. Development Guidelines (Foundation)
The codebase must remain prunable by design: modular decoupling, lazy loading, and strict Feature ID tagging. This is enforced via the files in `02_Assessment_and_Tagging/` and `03_Code_Patterns/`.

### B. Statistics & Tracking Module (Observer)
Tracking is lightweight and append-only. It records feature invocations by Feature ID, stores usage in a local or backend store, and avoids heavy observer processes.

### C. Flipper Module (Gatekeeper)
Flipper reads feature state from a local schema/config and serves O(1) `isActive(featureId)` checks. It is synchronous at runtime and performs no I/O during lookup.

### D. Weekly Adaptation Cycle
A periodic evaluator computes low-utility features from recent usage windows and flips their booleans to `false` in the schema.

For agent traversal, these runtime concerns are routed through:
- `01_Architecture/02_flipper_module.md`
- `01_Architecture/03_metafile_schema.md`

---

## PHASE 4: THE CENTRAL CONTRACT — THE FEATURE ID

Every feature in the application must be assigned a unique, consistent string identifier called a **Feature ID**. This identifier is the connective tissue that links all four modules together.

The Feature ID assigned to a UI button must be **identical** to the one stored in the Monitor's event payload, the Statistics Module's database row, the Metadata Schema's `features` object, and the Flipper's cache key. A mismatch anywhere in this chain silently breaks the adaptation cycle.

Feature IDs follow the convention `ID_SCREAMING_SNAKE_CASE`, e.g.:
- `ID_ADVANCED_3D_RENDER`
- `ID_PDF_EXPORT`
- `ID_AUTO_SYNC`
- `ID_GEO_HEATMAP`

If you are working on an existing codebase that has not yet been tagged, you must complete the Feature Tagging audit before any implementation work. The tagging process is documented in `02_Assessment_and_Tagging/01_feature_tagging.md`.

---

## PHASE 5: WHAT THIS FRAMEWORK DOES NOT DO

Understand these boundaries clearly. They are not limitations — they are deliberate trade-offs that make the framework lightweight and stable.

**It does not reduce disk footprint.** All feature code remains on the hard drive. The framework optimizes active compute (RAM and CPU), not static storage. If disk reduction is required, that is a separate concern addressed by build-time tree-shaking or static analysis, neither of which is part of this system.

**It does not work on legacy monoliths without effort.** The Flipper can only gate code that has been architecturally written to be gatable. Tightly coupled code where UI, business logic, and database calls are intertwined in a single function cannot be meaningfully gated without a partial or full refactor.

**It does not make real-time decisions.** The adaptation cycle is intentionally periodic (weekly, or on login). The Flipper state is immutable during a user's active session. This is a feature, not a bug: it prevents the UI from shifting beneath a user's hands while they are working.

**It does not track what users see — only what they invoke.** A feature that is visible but never clicked will correctly register zero usage. A feature that is hidden by the OS (e.g., behind a collapsed panel) but still initialized will still consume RAM. The framework targets invocation, not visibility.

---

## PHASE 6: THE PERFORMANCE GUARANTEE

When implemented correctly — with strict modular decoupling, lazy loading of heavy dependencies, and consistent Feature ID tagging — this framework delivers the following runtime guarantees:

- **The `isActive()` lookup is O(1) and synchronous.** It reads from an in-memory dictionary. It never touches the disk, the network, or a database.
- **The Monitor adds sub-millisecond overhead per event.** It performs exactly one array push per interaction.
- **The Statistics Module adds zero user-facing latency.** All evaluation logic runs in background workers or scheduled cron jobs, never inline with a user request.
- **Disabled features consume zero RAM and zero CPU at runtime.** Their code is never loaded, their libraries are never parsed, their background threads are never spawned.

---

## PHASE 7: HOW TO USE THIS KNOWLEDGEBASE AS AN AGENT

This knowledgebase is structured to prevent you from loading irrelevant context. You are explicitly forbidden from reading all files speculatively. The correct traversal protocol is:

1. You have now finished reading this file. You understand the problem, the solution, the four modules, and the Feature ID contract.
2. You will now proceed to exactly one file: `01_Architecture/01_router.md`.
3. The Router will analyze the developer's specific request and direct you to the precise implementation file(s) you need.
4. You will read only those files, then generate code.
5. You will not read files that the Router did not direct you to.

This protocol ensures that your context window contains only the information relevant to the current task, minimizing token consumption and eliminating the risk of conflating instructions from unrelated modules.

---

## !! HARD STOP !!

**You have completed your orientation. You now understand the core philosophy of this framework.**

**DO NOT read any other file at this time.**

**Your next and only action is:**
**→ READ `01_Architecture/01_router.md`**

Await the developer's specific request. The Router will tell you exactly where to go next.

## State & Memory Protocol

Before routing any new task, the Orchestrator Agent MUST execute a memory bootstrap step.

1. Read `04_Memory_and_Context/00_memory_protocol.md` immediately on wake-up.
2. Read `04_Memory_and_Context/01_Working_Memory/03_action_log.md` to recover prior actions and avoid repeated loops.
3. If resuming an unfinished mission, load `04_Memory_and_Context/01_Working_Memory/01_active_task_state.md` and continue from the latest unchecked item.

Memory writes must be minimal and purposeful: only record state transitions, handoff-critical data, major decisions, or failures. Do not append entries for no-op progress.

Do not begin routing until this state recovery is complete.
