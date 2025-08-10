import React, { useState, useEffect } from "react";
import { 
  Users, 
  BookOpen, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp,
  BarChart3,
  Calendar,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../../lib/ApiService";
import Loading from "../ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import AdminLayout from "../AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStories: 0,
    totalCategories: 0,
    pendingStories: 0,
    approvedStories: 0,
    rejectedStories: 0,
    totalViews: 0,
    totalComments: 0
  });
  const [recentStories, setRecentStories] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch stats
      const statsResponse = await apiService.getAdminStats();
      if (statsResponse.status === "success") {
        setStats(statsResponse.data);
      }

      // Fetch recent stories
      const storiesResponse = await apiService.getAdminStories({ limit: 5 });
      if (storiesResponse.status === "success") {
        setRecentStories(storiesResponse.data.stories || []);
      }

      // Fetch recent users
      const usersResponse = await apiService.getUsers({ limit: 5 });
      if (usersResponse.status === "success") {
        setRecentUsers(usersResponse.data.users || []);
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
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

  const getRoleBadge = (role) => {
    const roleColors = {
      user: "bg-blue-100 text-blue-800",
      author: "bg-green-100 text-green-800", 
      admin: "bg-red-100 text-red-800"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role] || roleColors.user}`}>
        {role === 'user' ? 'Người dùng' : role === 'author' ? 'Tác giả' : 'Admin'}
      </span>
    );
  };

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
            Dashboard
          </h1>
          <p className="text-gray-600">
            Tổng quan hệ thống và thống kê
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Stories */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng truyện</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStories}</p>
              </div>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                {/* FolderOpen icon was removed from imports, so using a placeholder or removing if not needed */}
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Danh mục</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  {/* Clock icon was removed from imports, so using a placeholder or removing if not needed */}
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingStories}</p>
                </div>
              </div>
              <Link
                to="/admin/stories?status=pending"
                className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                {/* ArrowUpRight icon was removed from imports, so using a placeholder or removing if not needed */}
                <TrendingUp size={20} />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  {/* CheckCircle icon was removed from imports, so using a placeholder or removing if not needed */}
                  <ThumbsUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvedStories}</p>
                </div>
              </div>
              <Link
                to="/admin/stories?status=approved"
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                {/* ArrowUpRight icon was removed from imports, so using a placeholder or removing if not needed */}
                <TrendingUp size={20} />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  {/* XCircle icon was removed from imports, so using a placeholder or removing if not needed */}
                  <Loader2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Từ chối</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejectedStories}</p>
                </div>
              </div>
              <Link
                to="/admin/stories?status=rejected"
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                {/* ArrowUpRight icon was removed from imports, so using a placeholder or removing if not needed */}
                <TrendingUp size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/users"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900">Quản lý người dùng</h4>
                  <p className="text-sm text-gray-600">{stats.totalUsers} tài khoản</p>
                </div>
              </Link>

              <Link
                to="/admin/stories"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900">Quản lý truyện</h4>
                  <p className="text-sm text-gray-600">{stats.pendingStories} chờ duyệt</p>
                </div>
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* FolderOpen icon was removed from imports, so using a placeholder or removing if not needed */}
                <BarChart3 className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900">Quản lý danh mục</h4>
                  <p className="text-sm text-gray-600">{stats.totalCategories} danh mục</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Stories */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Truyện gần đây</h3>
                <Link
                  to="/admin/stories"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentStories.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Chưa có truyện nào
                </div>
              ) : (
                recentStories.map((story) => (
                  <div key={story.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>{story.author?.username || 'Không xác định'}</span>
                          <span>{formatDate(story.createdAt)}</span>
                          <span>{story.chapters?.length || 0} chương</span>
                        </div>
                        {getStatusBadge(story.publicationStatus)}
                      </div>
                      <Link
                        to={`/admin/stories`}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        {/* ArrowUpRight icon was removed from imports, so using a placeholder or removing if not needed */}
                        <TrendingUp size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Người dùng gần đây</h3>
                <Link
                  to="/admin/users"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentUsers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Chưa có người dùng nào
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {user.username}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>{user.email}</span>
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Hoạt động' : 'Khóa'}
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/admin/users"
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        {/* ArrowUpRight icon was removed from imports, so using a placeholder or removing if not needed */}
                        <TrendingUp size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>


        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 