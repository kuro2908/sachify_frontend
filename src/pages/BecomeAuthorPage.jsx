import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, AlertCircle, Send } from "lucide-react";
import apiService from "../lib/ApiService";
import useAuthStore from "../store/authStore";
import { useToast } from "../contexts/ToastContext";

const BecomeAuthorPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToast();

  const handleRequestAuthorRole = async () => {
    if (!isAuthenticated()) {
      showError("Vui lòng đăng nhập để thực hiện yêu cầu này");
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiService.requestAuthorRole();
      
      if (response.status === "success") {
        showSuccess("Yêu cầu làm tác giả đã được gửi thành công! Admin sẽ xem xét và phản hồi sớm nhất.");
      }
    } catch (error) {
      console.error("Error requesting author role:", error);
      showError(error.message || "Không thể gửi yêu cầu làm tác giả");
    } finally {
      setSubmitting(false);
    }
  };

  const rules = [
    {
      title: "Nội dung chất lượng",
      description: "Đảm bảo truyện có nội dung hay, không vi phạm quy định cộng đồng",
      icon: CheckCircle
    },
    {
      title: "Cập nhật thường xuyên",
      description: "Duy trì lịch đăng chương đều đặn để độc giả theo dõi",
      icon: CheckCircle
    },
    {
      title: "Tôn trọng bản quyền",
      description: "Không sao chép, đạo nhái nội dung từ tác phẩm khác",
      icon: CheckCircle
    },
    {
      title: "Tương tác với độc giả",
      description: "Phản hồi bình luận và tương tác tích cực với cộng đồng",
      icon: CheckCircle
    },
    {
      title: "Tuân thủ quy định",
      description: "Tuân thủ mọi quy định của nền tảng và pháp luật",
      icon: AlertCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trở thành Tác giả
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chia sẻ câu chuyện của bạn với cộng đồng độc giả yêu thích truyện
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">
              Tại sao nên trở thành tác giả?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-semibold mb-2">Sáng tạo tự do</h3>
                <p className="text-blue-100 text-sm">
                  Viết truyện theo ý tưởng và phong cách của riêng bạn
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-semibold mb-2">Cộng đồng lớn</h3>
                <p className="text-blue-100 text-sm">
                  Kết nối với hàng nghìn độc giả yêu thích truyện
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send size={24} />
                </div>
                <h3 className="font-semibold mb-2">Phát triển kỹ năng</h3>
                <p className="text-blue-100 text-sm">
                  Rèn luyện khả năng viết và sáng tạo nội dung
                </p>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nội quy và trách nhiệm của Tác giả
            </h2>
            
            <div className="space-y-6 mb-8">
              {rules.map((rule, index) => {
                const Icon = rule.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      rule.icon === AlertCircle 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {rule.title}
                      </h3>
                      <p className="text-gray-600">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Lưu ý quan trọng
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    Việc vi phạm nội quy có thể dẫn đến việc thu hồi quyền tác giả hoặc khóa tài khoản. 
                    Hãy đảm bảo bạn đã đọc kỹ và đồng ý với tất cả quy định trước khi gửi yêu cầu.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRequestAuthorRole}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang gửi yêu cầu...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Xin cấp quyền Tác giả
                  </>
                )}
              </button>
              
              <Link
                to="/"
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-600">
          <p>
            Có câu hỏi? Liên hệ với chúng tôi qua{" "}
            <a href="mailto:support@sachify.com" className="text-blue-600 hover:underline">
              support@sachify.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BecomeAuthorPage;
