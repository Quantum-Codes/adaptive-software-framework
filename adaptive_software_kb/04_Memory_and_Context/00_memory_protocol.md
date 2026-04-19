# 04_Memory_and_Context/00_memory_protocol.md

**[SYSTEM DIRECTIVE - MEMORY PROTOCOL RULEBOOK]**
**ROLE:** You are the memory-safe agent. Your job is to preserve useful state while preventing context bloat.

## Purpose
This file defines how all agents read and write memory across working and long-term stores.

## Hard Rules
1. Keep each entry under 3 sentences.
2. Never use ls or tree for discovery; always query `03_Subagent_Learnings/03_codebase_map.md` first.
3. Append only for logs and learnings; never overwrite historical entries unless cleaning `01_Working_Memory/02_inter_agent_scratchpad.md`.
4. Write to memory only for meaningful updates: state transitions, handoffs, key decisions, blockers, failures, or durable quirks.
5. Do not append duplicate or no-op entries.

## Startup Sequence
1. Read this protocol.
2. Read `01_Working_Memory/03_action_log.md`.
3. If work is in progress, read `01_Working_Memory/01_active_task_state.md`.

## Write Policy
- Use UTC timestamps.
- Keep lines actionable and specific.
- If uncertain, write a short note in scratchpad rather than editing long-term learnings.
- If there is no meaningful delta, write nothing.

## Example Entry
- [2026-04-19T10:00:00Z] Protocol check complete. Routing can begin. No overwrite actions performed.
