import React, { useState, useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import apiService from "../lib/ApiService";
import {
  X,
  Eye,
  EyeOff,
  UserPlus,
  User,
  Lock,
  Mail,
  BookOpen,
} from "lucide-react";
import GoogleLoginButton from "./ui/GoogleLoginButton";
import { useToast } from "../contexts/ToastContext";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { showSuccess, showError } = useToast();

  // Refs
  const emailRef = useRef(null);

  // State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Auth store
  const {
    login,
    setLoading,
    setError,
    clearError,
    isLoading: authLoading,
    error: authError,
  } = useAuthStore();

  // Auto focus email input when modal opens
  useEffect(() => {
    if (isOpen && emailRef.current) {
      emailRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Vui lòng nhập email hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!acceptedTerms) {
      newErrors.terms = "Bạn cần chấp nhận điều khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    clearError();

    try {
      const response = await apiService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === "success") {
        // Auto login after successful registration
        const loginData = { password: formData.password };
        if (formData.username) loginData.username = formData.username;
        if (formData.email) loginData.email = formData.email;
        
        const loginResponse = await apiService.login(loginData);

        if (loginResponse.status === "success") {
          login(loginResponse.data.user, loginResponse.data.token);
          showSuccess("Đăng ký thành công!");
          onClose();
          // Clear form
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setAcceptedTerms(false);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      showError(errorMessage);

      // Auto scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector(".error-message");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 border-b border-gray-100">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-t-3xl"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tạo tài khoản
                </h2>
                <p className="text-sm text-gray-500">
                  Tham gia cộng đồng thư viện của chúng tôi
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              disabled={authLoading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên đăng nhập
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors"
                  size={20}
                />
                <input
                  ref={emailRef}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.username
                      ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                      : "border-gray-200 focus:ring-green-100 focus:border-green-500"
                  }`}
                  placeholder="Nhập tên đăng nhập"
                  disabled={authLoading}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.email
                      ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                      : "border-gray-200 focus:ring-green-100 focus:border-green-500"
                  }`}
                  placeholder="Nhập email của bạn"
                  disabled={authLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.password
                      ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                      : "border-gray-200 focus:ring-green-100 focus:border-green-500"
                  }`}
                  placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                  disabled={authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={authLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                      : "border-gray-200 focus:ring-green-100 focus:border-green-500"
                  }`}
                  placeholder="Nhập lại mật khẩu"
                  disabled={authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={authLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">•</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                disabled={authLoading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <button
                  type="button"
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                  disabled={authLoading}
                >
                  Điều khoản sử dụng
                </button>{" "}
                và{" "}
                <button
                  type="button"
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                  disabled={authLoading}
                >
                  Chính sách bảo mật
                </button>
                {errors.terms && (
                  <span className="text-red-500 text-sm block mt-1">
                    {errors.terms}
                  </span>
                )}
              </label>
            </div>

            {/* Error display */}
            {authError && (
              <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={authLoading || isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Tạo tài khoản</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">hoặc</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton setLoading={setLoading} disabled={authLoading} />

          {/* Switch to login */}
          <p className="text-center mt-8 text-gray-600">
            Đã có tài khoản?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-800 font-semibold transition-colors"
              disabled={authLoading}
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
