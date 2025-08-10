// hooks/useApiService.js
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiService from "../lib/ApiService";

export function useApiService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function to handle errors
  const handleError = useCallback((err) => {
    let message = "Something went wrong";
    let shouldRedirect = false;
    let errorCode = "500";

    if (err?.isNetworkError) {
      message = "Không thể kết nối đến máy chủ";
      shouldRedirect = true;
      errorCode = "NETWORK";
    } else if (err?.isTimeout) {
      message = "Yêu cầu quá thời gian chờ";
      shouldRedirect = true;
      errorCode = "TIMEOUT";
    } else if (err?.isAborted) {
      message = "Yêu cầu đã bị hủy";
      shouldRedirect = false;
      errorCode = "ABORTED";
    } else if (err?.response?.status === 403 && err?.response?.data?.message?.includes('khóa')) {
      message = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.";
      shouldRedirect = false;
      errorCode = "ACCOUNT_LOCKED";
    } else if (err?.response?.data?.message) {
      message = err.response.data.message;
      shouldRedirect = false;
    } else if (err?.message) {
      message = err.message;
      shouldRedirect = false;
    }

    setError(message);
    toast.error(message);

    // Redirect to error page for network errors
    if (shouldRedirect) {
      navigate(`/error/${errorCode}`);
    }

    return err;
  }, [navigate]);

  // ✅ Gọi API GET
  const fetchData = useCallback(async (method, ...args) => {
    setLoading(true);
    setError(null);
    try {
      if (typeof apiService[method] !== "function") {
        throw new Error(`API method "${method}" not found`);
      }
      return await apiService[method](...args);
    } catch (err) {
      throw handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ✅ Gọi API POST/PUT/PATCH/DELETE
  const mutate = useCallback(async (method, ...args) => {
    setLoading(true);
    setError(null);
    try {
      if (typeof apiService[method] !== "function") {
        throw new Error(`API method "${method}" not found`);
      }
      const result = await apiService[method](...args);
      toast.success("Action completed successfully!");
      return result;
    } catch (err) {
      throw handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return { fetchData, mutate, loading, error };
}
