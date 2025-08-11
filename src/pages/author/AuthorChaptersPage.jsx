import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronLeft,
  BookOpen,
  Clock,
  User
} from "lucide-react";
import apiService from "../../lib/ApiService";
import Loading from "../../components/ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import useAuthStore from "../../store/authStore";

const AuthorChaptersPage = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (storyId) {
      fetchStoryAndChapters();
    }
  }, [storyId]);

  const fetchStoryAndChapters = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Lấy thông tin truyện
      const storyResponse = await apiService.getStory(storyId);
      if (storyResponse.status === "success") {
        setStory(storyResponse.data.story);
        
        // Lấy danh sách chương
        const chaptersResponse = await apiService.getStoryChapters(storyId);
        if (chaptersResponse.status === "success") {
          setChapters(chaptersResponse.data.chapters || []);
        }
      }
    } catch (err) {
      console.error("Error fetching story and chapters:", err);
      setError(err.message || "Không thể tải thông tin truyện và chương");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chương này?")) {
      return;
    }

    try {
      const response = await apiService.deleteChapter(chapterId);
      if (response.status === "success") {
        setChapters(chapters.filter(chapter => chapter.id !== chapterId));
        showSuccess("Xóa chương thành công!");
      }
    } catch (err) {
      console.error("Error deleting chapter:", err);
      showError(err.message || "Không thể xóa chương");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentTypeBadge = (contentType) => {
    const typeConfig = {
      TEXT: { 
        color: "bg-blue-100 text-blue-800", 
        text: "Truyện chữ" 
      },
      IMAGES: { 
        color: "bg-purple-100 text-purple-800", 
        text: "Truyện tranh" 
      }
    };

    const config = typeConfig[contentType] || typeConfig.TEXT;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy truyện</h3>
          <p className="text-gray-600 mb-6">Truyện này không tồn tại hoặc bạn không có quyền truy cập</p>
          <Link
            to="/author/stories"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft size={20} className="mr-2" />
            Quay lại danh sách truyện
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/author/stories"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ChevronLeft size={20} className="mr-1" />
              Quay lại
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý chương</h1>
          </div>
          
          {/* Story Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={story.coverImageUrl || "https://via.placeholder.com/120x160"}
                alt={story.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {story.description || "Chưa có mô tả"}
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    <span>{chapters.length} chương</span>
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    <span>{story.viewCount?.toLocaleString() || 0} lượt xem</span>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>{story.author?.username || "Ẩn danh"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Link
                  to={`/author/stories/${story.id}/edit`}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Chỉnh sửa truyện
                </Link>
                <Link
                  to={`/author/stories/${story.id}/chapters/new`}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Thêm chương mới
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        {/* Chapters List */}
        {chapters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chương nào</h3>
            <p className="text-gray-600 mb-6">Bắt đầu viết chương đầu tiên cho truyện của bạn</p>
            <Link
              to={`/author/stories/${story.id}/chapters/new`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Viết chương đầu tiên
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Danh sách chương ({chapters.length})</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                                             <div className="flex items-center space-x-3 mb-2">
                         <span className="text-sm font-medium text-gray-500">
                           Chương {chapter.chapterNumber}
                         </span>
                         {getContentTypeBadge(chapter.contentType)}
                       </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={chapter.title}>
                        {chapter.title}
                      </h4>
                                             <p className="text-gray-600 mb-3 line-clamp-2">
                         {chapter.contentType === 'TEXT' ? 'Truyện chữ' : 'Truyện tranh'} - {chapter.contentUrls ? (Array.isArray(chapter.contentUrls) ? `${chapter.contentUrls.length} trang` : 'Có nội dung') : 'Chưa có nội dung'}
                       </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{formatDate(chapter.updatedAt)}</span>
                        </div>
                                                 <div className="flex items-center">
                           <FileText size={14} className="mr-1" />
                           <span>{chapter.contentType === 'TEXT' ? 'Truyện chữ' : 'Truyện tranh'}</span>
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {/* <Link
                        to={`/author/stories/${story.id}/chapters/${chapter.id}/edit`}
                        className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Sửa
                      </Link> */}
                      <Link
                        to={`/chapters/${chapter.id}`}
                        target="_blank"
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Eye size={16} className="mr-1" />
                        Xem
                      </Link>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa chương"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorChaptersPage;
