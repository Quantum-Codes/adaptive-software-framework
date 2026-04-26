import { useAuth } from "../../context/AuthContext";
import useFlipper from "../../hooks/useFlipper";
import { useFeedContext } from "../../context/FeedContext";
import FeedNavLink from "./FeedNavLink";

function FeedToggler() {
  const { isAuth } = useAuth();
  const { tabName, tagName } = useFeedContext();
  const isPersonalFeedEnabled = useFlipper("ID_FEED_PERSONAL");

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {isAuth && isPersonalFeedEnabled && (
          <FeedNavLink featureId="ID_FEED_PERSONAL" name="feed" text="Your Feed" />
        )}

        <FeedNavLink featureId="ID_NAV_TOPBAR" name="global" text="Global Feed" />

        {tabName === "tag" && <FeedNavLink icon name="tag" text={tagName} />}
      </ul>
    </div>
  );
}

export default FeedToggler;
