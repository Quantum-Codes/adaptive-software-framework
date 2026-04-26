import { useAdaptive } from "../context/AdaptiveContext";

function useFlipper(featureId) {
  const { isActive, schema } = useAdaptive();
  const featureFlag = schema?.features?.[featureId];

  if (featureFlag === undefined) {
    return true;
  }

  return isActive(featureId);
}

export default useFlipper;

