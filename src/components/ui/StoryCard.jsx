import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={story.coverImageUrl}
          alt={story.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {story.status && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              story.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {story.status === 'completed' ? 'Hoàn thành' : 'Đang viết'}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {story.title}
        </h3>
        
        <div className="mb-3 space-y-1">
          <p className="text-sm text-gray-600">
            bởi <span className="font-medium text-gray-700">{story.author?.username || "Không xác định"}</span>
          </p>
          
          {story.categories && story.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {story.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {category.name}
                </span>
              ))}
              {story.categories.length > 2 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{story.categories.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Link
            to={`/stories/${story.id}`}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all text-sm w-full text-center group-hover:bg-blue-600"
          >
            Đọc ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
