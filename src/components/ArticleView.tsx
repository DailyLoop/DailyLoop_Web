// src/components/ArticleView.tsx
import React, { useState } from "react";
import { ArrowLeft, Bookmark, Share2, Clock, ExternalLink, Radio } from "lucide-react";
import { Waves } from "./ui/waves-background";
import { useAuth } from "../context/AuthContext";
import { useStoryTracking } from "../context/StoryTrackingContext";
import { addBookmark, removeBookmark } from "../services/bookmarkService";

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  image: string;
  date: string;
  url: string;
  author: string; // Added author field
  bookmark_id?: string; // Optional bookmark id if already bookmarked
}

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const { user, token } = useAuth();
  const { startTracking, stopTracking, trackedStories } = useStoryTracking();
  const keyword = article.title.split(' ').slice(0, 3).join(' ');
  const isTracking = trackedStories.some(story => story.keyword === keyword);
  // Initialize bookmark state based on the article prop (if provided)
  const [isBookmarked, setIsBookmarked] = useState(!!article.bookmark_id);
  const [bookmarkId, setBookmarkId] = useState<string | null>(article.bookmark_id || null);
  const [loading, setLoading] = useState(false);

  const handleTrackClick = () => {
    if (isTracking) {
      stopTracking(keyword);
    } else {
      startTracking(keyword);
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent other click events from firing
    if (!user || !token) return; // Ensure the user is authenticated

    setLoading(true);
    try {
      if (isBookmarked) {
        // If already bookmarked, remove the bookmark.
        // console.log("Removing bookmark:", bookmarkId);
        await removeBookmark(bookmarkId as string, token);
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        // If not bookmarked, add the bookmark.
        const data = await addBookmark(user.id, article.id, token);
        // Assuming the API returns the created bookmark's id in data.data.id
        setIsBookmarked(true);
        setBookmarkId(data.data.id);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    }
    setLoading(false);
  };

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
      <div className="relative z-10 max-w-4xl mx-auto h-[calc(100vh-2rem)] overflow-y-auto pb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent transition-all duration-300">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors mb-6 md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-inter">Back to Headlines</span>
        </button>

        <article className="bg-primary rounded-xl overflow-hidden mb-6">
          <div className="aspect-video relative">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  {article.source}
                </span>
                <div className="flex items-center text-gray-400 text-sm font-inter">
                  <Clock className="h-4 w-4 mr-2" />
                  {article.date}
                </div>
                {article.author && (
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">
                    By {article.author}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {/* Bookmark Button with toggle functionality */}
                <button
                  onClick={handleBookmarkClick}
                  disabled={loading}
                  className="transition-colors duration-300"
                >
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked ? "text-blue-500" : "text-gray-400"}`}
                  />
                </button>
                <button
                  onClick={handleTrackClick}
                  className="transition-colors duration-300"
                >
                  <Radio
                    className={`h-5 w-5 ${isTracking ? "text-blue-500" : "text-gray-400"}`}
                  />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl mb-6 font-['Mencken_Std_Narrow'] font-extrabold leading-tight">
              {article.title}
            </h1>

            <div className="prose prose-invert max-w-none">
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <p className="text-gray-300 text-lg leading-relaxed font-['Shonar_Bangla']">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <a
                href={article.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!article.url) {
                    e.preventDefault();
                    console.error("No URL available for this article");
                  } else {
                    console.log("Opening URL:", article.url);
                  }
                }}
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors font-inter"
              >
                <span>Read full article on {article.source}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleView;