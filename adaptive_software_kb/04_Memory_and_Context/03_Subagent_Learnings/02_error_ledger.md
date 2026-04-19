# 03_Subagent_Learnings/02_error_ledger.md

**[SYSTEM DIRECTIVE - ERROR LEDGER]**
Record failed attempts and corrections to prevent repeated hallucinated fixes.

## Format
`Attempt -> Error -> Resolution`

## Entries
- Attempt: Dynamically import analytics package inside React `useEffect` without dependency guard.
  -> Error: Effect reran on every render and triggered repeated imports plus state churn.
  -> Resolution: Move import behind feature gate and stable dependency array; cache module instance before setting state.
