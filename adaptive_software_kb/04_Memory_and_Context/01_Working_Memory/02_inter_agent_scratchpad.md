# 01_Working_Memory/02_inter_agent_scratchpad.md

**[SYSTEM DIRECTIVE - INTER-AGENT SCRATCHPAD]**
Use this file for temporary handoff data that should not be recomputed.

## Usage Rules
- Always use fenced code blocks for payloads.
- Prefix each payload with timestamp and source/target agent roles.
- Keep this file short; prune stale blocks after successful handoff.

## Example Payload
Source: UI Agent
Target: Backend Agent
Timestamp: 2026-04-19T10:12:00Z

```json
{
  "featureId": "ID_DASHBOARD_ADAPTIVE",
  "domElements": [
    "dashboard-chart-panel",
    "dashboard-advanced-filter",
    "dashboard-live-feed"
  ],
  "requestedBackendGuards": [
    "GET /api/dashboard/analytics",
    "GET /api/dashboard/live-feed"
  ]
}
```
