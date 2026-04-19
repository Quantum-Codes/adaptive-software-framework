# 03_Subagent_Learnings/01_codebase_quirks.md

**[SYSTEM DIRECTIVE - CODEBASE QUIRKS]**
Track non-standard architectural behavior discovered during implementation.

## Template
- [DATE] [DOMAIN] Observation
  - Impact:
  - Required Behavior:

## Entries
- [2026-04-19] ROUTING: This project uses a custom `apiClient.ts` wrapper. DO NOT use standard `fetch()`.
  - Impact: Direct fetch calls bypass shared interceptors and auth headers.
  - Required Behavior: Route all HTTP calls through the wrapper layer.
