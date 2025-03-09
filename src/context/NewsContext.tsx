import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { addBookmark, removeBookmark } from "../services/bookmarkService";

export interface News {
  id: string;
  title: string;
  summary: string;
  context: string;
  source: string;
  image: string;
  date: string;
  url: string;
  author: string;
  filter_keywords?: string[];
  bookmarked_id?: string; // Add this line
}

interface NewsContextType {
  news: News[];
  loading: boolean;
  selectedArticle: string | null;
  setSelectedArticle: (id: string | null) => void;
  isTransitioning: boolean;
  error: string | null;
  refreshNews: () => Promise<void>;
  resetNews: () => void;
  // New bookmark-related methods
  toggleBookmark: (newsId: string) => Promise<void>;
  isBookmarked: (newsId: string) => boolean;
  getBookmarkId: (newsId: string) => string | null;
  bookmarkLoading: boolean; // Add this to expose loading state
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

interface NewsProviderProps {
  children: ReactNode;
  newsData: any[];
}

const processNewsData = (data: any[]): News[] => {
  return data.map((item: any) => ({
    id: item.id || String(Math.random()),
    title: item.title || '',
    summary: item.summary || '',
    context: item.content || '',
    source: item.source || '',
    image: item.image || item.urlToImage || '',
    url: item.url || '',
    date: item.publishedAt
      ? new Date(item.publishedAt).toISOString().split("T")[0]
      : "",
    author: item.author || "Unknown",
    filter_keywords: item.filter_keywords || [],
    bookmarked_id: item.bookmarked_id || null, // Add this line
  }));
};

export const NewsProvider: React.FC<NewsProviderProps> = ({
  children,
  newsData,
}) => {
  const { user, token } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Bookmark state
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Map<string, string>>(new Map());
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Function to refresh the news from incoming data (e.g., after a search)
  const refreshNews = useCallback(async () => {
    setIsTransitioning(true);
    setError(null);
    setLoading(true);
    try {
      // Process the raw newsData into the shape we need
      const processedNews = processNewsData(newsData);
      
      // Initialize bookmarked articles from the processed news data
      const initialBookmarks = new Map<string, string>();
      processedNews.forEach(article => {
        if (article.bookmarked_id) {
          initialBookmarks.set(article.id, article.bookmarked_id);
        }
      });
      setBookmarkedArticles(initialBookmarks);
      
      // Wait for a transition-out animation (simulate with 300ms delay)
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Update our news state with the processed data
      setNews(processedNews);
      setLoading(false);
      // Clear any existing transition timeout if needed
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      // Simulate transition completion after 500ms
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news");
      setLoading(false);
      setIsTransitioning(false);
    }
  }, [newsData]);

  // Refresh news whenever newsData changes
  useEffect(() => {
    refreshNews();
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [refreshNews]);

  // NEW: Reset function to clear news and selected article
  const resetNews = () => {
    setNews([]);
    setSelectedArticle(null);
  };
  
  // NEW: Check if an article is bookmarked
  const isBookmarked = useCallback((newsId: string): boolean => {
    return bookmarkedArticles.has(newsId);
  }, [bookmarkedArticles]);
  
  // NEW: Get bookmark ID for an article if it exists
  const getBookmarkId = useCallback((newsId: string): string | null => {
    return bookmarkedArticles.get(newsId) || null;
  }, [bookmarkedArticles]);
  
  // NEW: Toggle bookmark status for an article
  const toggleBookmark = useCallback(async (newsId: string): Promise<void> => {
    if (!user || !token) return;
    
    setBookmarkLoading(true);
    try {
      const articleIsBookmarked = isBookmarked(newsId);
      
      if (articleIsBookmarked) {
        // Remove bookmark if already bookmarked
        const bookmarkId = getBookmarkId(newsId);
        if (bookmarkId) {
          await removeBookmark(bookmarkId, token);
          // Update state after successful API call
          setBookmarkedArticles(prevBookmarks => {
            const newBookmarks = new Map(prevBookmarks);
            newBookmarks.delete(newsId);
            return newBookmarks;
          });
        }
      } else {
        // Add bookmark if not bookmarked
        const response = await addBookmark(user.id, newsId, token);
        const bookmarkId = response.data.id;
        
        // Update state after successful API call
        setBookmarkedArticles(prevBookmarks => {
          const newBookmarks = new Map(prevBookmarks);
          newBookmarks.set(newsId, bookmarkId);
          return newBookmarks;
        });
      }
    } catch (err) {
      console.error("Bookmark operation failed:", err);
      setError("Failed to update bookmark. Please try again.");
    } finally {
      setBookmarkLoading(false);
    }
  }, [user, token, isBookmarked, getBookmarkId]);
  
  return (
    <NewsContext.Provider
      value={{
        news,
        loading,
        selectedArticle,
        setSelectedArticle,
        isTransitioning,
        error,
        refreshNews,
        resetNews,
        // New bookmark-related methods
        toggleBookmark,
        isBookmarked,
        getBookmarkId,
        bookmarkLoading, // Expose bookmark loading state
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};
