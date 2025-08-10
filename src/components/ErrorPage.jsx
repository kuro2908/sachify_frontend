import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Home, RefreshCw, Wifi, WifiOff, AlertTriangle, Server, Clock } from 'lucide-react';

const ErrorPage = ({ 
  errorCode, 
  title, 
  message, 
  showRefresh = true 
}) => {
  const params = useParams();
  const urlCode = params.code;
  
  // Use URL parameter if no props provided
  const finalCode = errorCode || urlCode || "500";
  
  // Define error types and their content
  const errorTypes = {
    '500': {
      title: 'Đã có lỗi xảy ra',
      message: 'Đã có lỗi xảy ra, mong bạn quay lại sau.',
      icon: '(╥﹏╥)',
      showRefresh: true,
      color: 'text-red-500'
    },
    '404': {
      title: 'Không tìm thấy trang',
      message: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
      icon: '(╥﹏╥)',
      showRefresh: false,
      color: 'text-orange-500'
    },
    'NETWORK': {
      title: 'Không thể kết nối đến máy chủ',
      message: 'Vui lòng kiểm tra kết nối mạng và thử lại. Máy chủ có thể đang bảo trì hoặc không khả dụng.',
      icon: <WifiOff className="w-24 h-24 text-red-400" />,
      showRefresh: true,
      color: 'text-red-500'
    },
    'ABORTED': {
      title: 'Yêu cầu đã bị hủy',
      message: 'Yêu cầu của bạn đã bị hủy. Vui lòng thử lại.',
      icon: <Clock className="w-24 h-24 text-yellow-400" />,
      showRefresh: true,
      color: 'text-yellow-500'
    },
    'TIMEOUT': {
      title: 'Yêu cầu quá thời gian chờ',
      message: 'Máy chủ phản hồi quá chậm. Vui lòng thử lại sau.',
      icon: <Clock className="w-24 h-24 text-orange-400" />,
      showRefresh: true,
      color: 'text-orange-500'
    },
    'server': {
      title: 'Không thể kết nối đến máy chủ',
      message: 'Máy chủ hiện tại không khả dụng, vui lòng thử lại sau.',
      icon: <Server className="w-24 h-24 text-red-400" />,
      showRefresh: true,
      color: 'text-red-500'
    },
    'ACCOUNT_LOCKED': {
      title: 'Tài khoản bị khóa',
      message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.',
      icon: <AlertTriangle className="w-24 h-24 text-red-400" />,
      showRefresh: false,
      color: 'text-red-500'
    }
  };

  // Get error content based on code
  const errorContent = errorTypes[finalCode] || errorTypes['500'];
  const finalTitle = title || errorContent.title;
  const finalMessage = message || errorContent.message;
  const finalIcon = errorContent.icon;
  const finalShowRefresh = showRefresh !== undefined ? showRefresh : errorContent.showRefresh;
  const finalColor = errorContent.color;

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    // Try to go back to previous page first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-8">
          {typeof finalIcon === 'string' ? (
            <div className={`text-8xl mb-4 ${finalColor}`}>{finalIcon}</div>
          ) : (
            <div className="mb-4 flex justify-center">{finalIcon}</div>
          )}
          {finalCode && finalCode !== 'NETWORK' && finalCode !== 'ABORTED' && finalCode !== 'ACCOUNT_LOCKED' && (
            <div className={`text-6xl font-bold mb-2 ${finalColor}`}>
              {finalCode}
            </div>
          )}
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {finalTitle}
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {finalMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Home size={18} className="mr-2" />
            Về trang chủ
          </Link>
          
          {finalShowRefresh && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <RefreshCw size={18} className="mr-2" />
              Thử lại
            </button>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Nếu vấn đề vẫn tiếp tục, vui lòng:</p>
          <ul className="mt-2 space-y-1">
            <li>• Kiểm tra kết nối mạng</li>
            <li>• Xóa cache trình duyệt</li>
            <li>• Liên hệ hỗ trợ kỹ thuật</li>
            {finalCode === 'NETWORK' && (
              <>
                <li>• Kiểm tra xem máy chủ có đang hoạt động không</li>
                <li>• Thử lại sau vài phút</li>
              </>
            )}
            {finalCode === 'ACCOUNT_LOCKED' && (
              <>
                <li>• Liên hệ admin để biết lý do khóa tài khoản</li>
                <li>• Cung cấp thông tin tài khoản khi liên hệ</li>
                <li>• Không thể sử dụng các chức năng cần xác thực</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
