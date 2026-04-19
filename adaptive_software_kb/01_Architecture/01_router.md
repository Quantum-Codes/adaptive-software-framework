# 01_Architecture/01_router.md

**[SYSTEM DIRECTIVE - ROOT ORCHESTRATOR]**
**ROLE:** YOU ARE THE KNOWLEDGEBASE ROUTER.
**PRIME CONSTRAINT:** Minimize token usage. Read only what is required for the user's task. Do not ingest the full knowledgebase.

---

## PHASE 0: MEMORY BOOTSTRAP (MANDATORY)

Before classifying any request, load state in this exact order:
1. READ: `04_Memory_and_Context/00_memory_protocol.md`
2. READ: `04_Memory_and_Context/01_Working_Memory/03_action_log.md`
3. If an unfinished flow exists, READ: `04_Memory_and_Context/01_Working_Memory/01_active_task_state.md`

Do not route until state recovery is complete.

---

## PHASE 1: REQUEST CLASSIFICATION

Classify the user's request into one of four categories:
1. Core adaptation infrastructure setup.
2. Codebase assessment and Feature ID assignment.
3. Frontend/client runtime optimization.
4. Backend/data/worker optimization.

---

## PHASE 2: ROUTING MATRIX

### Category A: Core Infrastructure
Trigger keywords: setup, flipper, config, tracking, weekly cycle, schema.

- If the task is runtime gating, tracking flow, or adaptation cycle logic:
  -> READ: `01_Architecture/02_flipper_module.md`
- If the task is schema design, config persistence, or strict data shape:
  -> READ: `01_Architecture/03_metafile_schema.md`

### Category B: Assessment and Tagging
Trigger keywords: audit, feature IDs, tagging, map codebase.

- For feature discovery and ID assignment:
  -> READ: `02_Assessment_and_Tagging/01_feature_tagging.md`

### Category C: Frontend and Client
Trigger keywords: ui, dom, component visibility, assets, imports, leaks.

- UI visibility and component gating:
  -> READ: `03_Code_Patterns/01_frontend_dom.md`
- Asset loading and preload control:
  -> READ: `03_Code_Patterns/05_asset_manager.md`
- Heavy package import gating:
  -> READ: `03_Code_Patterns/07_package_imports.md`
- Post-removal cleanup and leak control:
  -> READ: `03_Code_Patterns/08_memory_cleanup.md`

### Category D: Backend, Data, and Jobs
Trigger keywords: api, endpoint, sql, join, cron, worker, middleware.

- API/controller execution gating:
  -> READ: `03_Code_Patterns/02_backend_api.md`
- Background jobs, polling, workers:
  -> READ: `03_Code_Patterns/03_background_jobs.md`
- Route suite and request-level controls:
  -> READ: `03_Code_Patterns/04_middleware.md`
- Query fragmentation and DB optimization:
  -> READ: `03_Code_Patterns/06_db_query_logic.md`

### Category E: Memory and Orchestration State
Trigger keywords: handoff, resume, memory protocol, action log, scratchpad, routing heuristics, error ledger, codebase map.

- Protocol and memory write constraints:
  -> READ: `04_Memory_and_Context/00_memory_protocol.md`
- Current mission status and handoff state:
  -> READ: `04_Memory_and_Context/01_Working_Memory/01_active_task_state.md`
- Raw handoff payloads and extracted artifacts:
  -> READ: `04_Memory_and_Context/01_Working_Memory/02_inter_agent_scratchpad.md`
- Prior actions and outcomes:
  -> READ: `04_Memory_and_Context/01_Working_Memory/03_action_log.md`
- Long-term orchestrator routing intelligence:
  -> READ: `04_Memory_and_Context/02_Orchestrator_Learnings/01_routing_heuristics.md`
- Long-term subagent learnings and failures:
  -> READ: `04_Memory_and_Context/03_Subagent_Learnings/01_codebase_quirks.md`
  -> READ: `04_Memory_and_Context/03_Subagent_Learnings/02_error_ledger.md`
  -> READ: `04_Memory_and_Context/03_Subagent_Learnings/03_codebase_map.md`

---

## PHASE 3: COMPOUND TASK ROUTES

For full-feature adaptation requests, route to combined files:
- Full UI adaptation:
  -> `03_Code_Patterns/01_frontend_dom.md` + `03_Code_Patterns/08_memory_cleanup.md`
- Full data/compute adaptation:
  -> `03_Code_Patterns/02_backend_api.md` + `03_Code_Patterns/06_db_query_logic.md` + `03_Code_Patterns/03_background_jobs.md`
- Heavy frontend adaptation:
  -> `03_Code_Patterns/01_frontend_dom.md` + `03_Code_Patterns/05_asset_manager.md` + `03_Code_Patterns/07_package_imports.md`

---

## PHASE 4: EXECUTION PROTOCOL

1. Output the minimal set of required files.
2. Load only those files.
3. Implement only after those files are ingested.
4. Do not scan unrelated files.
5. Append outcomes to `04_Memory_and_Context/01_Working_Memory/03_action_log.md`.
6. Update `04_Memory_and_Context/01_Working_Memory/01_active_task_state.md` before handoff.

## PHASE 5: SUBAGENT SPAWNING POLICY

If a subagent is used, enforce all of the following:
1. Spawn only after routing selects the minimal file set.
2. Pass the Project Context Summary and only routed file content/summaries.
3. Do not allow recursive subagent fan-out unless explicitly requested by the user.
4. Prefer one focused subagent task per request domain (UI, API, DB, or jobs).
5. If confidence is low, ask one clarification instead of spawning multiple broad searches.