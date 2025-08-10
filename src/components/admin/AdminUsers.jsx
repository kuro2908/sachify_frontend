import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Search, User, Mail, Calendar, Edit, Shield, Lock, Unlock } from "lucide-react";
import apiService from "../../lib/ApiService";
import Loading from "../ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import AdminLayout from "../AdminLayout";
import useAuthStore from "../../store/authStore";

const AdminUsers = () => {
  const { showSuccess, showError } = useToast();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array to run only once

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getUsers();
      
      if (response.status === "success") {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      setUpdating(true);
      const response = await apiService.updateUserRole(userId, { role: newRole });
      
      if (response.status === "success") {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        setEditingUser(null);
        showSuccess("Cập nhật vai trò thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể cập nhật vai trò";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  // Kiểm tra quyền sửa role của user
  const canEditUserRole = (user) => {
    if (!currentUser) return false;
    
    // Admin có thể sửa tất cả
    if (currentUser.role === 'admin') return true;
    
    // Manager không thể sửa admin và manager khác
    if (currentUser.role === 'manager') {
      return user.role !== 'admin' && user.role !== 'manager';
    }
    
    return false;
  };

  // Kiểm tra quyền cấp role
  const canAssignRole = (newRole) => {
    if (!currentUser) return false;
    
    // Admin có thể cấp tất cả role
    if (currentUser.role === 'admin') return true;
    
    // Manager chỉ có thể cấp user và author
    if (currentUser.role === 'manager') {
      return newRole === 'user' || newRole === 'author';
    }
    
    return false;
  };

  // Kiểm tra quyền khóa/mở khóa tài khoản
  const canUpdateUserStatus = (user) => {
    if (!currentUser) return false;
    
    // Admin có thể khóa tất cả
    if (currentUser.role === 'admin') return true;
    
    // Manager không thể khóa admin và manager khác
    if (currentUser.role === 'manager') {
      return user.role !== 'admin' && user.role !== 'manager';
    }
    
    return false;
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      setUpdating(true);
      const response = await apiService.updateUserStatus(userId, { status: newStatus });
      
      if (response.status === "success") {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        showSuccess(newStatus === 'active' ? "Mở khóa tài khoản thành công" : "Khóa tài khoản thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể cập nhật trạng thái";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getRoleBadge = (role) => {
    const roleColors = {
      user: "bg-blue-100 text-blue-800",
      author: "bg-green-100 text-green-800", 
      manager: "bg-orange-100 text-orange-800",
      admin: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || roleColors.user}`}>
        {role === 'user' ? 'Người dùng' : 
         role === 'author' ? 'Tác giả' : 
         role === 'manager' ? 'Manager' : 'Admin'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Đang tải danh sách người dùng..." />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý người dùng
              </h1>
              <p className="text-gray-600">
                Xem và quản lý tất cả tài khoản đã đăng ký
              </p>
            </div>
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showPasswords ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
              {showPasswords ? "Ẩn thông tin nhạy cảm" : "Hiển thị thông tin nhạy cảm"}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {showPasswords ? user.email : "••••••••••••••••"}
                        </span>
                      </div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       {editingUser === user.id ? (
                         <select
                           value={user.role}
                           onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                           disabled={updating}
                           className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                         >
                           <option value="user" disabled={!canAssignRole('user')}>Người dùng</option>
                           <option value="author" disabled={!canAssignRole('author')}>Tác giả</option>
                           <option value="manager" disabled={!canAssignRole('manager')}>Manager</option>
                           <option value="admin" disabled={!canAssignRole('admin')}>Admin</option>
                         </select>
                       ) : (
                         <div className="flex items-center space-x-2">
                           {getRoleBadge(user.role)}
                           {canEditUserRole(user) && (
                             <button
                               onClick={() => setEditingUser(user.id)}
                               disabled={updating}
                               className="text-gray-400 hover:text-gray-600 transition-colors"
                             >
                               <Edit size={14} />
                             </button>
                           )}
                         </div>
                       )}
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {showPasswords ? formatDate(user.createdAt) : "••••••••••••••••"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Hoạt động' : 'Khóa'}
                        </span>
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, user.status === 'active' ? 'locked' : 'active')}
                          disabled={updating || !canUpdateUserStatus(user)}
                          className={`transition-colors ${
                            canUpdateUserStatus(user) 
                              ? 'text-gray-400 hover:text-gray-600' 
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={
                            canUpdateUserStatus(user)
                              ? (user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản')
                              : 'Không có quyền thay đổi trạng thái tài khoản này'
                          }
                        >
                          {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {updating && editingUser === user.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span>Cập nhật...</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {user.authorRequest && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Yêu cầu làm tác giả
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có người dùng nào được đăng ký'}
              </p>
            </div>
          )}
        </div>

                 {/* Summary */}
         <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
             <div className="bg-blue-50 p-4 rounded-lg">
               <div className="text-2xl font-bold text-blue-600">{users.length}</div>
               <div className="text-sm text-blue-600">Tổng số người dùng</div>
             </div>
             <div className="bg-green-50 p-4 rounded-lg">
               <div className="text-2xl font-bold text-green-600">
                 {users.filter(u => u.role === 'user').length}
               </div>
               <div className="text-sm text-green-600">Người dùng thường</div>
             </div>
             <div className="bg-purple-50 p-4 rounded-lg">
               <div className="text-2xl font-bold text-purple-600">
                 {users.filter(u => u.role === 'author').length}
               </div>
               <div className="text-sm text-purple-600">Tác giả</div>
             </div>
             <div className="bg-orange-50 p-4 rounded-lg">
               <div className="text-2xl font-bold text-orange-600">
                 {users.filter(u => u.role === 'manager').length}
               </div>
               <div className="text-sm text-orange-600">Manager</div>
             </div>
             <div className="bg-red-50 p-4 rounded-lg">
               <div className="text-2xl font-bold text-red-600">
                 {users.filter(u => u.role === 'admin').length}
               </div>
               <div className="text-sm text-red-600">Admin</div>
             </div>
           </div>
         </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 