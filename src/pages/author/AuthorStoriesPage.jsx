import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import apiService from "../../lib/ApiService";
import Loading from "../../components/ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import useAuthStore from "../../store/authStore";

const AuthorStoriesPage = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Lấy tất cả truyện của author (bao gồm pending, approved, rejected)
      // Không filter theo status để author có thể thấy tất cả truyện của mình
      const response = await apiService.getStories({ author: user.id });
      
      if (response.status === "success") {
        setStories(response.data.stories || []);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError(err.message || "Không thể tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa truyện này?")) {
      return;
    }

    try {
      const response = await apiService.deleteStory(storyId);
      if (response.status === "success") {
        setStories(stories.filter(story => story.id !== storyId));
        showSuccess("Xóa truyện thành công!");
      }
    } catch (err) {
      console.error("Error deleting story:", err);
      showError(err.message || "Không thể xóa truyện");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: "bg-yellow-100 text-yellow-800", 
        text: "Chờ duyệt" 
      },
      approved: { 
        color: "bg-green-100 text-green-800", 
        text: "Đã duyệt" 
      },
      rejected: { 
        color: "bg-red-100 text-red-800", 
        text: "Từ chối" 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Truyện của tôi</h1>
            <p className="text-gray-600 mt-2">Quản lý tất cả truyện của bạn</p>
          </div>
          <Link
            to="/author/stories/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Tạo truyện mới
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        {/* Stories List */}
        {stories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có truyện nào</h3>
            <p className="text-gray-600 mb-6">Bắt đầu tạo truyện đầu tiên của bạn</p>
            <Link
              to="/author/stories/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Tạo truyện đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={story.coverImageUrl || "https://via.placeholder.com/300x200"}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(story.publicationStatus)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {story.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {story.description || "Chưa có mô tả"}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-1" />
                      <span>{story.chapters?.length || 0} chương</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      <span>{story.viewCount?.toLocaleString() || 0} lượt xem</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(story.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/author/stories/${story.id}/edit`}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit size={16} className="mr-1" />
                      Chỉnh sửa
                    </Link>
                    <Link
                      to={`/author/stories/${story.id}/chapters`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileText size={16} className="mr-1" />
                      Chương
                    </Link>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa truyện"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorStoriesPage; 