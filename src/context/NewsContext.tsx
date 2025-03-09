import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

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
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  // Function to refresh the news from incoming data (e.g., after a search)
  const refreshNews = useCallback(async () => {
    setIsTransitioning(true);
    setError(null);
    setLoading(true);
    try {
      // Process the raw newsData into the shape we need
      const processedNews = processNewsData(newsData);
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
