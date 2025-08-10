import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="text-6xl font-mono mb-6">¯\_(ツ)_/¯</div>
        <p className="text-xl text-gray-600 mb-4">Không có trang này đâu</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Về trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFound;
