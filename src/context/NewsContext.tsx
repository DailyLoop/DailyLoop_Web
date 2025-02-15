import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

interface News {
  id: string;
  title: string;
  summary: string;
  context: string;
  source: string;
  image: string;
  date: string;
  url: string;
  author: string;  // Added author field
}

interface NewsContextType {
  news: News[];
  loading: boolean;
  selectedArticle: string | null;
  setSelectedArticle: (id: string | null) => void;
  isTransitioning: boolean;
  error: string | null;
  refreshNews: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const BACKEND_URL = '/summarized_news.json';  // Update to relative path in public folder

const fetchNews = async (): Promise<News[]> => {
  try {
    const response = await fetch(BACKEND_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    return data.map((item: any, index: number) => ({
      id: String(index + 1),
      title: item.title || '',
      summary: item.summary || '',
      context: item.content || '',  
      source: item.source || '',
      image: item.image || item.urlToImage || '',
      url: item.url || '',
      date: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
      author: item.author || 'Unknown'  // Added comma here
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const NewsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  const refreshNews = useCallback(async () => {
    setIsTransitioning(true);
    setError(null);

    try {
      const newsData = await fetchNews();
      
      // Start transition out
      setLoading(true);
      
      // Wait for transition out animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update data
      setNews(newsData);
      
      // Start transition in
      setLoading(false);
      
      // Clear any existing transition timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // Set timeout for transition completion
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      setLoading(false);
      setIsTransitioning(false);
    }
  }, []);

  useEffect(() => {
    refreshNews();
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [refreshNews]);

  return (
    <NewsContext.Provider
      value={{
        news,
        loading,
        selectedArticle,
        setSelectedArticle,
        isTransitioning,
        error,
        refreshNews
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
