// src/components/FeaturedBooks.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Star, Eye, BookOpen } from "lucide-react";

const FeaturedBooks = ({ books = [] }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Sách Nổi Bật</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-lg">
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-4">
                bởi {book.author?.username || "Không xác định"}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <Eye size={16} className="mr-1" />
                  {(book.viewCount || 0).toLocaleString()} lượt đọc
                </div>
                <Link
                  to={`/stories/${book.id}`}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  Đọc ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBooks;
