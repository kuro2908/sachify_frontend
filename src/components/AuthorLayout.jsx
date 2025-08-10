import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  FileText, 
  BarChart3, 
  LogOut,
  User
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { useToast } from "../contexts/ToastContext";
import AccessDenied from "./AccessDenied";

const AuthorLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { showSuccess } = useToast();

  // Check if user is author
  if (!user || user.role !== "author") {
    return <AccessDenied />;
  }

  const handleLogout = () => {
    logout();
    showSuccess("Đăng xuất thành công!");
    navigate("/", { replace: true });
  };

  const navigation = [
    { name: "Dashboard", href: "/author", icon: BarChart3 },
    { name: "Truyện của tôi", href: "/author/stories", icon: BookOpen },
  ];

  const isActive = (href) => {
    if (href === "/author") {
      return location.pathname === "/author";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg" style={{ top: '64px', height: 'calc(100vh - 64px)' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen size={24} className="text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Sachify</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-600">Tác giả</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <BookOpen size={20} />
                <span>Về trang chủ</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16">
        {children}
      </div>
    </div>
  );
};

export default AuthorLayout; 