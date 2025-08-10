import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  BookOpen,
  User,
  Calendar,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import apiService from "../../lib/ApiService";
import Loading from "../ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import AdminLayout from "../AdminLayout";

const AdminStories = () => {
  const { showSuccess, showError } = useToast();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStoryDetail, setShowStoryDetail] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [currentPage, statusFilter]);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Đúng: truyền object params
      const params = { page: currentPage };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await apiService.getAdminStories(params);

      if (response.status === "success") {
        setStories(response.data.stories || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  const handleApproveStory = async (storyId) => {
    try {
      setUpdating(true);
      const response = await apiService.approveStory(storyId);
      
      if (response.status === "success") {
        setStories(stories.map(story => 
          story.id === storyId ? { ...story, publicationStatus: 'approved' } : story
        ));
        showSuccess("Duyệt truyện thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể duyệt truyện";
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectStory = async (storyId) => {
    try {
      setUpdating(true);
      
      
      const response = await apiService.rejectStory(storyId);
      
      
      if (response.status === "success") {
        setStories(stories.map(story => 
          story.id === storyId ? { ...story, publicationStatus: 'rejected' } : story
        ));
        showSuccess("Từ chối truyện thành công");
      }
    } catch (err) {
      console.error('Error rejecting story:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.message || "Không thể từ chối truyện";
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleHideStory = async (storyId) => {
    try {
      setUpdating(true);
      const response = await apiService.hideStory(storyId);
      
      if (response.status === "success") {
        setStories(stories.map(story => 
          story.id === storyId ? { ...story, publicationStatus: 'hidden' } : story
        ));
        showSuccess("Ẩn truyện thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể ẩn truyện";
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleUnhideStory = async (storyId) => {
    try {
      setUpdating(true);
      const response = await apiService.unhideStory(storyId);
      
      if (response.status === "success") {
        setStories(stories.map(story => 
          story.id === storyId ? { ...story, publicationStatus: 'approved' } : story
        ));
        showSuccess("Hiện lại truyện thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể hiện lại truyện";
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.author?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: "bg-yellow-100 text-yellow-800", 
        icon: Clock,
        text: "Chờ duyệt" 
      },
      approved: { 
        color: "bg-green-100 text-green-800", 
        icon: CheckCircle,
        text: "Đã duyệt" 
      },
      rejected: { 
        color: "bg-red-100 text-red-800", 
        icon: XCircle,
        text: "Từ chối" 
      },
      hidden: { 
        color: "bg-gray-100 text-gray-800", 
        icon: EyeOff,
        text: "Đã ẩn" 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  const getStatusCounts = () => {
    const counts = {
      pending: stories.filter(s => s.publicationStatus === 'pending').length,
      approved: stories.filter(s => s.publicationStatus === 'approved').length,
      rejected: stories.filter(s => s.publicationStatus === 'rejected').length,
      hidden: stories.filter(s => s.publicationStatus === 'hidden').length,
      total: stories.length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <Loading />;
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý duyệt truyện
          </h1>
          <p className="text-gray-600">
            Duyệt và quản lý các truyện được đăng tải
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng truyện</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Từ chối</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên truyện hoặc tác giả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stories List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách truyện ({filteredStories.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredStories.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Không tìm thấy truyện nào phù hợp" 
                  : "Chưa có truyện nào"
                }
              </div>
            ) : (
              filteredStories.map((story) => (
                <div key={story.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {story.title}
                        </h4>
                        {getStatusBadge(story.publicationStatus)}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>{story.author?.username || 'Không xác định'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{formatDate(story.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={16} />
                          <span>{story.chapters?.length || 0} chương</span>
                        </div>
                      </div>

                      {story.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {story.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedStory(story);
                          setShowStoryDetail(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={20} />
                      </button>

                      {story.publicationStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveStory(story.id)}
                            disabled={updating}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Duyệt truyện"
                          >
                            {updating ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                          </button>
                          <button
                            onClick={() => handleRejectStory(story.id)}
                            disabled={updating}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Từ chối truyện"
                          >
                            {updating ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} />}
                          </button>
                        </>
                      )}

                      {story.publicationStatus === 'approved' && (
                        <button
                          onClick={() => handleHideStory(story.id)}
                          disabled={updating}
                          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Ẩn truyện"
                        >
                          {updating ? <Loader2 size={20} className="animate-spin" /> : <EyeOff size={20} />}
                        </button>
                      )}

                      {story.publicationStatus === 'hidden' && (
                        <button
                          onClick={() => handleUnhideStory(story.id)}
                          disabled={updating}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Hiện lại truyện"
                        >
                          {updating ? <Loader2 size={20} className="animate-spin" /> : <Eye size={20} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              <span className="px-3 py-2 text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </nav>
          </div>
        )}

        {/* Story Detail Modal */}
        {showStoryDetail && selectedStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Chi tiết truyện
                  </h3>
                  <button
                    onClick={() => setShowStoryDetail(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên truyện</label>
                        <p className="text-gray-900">{selectedStory.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tác giả</label>
                        <p className="text-gray-900">{selectedStory.author?.username || 'Không xác định'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <div className="mt-1">{getStatusBadge(selectedStory.publicationStatus)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                        <p className="text-gray-900">{formatDate(selectedStory.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {selectedStory.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedStory.description}</p>
                    </div>
                  )}

                  {selectedStory.chapters && selectedStory.chapters.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh sách chương ({selectedStory.chapters.length})
                      </label>
                      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        <div className="space-y-1">
                          {selectedStory.chapters.slice(0, 10).map((chapter) => (
                            <div key={chapter.id} className="text-sm text-gray-700 truncate" title={`Chương ${chapter.chapterNumber}: ${chapter.title}`}>
                              Chương {chapter.chapterNumber}: {chapter.title}
                            </div>
                          ))}
                          {selectedStory.chapters.length > 10 && (
                            <div className="text-sm text-gray-500 italic">
                              ... và {selectedStory.chapters.length - 10} chương khác
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedStory.publicationStatus === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          handleApproveStory(selectedStory.id);
                          setShowStoryDetail(false);
                        }}
                        disabled={updating}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        Duyệt truyện
                      </button>
                      <button
                        onClick={() => {
                          handleRejectStory(selectedStory.id);
                          setShowStoryDetail(false);
                        }}
                        disabled={updating}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                        Từ chối truyện
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStories; 