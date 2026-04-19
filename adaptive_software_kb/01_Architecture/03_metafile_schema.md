# 01_Architecture/03_metafile_schema.md

**[SYSTEM DIRECTIVE - METAFILE SCHEMA]**
**ROLE:** YOU ARE THE DATA CONTRACT AGENT FOR FEATURE FLAGS.
**PRIME CONSTRAINT:** The metafile schema must remain flat, strict, and fast to parse. It is the source of truth consumed by Flipper at startup.

---

## PHASE 1: SCHEMA CONTRACT

The runtime-loaded structure must match:

```json
{
  "schemaVersion": "1.0",
  "userId": "uuid-or-local-id",
  "lastEvaluated": "2026-04-19T02:00:00Z",
  "lockedFeatures": [
    "ID_APP_SETTINGS",
    "ID_NAV_SIDEBAR",
    "ID_AUTH_LOGIN",
    "ID_RESTORE_FEATURES_TAB"
  ],
  "features": {
    "ID_ADVANCED_3D_RENDER": false,
    "ID_EXPORT_PDF": true,
    "ID_SYNC_AUTO": false
  }
}
```

### Field constraints
- `features` must be `Record<string, boolean>` with one-level depth.
- `lockedFeatures` entries must always remain enabled by adaptation.
- Feature IDs follow `ID_[DOMAIN]_[CAPABILITY]`.

---

## PHASE 2: PERSISTENCE RULES

- Bind schema per user or machine profile.
- Read-heavy, write-light lifecycle.
- Atomic writes only.
- If malformed/corrupt, recover with safe defaults (`true` for missing feature IDs).

### Environment mapping
- SQL: user profile JSON/JSONB column.
- NoSQL: embedded document under user profile.
- Desktop/offline: local JSON file with atomic replace write.
- Mobile: single serialized payload in native key-value store.

---

## PHASE 3: VALIDATION RULES

Before persisting schema updates:
1. Reject unknown top-level keys.
2. Ensure all `features` values are booleans.
3. Ensure all `lockedFeatures` values exist as valid Feature IDs.
4. Preserve immutable ID strings once deployed.

---

## PHASE 4: ANTI-PATTERNS (STRICT)

- Storing usage counters inside metafile.
- Deeply nested feature maps.
- One DB row per feature for startup path.
- Hard-fail crashes on parse errors.
- Silent schema mutation without versioning.

---

## PHASE 5: AGENT OUTPUT REQUIREMENTS

When implementing this in code, output must include:
1. Type definitions/interfaces for the exact schema.
2. `readMetafileSchema(userId)` with parse and fallback safeguards.
3. `writeMetafileSchema(userId, schema)` with atomic persistence.
4. Validation routine enforcing this contract.
