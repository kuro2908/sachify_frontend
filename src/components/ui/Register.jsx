import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import apiService from "../../lib/ApiService";
import { useToast } from "../../contexts/ToastContext";
import useAuthStore from "../../store/authStore";
import GoogleLoginButton from "../ui/GoogleLoginButton";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  
  const navigate = useNavigate();
  const { login, setLoading, setError, clearError } = useAuthStore();
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

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp!");
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }

    if (formData.username.length < 3) {
      setLocalError("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError("Email không hợp lệ!");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await apiService.register(registerData);
      
      if (response.status === 'success') {
        // Auto login after successful registration
        const loginData = { password: formData.password };
        if (formData.username) loginData.username = formData.username;
        if (formData.email) loginData.email = formData.email;
        
        const loginResponse = await apiService.login(loginData);

        if (loginResponse.status === 'success') {
          login(loginResponse.data.user, loginResponse.data.token);
          showSuccess("Đăng ký và đăng nhập thành công!");
          navigate("/", { replace: true });
        }
      } else {
        setLocalError(response.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Register error:", error);
      setLocalError(error.message || "Đăng ký thất bại!");
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>

        {localError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {localError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập tên đăng nhập"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập lại mật khẩu"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Đã có tài khoản?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
