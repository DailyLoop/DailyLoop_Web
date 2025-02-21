// src/pages/BookmarksPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/common/LoadingState";
import { listBookmarks } from "../services/bookmarkService";
import NewsCard from "../components/NewsCard";
import AppHeader from "../components/layout/AppHeader";
import { useNavigate } from "react-router-dom";
import { Waves } from "../components/ui/waves-background";

interface Article {
  id: string;
  title: string;
  summary: string;
  context: string;
  source: string;
  image: string;
  date: string;
  url: string;
  bookmarkId?: string;
}

const BookmarksPage: React.FC = () => {
  const { user, token } = useAuth();
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    if (!user || !token) {
      console.log("Not authenticated; skipping bookmarks fetch", { user, token });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await listBookmarks(user.id, token);
      console.log("Bookmarks response:", data);
      // Adjust based on the shape of your response:
      setBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user, token]);

  return (
    <div className="relative min-h-screen bg-primary">
      <Waves
        lineColor="rgba(255, 255, 255, 0.1)"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        className="z-0"
      />
      <div className="relative z-10">
        <AppHeader onLogoClick={() => navigate("/")} mode="app" onSearch={() => {}} />
        <div className="container mx-auto px-4 py-6">
          {/* Page Header with a Back button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl text-white">My Bookmarks</h1>
            <button
              onClick={() => navigate("/")} // Change to "/" if your main page is "/"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to News
            </button>
          </div>

          {loading ? (
            <LoadingState type="cards" count={3} />
          ) : bookmarks.length === 0 ? (
            <p className="text-gray-400">You have not bookmarked any articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((article, index) => (
                <NewsCard
                  key={article.id}
                  news={article}
                  onClick={() => navigate(`/article/${article.id}`)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;