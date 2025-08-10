import React from 'react';

const StoriesCountInfo = ({ storiesCount, totalStories, currentPage, totalPages, loading }) => {
  if (loading) return null;

  return (
    <div className="mb-6 text-center">
      <p className="text-gray-600">
        Hiển thị {storiesCount} trong tổng số {totalStories} truyện
        {totalPages > 1 && ` (Trang ${currentPage} / ${totalPages})`}
      </p>
    </div>
  );
};

export default StoriesCountInfo;
