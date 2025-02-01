import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  headline: string;
  content: string;
  imageUrl: string;
  date: string;
  source: string;
}

interface ArticleThreadProps {
  article: Article;
  relatedArticles: Article[];
}

const ArticleThread: React.FC<ArticleThreadProps> = ({ article, relatedArticles }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Headlines
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={article.imageUrl}
            alt={article.headline}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>{article.source}</span>
            <time dateTime={article.date}>{new Date(article.date).toLocaleDateString()}</time>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.headline}</h1>
          <div className="prose max-w-none">{article.content}</div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Stories</h2>
          <div className="space-y-8">
            {relatedArticles.map((relatedArticle, index) => (
              <div key={index} className="relative">
                <div className="absolute left-4 -top-4 bottom-0 w-0.5 bg-gray-200" />
                <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <Link href={`/article/${encodeURIComponent(relatedArticle.headline)}`} className="block p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{relatedArticle.headline}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{relatedArticle.source}</span>
                      <time dateTime={relatedArticle.date}>
                        {new Date(relatedArticle.date).toLocaleDateString()}
                      </time>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleThread;