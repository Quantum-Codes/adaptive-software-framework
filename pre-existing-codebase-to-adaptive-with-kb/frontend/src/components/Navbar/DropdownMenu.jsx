import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import userLogout from "../../services/userLogout";
import Avatar from "../Avatar";
import DropdownItem from "./DropdownItem";
import FeatureGate from "../FeatureGate";

function DropdownMenu() {
  const [dropdown, setDropdown] = useState(false);
  const { loggedUser, setAuthState } = useAuth();
  const { username, image } = loggedUser || {};

  const logout = () => {
    setAuthState(userLogout);
  };

  const handleClick = () => {
    setDropdown((prev) => !prev);
  };

  return (
    <li className="nav-item dropdown">
      <div
        className="nav-link dropdown-toggle cursor-pointer"
        data-feature-id="ID_NAV_TOPBAR"
        onClick={handleClick}
      >
        <Avatar alt={username} className="user-pic" src={image} />
        {username}
      </div>

      <div
        className="dropdown-menu"
        style={{ display: dropdown ? "block" : "none" }}
        onMouseLeave={handleClick}
      >
        <DropdownItem
          featureId="ID_NAV_TOPBAR"
          icon="ion-person"
          text="Profile"
          url={`/profile/${username}`}
          state={loggedUser}
        />
        <FeatureGate featureId="ID_APP_SETTINGS">
          <DropdownItem
            featureId="ID_APP_SETTINGS"
            icon="ion-gear-a"
            text="Settings"
            url="/settings"
          />
        </FeatureGate>
        <div className="dropdown-divider"></div>
        <FeatureGate featureId="ID_AUTH_LOGOUT">
          <DropdownItem
            featureId="ID_AUTH_LOGOUT"
            icon="ion-log-out"
            text="Logout"
            handler={logout}
          />
        </FeatureGate>
      </div>
    </li>
  );
}

export default DropdownMenu;
