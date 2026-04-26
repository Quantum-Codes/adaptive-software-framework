const FLUSH_INTERVAL_MS = 30_000;
const THROTTLE_INTERVAL_MS = 1_000;

let queue = [];
const lastTrackedAt = new Map();

function toPayload(featureId, ts) {
  return { f_id: featureId, ts };
}

function shouldTrack(featureId, timestamp) {
  const lastTs = lastTrackedAt.get(featureId) || 0;
  if (timestamp - lastTs < THROTTLE_INTERVAL_MS) return false;

  lastTrackedAt.set(featureId, timestamp);
  return true;
}

export function startAdaptiveTracker({ getAuthHeader, isFeatureEnabled }) {
  if (typeof document === "undefined") {
    return () => {};
  }

  const flush = async ({ keepalive = false } = {}) => {
    if (queue.length === 0) return;

    const authorization = getAuthHeader?.();
    if (!authorization) {
      queue = [];
      return;
    }

    const events = queue.splice(0, queue.length);

    try {
      await fetch("api/adaptive/track", {
        body: JSON.stringify({ events }),
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        keepalive,
        method: "POST",
      });
    } catch (_error) {
      queue = [...events, ...queue].slice(-500);
    }
  };

  const clickHandler = (event) => {
    const target = event.target?.closest?.("[data-feature-id]");
    if (!target) return;

    const featureId = target.getAttribute("data-feature-id");
    if (!featureId) return;
    if (typeof isFeatureEnabled === "function" && !isFeatureEnabled(featureId)) return;

    const now = Date.now();
    if (!shouldTrack(featureId, now)) return;

    queue.push(toPayload(featureId, now));
    if (queue.length > 500) {
      queue = queue.slice(-500);
    }
  };

  const visibilityHandler = () => {
    if (document.visibilityState === "hidden") {
      flush({ keepalive: true });
    }
  };

  const unloadHandler = () => {
    flush({ keepalive: true });
  };

  document.addEventListener("click", clickHandler);
  document.addEventListener("visibilitychange", visibilityHandler);
  window.addEventListener("beforeunload", unloadHandler);

  const intervalId = window.setInterval(() => flush(), FLUSH_INTERVAL_MS);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener("click", clickHandler);
    document.removeEventListener("visibilitychange", visibilityHandler);
    window.removeEventListener("beforeunload", unloadHandler);
    flush({ keepalive: true });
  };
}

