```markdown
# 03_Code_Patterns/08_memory_cleanup.md

**[SYSTEM DIRECTIVE - MEMORY INTEGRITY & CLEANUP]**
**ROLE:** YOU ARE THE IMPLEMENTATION AGENT FOR MEMORY MANAGEMENT AND GARBAGE COLLECTION.
**PRIME CONSTRAINT:** You must generate code that ensures when the `Flipper` disables or hides a feature, that feature is completely eradicated from active memory. Hiding a DOM element is not enough. You must severe all stray references, global event listeners, active intervals, and data subscriptions so the Garbage Collector (GC) can free the RAM. On low-end hardware, "Zombie Components" (invisible but still in memory) will cause fatal crashes.

---

## PHASE 1: CORE PHILOSOPHY & ARCHITECTURE
Before generating memory management code, you must internalize the lifecycle of a toggled feature:

1. **The "Zombie" Problem:** If a React component or Vanilla JS node is removed from the DOM, but a global `window.addEventListener` still references a variable inside that component, the JavaScript engine CANNOT garbage collect it. It remains in the heap.
2. **The Mid-Session Toggle:** Adaptive software may change states during a session (e.g., a "Weekly Flip" evaluates and turns off a heavy feature while the app is open). The transition from `isEnabled: true` to `isEnabled: false` must trigger a complete teardown of the feature's active memory footprint.
3. **Data Store Purging:** Memory leaks aren't just DOM nodes. If a feature fetches a 50MB JSON payload and stores it in Redux/Vuex/Global State, and then the Flipper disables that feature, that 50MB payload must be explicitly wiped from the state.

---

## PHASE 2: IMPLEMENTATION PATTERNS BY FRAMEWORK

### 2.1 React Environments
**The Goal:** Strict usage of `useEffect` cleanup functions.

**Pattern: The Teardown Hook**
Instruct the developer to always return a cleanup function when dealing with anything outside the immediate React synthetic event system.

```jsx
import React, { useEffect } from 'react';

export const HeavyMouseTracker = () => {
  useEffect(() => {
    // 1. Setup
    const handleMouseMove = (e) => {
      // Heavy computation here
      processCoordinates(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const pollingInterval = setInterval(syncWithServer, 5000);

    // 2. The Teardown (Crucial for Flipper toggles)
    // When the Flipper unmounts this component, THIS must run.
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(pollingInterval);
      
      // 3. Purge related heavy state if applicable
      dispatch({ type: 'PURGE_TRACKER_DATA' });
    };
  }, []);

  return <canvas id="tracker-canvas"></canvas>;
};
```

### 2.2 Vue.js Environments
**The Goal:** Strict usage of `onBeforeUnmount` or `onUnmounted`.

```vue
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { heavy3DEngine } from '@/lib/3d';

let engineInstance = null;

onMounted(() => {
  engineInstance = heavy3DEngine.init('#canvas-container');
});

// When the Flipper's v-if resolves to false, this hook fires.
onBeforeUnmount(() => {
  if (engineInstance) {
    // Call the library's native destroy method to clear WebGL contexts
    engineInstance.destroy(); 
    engineInstance = null; // Sever the reference for the GC
  }
});
</script>
```

### 2.3 Vanilla JS / Legacy Environments
**The Goal:** Manual reference severing and named function enforcement.

**Pattern: The Registry Pattern**
Vanilla JS does not have an automatic unmount lifecycle. You must create a registry of teardown functions that execute when the Flipper state changes.

```javascript
// A central registry for cleanup tasks mapped to Feature IDs
const CleanupRegistry = {
    tasks: {},
    
    register: function(featureId, cleanupFn) {
        if (!this.tasks[featureId]) this.tasks[featureId] = [];
        this.tasks[featureId].push(cleanupFn);
    },
    
    execute: function(featureId) {
        if (this.tasks[featureId]) {
            this.tasks[featureId].forEach(fn => fn());
            delete this.tasks[featureId]; // Clear the registry
        }
    }
};

// Example Feature Implementation
function initLegacyFeature() {
    const featureId = 'ID_LEGACY_WIDGET';
    if (!Flipper.isActive(featureId)) return;

    const widget = document.getElementById('legacy-widget');
    
    // ANTI-PATTERN AVOIDANCE: Must use a named function, NOT an arrow function
    function handleScroll() { /* heavy logic */ }
    window.addEventListener('scroll', handleScroll);

    // Register the exact steps to destroy this feature
    CleanupRegistry.register(featureId, () => {
        window.removeEventListener('scroll', handleScroll);
        widget.innerHTML = ''; // Clear DOM bindings
        widget.remove(); // Remove node
    });
}
```

---

## PHASE 3: DEEP DIVE - NON-DOM LEAKS
You must explicitly check the developer's code for these hidden leaks and generate mitigations:

1. **Third-Party SDKs:** Map libraries (Google Maps, Mapbox) and 3D libraries (Three.js) hold massive WebGL contexts. Removing the `<canvas>` does NOT free the memory. You MUST instruct the agent/developer to call `map.remove()`, `renderer.dispose()`, or `scene.clear()`.
2. **WebSockets & SSE:** If a feature streams live data (e.g., a live stock ticker), and the Flipper hides the ticker, the WebSocket MUST be closed (`socket.close()`). An open socket for a hidden UI feature is a massive CPU and Network leak.
3. **Global State Arrays:** If a feature pushes items to a global `window.appData` array, you must write logic to `splice` or nullify those specific items when the feature is disabled.

---

## PHASE 4: STRICT ANTI-PATTERNS (WHAT NOT TO DO)
If you generate code containing any of the following, you have failed the implementation:

* **DO NOT** use anonymous inline functions in global event listeners.
  * *BAD:* `window.addEventListener('resize', () => { ... })` -> Cannot be removed.
  * *GOOD:* `window.addEventListener('resize', handleResize)`
* **DO NOT** rely solely on React/Vue unmounting if a third-party library is involved. The framework only knows how to clean up its own Virtual DOM, not native browser memory allocated by external scripts.
* **DO NOT** use `display: none` to "hide" a canvas running a `requestAnimationFrame` loop. The loop will continue firing 60 times a second in the background. You must call `cancelAnimationFrame`.

---

## PHASE 5: AGENT OUTPUT REQUIREMENTS
When the user prompts you to optimize memory or clean up after a removed feature, your output MUST include:

1. **The Vulnerability Analysis:** Explicitly point out where the user's provided code is leaking memory (e.g., "You attached an interval but never cleared it.").
2. **The Teardown Implementation:** Provide the exact `useEffect` return, `onUnmounted` hook, or Vanilla JS cleanup function required.
3. **Library-Specific Teardown:** If the code involves Chart.js, Three.js, or similar, you MUST include the specific `.destroy()` or `.dispose()` methods mandated by that library's API.
4. **State Purge (If Applicable):** Code showing how to clear out massive data arrays associated with the disabled feature.

---

## PHASE 6: EXECUTION
1. Scan the developer's code for global listeners (`window`, `document`, `body`), timers (`setInterval`, `setTimeout`), subscriptions (RxJS, WebSockets), and heavy external libraries.
2. Refactor the setup code to ensure all functions passed to event listeners are named references.
3. Generate the Framework-specific teardown hook (Phase 2).
4. Inject the teardown commands required to kill timers, sockets, and WebGL contexts (Phase 3).
5. Verify that no Phase 4 Anti-patterns remain in your generated output.
```