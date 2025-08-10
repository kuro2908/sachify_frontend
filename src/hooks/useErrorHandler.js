import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle unhandled errors
  useEffect(() => {
    const handleUnhandledError = (event) => {
      console.error('Unhandled error:', event.error);
      
      // Check if it's a fetch error
      if (event.error && event.error.message && (
        event.error.message.includes('fetch') || 
        event.error.message.includes('Failed to fetch') ||
        event.error.message.includes('NetworkError') ||
        event.error.message.includes('ERR_NETWORK')
      )) {
        setError({
          code: 'NETWORK',
          title: 'Không thể kết nối đến máy chủ',
          message: 'Vui lòng kiểm tra kết nối mạng và thử lại.',
          showRefresh: true,
          originalError: event.error
        });
        navigate('/error/NETWORK');
      } else if (event.error && event.error.message && event.error.message.includes('khóa')) {
        setError({
          code: 'ACCOUNT_LOCKED',
          title: 'Tài khoản bị khóa',
          message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.',
          showRefresh: false,
          originalError: event.error
        });
        navigate('/error/ACCOUNT_LOCKED');
      } else {
        setError({
          code: '500',
          title: 'Đã có lỗi xảy ra',
          message: 'Đã có lỗi xảy ra, mong bạn quay lại sau.',
          originalError: event.error
        });
        navigate('/error/500');
      }
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Check if it's a fetch error
      if (event.reason && event.reason.message && (
        event.reason.message.includes('fetch') || 
        event.reason.message.includes('Failed to fetch') ||
        event.reason.message.includes('NetworkError') ||
        event.reason.message.includes('ERR_NETWORK')
      )) {
        setError({
          code: 'NETWORK',
          title: 'Không thể kết nối đến máy chủ',
          message: 'Vui lòng kiểm tra kết nối mạng và thử lại.',
          showRefresh: true,
          originalError: event.reason
        });
        navigate('/error/NETWORK');
      } else if (event.reason && event.reason.message && event.reason.message.includes('khóa')) {
        setError({
          code: 'ACCOUNT_LOCKED',
          title: 'Tài khoản bị khóa',
          message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.',
          showRefresh: false,
          originalError: event.reason
        });
        navigate('/error/ACCOUNT_LOCKED');
      } else {
        setError({
          code: '500',
          title: 'Đã có lỗi xảy ra',
          message: 'Đã có lỗi xảy ra, mong bạn quay lại sau.',
          originalError: event.reason
        });
        navigate('/error/500');
      }
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [navigate]);

  // Check network status and redirect if offline
  useEffect(() => {
    if (!isOnline) {
      setError({
        code: 'NETWORK',
        title: 'Không có kết nối mạng',
        message: 'Vui lòng kiểm tra kết nối mạng và thử lại.',
        showRefresh: false
      });
      navigate('/error/NETWORK');
    }
  }, [isOnline, navigate]);

  const handleError = (errorData) => {
    setError(errorData);
    navigate(`/error/${errorData.code || '500'}`);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    isOnline,
    handleError,
    clearError
  };
};

export default useErrorHandler;
