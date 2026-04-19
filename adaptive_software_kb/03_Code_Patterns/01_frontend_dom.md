```markdown
# 03_Code_Patterns/01_frontend_dom.md

**[SYSTEM DIRECTIVE - FRONTEND DOM ADAPTATION]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR UI VISIBILITY TOGGLING.
**PRIME CONSTRAINT:** You must generate code that toggles the visibility or rendering of UI elements based on the `Flipper` state. The goal is to reduce visual clutter and, in modern frameworks (React/Vue), prevent the component from mounting entirely to save memory.

---

## PHASE 1: CORE PHILOSOPHY & ARCHITECTURE
Before generating frontend code, internalize these rules:

1. **Unmount vs. Hide:** * **Modern Frameworks (React, Vue, Svelte):** Do not use CSS `display: none`. You must conditionally render the component (`if (enabled) { return <Component /> }`). This prevents the component from mounting, saving RAM and preventing background processes inside the component from running.
   * **Legacy/Vanilla JS (HTML/JS):** You may use DOM removal (`element.remove()`) or CSS (`display: none`), but DOM removal is preferred to free up memory.
2. **The "Hidden Features" Directory:** When you hide a feature from the main UI, the user must still be able to find it if they need it. The adaptation is not permanent deletion; it is relocation.
3. **Failsafe Default:** If the Flipper state for a feature is `undefined` or the Flipper fails to load, the UI element MUST render by default.

---

## PHASE 2: IMPLEMENTATION PATTERNS BY FRAMEWORK

### 2.1 React Environments
**The Goal:** Prevent the component from mounting.

**Pattern: The Higher-Order Component (HOC) or Wrapper**
Instead of polluting every component with `if/else` logic, generate a reusable `FeatureGate` component.

```jsx
// FeatureGate.jsx
import React from 'react';
import { useFlipper } from '../hooks/useFlipper';

export const FeatureGate = ({ featureId, children, fallback = null }) => {
  const isEnabled = useFlipper(featureId);

  // If enabled (or failsafe true), render the children.
  // Otherwise, render the fallback (often null to unmount).
  return isEnabled ? children : fallback;
};
```

**Usage Generation:**
Instruct the developer to wrap target components:
```jsx
<FeatureGate featureId="ID_ADVANCED_3D_RENDER">
  <Complex3DViewer />
</FeatureGate>
```

### 2.2 Vue.js Environments
**The Goal:** Prevent the component from mounting using `v-if`.

**Pattern: The Global Directive or Composable**

```vue
<template>
  <div v-if="isActive('ID_PDF_EXPORT')">
    <HeavyExportWidget />
  </div>
</template>

<script setup>
import { useFlipper } from '@/composables/useFlipper';
const { isActive } = useFlipper();
</script>
```

### 2.3 Vanilla HTML/JS or Legacy Environments (jQuery, PHP templates)
**The Goal:** Remove the element from the DOM to save memory, or hide it.

**Pattern: Data Attributes and DOM Mutation**
Instruct the developer to tag HTML elements with `data-feature-id`.

```html
<button data-feature-id="ID_QUICK_FILTERS" class="heavy-filter-btn">Quick Filters</button>
```

```javascript
// Vanilla JS Initialization Script (Runs after Flipper is loaded)
function applyAdaptiveUI() {
    const elements = document.querySelectorAll('[data-feature-id]');
    
    elements.forEach(el => {
        const featureId = el.getAttribute('data-feature-id');
        const isEnabled = Flipper.isActive(featureId);
        
        if (!isEnabled) {
            // Option 1: Remove from DOM (Saves memory, harder to restore without reload)
            el.remove(); 
            
            // Option 2: Hide visually (Easier to restore, uses more memory)
            // el.style.display = 'none';
        }
    });
}
```

---

## PHASE 3: STRICT ANTI-PATTERNS (WHAT NOT TO DO)

* **DO NOT** use CSS `visibility: hidden;` or `opacity: 0;`. These keep the element in the rendering tree, consuming layout and composite cycles, which drains battery on low-end hardware.
* **DO NOT** put heavy API calls or data fetching inside the parent component if the child component is hidden. If you hide `<DashboardChart />`, ensure the parent isn't still running the `fetchChartData()` API call. (Route the agent to `03_Code_Patterns/02_backend_api.md` if data fetching is involved).
* **DO NOT** break the layout grid. If removing a component leaves a massive empty white space, instruct the developer on how to use CSS Grid/Flexbox `auto-fill` or provide a fallback layout.

---

## PHASE 4: AGENT OUTPUT REQUIREMENTS
When implementing Frontend DOM toggling, your output MUST include:

1. **The Reusable Gate:** The code for the `FeatureGate` (React), `v-if` logic (Vue), or the DOM traversal script (Vanilla).
2. **Implementation Example:** Show exactly how to apply the gate to a specific button, div, or component in the user's provided codebase.
3. **Relocation Note:** Add a comment or instruction reminding the developer to ensure the hidden feature is accessible via a "Hidden Features" menu or a global search bar.
```