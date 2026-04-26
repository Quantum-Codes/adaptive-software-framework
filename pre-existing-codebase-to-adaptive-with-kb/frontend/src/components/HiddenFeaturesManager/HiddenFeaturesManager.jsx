import { ADAPTIVE_FEATURES } from "../../adaptive/featureRegistry";
import { useAdaptive } from "../../context/AdaptiveContext";

function HiddenFeaturesManager() {
  const { overrideFlag, schema } = useAdaptive();

  const hiddenFeatures = Object.entries(ADAPTIVE_FEATURES).filter(
    ([featureId]) => !schema.features[featureId],
  );

  if (hiddenFeatures.length === 0) {
    return (
      <div className="alert alert-light" data-feature-id="ID_RESTORE_HIDDEN_FEATURES">
        No adaptive features are hidden right now.
      </div>
    );
  }

  return (
    <div className="card" data-feature-id="ID_RESTORE_HIDDEN_FEATURES">
      <div className="card-header">Restore Hidden Features</div>
      <ul className="list-group list-group-flush">
        {hiddenFeatures.map(([featureId, meta]) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={featureId}
          >
            <span>{meta.displayName}</span>
            <button
              className="btn btn-sm btn-outline-primary"
              data-feature-id="ID_RESTORE_HIDDEN_FEATURES"
              onClick={() => overrideFlag(featureId, true)}
              type="button"
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HiddenFeaturesManager;

