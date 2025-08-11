import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle
} from "lucide-react";
import apiService from "../../lib/ApiService";
import Loading from "../../components/ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import useAuthStore from "../../store/authStore";

const StoryEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  
  const [story, setStory] = useState({
    title: "",
    description: "",
    categories: [],
    coverImageUrl: "",
    isPublished: false
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isNewStory, setIsNewStory] = useState(!id);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchStory();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.status === "success") {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStory(id);
      if (response.status === "success") {
        setStory(response.data.story);
      }
    } catch (err) {
      console.error("Error fetching story:", err);
      setError("Không thể tải thông tin truyện");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setStory(prev => {
      // Check if category is already selected (handle both object and ID cases)
      const isSelected = prev.categories.some(cat => 
        (typeof cat === 'object' ? cat.id : cat) === categoryId
      );
      
      if (isSelected) {
        // Remove the category
        return {
          ...prev,
          categories: prev.categories.filter(cat => 
            (typeof cat === 'object' ? cat.id : cat) !== categoryId
          )
        };
      } else {
        // Add the category (store as ID for consistency)
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      }
    });
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      setError("");

      // Upload ảnh bìa mới
      const response = await apiService.uploadCoverImage(file);
      if (response.status === "success") {
        setStory(prev => ({ ...prev, coverImageUrl: response.data.url }));
        showSuccess("Tải ảnh bìa thành công!");
      }
    } catch (err) {
      console.error("Error uploading cover image:", err);
      showError("Không thể tải ảnh bìa");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Validation
      if (!story.title.trim()) {
        setError("Vui lòng nhập tiêu đề truyện");
        return;
      }

      if (story.categories.length === 0) {
        setError("Vui lòng chọn ít nhất một thể loại");
        return;
      }

      // Extract category IDs from story.categories (which contains full category objects)
      const categoryIds = story.categories.map(cat => typeof cat === 'object' ? cat.id : cat);

      // Tạo FormData để gửi file ảnh bìa cùng các trường khác
      const formData = new FormData();
      formData.append("title", story.title.trim());
      formData.append("description", story.description.trim());
      formData.append("status", story.status || "ongoing"); // Giữ nguyên status hiện tại
      formData.append("publicationStatus", "pending"); // Luôn gửi pending để admin duyệt
      formData.append("categoryIds", JSON.stringify(categoryIds));
      
      // Lấy file từ input (nếu có)
      const fileInput = document.getElementById("cover-upload");
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append("coverImage", fileInput.files[0]);
      }

      let response;
      if (isNewStory) {
        response = await apiService.createStory(formData);
      } else {
        // Use updateStory for updates to handle file uploads consistently
        response = await apiService.updateStory(id, formData);
      }

      if (response.status === "success") {
        showSuccess(isNewStory ? "Tạo truyện thành công và đã gửi để duyệt!" : "Cập nhật truyện thành công và đã gửi để duyệt!");
        navigate("/author/stories");
      }
    } catch (err) {
      console.error("Error saving story:", err);
      setError(err.message || "Không thể lưu truyện");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => handleSave();

  const handleStatusToggle = async () => {
    try {
      setSaving(true);
      setError("");

      const newStatus = story.status === 'ongoing' ? 'completed' : 'ongoing';
      const formData = new FormData();
      formData.append("status", newStatus);

      const response = await apiService.formRequest(`/stories/${id}`, formData, { method: "PATCH" });

      if (response.status === "success") {
        setStory(prev => ({ ...prev, status: newStatus }));
        showSuccess(`Đã đổi trạng thái truyện thành "${newStatus === 'ongoing' ? 'Đang viết' : 'Đã hoàn thành'}"`);
      } else {
        setError("Không thể đổi trạng thái truyện");
      }
    } catch (err) {
      console.error("Error toggling story status:", err);
      setError(err.message || "Không thể đổi trạng thái truyện");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/author/stories")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNewStory ? "Tạo truyện mới" : "Chỉnh sửa truyện"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : "Gửi để duyệt"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* Basic Information */}
            <div className="space-y-6">
              {!isNewStory && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    <div>
                      <p className="font-medium">Chỉnh sửa truyện</p>
                      <p className="text-sm">Sau khi chỉnh sửa, truyện sẽ được gửi để admin duyệt lại.</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề truyện *
                </label>
                <input
                  type="text"
                  name="title"
                  value={story.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề truyện"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả truyện
                </label>
                <textarea
                  name="description"
                  value={story.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mô tả truyện..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thể loại
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={story.categories.some(cat => 
                          (typeof cat === 'object' ? cat.id : cat) === category.id
                        )}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh bìa
                </label>
                <div className="flex items-center space-x-4">
                  {story.coverImageUrl && (
                    <div className="relative">
                      <img
                        src={story.coverImageUrl}
                        alt="Cover"
                        className="w-20 h-28 object-cover rounded-lg border"
                        style={{ minWidth: 80, minHeight: 112 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setStory(prev => ({ ...prev, coverImageUrl: "" }));
                          // Reset file input
                          const fileInput = document.getElementById("cover-upload");
                          if (fileInput) fileInput.value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Xóa ảnh bìa hiện tại"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Upload size={16} className="mr-2" />
                      {story.coverImageUrl ? "Thay đổi ảnh bìa" : "Tải ảnh bìa"}
                    </label>
                    {story.coverImageUrl && (
                      <p className="text-xs text-gray-500 mt-1">
                        Click để thay đổi ảnh bìa
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Story Status Toggle */}
              {!isNewStory && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Trạng thái truyện</h4>
                    <p className="text-sm text-gray-500">
                      {story.status === 'completed' ? 'Đã hoàn thành' : 'Đang viết'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStatusToggle()}
                    disabled={saving}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      story.status === 'completed'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    } disabled:opacity-50`}
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : story.status === 'completed' ? (
                      'Chuyển về đang viết'
                    ) : (
                      'Đánh dấu hoàn thành'
                    )}
                  </button>
                </div>
              )}

              {/* XÓA PHẦN XUẤT BẢN NGAY */}
              {/*
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={story.isPublished}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Xuất bản ngay
                </label>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryEditorPage; 