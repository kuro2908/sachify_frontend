import React, { useEffect } from "react";
import useAuthStore from "../../store/authStore";
import apiService from "../../lib/ApiService";

const GoogleLoginButton = () => {
  const { login, setError, clearError } = useAuthStore();

  async function handleCredentialResponse(response) {
    try {
      clearError();
      
      const res = await apiService.googleLogin(response.credential);

      if (res.status === 'success') {
        login(res.data.user, res.data.token);
        window.location.href = "/"; // Redirect to home page
      } else {
        setError(res.message || "Đăng nhập bằng Google thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập bằng Google:", error);
      setError(error.message || "Đăng nhập bằng Google thất bại");
    }
  }

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "145225515731-i1u67913d3k5oksk1b4djd61vrofvucp.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  return <div id="googleSignInButton"></div>;
};

export default GoogleLoginButton;
