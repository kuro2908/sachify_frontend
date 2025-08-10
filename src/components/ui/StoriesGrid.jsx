import React from 'react';
import StoryCard from './StoryCard';

const StoriesGrid = ({ stories }) => {
  if (!stories || stories.length === 0) {
    return (
      <p className="text-center text-gray-500">Không tìm thấy truyện nào</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
};

export default StoriesGrid;
