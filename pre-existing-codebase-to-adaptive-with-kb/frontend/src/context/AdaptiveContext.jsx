import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import Flipper from "../adaptive/flipper";
import {
  buildDefaultAdaptiveSchema,
  sanitizeAdaptiveSchema,
} from "../adaptive/defaultSchema";
import { LOCKED_FEATURES } from "../adaptive/featureRegistry";
import { startAdaptiveTracker } from "../adaptive/tracker";
import updateAdaptiveSchema from "../services/updateAdaptiveSchema";

const AdaptiveContext = createContext();

export function useAdaptive() {
  return useContext(AdaptiveContext);
}

function AdaptiveProvider({ children }) {
  const { headers, isAuth, loggedUser, setAuthState } = useAuth();
  const [schema, setSchema] = useState(buildDefaultAdaptiveSchema("guest"));

  useEffect(() => {
    const userId = loggedUser?.username || "guest";
    const nextSchema = sanitizeAdaptiveSchema(loggedUser?.adaptiveSchema, userId);

    setSchema(nextSchema);
    Flipper.init(nextSchema);
  }, [loggedUser]);

  useEffect(() => {
    const stopTracking = startAdaptiveTracker({
      getAuthHeader: () => headers?.Authorization,
      isFeatureEnabled: (featureId) => Flipper.isActive(featureId),
    });

    return stopTracking;
  }, [headers]);

  const isActive = (featureId) => {
    return Flipper.isActive(featureId);
  };

  const overrideFlag = async (featureId, state) => {
    if (LOCKED_FEATURES.includes(featureId)) return;

    const nextSchema = {
      ...schema,
      features: {
        ...schema.features,
        [featureId]: Boolean(state),
      },
    };

    setSchema(nextSchema);
    Flipper.init(nextSchema);

    if (!isAuth || !headers) return;

    const updatedAuth = await updateAdaptiveSchema({
      adaptiveSchema: nextSchema,
      headers,
    });
    if (updatedAuth) {
      setAuthState(updatedAuth);
    }
  };

  const contextValue = useMemo(
    () => ({
      getAllFlags: () => Flipper.getAllFlags(),
      isActive,
      lockedFeatures: schema.lockedFeatures,
      overrideFlag,
      schema,
    }),
    [schema],
  );

  return (
    <AdaptiveContext.Provider value={contextValue}>
      {children}
    </AdaptiveContext.Provider>
  );
}

export default AdaptiveProvider;

