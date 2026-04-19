# 03_Code_Patterns/05_asset_manager.md

**[SYSTEM DIRECTIVE - ASSET GATING]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR CONDITIONAL ASSET LOADING.
**PRIME CONSTRAINT:** Disabled features must consume zero asset bandwidth, zero decode work, and near-zero memory.

---

## PHASE 1: ASSET GATING PATTERNS

### Pattern 1: Central Asset Manifest
Create a feature-owned asset manifest as the single source of truth.

```json
{
  "ID_3D_VIEWER": [{ "path": "models/product.glb", "type": "model" }],
  "ID_ADVANCED_DASHBOARD": [{ "path": "img/hero-banner.webp", "type": "image" }],
  "ID_PDF_EXPORT": [{ "path": "templates/invoice.pdf", "type": "document" }]
}
```

### Pattern 2: Universal Load Guard

```text
IF Flipper.isActive(featureId) is FALSE -> return immediately
IF Flipper.isActive(featureId) is TRUE  -> load assets
```

```js
async function loadFeatureAssets(featureId) {
  if (!Flipper.isActive(featureId)) return;
  const assets = assetManifest[featureId] ?? [];
  for (const item of assets) injectPreloadHint(item.path);
}
```

### Pattern 3: DOM-safe Source Assignment
Never hardcode `src` for feature-owned assets in static markup.

```html
<img data-feature="ID_3D_VIEWER" data-src="/assets/3d-viewer/hero.png" />
```

### Pattern 4: Programmatic Preload Injection
Inject preload hints after gate checks, not in static HTML.

```js
function injectPreloadHint(url) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  link.as = detectType(url);
  document.head.appendChild(link);
}
```

### Pattern 5: Shared Asset Demotion
If an asset is used by always-on paths, it is not feature-owned. Remove it from manifest and load unconditionally.

### Pattern 6: Server Route Gating
When assets are backend-served, route must enforce feature state.

```js
app.get("/assets/3d-viewer/:file", (req, res) => {
  if (!Flipper.isActive("ID_3D_VIEWER")) return res.status(404).end();
  res.sendFile(path.join(assetDir, req.params.file));
});
```

---

## PHASE 2: STRICT ANTI-PATTERNS

- Fetch-and-hide behavior.
- Static preload links for feature-owned assets.
- CSS selectors that trigger unconditional heavy asset fetch.
- Manifest-less ad hoc asset ownership assumptions.
- Ungated server asset endpoints.

---

## PHASE 3: AGENT OUTPUT REQUIREMENTS

When implementing asset adaptation, output MUST include:
1. Feature asset manifest changes.
2. Guarded loader implementation.
3. DOM/CSS corrections preventing eager fetch.
4. Optional server-route gating when applicable.
5. Validation checklist proving zero-fetch when disabled.

---

## PHASE 4: EXECUTION

1. Enumerate feature-owned assets.
2. Add/verify manifest entries.
3. Guard all load paths via Flipper checks.
4. Remove hardcoded eager-loading references.
5. Verify disabled state makes no network requests.