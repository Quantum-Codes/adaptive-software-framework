import { Outlet, useLocation } from "react-router-dom";
import AuthorInfo from "../../components/AuthorInfo";
import ContainerRow from "../../components/ContainerRow";
import NavItem from "../../components/NavItem";
import useFlipper from "../../hooks/useFlipper";

function Profile() {
  const { state } = useLocation();
  const isFavoritesEnabled = useFlipper("ID_PROFILE_FAVORITED_ARTICLES");

  return (
    <div className="profile-page">
      <div className="user-info">
        <ContainerRow>
          <AuthorInfo />
        </ContainerRow>
      </div>

      <ContainerRow>
        <div className="col-xs-12 col-md-10 offset-md-1">
          <div className="articles-toggle">
            <ul className="nav nav-pills outline-active">
              <NavItem text="My Articles" url="" state={state} />
              {isFavoritesEnabled && (
                <NavItem
                  featureId="ID_PROFILE_FAVORITED_ARTICLES"
                  text="Favorited Articles"
                  url="favorites"
                  state={state}
                />
              )}
            </ul>
          </div>
          <Outlet />
        </div>
      </ContainerRow>
    </div>
  );
}

export default Profile;
