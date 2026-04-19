# 03_Code_Patterns/03_background_jobs.md

**[SYSTEM DIRECTIVE - BACKGROUND TASKS GATING]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR BACKGROUND PROCESSES.
**PRIME CONSTRAINT:** The Background Task Gating Pattern is mandatory. You must ensure zero CPU usage for disabled features, no unnecessary worker processes, and no idle polling loops.

---

## PHASE 1: THE 7 GATING PATTERNS

### Core Principle
All background tasks MUST be gated using:

`Flipper.isActive(Feature_ID)`

A background task MUST NOT initialize, execute, or consume resources unless explicitly enabled.

### Feature Identification Requirement
Every background task MUST have a unique `Feature_ID`.

Examples:
- `ID_EMAIL_SCHEDULER`
- `ID_DATA_SYNC`
- `ID_QUEUE_WORKER`
- `ID_POLLING_SERVICE`

### Pattern 1: Conditional Initialization (Startup Gating)
Problem: Background jobs start automatically on application boot.

Solution: Only initialize if feature is active.

```js
if (Flipper.isActive("ID_EMAIL_SCHEDULER")) {
    startEmailScheduler();
}
```

Outcome:
- Prevent unnecessary process/thread creation
- Save memory at startup

### Pattern 2: Cron Job Execution Gating
Problem: Cron schedulers run continuously even when feature is unused.

Solution: Gate execution inside scheduler.

```js
cron.schedule("* * * * *", async () => {
    if (!Flipper.isActive("ID_DATA_SYNC")) return;

    await syncData();
});
```

Outcome:
- Scheduler remains lightweight
- Execution cost becomes near zero when disabled

### Pattern 3: Worker Process Gating
Problem: Queue workers consume RAM and CPU even when idle.

Solution A: Conditional worker startup.

```js
if (Flipper.isActive("ID_QUEUE_WORKER")) {
    startWorker();
}
```

Solution B: Runtime gating inside worker loop.

```js
while (true) {
    if (!Flipper.isActive("ID_QUEUE_WORKER")) {
        await sleep(60000);
        continue;
    }

    await processQueue();
}
```

Outcome:
- Worker sleeps when disabled
- Prevents constant CPU usage

### Pattern 4: Polling Loop Optimization
Problem: Frequent polling wastes CPU cycles.

Solution: Gate polling logic.

```js
setInterval(async () => {
    if (!Flipper.isActive("ID_POLLING_SERVICE")) return;

    await checkUpdates();
}, 5000);
```

Outcome:
- Eliminate unnecessary execution cycles
- Reduce CPU usage significantly

### Pattern 5: Lazy Resource Initialization
Problem: Streams, connections, and engines consume memory even when unused.

Solution: Initialize only inside feature gate.

```js
if (Flipper.isActive("ID_STREAM_PROCESSOR")) {
    const stream = await initStream();
    stream.start();
}
```

Outcome:
- Avoid memory-heavy initialization for disabled features

### Pattern 6: Dynamic Shutdown (Adaptive Cycle Integration)
Problem: Feature may be disabled after startup (for example, during a weekly adaptation cycle).

Solution: Background tasks MUST support runtime shutdown.

```js
if (!Flipper.isActive("ID_CLEANUP_JOB")) {
    stopCleanupJob();
}
```

Requirement:
- All long-running jobs must periodically check Flipper state
- Tasks must terminate or sleep if disabled mid-session

### Pattern 7: Resource Cleanup
Problem: Disabling a feature without cleanup leads to memory leaks.

Solution: Explicit cleanup on disable.

```js
if (!Flipper.isActive("ID_STREAM_PROCESSOR")) {
    stream.close();
    clearInterval(pollingRef);
}
```

Outcome:
- Prevent dangling processes
- Ensure memory is freed

---

## PHASE 2: STRICT ANTI-PATTERNS

The following are strictly forbidden:
- Always-on cron jobs without gating
- Workers running without `Feature_ID` checks
- Infinite loops without Flipper checks
- Initializing background services unconditionally at startup
- Ignoring cleanup when disabling features

---

## PHASE 3: AGENT OUTPUT REQUIREMENTS

When the user asks to implement or optimize a background task, your output MUST include:
1. **Architecture Choice:** Identify which of the 7 patterns applies.
2. **Gated Implementation:** Show code with `Flipper.isActive()` checks.
3. **Teardown/Cleanup:** Show explicit shutdown and cleanup logic for mid-session disable scenarios (Pattern 6 and Pattern 7).

---

## PHASE 4: EXECUTION

1. Analyze the developer's background task and identify current runtime behavior.
2. Apply the relevant pattern(s) from Phase 1.
3. Verify no Phase 2 anti-patterns remain.
4. Return a complete implementation that satisfies all Phase 3 output requirements.

---

## Performance Guarantees

When implemented correctly:
- Disabled background tasks consume zero CPU
- No unnecessary threads/processes are spawned
- System battery and thermal efficiency improve
- Backend remains scalable on low-resource machines

## Integration Requirements

This pattern MUST integrate with:
- Flipper module (feature gating)
- Statistics module (optional task-usage tracking)
- Adaptation cycle (dynamic enable/disable)

## Final Rule

If a background task is associated with a `Feature_ID`, it MUST be gated at:
- Initialization
- Execution loop
- Resource lifecycle

No exceptions.