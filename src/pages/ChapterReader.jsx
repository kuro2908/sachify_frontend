import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiService from "../lib/ApiService";
import useAuthStore from "../store/authStore";
import Comments from "../components/Comments";
import Toast from "../components/Toast";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Settings,
  Share2,
  Bookmark,
  Loader2,
  ArrowLeft,
  Eye,
  MessageCircle,
  X,
} from "lucide-react";

const ChapterReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [theme, setTheme] = useState("light");
  const [showSettings, setShowSettings] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);


  useEffect(() => {
    fetchChapter();
  }, [id]);

  // Keyboard shortcut for settings
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false);
      }
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSettings(!showSettings);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showSettings]);

  const fetchChapter = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getChapter(id);

      if (response.status === "success") {
        setChapter(response.data);

        // If we have story info, fetch it
        if (response.data.storyId) {
          fetchStoryInfo(response.data.storyId);
        }

        // Record reading history if user is authenticated
        if (isAuthenticated()) {
          recordReadingHistory();
        }
      }
    } catch (err) {
      setError(err.message || "Không thể tải nội dung chương");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoryInfo = async (storyId) => {
    try {
      const response = await apiService.getStory(storyId);
      if (response.status === "success") {
        setStory(response.data.story);
      }
    } catch (err) {
      console.error("Error fetching story info:", err);
    }
  };

  const recordReadingHistory = async () => {
    try {
      await apiService.saveReadingProgress(parseInt(id));
    } catch (err) {
      console.error("Error recording reading history:", err);
    }
  };

  const navigateToChapter = (direction) => {
    if (!story || !story.chapters) return;

    const currentIndex = story.chapters.findIndex(
      (ch) => ch.id === parseInt(id)
    );
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === "prev") {
      nextIndex = currentIndex - 1;
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= 0 && nextIndex < story.chapters.length) {
      const nextChapter = story.chapters[nextIndex];
      navigate(`/chapters/${nextChapter.id}`);
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case "dark":
        return {
          bg: "bg-gray-900",
          text: "text-gray-100",
          border: "border-gray-700",
        };
      case "sepia":
        return {
          bg: "bg-amber-50",
          text: "text-gray-800",
          border: "border-amber-200",
        };
      default:
        return {
          bg: "bg-white",
          text: "text-gray-900",
          border: "border-gray-200",
        };
    }
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      
      // Hiển thị toast thông báo
      setShowShareToast(true);
      
      // Tự động ẩn toast sau 3 giây
      setTimeout(() => {
        setShowShareToast(false);
      }, 3000);
    } catch (err) {
      console.error('Không thể copy link:', err);
      // Fallback cho trình duyệt cũ
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowShareToast(true);
      setTimeout(() => {
        setShowShareToast(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải nội dung chương...</p>
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy chương</p>
        </div>
      </div>
    );
  }

  const themeStyles = getThemeStyles();

  return (
    <div className={`min-h-screen ${themeStyles.bg}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-40 ${themeStyles.bg} border-b ${themeStyles.border} shadow-sm`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back to story */}
            {story && (
              <Link
                to={`/stories/${story.id}`}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="hidden sm:inline">{story.title}</span>
              </Link>
            )}

            {/* Chapter title */}
            <div className="flex-1 text-center">
              <h1
                className={`text-lg font-semibold ${themeStyles.text} truncate max-w-md mx-auto`}
              >
                {chapter.title}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg hover:bg-gray-100 ${themeStyles.text}`}
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleShare}
                className={`p-2 rounded-lg hover:bg-gray-100 ${themeStyles.text}`}
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel - Floating Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className={`${themeStyles.bg} rounded-lg shadow-xl max-w-md w-full p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${themeStyles.text}`}>
                Cài đặt đọc
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${themeStyles.text} opacity-70`}>
                  Ctrl+S
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${themeStyles.text}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label
                  className={`block text-sm font-medium ${themeStyles.text} mb-2`}
                >
                  Cỡ chữ
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    A-
                  </button>
                  <span className={`px-3 py-1 ${themeStyles.text}`}>
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label
                  className={`block text-sm font-medium ${themeStyles.text} mb-2`}
                >
                  Khoảng cách dòng
                </label>
                <select
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  className="w-full px-3 py-1 border rounded"
                >
                  <option value={1.2}>Chặt</option>
                  <option value={1.6}>Bình thường</option>
                  <option value={2.0}>Rộng</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label
                  className={`block text-sm font-medium ${themeStyles.text} mb-2`}
                >
                  Giao diện
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                >
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                  <option value="sepia">Sepia</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg hover:shadow-xl transition-all ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : theme === 'sepia'
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title="Cài đặt đọc"
      >
        <Settings size={24} />
      </button>

      {/* Share Toast */}
      <Toast
        message="Đã sao chép liên kết!"
        type="success"
        isVisible={showShareToast}
        onClose={() => setShowShareToast(false)}
        position="bottom-center"
      />

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`prose prose-lg max-w-none ${themeStyles.text}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {chapter.contentType === "TEXT" ? (
            <div className="whitespace-pre-wrap leading-relaxed">
              {chapter.content}
            </div>
          ) : Array.isArray(chapter.content) ? (
            <div className="space-y-4">
              {chapter.content.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Hình ảnh ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-sm"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x800?text=Không+thể+tải+ảnh";
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-red-500">Không có nội dung chương.</div>
          )}
        </div>

        {/* Chapter Navigation */}
        {story && story.chapters && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToChapter("prev")}
                disabled={
                  story.chapters.findIndex((ch) => ch.id === parseInt(id)) === 0
                }
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="mr-2" />
                Chương trước
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Chương{" "}
                  {story.chapters.findIndex((ch) => ch.id === parseInt(id)) + 1}{" "}
                  / {story.chapters.length}
                </span>
              </div>

              <button
                onClick={() => navigateToChapter("next")}
                disabled={
                  story.chapters.findIndex((ch) => ch.id === parseInt(id)) ===
                  story.chapters.length - 1
                }
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Chương tiếp
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Chapter List */}
        {story && story.chapters && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Danh sách chương</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {story.chapters.slice(0, 12).map((ch) => (
                <Link
                  key={ch.id}
                  to={`/chapters/${ch.id}`}
                  className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                    ch.id === parseInt(id)
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "border-gray-200"
                  }`}
                >
                  <div className="font-medium truncate" title={ch.title}>{ch.title}</div>
                  <div className="text-sm text-gray-500">
                    Chương {ch.chapterNumber}
                  </div>
                </Link>
              ))}
            </div>
            {story.chapters.length > 12 && (
              <div className="text-center mt-4">
                <Link
                  to={`/stories/${story.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xem tất cả {story.chapters.length} chương
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Comments Section */}
        {chapter && (
          <Comments 
            chapterId={chapter.id} 
            storyId={chapter.storyId}
            type="chapter"
          />
        )}
      </div>
    </div>
  );
};

export default ChapterReader;
