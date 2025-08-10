import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, Calendar, Trash2, Loader2, User } from "lucide-react";
import apiService from "../lib/ApiService";
import useAuthStore from "../store/authStore";

const UserBookshelfPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchBookmarks();
    }
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
  
      const response = await apiService.getBookmarks();
      
      
      if (response.status === "success") {
        const stories = response.data.stories || [];

        
                         // Process stories data
        
        setBookmarks(stories);
      } else {
        console.error("Bookmarks response error:", response);
        setError("Không thể tải tủ truyện");
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Không thể tải tủ truyện");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (storyId) => {
    try {
      await apiService.removeBookmark(storyId);
      // Refresh bookmarks after removal
      fetchBookmarks();
    } catch (err) {
      console.error("Error removing bookmark:", err);
      alert("Không thể xóa truyện khỏi tủ");
    }
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

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đăng nhập để xem tủ truyện
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để xem và quản lý tủ truyện của mình
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải tủ truyện...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra dữ liệu bookmarks
  if (bookmarks && !Array.isArray(bookmarks)) {
    setBookmarks([]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tủ truyện của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý những truyện bạn đã bookmark
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {bookmarks.length}
              </div>
              <div className="text-gray-600">Truyện đã lưu</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {bookmarks.filter(story => story.status === 'completed').length}
              </div>
              <div className="text-gray-600">Truyện hoàn thành</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {bookmarks.filter(story => story.status === 'ongoing').length}
              </div>
              <div className="text-gray-600">Đang cập nhật</div>
            </div>
          </div>
        </div>

        {/* Bookmarks List */}
        {!bookmarks || bookmarks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tủ truyện trống
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có truyện nào trong tủ. Hãy khám phá và bookmark những truyện yêu thích!
            </p>
            <Link
              to="/stories"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá truyện
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((story) => {
              // Kiểm tra story có hợp lệ không
              if (!story || typeof story !== 'object') {
                return null;
              }
              
                             // Đảm bảo dữ liệu được xử lý đúng
               const storyData = {
                 id: story.id,
                 title: story.title || "Không có tiêu đề",
                 author: story.author || { username: "Không xác định" },
                 coverImageUrl: story.cover_image_url || story.coverImageUrl,
                 viewCount: story.view_count || story.viewCount || 0,
                 chapters: story.chapters || [],
                 averageRating: null, // Không có cột average_rating trong database
                 categories: story.categories || [],
                 status: story.status || "unknown"
               };
              
              return (
                                 <div
                   key={storyData.id}
                   className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                 >
                                   {/* Cover Image */}
                   <div className="relative">
                     <img
                       src={storyData.coverImageUrl || "https://via.placeholder.com/300x400?text=No+Image"}
                       alt={storyData.title}
                       className="w-full h-48 object-cover"
                     />
                     <div className="absolute top-2 right-2">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(storyData.status)}`}>
                         {getStatusText(storyData.status)}
                       </span>
                     </div>
                                       <button
                       onClick={() => handleRemoveBookmark(storyData.id)}
                       className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                       title="Xóa khỏi tủ"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>

                   {/* Story Info */}
                   <div className="p-4">
                     <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                       {storyData.title}
                     </h3>
                   
                   <div className="flex items-center text-sm text-gray-600 mb-2">
                     <User size={14} className="mr-1" />
                     <span>{storyData.author.username}</span>
                   </div>

                   {/* Stats */}
                                     <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                     <div className="flex items-center">
                       <Eye size={14} className="mr-1" />
                       <span>{formatNumber(storyData.viewCount)}</span>
                     </div>
                     <div className="flex items-center">
                       <BookOpen size={14} className="mr-1" />
                       <span>{storyData.chapters.length} chương</span>
                     </div>
                   </div>

                   {/* Categories */}
                   {storyData.categories.length > 0 && (
                     <div className="flex flex-wrap gap-1 mb-3">
                       {storyData.categories.slice(0, 2).map((category) => (
                         <span
                           key={category.id}
                           className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                         >
                           {category.name}
                         </span>
                       ))}
                       {storyData.categories.length > 2 && (
                         <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                           +{storyData.categories.length - 2}
                         </span>
                       )}
                     </div>
                   )}

                   {/* Action Buttons */}
                   <div className="flex gap-2">
                     <Link
                       to={`/stories/${storyData.id}`}
                       className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm text-center hover:bg-blue-700 transition-colors"
                     >
                       Chi tiết
                     </Link>
                     {storyData.chapters.length > 0 && (
                       <Link
                         to={`/chapters/${storyData.chapters[0].id}`}
                         className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm text-center hover:bg-green-700 transition-colors"
                       >
                         Đọc ngay
                       </Link>
                     )}
                   </div>
                 </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookshelfPage; 