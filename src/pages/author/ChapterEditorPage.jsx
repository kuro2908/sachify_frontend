import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle,
  FileText,
  Upload,
  Image,
  Type
} from "lucide-react";
import apiService from "../../lib/ApiService";
import Loading from "../../components/ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import useAuthStore from "../../store/authStore";

const ChapterEditorPage = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  
  const [chapter, setChapter] = useState({
    title: "",
    content: "",
    chapterNumber: 1,
    contentType: "TEXT", // TEXT hoặc IMAGES
    isPublished: false
  });
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isNewChapter, setIsNewChapter] = useState(!chapterId);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchStory();
    if (chapterId) {
      fetchChapter();
    } else {
      setLoading(false);
    }
  }, [storyId, chapterId]);

  const fetchStory = async () => {
    try {
      const response = await apiService.getStory(storyId);
      if (response.status === "success") {
        setStory(response.data.story);
      }
    } catch (err) {
      console.error("Error fetching story:", err);
      setError("Không thể tải thông tin truyện");
    }
  };

  const fetchChapter = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAuthorChapter(chapterId);
      if (response.status === "success") {
        setChapter(response.data.chapter);
      }
    } catch (err) {
      console.error("Error fetching chapter:", err);
      setError("Không thể tải thông tin chương");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChapter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSave = async (isPublish = false) => {
    try {
      setSaving(true);
      setError("");
      setUploadProgress(0);
      setIsUploading(false);

      // Kiểm tra dữ liệu trước khi gửi
      if (!storyId) {
        setError("Không tìm thấy ID truyện");
        return;
      }

      if (!chapter.title || !chapter.contentType) {
        setError("Vui lòng điền đầy đủ thông tin chương");
        return;
      }

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('storyId', storyId);
      formData.append('chapterNumber', chapter.chapterNumber);
      formData.append('title', chapter.title);
      formData.append('contentType', chapter.contentType);
      formData.append('isPublished', isPublish);

      // Thêm nội dung tùy theo loại
      if (chapter.contentType === 'TEXT') {
        formData.append('content', chapter.content);
      } else if (chapter.contentType === 'IMAGES') {
        // Thêm tất cả file ảnh
        selectedFiles.forEach((file, index) => {
          formData.append('files', file);
        });
        
        // Bắt đầu progress tracking cho upload ảnh
        if (selectedFiles.length > 0) {
          setIsUploading(true);
          setUploadProgress(0);
          
          // Simulate progress (vì không có real-time progress từ Firebase)
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 1000);
        }
      }

      let response;
      if (isNewChapter) {
        response = await apiService.createChapter(formData);
      } else {
        response = await apiService.updateAuthorChapter(chapterId, formData);
      }

      // Upload hoàn tất
      if (chapter.contentType === 'IMAGES' && selectedFiles.length > 0) {
        setUploadProgress(100);
        setIsUploading(false);
      }

      if (response.status === "success") {
        showSuccess(isNewChapter ? "Tạo chương thành công!" : "Cập nhật chương thành công!");
        navigate(`/author/stories/${storyId}/chapters`);
      }
    } catch (err) {
      console.error("Error saving chapter:", err);
      setError(err.message || "Không thể lưu chương");
      // Reset upload progress nếu có lỗi
      if (chapter.contentType === 'IMAGES') {
        setUploadProgress(0);
        setIsUploading(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => handleSave(false);
  const handlePublish = () => handleSave(true);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/author/stories/${storyId}/chapters`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isNewChapter ? "Tạo chương mới" : "Chỉnh sửa chương"}
              </h1>
              {story && (
                <p className="text-gray-600 mt-1">
                  Truyện: {story.title}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {previewMode ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
              {previewMode ? "Ẩn xem trước" : "Xem trước"}
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={saving || isUploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : 
               isUploading ? <Loader2 size={16} className="animate-spin" /> : "Lưu nháp"}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving || isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : 
               isUploading ? <Loader2 size={16} className="animate-spin" /> : "Xuất bản ngay"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}
        
        {/* Upload Progress Message */}
        {isUploading && uploadProgress > 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <Loader2 size={20} className="mr-2 animate-spin" />
            <div>
              <div className="font-medium">Đang upload ảnh lên Firebase...</div>
              <div className="text-sm">Tiến độ: {uploadProgress}% - Vui lòng đợi, quá trình này có thể mất vài phút</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số chương
                  </label>
                  <input
                    type="number"
                    name="chapterNumber"
                    value={chapter.chapterNumber}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề chương *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={chapter.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tiêu đề chương"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại nội dung *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      chapter.contentType === 'TEXT' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="contentType"
                        value="TEXT"
                        checked={chapter.contentType === 'TEXT'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Type size={24} className={`mr-3 ${chapter.contentType === 'TEXT' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium text-gray-900">Truyện chữ</div>
                        <div className="text-sm text-gray-500">Nội dung văn bản</div>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      chapter.contentType === 'IMAGES' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="contentType"
                        value="IMAGES"
                        checked={chapter.contentType === 'IMAGES'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Image size={24} className={`mr-3 ${chapter.contentType === 'IMAGES' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium text-gray-900">Truyện tranh</div>
                        <div className="text-sm text-gray-500">Nội dung ảnh</div>
                      </div>
                    </label>
                  </div>
                </div>

                {chapter.contentType === 'TEXT' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung chương *
                    </label>
                    <textarea
                      name="content"
                      value={chapter.content}
                      onChange={handleInputChange}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Nhập nội dung chương..."
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload ảnh chương *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        required
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Chọn file ảnh
                        </span>
                        <span className="text-gray-500"> hoặc kéo thả vào đây</span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Hỗ trợ: JPG, PNG, GIF. Tối đa 10MB mỗi file.
                      </p>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Đã chọn {selectedFiles.length} file:
                        </h4>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Progress Bar cho Upload */}
                        {isUploading && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Đang upload lên Firebase...
                              </span>
                              <span className="text-sm text-gray-500">
                                {uploadProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Vui lòng đợi, quá trình này có thể mất vài phút tùy thuộc vào số lượng ảnh
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle size={20} className="text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Về nút "Xuất bản ngay"</h4>
                      <p className="text-sm text-blue-800">
                        Khi bấm "Xuất bản ngay", chương sẽ được đăng lên ngay lập tức và độc giả có thể đọc được. 
                        Nếu bấm "Lưu nháp", chương sẽ được lưu nhưng chưa hiển thị cho độc giả.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Xem trước</h3>
                <FileText size={20} className="text-gray-400" />
              </div>
              
              {previewMode ? (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Chương {chapter.chapterNumber}: {chapter.title}
                  </h2>
                  
                  {chapter.contentType === 'TEXT' ? (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {chapter.content || "Nội dung sẽ hiển thị ở đây..."}
                    </div>
                  ) : (
                    <div className="text-gray-700">
                      {selectedFiles.length > 0 ? (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Sẽ hiển thị {selectedFiles.length} ảnh theo thứ tự:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="text-center p-2 bg-gray-50 rounded">
                                <div className="text-xs text-gray-500 mb-1">Trang {index + 1}</div>
                                <div className="text-sm font-medium truncate">{file.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Image size={48} className="mx-auto mb-4 text-gray-300" />
                          <p>Chưa có ảnh nào được chọn</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Eye size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Nhấn "Xem trước" để xem nội dung chương</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditorPage; 