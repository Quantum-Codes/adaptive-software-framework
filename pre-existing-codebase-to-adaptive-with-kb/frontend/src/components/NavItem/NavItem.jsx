import { NavLink } from "react-router-dom";

function NavItem({ icon, text, url, state, featureId }) {
  const activeClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <li className="nav-item">
      <NavLink
        className={activeClass}
        data-feature-id={featureId}
        end
        state={state}
        to={url}
      >
        {icon && <i className={icon}></i>} {text}
      </NavLink>
    </li>
  );
}

export default NavItem;
