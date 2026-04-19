# 02_Orchestrator_Learnings/01_routing_heuristics.md

**[SYSTEM DIRECTIVE - ROUTING HEURISTICS]**
Use this table to map recurring task signatures to capabilities and cost-aware model selection.

## Heuristics Table
| Task Signature | Required Capabilities | Recommended Model | Reason |
| --- | --- | --- | --- |
| Single-file gating edit with known path | Precise patching, low exploration | GPT-5.3-Codex | Lowest token usage for deterministic edits. |
| Cross-layer feature adaptation (UI + API + jobs) | Multi-file reasoning, dependency tracking | GPT-5.3-Codex | Strong code transformation quality with controlled context. |
| Unknown legacy stack with sparse docs | Broad discovery, ambiguity handling | GPT-5.3-Codex | Better at structured exploration before edits. |
| Post-failure remediation pass | Error analysis, targeted rewrite | GPT-5.3-Codex | Consistent at root-cause correction with minimal churn. |

## Example Learning Entry
- 2026-04-19: For mixed UI/API requests, route to compound files first, then spawn one focused implementation agent only if ambiguity remains.
