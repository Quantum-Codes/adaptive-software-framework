import useFlipper from "../../hooks/useFlipper";

function FeatureGate({ children, fallback = null, featureId }) {
  const isEnabled = useFlipper(featureId);
  return isEnabled ? children : fallback;
}

export default FeatureGate;

