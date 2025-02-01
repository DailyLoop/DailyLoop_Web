import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  headline: string;
  description: string;
  imageUrl: string;
  date: string;
  source: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  headline,
  description,
  imageUrl,
  date,
  source
}) => {
  return (
    <Link href={`/article/${encodeURIComponent(headline)}`} className="block">
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer">
        <div className="relative h-48 w-full">
          <div className="absolute inset-0 bg-gray-200">
            <Image
              src={imageUrl}
              alt={headline}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
            {headline}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {description}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{source}</span>
            <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;