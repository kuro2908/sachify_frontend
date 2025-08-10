import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FolderOpen,
  Calendar,
  BookOpen,
  Loader2
} from "lucide-react";
import apiService from "../../lib/ApiService";
import Loading from "../ui/Loading";
import { useToast } from "../../contexts/ToastContext";
import AdminLayout from "../AdminLayout";

const AdminCategories = () => {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getCategories();
      
      if (response.status === "success") {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      showError("Tên danh mục không được để trống");
      return;
    }

    try {
      setUpdating(true);
      const response = await apiService.createCategory(newCategory);
      
      if (response.status === "success") {
        setCategories([...categories, response.data.category]);
        setNewCategory({ name: "" });
        setShowAddForm(false);
        showSuccess("Tạo danh mục thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể tạo danh mục";
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateCategory = async (categoryId, updatedData) => {
    if (!updatedData.name.trim()) {
      showError("Tên danh mục không được để trống");
      return;
    }

    try {
      setUpdating(true);
      const response = await apiService.updateCategory(categoryId, updatedData);
      
      if (response.status === "success") {
        setCategories(categories.map(cat => 
          cat.id === categoryId ? { ...cat, ...response.data.category } : cat
        ));
        setEditingCategory(null);
        showSuccess("Cập nhật danh mục thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể cập nhật danh mục";
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Các truyện thuộc danh mục này sẽ mất danh mục.")) {
      return;
    }

    try {
      setUpdating(true);
      const response = await apiService.deleteCategory(categoryId);
      
      if (response.status === "success") {
        setCategories(categories.filter(cat => cat.id !== categoryId));
        showSuccess("Xóa danh mục thành công");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể xóa danh mục";
      showError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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
            Quản lý danh mục
          </h1>
          <p className="text-gray-600">
            Quản lý các danh mục truyện trong hệ thống
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng danh mục</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách danh mục ({filteredCategories.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredCategories.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm 
                  ? "Không tìm thấy danh mục nào phù hợp" 
                  : "Chưa có danh mục nào"
                }
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                  {editingCategory?.id === category.id ? (
                    <div className="space-y-4">
                                             <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục *
                          </label>
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({
                              ...editingCategory,
                              name: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateCategory(category.id, editingCategory)}
                          disabled={updating}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {updating ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          disabled={updating}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {category.name}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <BookOpen size={16} />
                            <span>ID: {category.id}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Slug: {category.slug}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setEditingCategory({
                            id: category.id,
                            name: category.name,
                            slug: category.slug
                          })}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={updating}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa danh mục"
                        >
                          {updating ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Category Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Thêm danh mục mới
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCategory({ name: "" });
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên danh mục *
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({
                        ...newCategory,
                        name: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên danh mục"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCreateCategory}
                      disabled={updating || !newCategory.name.trim()}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Thêm danh mục
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewCategory({ name: "" });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                  </div>
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

export default AdminCategories; 