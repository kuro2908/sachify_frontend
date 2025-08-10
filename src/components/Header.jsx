import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useToast } from "../contexts/ToastContext";
import { LogOut, LogIn, BookOpen, Search, Menu, X, User, Clock, ChevronDown } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

import ForgotPasswordModal from "./ForgotPasswordModal";

const Navbar = () => {
  const { user, logout, isAccountLocked } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const userDropdownRef = useRef(null);

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide header
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    showSuccess("Đăng xuất thành công!");
    navigate("/", { replace: true });
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToForgotPassword = () => {
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isUserDropdownOpen]);

  return (
    <>
      <nav className={`fixed bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 top-0 z-50 w-full transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Web Library text */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 transform hover:scale-105"
            >
              <div className="relative">
                <img src="../dist/small_logo_sachify.png" alt="Sachify" className="w-10 h-10" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sachify
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                to="/stories"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Danh sách truyện
              </Link>
              <Link
                to="/rankings"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Bảng xếp hạng
              </Link>
              {user && (user.role === "admin" || user.role === "manager") && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Quản lý
                </Link>
              )}
              {user && user.role === "author" && (
                <Link
                  to="/author"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Tác giả
                </Link>
              )}
              {user && user.role === "user" && (
                <Link
                  to="/become-author"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Làm tác giả
                </Link>
              )}
            </div>

            

            {/* Right side - Login/Register buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Account locked warning */}
                  {isAccountLocked() && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Tài khoản bị khóa
                    </div>
                  )}
                  
                  {/* User dropdown */}
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-700 hidden sm:inline">
                        {user.username}
                      </span>
                      <ChevronDown size={16} className="text-gray-600" />
                    </button>

                    {/* Dropdown menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <Link
                          to="/user/bookshelf"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <BookOpen size={16} className="mr-3" />
                          Tủ truyện
                        </Link>
                        <Link
                          to="/user/activity"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Clock size={16} className="mr-3" />
                          Hoạt động
                        </Link>

                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={openLoginModal}
                    className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <LogIn size={18} className="mr-2" />
                    <span className="hidden sm:inline">Đăng nhập</span>
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <span className="hidden sm:inline">Đăng ký</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white">
              <div className="space-y-4">
                {/* Mobile navigation links */}
                <div className="space-y-2">
                  <Link
                    to="/"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/stories"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Danh sách truyện
                  </Link>
                  <Link
                    to="/rankings"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bảng xếp hạng
                  </Link>
                  {user && (user.role === "admin" || user.role === "manager") && (
                    <Link
                      to="/admin"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Quản lý
                    </Link>
                  )}
                  {user && user.role === "author" && (
                    <Link
                      to="/author"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Tác giả
                    </Link>
                  )}
                </div>

                {/* Mobile search */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sách..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  />
                </div>

                {/* Mobile auth buttons */}
                {!user && (
                  <div className="flex space-x-3">
                    <button
                      onClick={openLoginModal}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={openRegisterModal}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Đăng ký
                    </button>
                  </div>
                )}

                {user && (
                  <div className="space-y-3">
                    {/* Account locked warning */}
                    {isAccountLocked() && (
                      <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                        ⚠️ Tài khoản của bạn đã bị khóa
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="font-semibold text-gray-700">
                        {user.username}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Link
                        to="/user/bookshelf"
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BookOpen size={16} className="mr-3" />
                        Tủ truyện
                      </Link>
                      <Link
                        to="/user/activity"
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Clock size={16} className="mr-3" />
                        Hoạt động
                      </Link>

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={switchToRegister}
        onSwitchToForgotPassword={switchToForgotPassword}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onSwitchToLogin={switchToLogin}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default Navbar;
