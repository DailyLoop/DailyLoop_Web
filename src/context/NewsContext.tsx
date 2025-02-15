import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
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
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    try {
      const processedNews = processNewsData(newsData);
      setNews(processedNews);
    } catch (error) {
      console.error('Error processing news:', error);
    } finally {
      setLoading(false);
    }
  }, [newsData]);

  return (
    <NewsContext.Provider
      value={{ news, loading, selectedArticle, setSelectedArticle }}
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
