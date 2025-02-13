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
  author: string;  // Added author field
}

interface NewsContextType {
  news: News[];
  loading: boolean;
  selectedArticle: string | null;
  setSelectedArticle: (id: string | null) => void;
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
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

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
