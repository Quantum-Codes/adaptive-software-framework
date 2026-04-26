# Software Overview and Adaptive Architecture

## What this software is

This repository is a full-stack implementation of the RealWorld "Conduit" app.

At a high level, it provides:
- User authentication (register, login, logout, current user)
- Article publishing (create, read, update, delete)
- Profiles and follow/unfollow
- Favorites
- Comments
- Tag discovery
- Feed views (global and personal)

Tech stack:
- Frontend: React + Vite
- Backend: Express.js
- ORM: Sequelize
- Database: SQL database (commonly PostgreSQL)

It is structured as:
- `frontend/` for UI and client-side feature gating/tracking
- `backend/` for API, auth, persistence, and server-side feature enforcement
- `adaptive_config/` for feature registry and schema artifacts

## What makes it adaptive

The application includes a per-user adaptive layer that automatically hides low-usage features while keeping a guaranteed recovery path.

Core idea:
- Track each user’s interactions with specific features.
- Periodically evaluate recent usage.
- Disable adaptive features that are below threshold.
- Keep critical features permanently enabled.
- Let users restore hidden features manually.

This adaptation is personalized per user via `user.adaptiveSchema`.

## Adaptive model: terminology

- `locked feature`: never auto-disabled; always forced to `true`
- `adaptive feature`: can be enabled/disabled by usage-based evaluation
- `adaptive schema`: JSON object stored per user with feature flags and metadata
- `flipper`: in-memory feature-flag engine used at runtime in both frontend and backend

## Feature inventory

### Locked (always on)
- `ID_NAV_TOPBAR`
- `ID_AUTH_LOGIN`
- `ID_AUTH_REGISTER`
- `ID_AUTH_LOGOUT`
- `ID_APP_SETTINGS`
- `ID_RESTORE_HIDDEN_FEATURES`
- `ID_ERROR_BOUNDARY`

### Adaptive (usage-based)
- `ID_DISCOVERY_POPULAR_TAGS` (threshold: 3)
- `ID_FEED_PERSONAL` (threshold: 3)
- `ID_PROFILE_FAVORITED_ARTICLES` (threshold: 2)
- `ID_ARTICLE_COMMENTS` (threshold: 3)

Primary source of record:
- `backend/adaptive/featureRegistry.js`
- mirrored in `frontend/src/adaptive/featureRegistry.js`
- reference artifact: `adaptive_config/feature_registry.json`

## Per-user schema format

Each authenticated user has `adaptiveSchema` in the `Users` model (`backend/models/User.js`).

Shape:
- `schemaVersion`
- `userId`
- `lastEvaluated` (ISO timestamp)
- `lockedFeatures` (array)
- `features` (map: featureId -> boolean)

Default behavior:
- New users are initialized with all features enabled (`true`).
- `lastEvaluated` starts at Unix epoch (`1970-01-01T00:00:00.000Z`) to force first evaluation eligibility.

Sanitization behavior (frontend and backend both enforce):
- Unknown/malformed schema falls back to safe default.
- Missing/invalid flag values are repaired.
- Locked features are always reset to `true`.

Sources:
- `backend/adaptive/metadataSchema.js`
- `frontend/src/adaptive/defaultSchema.js`
- `adaptive_config/initial_metadata_schema.json`

## Usage tracking pipeline

### 1. Client event capture

The tracker (`frontend/src/adaptive/tracker.js`) listens for document clicks and collects events from elements tagged with `data-feature-id`.

Event payload:
- `f_id`: feature id
- `ts`: event timestamp (ms)

Control rules:
- Throttle: max 1 event per feature per 1000 ms
- Queue size cap: 500 events
- Flush interval: every 30 seconds
- Flush on tab hidden / before unload using `keepalive`

### 2. Client upload

Tracked events are sent to:
- `POST api/adaptive/track`

Auth behavior:
- If no auth header exists, queue is dropped (guest usage is not persisted).

### 3. Server ingestion

`backend/controllers/adaptive.js`:
- Validates event list and allowed feature IDs.
- Buckets events by day (`YYYY-MM-DD`) and feature.
- Increments counters in `feature_usage_stats`.

Storage model (`backend/models/FeatureUsageStat.js`):
- Composite primary key: `(userId, featureId, timeBucket)`
- Metric: `usageCount`

## Adaptation cycle (decision engine)

Location: `backend/adaptive/adaptationService.js`

