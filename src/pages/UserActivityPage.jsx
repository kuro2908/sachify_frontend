import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import useAuthStore from "../store/authStore";
import ReadingHistory from "../components/ReadingHistory";

const UserActivityPage = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đăng nhập để xem hoạt động
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để xem lịch sử đọc
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lịch sử đọc
          </h1>
          <p className="text-gray-600">
            Theo dõi các truyện bạn đã đọc
          </p>
        </div>

        {/* Content */}
        <ReadingHistory userId={user.id} />
      </div>
    </div>
  );
};

export default UserActivityPage; 