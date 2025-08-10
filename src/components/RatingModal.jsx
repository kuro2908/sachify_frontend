import React, { useState, useEffect } from "react";
import { Star, X, Loader2 } from "lucide-react";
import apiService from "../lib/ApiService";
import { useToast } from "../contexts/ToastContext";

const RatingModal = ({ isOpen, onClose, storyId, storyTitle, currentRating = null, onRatingSubmitted }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen && currentRating) {
      setRating(currentRating);
    }
  }, [isOpen, currentRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      showError("Vui lòng chọn điểm đánh giá");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiService.postReview(storyId, {
        rating,
        content: content.trim() || null
      });

      if (response.status === "success") {
        showSuccess(response.message);
        onRatingSubmitted(rating, content);
        onClose();
        // Reset form
        setRating(0);
        setContent("");
      }
    } catch (error) {
      console.error("Rating error:", error);
      showError(error.message || "Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form
      setRating(0);
      setContent("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-3xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Đánh giá truyện
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {storyTitle}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Stars */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Điểm đánh giá *
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all duration-200 transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center text-sm text-gray-600">
                {rating > 0 && (
                  <span className="font-medium">
                    {rating === 1 && "Rất tệ"}
                    {rating === 2 && "Tệ"}
                    {rating === 3 && "Bình thường"}
                    {rating === 4 && "Tốt"}
                    {rating === 5 && "Rất tốt"}
                  </span>
                )}
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nhận xét (tùy chọn)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về truyện này..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 transition-all duration-200 resize-none"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <Star size={20} />
                  <span>
                    {currentRating ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
