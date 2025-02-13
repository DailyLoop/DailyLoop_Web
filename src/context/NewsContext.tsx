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
  source: string;
  image: string;
  date: string;
}

interface NewsContextType {
  news: News[];
  loading: boolean;
  selectedArticle: string | null;
  setSelectedArticle: (id: string | null) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Temporary dummy data
const dummyNews: News[] = [
  {
    id: "1",
    title: "Breaking: Major Tech Companies Announce AI Coalition",
    summary:
      "Leading tech giants form partnership to establish ethical AI guidelines...",
    source: "Tech Daily",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    date: "2025-01-15",
  },
  {
    id: "2",
    title: "Global Climate Summit 2025 Announces Key Initiatives",
    summary: "World leaders gather to address climate change challenges...",
    source: "Environmental News",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce",
    date: "2025-01-15",
  },
  {
    id: "4",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "5",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "6",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "7",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "8",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "9",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "10",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "11",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
  {
    id: "12",
    title: "New Breakthrough in Quantum Computing Research",
    summary:
      "Scientists achieve major milestone in quantum computing development...",
    source: "Science Weekly",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2025-01-15",
  },
];

export const NewsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API loading
    const loadNews = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setNews(dummyNews);
      setLoading(false);
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
