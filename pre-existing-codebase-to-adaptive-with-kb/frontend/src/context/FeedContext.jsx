import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import useFlipper from "../hooks/useFlipper";

const FeedContext = createContext();

export function useFeedContext() {
  return useContext(FeedContext);
}

function FeedProvider({ children }) {
  const { isAuth } = useAuth();
  const isPersonalFeedEnabled = useFlipper("ID_FEED_PERSONAL");
  const [{ tabName, tagName }, setTab] = useState({
    tabName: isAuth && isPersonalFeedEnabled ? "feed" : "global",
    tagName: "",
  });

  useEffect(() => {
    setTab((tab) => ({
      ...tab,
      tabName: isAuth && isPersonalFeedEnabled ? "feed" : "global",
    }));
  }, [isAuth, isPersonalFeedEnabled]);

  const changeTab = async (e, tabName) => {
    const tagName = e.target.innerText.trim();

    setTab({ tabName, tagName });
  };

  return (
    <FeedContext.Provider value={{ changeTab, tabName, tagName }}>
      {children}
    </FeedContext.Provider>
  );
}

export default FeedProvider;
