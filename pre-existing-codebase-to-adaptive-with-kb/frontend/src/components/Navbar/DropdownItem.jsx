import { Link } from "react-router-dom";

function DropdownItem({ handler, icon, text, url, state, featureId }) {
  return (
    <Link
      className="dropdown-item"
      data-feature-id={featureId}
      onClick={handler}
      to={url || "#"}
      state={state}
    >
      {icon && <i className={icon}></i>} {text}
    </Link>
  );
}
export default DropdownItem;
