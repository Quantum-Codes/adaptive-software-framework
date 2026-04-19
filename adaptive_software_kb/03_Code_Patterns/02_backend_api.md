# 03_Code_Patterns/02_backend_api.md

**[SYSTEM DIRECTIVE - BACKEND API GATING]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR API AND CONTROLLER EXECUTION GATING.
**PRIME CONSTRAINT:** Disabled features must incur near-zero compute cost. Gate before heavy logic, before heavy queries, and before heavy imports.

---

## PHASE 1: THE 7 BACKEND GATING PATTERNS

### Core Principle
All feature-dependent backend logic MUST begin with `Flipper.isActive(Feature_ID)`.

No heavy computation, DB join, external API call, or dynamic import runs before this check.

### Pattern 1: Route-Level Gating
Use when an entire endpoint is feature-owned.

```js
app.get("/export/pdf", async (req, res) => {
    if (!Flipper.isActive("ID_EXPORT_PDF")) {
        return res.status(403).json({ error: "Feature disabled" });
    }
    const result = await generatePDF(req.body);
    return res.json(result);
});
```

### Pattern 2: Inline Logic Gating
Use when only part of a route is heavy/optional.

```js
app.get("/dashboard", async (req, res) => {
    const basicData = await getBasicData();
    let analytics = null;

    if (Flipper.isActive("ID_ANALYTICS")) {
        analytics = await computeAnalytics();
    }

    return res.json({ basicData, analytics });
});
```

### Pattern 3: Query Fragmentation Handoff
Split joins and projections by Feature ID.

```js
let user;
if (Flipper.isActive("ID_PROFILE_PIC")) {
    user = await db.query(`
        SELECT u.*, p.image
        FROM users u
        LEFT JOIN profile_pics p ON u.id = p.user_id
    `);
} else {
    user = await db.query(`SELECT u.* FROM users u`);
}
```

For deeper DB fragmentation patterns, route to `03_Code_Patterns/06_db_query_logic.md`.

### Pattern 4: Lazy Heavy Imports
Import large dependencies only after gate.

```js
if (Flipper.isActive("ID_REPORTS")) {
    const reportEngine = await import("heavy-report-lib");
    await reportEngine.generate();
}
```

### Pattern 5: External Service Call Gating

```js
if (Flipper.isActive("ID_THIRD_PARTY_SYNC")) {
    await syncWithExternalService();
}
```

### Pattern 6: Response Shaping

```js
const response = { name: user.name };
if (Flipper.isActive("ID_ADVANCED_PROFILE")) {
    response.details = await getAdvancedDetails();
}
return res.json(response);
```

### Pattern 7: Early Exit Optimization

```js
if (!Flipper.isActive("ID_HEAVY_FEATURE")) {
    return res.json({ message: "Feature disabled" });
}
```

---

## PHASE 2: STRICT ANTI-PATTERNS

- Running heavy logic before Feature ID checks
- Top-level heavy imports for optional features
- Monolithic queries ignoring feature state
- Triggering workers from API paths without gates
- Inconsistent Feature ID names across UI/API/schema

---

## PHASE 3: AGENT OUTPUT REQUIREMENTS

When implementing API adaptation, output MUST include:
1. Architecture choice: route-level, inline, or mixed gating.
2. Gated controller implementation with explicit Flipper checks.
3. Query/import/service-call gating where applicable.
4. Early-exit behavior and disabled-feature response contract.

---

## PHASE 4: EXECUTION

1. Identify endpoint ownership by Feature ID.
2. Insert guard at earliest safe boundary.
3. Fragment heavy internals behind conditional blocks.
4. Verify anti-patterns are removed.
5. Return complete implementation with deterministic behavior.