Evaluation rules:
- Rolling usage window: last 14 days
- Re-run interval: every 7 days (minimum gap between evaluations)
- For each adaptive feature:
  - Sum usage in window
  - Compare with feature threshold
  - Set flag to `true` if usage >= threshold, else `false`

Locked-feature protection:
- Locked IDs are skipped in evaluator and forced true by schema sanitization.

Schema update:
- `lastEvaluated` is set to current timestamp.
- Updated schema is saved to user record.

### When adaptation runs

`runAdaptationCycleIfDue` is triggered asynchronously (`setImmediate`) on:
- login (`signIn` in `backend/controllers/users.js`)
- current-user fetch (`currentUser` in `backend/controllers/user.js`)

Implication:
- Adaptation is periodic and opportunistic on authenticated user flows.

## Runtime feature enforcement

### Frontend gating

Main mechanism:
- `FeatureGate` (`frontend/src/components/FeatureGate/FeatureGate.jsx`)
- `useFlipper` hook (`frontend/src/hooks/useFlipper.js`)

Examples:
- Popular tags sidebar hidden when `ID_DISCOVERY_POPULAR_TAGS=false`
- Personal feed tab removed and feed defaults to global when `ID_FEED_PERSONAL=false`
- Favorited articles tab/requests disabled when `ID_PROFILE_FAVORITED_ARTICLES=false`
- Comments section hidden when `ID_ARTICLE_COMMENTS=false`

### Backend gating

Enforced API protections:
- Personal feed route gated by middleware:
  - `GET /api/articles/feed` requires `ID_FEED_PERSONAL`
- Comments routes gated by middleware:
  - `GET/POST/DELETE /api/articles/:slug/comments...` require `ID_ARTICLE_COMMENTS`
- Favorited query path blocked in controller:
  - `GET /api/articles?favorited=<username>` checks `ID_PROFILE_FAVORITED_ARTICLES`

Failure mode when disabled:
- HTTP `403` with `Feature disabled` and `featureId`.

Why dual-layer gating matters:
- UI hides unavailable features for UX clarity.
- API still enforces policy to prevent bypass via direct requests.

## Recovery and user control

Users can manually restore hidden adaptive features from Settings via:
- `HiddenFeaturesManager` (`frontend/src/components/HiddenFeaturesManager/HiddenFeaturesManager.jsx`)

Restore behavior:
- Lists adaptive features currently set to `false`.
- "Restore" sets selected feature to `true` via `overrideFlag`.
- Updated schema is persisted through:
  - `PUT api/user` with `user.adaptiveSchema`

Important constraint:
- Locked features cannot be overridden to `false`.

## End-to-end adaptive flow

1. User interacts with feature-tagged UI elements (`data-feature-id`).
2. Frontend batches and sends usage events to `/api/adaptive/track`.
3. Backend aggregates usage into `feature_usage_stats` by day.
4. On due authenticated flow (login/current user), adaptation evaluates recent usage.
5. Low-usage adaptive features are switched off in that user’s schema.
6. Frontend and backend both respect the updated flags.
7. User can re-enable hidden features in Settings at any time.

## Safety and fail-open/fail-safe behavior

Safety defaults implemented in code:
- If flipper is not initialized or feature is unknown, checks return `true` (fail-open to avoid accidental lockout).
- Schema sanitization ensures malformed schema does not break runtime.
- Locked features guarantee navigation/auth/settings/recovery paths remain accessible.
- Tracking endpoint validates feature IDs against registry to prevent arbitrary writes.

## Adaptive artifacts in this repo

- `adaptive_config/feature_registry.json`
- `adaptive_config/initial_metadata_schema.json`
- `adaptive_config/tagging_checklist.md`

These files provide governance/traceability for feature IDs, thresholds, and where tagging/gating was integrated.

## Practical extension points

To add a new adaptive feature correctly:
1. Add feature ID + threshold to backend and frontend feature registries.
2. Tag relevant interaction points with `data-feature-id`.
3. Add frontend gate(s) where UI should hide.
4. Add backend route/controller guard where API access should be blocked.
5. Ensure feature appears in restore UI (if adaptive and not locked).
6. Verify schema sanitization and default schema include the new ID.
7. Update `adaptive_config/feature_registry.json` and checklist.

This keeps adaptation consistent across tracking, decisioning, UI behavior, and API enforcement.
