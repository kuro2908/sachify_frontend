import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiService from "../lib/ApiService";
import useAuthStore from "../store/authStore";
import Comments from "../components/Comments";
import RatingModal from "../components/RatingModal";
import {
  Star,
  Eye,
  BookOpen,
  Calendar,
  User,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  ThumbsUp,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const StoryDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    fetchStoryDetail();
  }, [id]);

  const fetchStoryDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getStory(id);

      if (response.status === "success") {
        setStory(response.data.story);
        // Check if user has bookmarked this story
        if (isAuthenticated()) {
          checkBookmarkStatus();
          fetchReadingProgress();
          checkUserRating();
        }
      }
    } catch (err) {
      setError(err.message || "Không thể tải thông tin truyện");
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const bookmarks = await apiService.getBookmarks();
      const isBookmarked = bookmarks.data.stories.some(
        (story) => story.id === parseInt(id)
      );
      setIsBookmarked(isBookmarked);
    } catch (err) {
      console.error("Error checking bookmark status:", err);
    }
  };

  const fetchReadingProgress = async () => {
    try {
      const response = await apiService.getCurrentReadingProgress(id);
      if (response.status === "success") {
        setReadingProgress(response.data);
      }
    } catch (err) {
      console.error("Error fetching reading progress:", err);
    }
  };

  const checkUserRating = async () => {
    if (!isAuthenticated()) return;
    
    try {
      setRatingLoading(true);
      const response = await apiService.getReviewsForStory(id);
      if (response.status === "success") {
        // Find if current user has rated this story
        const userReview = response.data.reviews.find(
          review => review.user.id === user.id
        );
        if (userReview) {
          setUserRating(userReview.rating);
        }
      }
    } catch (err) {
      console.error("Error checking user rating:", err);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để bookmark truyện");
      return;
    }

    try {
      setBookmarkLoading(true);

      if (isBookmarked) {
        await apiService.removeBookmark(id);
        setIsBookmarked(false);
      } else {
        await apiService.addBookmark(id);
        setIsBookmarked(true);
      }
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi bookmark truyện");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleRatingClick = () => {
    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để đánh giá truyện");
      return;
    }
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmitted = (rating, content) => {
    setUserRating(rating);
    // Refresh story data to update average rating and review count
    fetchStoryDetail();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "hiatus":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "ongoing":
        return "Đang cập nhật";
      case "hiatus":
        return "Tạm ngưng";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin truyện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy truyện</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cover Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <img
                  src={
                    story.coverImageUrl ||
                    "https://via.placeholder.com/400x600?text=No+Image"
                  }
                  alt={story.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                />
                <div className="absolute -top-2 -right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      story.status
                    )}`}
                  >
                    {getStatusText(story.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Story Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
                  <p className="text-xl text-blue-100 mb-4">
                    {story.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatNumber(story.viewCount || 0)}
                    </div>
                    <div className="text-blue-100 text-sm">Lượt xem</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {story.chapters?.length || 0}
                    </div>
                    <div className="text-blue-100 text-sm">Chương</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {story.reviewCount || 0}
                    </div>
                    <div className="text-blue-100 text-sm">Đánh giá</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold flex items-center justify-center">
                      <Star size={20} className="mr-1 fill-current" />
                      {story.averageRating
                        ? parseFloat(story.averageRating).toFixed(1)
                        : "N/A"}
                    </div>
                    <div className="text-blue-100 text-sm">Điểm</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-blue-100">Tác giả</div>
                    <Link
                      to={`/stories?author=${story.author?.id}`}
                      className="font-semibold hover:underline cursor-pointer"
                    >
                      {story.author?.username || "Không xác định"}
                    </Link>
                  </div>
                </div>

                {/* Categories */}
                {story.categories && story.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {story.categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/stories?category=${category.slug}`}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {story.chapters && story.chapters.length > 0 && (
                    <Link
                      to={`/chapters/${story.chapters[0].id}`}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Đọc ngay
                    </Link>
                  )}

                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      isBookmarked
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                  >
                    {bookmarkLoading ? (
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : isBookmarked ? (
                      <BookmarkCheck className="h-5 w-5 mr-2" />
                    ) : (
                      <Bookmark className="h-5 w-5 mr-2" />
                    )}
                    {isBookmarked ? "Đã bookmark" : "Bookmark"}
                  </button>

                  <button
                    onClick={handleRatingClick}
                    disabled={ratingLoading}
                    className="flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
                  >
                    {ratingLoading ? (
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : userRating ? (
                      <div className="flex items-center mr-2">
                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm">{userRating}</span>
                      </div>
                    ) : (
                      <Star className="h-5 w-5 mr-2" />
                    )}
                    {userRating ? "Đã đánh giá" : "Đánh giá"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Chapters Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Danh sách chương
                </h2>
                <span className="text-gray-600">
                  {story.chapters?.length || 0} chương
                </span>
              </div>

              {story.chapters && story.chapters.length > 0 ? (
                <div className="space-y-2">
                  {story.chapters.slice(0, 10).map((chapter) => (
                    <Link
                      key={chapter.id}
                      to={`/chapters/${chapter.id}`}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {chapter.chapterNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate" title={chapter.title}>
                            {chapter.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(chapter.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" size={20} />
                    </Link>
                  ))}

                  {story.chapters.length > 10 && (
                    <div className="text-center pt-4">
                      <Link
                        to={`/stories/${id}/chapters`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Xem tất cả {story.chapters.length} chương
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có chương nào
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Comments 
                storyId={story.id}
                type="story"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Reading Progress */}
            {isAuthenticated() && readingProgress && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Tiến độ đọc
                </h3>
                {readingProgress.hasRead ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Chương cuối đã đọc:</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="font-medium text-gray-900 truncate" title={readingProgress.lastReadChapter.title}>
                        Chương {readingProgress.lastReadChapter.chapterNumber}: {readingProgress.lastReadChapter.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Đọc lần cuối: {new Date(readingProgress.lastReadChapter.lastReadAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <Link
                      to={`/chapters/${readingProgress.lastReadChapter.id}`}
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Tiếp tục đọc
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Chưa đọc truyện này</p>
                    {story.chapters && story.chapters.length > 0 && (
                      <Link
                        to={`/chapters/${story.chapters[0].id}`}
                        className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Bắt đầu đọc
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Similar Stories */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Truyện tương tự
              </h3>
              <div className="space-y-4">
                {/* Placeholder for similar stories */}
                <div className="text-center py-8 text-gray-500">
                  Tính năng đang phát triển
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        storyId={id}
        storyTitle={story?.title}
        currentRating={userRating}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};

export default StoryDetail;
