import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import apiService from "../../lib/ApiService";
import { useToast } from "../../contexts/ToastContext";
import useAuthStore from "../../store/authStore";
import GoogleLoginButton from "../ui/GoogleLoginButton";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  
  const { login, setLoading, setError, clearError } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if ((!formData.username && !formData.email) || !formData.password) {
      setLocalError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const loginData = { password: formData.password };
      if (formData.username) loginData.username = formData.username;
      if (formData.email) loginData.email = formData.email;
      
      const response = await apiService.login(loginData);
      
      if (response.status === 'success') {
        login(response.data.user, response.data.token);
        showSuccess("Đăng nhập thành công!");
        navigate("/", { replace: true });
      } else {
        setLocalError(response.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLocalError(error.message || "Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

        {localError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {localError}
          </div>
        )}

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              name="username"
              value={formData.username || formData.email}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes('@')) {
                  setFormData(prev => ({ ...prev, email: value, username: "" }));
                } else {
                  setFormData(prev => ({ ...prev, username: value, email: "" }));
                }
              }}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên đăng nhập hoặc email"
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-medium">Mật khẩu</label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Hoặc đăng nhập bằng Google */}
        <div className="mt-6">
          <GoogleLoginButton />
        </div>

        <p className="text-center mt-4 text-gray-600">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
