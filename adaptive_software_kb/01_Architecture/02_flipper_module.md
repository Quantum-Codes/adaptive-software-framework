# 01_Architecture/02_flipper_module.md

**[SYSTEM DIRECTIVE - FLIPPER + TRACKING ORCHESTRATION]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR RUNTIME GATING, LIGHTWEIGHT TRACKING, AND THE WEEKLY ADAPTATION CYCLE.
**PRIME CONSTRAINT:** Prevent the Observer Paradox. Runtime checks must stay O(1), tracking overhead must remain sub-millisecond, and adaptation decisions must run asynchronously.

---

## PHASE 1: CORE RESPONSIBILITIES

This module defines the runtime contract for three coordinated concerns:
- Flipper runtime gatekeeping (`isActive(featureId)`)
- Lightweight feature usage tracking (event ingestion model)
- Weekly adaptation cycle (threshold-based config mutation)

### Non-negotiable rules
- `isActive(featureId)` must be synchronous and O(1)
- No disk/network/database I/O inside runtime feature checks
- Tracking must be append-only and batched
- Adaptation evaluation must run out-of-band (cron/background/login hook), never inline with user requests

---

## PHASE 2: FLIPPER RUNTIME API

### Required API
- `init(schema)`: Load the feature state once at startup.
- `isActive(featureId): boolean`: Return flag state in O(1).
- `getAllFlags()`: Read-only snapshot for diagnostics and hidden-feature UI.
- `overrideFlag(featureId, state)`: Immediate local override for manual restores.

### Reference implementation shape
```ts
class FlipperEngine {
  private flags: Record<string, boolean> = {};
  private initialized = false;

  init(schema: { features: Record<string, boolean> }) {
    this.flags = schema.features ?? {};
    this.initialized = true;
  }

  isActive(featureId: string): boolean {
    if (!this.initialized) return true;
    if (this.flags[featureId] === undefined) return true;
    return this.flags[featureId];
  }
}
```

Failsafe behavior: unknown IDs default to `true` to preserve stability.

---

## PHASE 3: TRACKING CONTRACT (LIGHTWEIGHT)

Tracking captures feature invocation events only.

### Minimal event payload
```json
{ "f_id": "ID_EXPORT_PDF", "ts": 1712534400000 }
```

### Batching rules
- Push events into an in-memory queue.
- Flush on timer or lifecycle transitions.
- Ingestion endpoint/worker performs atomic upsert increments per time bucket.

### Prohibited
- No heavy observers, AST parsers, or runtime profilers.
- No per-click synchronous writes on UI thread.

---

## PHASE 4: WEEKLY ADAPTATION CYCLE

Run periodically (for example weekly or every 7th boot):
1. Aggregate per-feature usage in rolling 14-day window.
2. Compare usage against threshold.
3. Keep `lockedFeatures` untouched.
4. Set low-utility feature flags to `false` in schema.
5. Persist schema atomically.

### Evaluator pseudocode
```python
def run_adaptation_cycle(user_id):
    schema = read_metafile_schema(user_id)
    recent = query_usage_14d(user_id)

    for feature_id in schema["features"].keys():
        if feature_id in schema["lockedFeatures"]:
            continue
        schema["features"][feature_id] = recent.get(feature_id, 0) >= 3

    schema["lastEvaluated"] = now_iso8601()
    write_metafile_schema(user_id, schema)
```

---

## PHASE 5: ANTI-PATTERNS (STRICT)

- Async or I/O-bound `isActive()`
- Runtime monitoring daemons that exceed feature savings
- Evaluating thresholds inside ingestion handlers
- Writing usage stats into the feature schema document
- Mid-request mutation of flipper state without explicit override path

---

## PHASE 6: AGENT OUTPUT REQUIREMENTS

When implementing for a real stack, output must include:
1. Flipper core with O(1) synchronous lookup.
2. Startup initialization flow (`read schema -> init flipper -> mount app`).
3. Tracking ingestion/batching strategy and payload shape.
4. Weekly evaluator function and schedule hook.
5. Failsafe behavior for missing IDs and malformed schema.
