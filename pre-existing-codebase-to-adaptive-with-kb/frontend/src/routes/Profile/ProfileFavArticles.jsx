import { useParams } from "react-router-dom";
import ArticlesPagination from "../../components/ArticlesPagination";
import ArticlesPreview from "../../components/ArticlesPreview";
import useFlipper from "../../hooks/useFlipper";
import useArticleList from "../../hooks/useArticles";

function ProfileFavArticles() {
  const { username } = useParams();
  const isFavoritesEnabled = useFlipper("ID_PROFILE_FAVORITED_ARTICLES");

  const { articles, articlesCount, loading, setArticlesData } = useArticleList({
    enabled: isFavoritesEnabled,
    location: "favorites",
    username,
  });

  if (!isFavoritesEnabled) {
    return <div className="article-preview">Favorited articles are currently hidden.</div>;
  }

  return loading ? (
    <div className="article-preview">
      <em>Loading {username} favorites articles...</em>
    </div>
  ) : articles.length > 0 ? (
    <>
      <ArticlesPreview
        articles={articles}
        loading={loading}
        updateArticles={setArticlesData}
      />

      <ArticlesPagination
        articlesCount={articlesCount}
        location="favorites"
        updateArticles={setArticlesData}
        username={username}
      />
    </>
  ) : (
    <div className="article-preview">{username} doesn't have favorites.</div>
  );
}

export default ProfileFavArticles;
