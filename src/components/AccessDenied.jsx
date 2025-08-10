import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="text-6xl font-mono mb-6">(ノ`Д ́)ノ</div>
        <p className="text-xl text-gray-600 mb-4">Ây, dừng lại, bạn không được vào trang này!</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
