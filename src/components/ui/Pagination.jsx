import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 5 
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Điều chỉnh startPage nếu endPage quá gần cuối
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Nút Previous
  pages.push(
    <button
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Trang trước"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );

  // Các trang số
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-3 py-2 text-sm font-medium border transition-colors ${
          i === currentPage
            ? "bg-blue-600 text-white border-blue-600"
            : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
        }`}
        aria-label={`Trang ${i}`}
        aria-current={i === currentPage ? "page" : undefined}
      >
        {i}
      </button>
    );
  }

  // Nút Next
  pages.push(
    <button
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Trang sau"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex items-center justify-center mt-8">
      <nav className="flex items-center space-x-0" role="navigation" aria-label="Phân trang">
        {pages}
      </nav>
    </div>
  );
};

export default Pagination;
