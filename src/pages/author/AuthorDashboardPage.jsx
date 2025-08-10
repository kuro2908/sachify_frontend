import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp,
  Plus,
  Edit,
  Calendar,
  Loader2,
  FileText
} from "lucide-react";

import Loading from "../../components/ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import useAuthStore from "../../store/authStore";

const AuthorDashboardPage = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);



  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Tác Giả</h1>
          <p className="text-gray-600 mt-2">Quản lý truyện và theo dõi hiệu suất</p>
        </div>





        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/author/stories/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h4 className="font-medium text-gray-900">Tạo truyện mới</h4>
                <p className="text-sm text-gray-600">Đăng truyện mới</p>
              </div>
            </Link>

            <Link
              to="/author/stories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h4 className="font-medium text-gray-900">Quản lý truyện</h4>
                <p className="text-sm text-gray-600">Chỉnh sửa truyện</p>
              </div>
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AuthorDashboardPage; 