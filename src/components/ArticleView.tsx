import React from "react";
import { ArrowLeft, Bookmark, Share2, Clock, ExternalLink } from "lucide-react";

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  image: string;
  date: string;
}

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors mb-6 md:hidden"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Headlines</span>
      </button>

      <article className="bg-primary rounded-xl overflow-hidden">
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
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {article.source}
              </span>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {article.date}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">{article.summary}</p>
            {/* Placeholder for the full article content that will come from your API */}
            <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
              <p className="text-gray-400 text-sm">
                This is a placeholder for the AI-generated summary. Your Python
                API will provide the actual summarized content here.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <a
              href="#"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Read full article on {article.source}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleView;
