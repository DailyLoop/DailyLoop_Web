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
  author: string;
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

interface NewsProviderProps {
  children: ReactNode;
  newsData: any[];
}

const processNewsData = (data: any[]): News[] => {
  return data.map((item: any, index: number) => ({
    id: String(index + 1),
    title: item.title || '',
    summary: item.summary || '',
    context: item.content || '',
    source: item.source || '',
    image: item.image || item.urlToImage || '',
    url: item.url || '',
    date: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
    author: item.author || 'Unknown'
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

  const refreshNews = useCallback(async () => {
    setIsTransitioning(true);
    setError(null);

    try {
//       const newsData = await fetchNews();
      const processedNews = processNewsData(newsData);
      
      
      // Start transition out
      setLoading(true);
      
      // Wait for transition out animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update data
//       setNews(newsData);
      setNews(processedNews);
      
      
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
<!--   useEffect(() => {
    try {
//       const processedNews = processNewsData(newsData);
//       setNews(processedNews);
    } catch (error) {
      console.error('Error processing news:', error);
    } finally {
      setLoading(false);
    }
  }, [newsData]); -->

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
