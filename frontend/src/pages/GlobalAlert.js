import { useAlert } from "../context/AlertContext";

function GlobalAlert() {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  return (
    <div className="global-alert-wrapper">
      <div
        className={`global-alert-box alert-${alert.type}`}
        role="alert"
      >
        <span className="global-alert-text">
          {alert.message}
        </span>

        <button
          className="global-alert-close"
          onClick={hideAlert}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default GlobalAlert;
