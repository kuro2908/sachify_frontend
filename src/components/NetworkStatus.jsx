import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { API_BASE_URL, HEALTH_CHECK_ENDPOINT } from '../config/api.js';
const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const navigate = useNavigate();

  // Check server status
  const checkServerStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}${HEALTH_CHECK_ENDPOINT}`, {
        signal: controller.signal,
        method: 'GET'
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerStatus('online');
        setConsecutiveFailures(0); // Reset failure count on success
      } else {
        // Don't immediately set error status for non-2xx responses
        // Only set error if we get multiple failed responses
        console.warn('Server returned non-2xx status:', response.status);
        setServerStatus('online'); // Keep as online for now
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setServerStatus('timeout');
      } else {
        // Only set offline if it's a clear network error
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('ERR_NETWORK')) {
          // Increment failure count
          const newFailureCount = consecutiveFailures + 1;
          setConsecutiveFailures(newFailureCount);
          
          // Only set offline after 3 consecutive failures
          if (newFailureCount >= 3) {
            setServerStatus('offline');
          } else {
            setServerStatus('online'); // Keep as online for now
          }
        } else {
          // For other errors, don't change status immediately
          console.warn('Non-network error during health check:', error.message);
          setServerStatus('online'); // Keep as online for now
        }
      }
    }
  };

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      setConsecutiveFailures(0); // Reset failure count
      // Check server status when coming back online
      setTimeout(checkServerStatus, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      setServerStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial server status check - only if online
    if (isOnline) {
      checkServerStatus();
    }

    // Check server status every 5 minutes to reduce unnecessary API calls
    const intervalId = setInterval(() => {
      if (isOnline && serverStatus !== 'offline') {
        checkServerStatus();
      }
    }, 300000); // 5 minutes

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  // Handle redirects to error page
  useEffect(() => {
    let redirectTimeout;
    
    // Only redirect if there's a persistent issue
    if (!isOnline || serverStatus === 'offline' || serverStatus === 'timeout') {
      // Wait longer before redirecting to avoid false positives
      redirectTimeout = setTimeout(() => {
        // Double-check the status before redirecting
        if (!isOnline || serverStatus === 'offline' || serverStatus === 'timeout') {
          // Try one more health check before redirecting
          checkServerStatus();
          
          // If still failing, then redirect
          setTimeout(() => {
            if (!isOnline || serverStatus === 'offline' || serverStatus === 'timeout') {
              navigate('/error/NETWORK');
            }
          }, 2000);
        }
      }, 15000); // Wait 15 seconds before redirecting
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [isOnline, serverStatus, navigate]);

  // Only show banner if there's an actual issue
  if (serverStatus === 'online' && isOnline) {
    return null;
  }

  // Debug logging (remove in production)
  console.log('NetworkStatus Debug:', {
    isOnline,
    serverStatus,
    consecutiveFailures,
    showOfflineBanner
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <WifiOff size={16} />
          <span>Không có kết nối mạng</span>
        </div>
      )}
      
      {isOnline && serverStatus === 'offline' && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          <span>Không thể kết nối đến máy chủ</span>
        </div>
      )}

      {isOnline && serverStatus === 'timeout' && (
        <div className="bg-yellow-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          <span>Máy chủ phản hồi chậm</span>
        </div>
      )}

      {isOnline && serverStatus === 'checking' && (
        <div className="bg-blue-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <Wifi size={16} />
          <span>Đang kiểm tra kết nối...</span>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
