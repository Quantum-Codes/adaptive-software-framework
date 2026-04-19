```markdown
# 03_Code_Patterns/07_package_imports.md

**[SYSTEM DIRECTIVE - FRONTEND PACKAGE & DEPENDENCY GATING]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR DYNAMIC DEPENDENCY GATING.
**PRIME CONSTRAINT:** You must generate code that prevents heavy JavaScript libraries, third-party SDKs, and complex UI modules from being parsed, compiled, or loaded into the JavaScript heap unless the `Flipper` explicitly permits it. The goal is to drastically reduce Main Thread blocking and memory consumption on low-end hardware.

---

## PHASE 1: CORE PHILOSOPHY & ARCHITECTURE
Before generating dependency-gating code, you must internalize the "Cost of JavaScript" on weak hardware:

1. **The Parsing Bottleneck:** On low-end CPUs, downloading a 2MB library (like `Three.js` or `Chart.js`) is only half the problem. The browser must *parse and compile* that JavaScript on the single Main Thread, causing the entire application to freeze. 
2. **Eager vs. Lazy Instantiation:** Static imports (`import { Chart } from 'chart.js'`) placed at the top of a file force modern bundlers (Webpack, Vite, Rollup) to include that library in the main application bundle. This completely defeats the purpose of the Flipper. If a feature is hidden, its dependencies MUST NOT be in the main bundle.
3. **Chunking Requirement:** To effectively gate a package, it must be isolated into its own asynchronous "chunk" that is only requested over the network (or loaded from the local disk in Electron/Tauri) when the Flipper resolves to `true`.
4. **Asynchronous Hand-off:** Because dynamic imports are inherently asynchronous (`Promise`-based), the UI must handle the micro-delay gracefully using Suspense boundaries or loading states.

---

## PHASE 2: IMPLEMENTATION PATTERNS BY FRAMEWORK

### 2.1 React Environments
**The Goal:** Combine the `FeatureGate` (from Pattern 01) with `React.lazy()` to prevent chunk loading.

**Pattern: Gated Suspense**
Instruct the developer to remove the static import and replace it with `React.lazy()`. Because `React.lazy()` only executes the import when the component is rendered, placing it *inside* a Flipper conditional guarantees the heavy package is never fetched if the feature is disabled.

```jsx
// 1. Remove the static import: 
// import HeavyChart from './HeavyChartComponent';

// 2. Implement the dynamic import (Webpack will split this into a separate file)
import React, { Suspense } from 'react';
import { useFlipper } from '../hooks/useFlipper';

const HeavyChart = React.lazy(() => import('./HeavyChartComponent'));

export const AdaptiveDashboard = () => {
  const isChartEnabled = useFlipper('ID_DATA_VISUALIZATION');

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>
      {/* 3. The Flipper gates the rendering. If false, React.lazy is never triggered. */}
      {isChartEnabled && (
        <Suspense fallback={<div className="skeleton-loader">Loading Chart Engine...</div>}>
          <HeavyChart data={chartData} />
        </Suspense>
      )}
    </div>
  );
};
```

### 2.2 Vue.js Environments
**The Goal:** Use `defineAsyncComponent` wrapped in a `v-if` Flipper check.

```vue
<template>
  <div class="dashboard-panel">
    <HeavyWidget v-if="isActive('ID_HEAVY_WIDGET')" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import { useFlipper } from '@/composables/useFlipper';

const { isActive } = useFlipper();

// Vue's async component definition
const HeavyWidget = defineAsyncComponent({
  loader: () => import('@/components/HeavyWidget.vue'),
  loadingComponent: SkeletonLoader,
  delay: 200 // Show loading component after 200ms
});
</script>
```

### 2.3 Vanilla JS / Service Workers / Node.js (Electron Backend)
**The Goal:** Gate raw library initialization using native ES Module dynamic imports.

```javascript
// Vanilla JS Controller
async function initializeDashboard() {
    const isExportEnabled = Flipper.isActive('ID_PDF_EXPORT');

    if (isExportEnabled) {
        try {
            // The browser/Node fetches and parses the library ONLY at this exact moment
            const { jsPDF } = await import('jspdf');
            
            const doc = new jsPDF();
            // ... configure export logic
            document.getElementById('export-btn').addEventListener('click', () => doc.save());
            
        } catch (error) {
            console.error("Failed to load the PDF engine chunk", error);
        }
    } else {
        // Feature is disabled, the 'jspdf' library remains untouched on the disk/server.
        console.log("PDF Export disabled. Saving 300kb of RAM.");
    }
}
```

---

## PHASE 3: BUNDLER & COMPILER INSTRUCTIONS
When generating code, you must actively remind the developer to configure their build tools to support this pattern.

* **Webpack Magic Comments:** If the developer uses Webpack, instruct them to name their chunks so they can verify the bloat is actually being separated.
  `const HeavyMap = React.lazy(() => import(/* webpackChunkName: "map-engine" */ './MapEngine'));`
* **Vite/Rollup:** Mention that Vite automatically chunks dynamic imports, but the developer should check the `dist` folder to ensure the heavy dependency (e.g., `three.js`) is not baked into `index.js`.

---

## PHASE 4: STRICT ANTI-PATTERNS (WHAT NOT TO DO)
If you generate code containing any of the following, you have failed the implementation:

* **DO NOT** leave the static `import X from 'y'` at the top of the file while gating the UI below it. If you do this, the UI is hidden, but the CPU still parses the library, defeating the entire purpose of this framework.
* **DO NOT** use synchronous `require('heavy-lib')` inside a Flipper `if` block in modern frontend environments (like Webpack), as bundlers will often statically analyze the `require` and bundle it anyway. Always use the ES6 `import()` Promise.
* **DO NOT** dynamically import tiny, structural utility libraries (like `lodash/get` or `clsx`). The overhead of creating a new HTTP request/chunk for a 2kb file is worse than the bloat. Only apply this pattern to heavy assets (>50kb) like Maps, Charts, Rich Text Editors, 3D Engines, and PDF Generators.

---

## PHASE 5: AGENT OUTPUT REQUIREMENTS
When the user prompts you to optimize a heavy package import, your output MUST include:

1. **The Import Refactor:** Code showing the removal of the static import and the implementation of the dynamic `import()` or `React.lazy()`.
2. **The Flipper Gate:** Code demonstrating how the Flipper boolean securely wraps the dynamic call so it never triggers when `false`.
3. **The Loading State:** A graceful fallback (Suspense, Skeleton, or Spinner) to handle the asynchronous delay required to fetch the library from the disk/network.
4. **Verification Step:** A brief instruction telling the developer how to open their Network Tab or build analyzer to prove the chunk is no longer loading on startup.

---

## PHASE 6: EXECUTION
1. Analyze the developer's provided code to identify the heavy third-party dependency (e.g., `ag-grid`, `chart.js`, `three.js`).
2. Delete the static `import` statement in your generated response.
3. Apply the appropriate dynamic import pattern (Phase 2) based on the developer's framework.
4. Ensure the Flipper conditional is the absolute top-level gate preventing the import (Phase 2).
5. Verify no Phase 4 Anti-Patterns are present.
```