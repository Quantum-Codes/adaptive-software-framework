import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavItem from "../NavItem";
import SourceCodeLink from "../SourceCodeLink";
import DropdownMenu from "./DropdownMenu";
import FeatureGate from "../FeatureGate";

function Navbar() {
  const { isAuth } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>

        <SourceCodeLink left />

        <ul className="nav navbar-nav pull-xs-right">
          <NavItem
            featureId="ID_NAV_TOPBAR"
            text="Home"
            icon="ion-compose"
            url="/"
          />

          {isAuth && (
            <>
              <NavItem
                featureId="ID_NAV_TOPBAR"
                text="New Article"
                icon="ion-compose"
                url="/editor"
              />
              <DropdownMenu />
            </>
          )}

          {!isAuth && (
            <>
              <FeatureGate featureId="ID_AUTH_LOGIN">
                <NavItem
                  featureId="ID_AUTH_LOGIN"
                  text="Login"
                  icon="ion-log-in"
                  url="/login"
                />
              </FeatureGate>
              <FeatureGate featureId="ID_AUTH_REGISTER">
                <NavItem featureId="ID_AUTH_REGISTER" text="Sign up" url="/register" />
              </FeatureGate>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
