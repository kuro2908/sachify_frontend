import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorDemoPage = () => {
  const navigate = useNavigate();

  const testNetworkError = () => {
    // Simulate a network error
    const error = new Error('Failed to fetch');
    error.name = 'TypeError';
    error.code = 'NETWORK';
    error.isNetworkError = true;
    throw error;
  };

  const testTimeoutError = () => {
    // Simulate a timeout error
    const error = new Error('Request timeout');
    error.code = 'TIMEOUT';
    error.isTimeout = true;
    throw error;
  };

  const testAbortError = () => {
    // Simulate an abort error
    const error = new Error('The user aborted a request.');
    error.name = 'AbortError';
    error.code = 'ABORTED';
    error.isAborted = true;
    throw error;
  };

  const testAccountLockedError = () => {
    // Simulate an account locked error
    const error = new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.');
    error.code = 'ACCOUNT_LOCKED';
    throw error;
  };

  const testServerError = () => {
    navigate('/error/500');
  };

  const testNotFoundError = () => {
    navigate('/error/404');
  };

  const testNetworkErrorPage = () => {
    navigate('/error/NETWORK');
  };

  const testTimeoutErrorPage = () => {
    navigate('/error/TIMEOUT');
  };

  const testAbortErrorPage = () => {
    navigate('/error/ABORTED');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Trang Demo Lỗi
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Test Error Pages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Test Trang Lỗi
            </h3>
            <div className="space-y-3">
              <button
                onClick={testServerError}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Lỗi Server (500)
              </button>
              <button
                onClick={testNotFoundError}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Không tìm thấy (404)
              </button>
              <button
                onClick={testNetworkErrorPage}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Lỗi Network
              </button>
              <button
                onClick={testTimeoutErrorPage}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                Lỗi Timeout
              </button>
              <button
                onClick={testAbortErrorPage}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Lỗi Abort
              </button>
              <button
                onClick={() => navigate('/error/ACCOUNT_LOCKED')}
                className="w-full px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
              >
                Tài khoản bị khóa
              </button>
            </div>
          </div>

          {/* Test Error Handling */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Test Xử Lý Lỗi
            </h3>
            <div className="space-y-3">
              <button
                onClick={testNetworkError}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Throw Network Error
              </button>
              <button
                onClick={testTimeoutError}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Throw Timeout Error
              </button>
              <button
                onClick={testAbortError}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Throw Abort Error
              </button>
              <button
                onClick={testAccountLockedError}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Throw Account Locked Error
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông Tin
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Network Error:</strong> Lỗi kết nối đến máy chủ</p>
              <p><strong>Timeout Error:</strong> Máy chủ phản hồi quá chậm</p>
              <p><strong>Abort Error:</strong> Yêu cầu bị hủy</p>
              <p><strong>Server Error:</strong> Lỗi từ máy chủ</p>
              <p><strong>Not Found:</strong> Trang không tồn tại</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDemoPage;
