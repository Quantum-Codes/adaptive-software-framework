import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import getArticles from "../services/getArticles";

function useArticles({ enabled = true, location, tabName, tagName, username }) {
  const [{ articles, articlesCount }, setArticlesData] = useState({
    articles: [],
    articlesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { headers } = useAuth();

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    if (!headers && tabName === "feed") return;

    setLoading(true);

    getArticles({ headers, location, tabName, tagName, username })
      .then(setArticlesData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [enabled, headers, location, tabName, tagName, username]);

  return { articles, articlesCount, loading, setArticlesData };
}

export default useArticles;
