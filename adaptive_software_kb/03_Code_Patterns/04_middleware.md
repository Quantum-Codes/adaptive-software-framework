# 03_Code_Patterns/04_middleware.md

**[SYSTEM DIRECTIVE - MIDDLEWARE GATING]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR REQUEST-LEVEL FEATURE CONTROL.
**PRIME CONSTRAINT:** Middleware must terminate disabled feature paths before business logic executes.

---

## PHASE 1: THE 7 MIDDLEWARE PATTERNS

### Pattern 1: Route-Level Access Middleware
```js
function requireFeature(featureId) {
    return (req, res, next) => {
        if (!Flipper.isActive(featureId)) {
            return res.status(403).json({ error: "Feature disabled" });
        }
        next();
    };
}
app.get("/premium/dashboard", requireFeature("ID_PREMIUM"), handler);
```

### Pattern 2: Feature Snapshot Injection
```js
app.use((req, _res, next) => {
    req.features = Flipper.getAllFlags();
    next();
});
```

### Pattern 3: Optional Middleware Wrapper
```js
function optionalFeature(featureId, middleware) {
    return (req, res, next) => {
        if (!Flipper.isActive(featureId)) return next();
        return middleware(req, res, next);
    };
}
```

### Pattern 4: Route Group Registration Gating
```js
if (Flipper.isActive("ID_ADMIN_PANEL")) {
    app.use("/admin", adminRoutes);
}
```

### Pattern 5: Feature Header Injection (Optional)
```js
app.use((req, res, next) => {
    res.setHeader("X-Feature-Flags", JSON.stringify(Flipper.getAllFlags()));
    next();
});
```

### Pattern 6: Lightweight Usage Tracking Hook
```js
function trackFeature(featureId) {
    return (req, res, next) => {
        Stats.increment(featureId);
        next();
    };
}
```

### Pattern 7: Early Termination
```js
function blockIfDisabled(featureId) {
    return (req, res, next) => {
        if (!Flipper.isActive(featureId)) {
            return res.status(404).json({ error: "Not available" });
        }
        next();
    };
}
```

---

## PHASE 2: STRICT ANTI-PATTERNS

- Heavy computation inside middleware.
- Repeated deep-layer feature checks when middleware already enforces route access.
- Mixing domain business logic in middleware layer.
- Registering feature-owned routes unconditionally.
- Missing Feature ID mapping per protected route.

---

## PHASE 3: AGENT OUTPUT REQUIREMENTS

When implementing middleware adaptation, output MUST include:
1. Middleware architecture choice (route-level, optional, group-level).
2. Concrete middleware implementation with Feature ID checks.
3. Early termination path and response contract.
4. Optional tracking or feature-header integration only if requested.

---

## PHASE 4: EXECUTION

1. Identify route ownership by Feature ID.
2. Place middleware before business handlers.
3. Confirm disabled routes terminate early.
4. Validate no anti-patterns remain.