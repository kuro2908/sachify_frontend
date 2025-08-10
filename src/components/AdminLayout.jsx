import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  FolderOpen, 
  BarChart3,
  ChevronRight
} from "lucide-react";
import useAuthStore from "../store/authStore";
import AccessDenied from "./AccessDenied";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  // Check if user is admin or manager
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return <AccessDenied />;
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      current: location.pathname === "/admin"
    },
    {
      name: "Quản lý người dùng",
      href: "/admin/users",
      icon: Users,
      current: location.pathname === "/admin/users"
    },
    {
      name: "Quản lý truyện",
      href: "/admin/stories",
      icon: BookOpen,
      current: location.pathname === "/admin/stories"
    },
    {
      name: "Quản lý danh mục",
      href: "/admin/categories",
      icon: FolderOpen,
      current: location.pathname === "/admin/categories"
    }
  ];

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: "Trang chủ", href: "/" },
      { name: "Admin", href: "/admin" }
    ];

    if (pathSegments.length > 1) {
      const currentPage = navigation.find(item => item.href === location.pathname);
      if (currentPage) {
        breadcrumbs.push({ name: currentPage.name, href: currentPage.href });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200" style={{ marginTop: '0px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 py-4">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight size={16} className="text-gray-400 mx-2" />
                )}
                <Link
                  to={breadcrumb.href}
                  className={`text-sm font-medium transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {breadcrumb.name}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout; 