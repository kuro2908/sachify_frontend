// src/components/HeroSlider.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, BookOpen, Star, Eye } from "lucide-react";
import apiService from "../../lib/ApiService";

const HeroSlider = ({ books = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (books.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % books.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [books.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % books.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + books.length) % books.length);

  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white hero-slider" style={{zIndex: 1}}>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Sách Đề Cử</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Chọn lọc đặc biệt cho bạn
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto px-8">
          <div className="relative rounded-2xl bg-white/10 backdrop-blur-sm mx-auto" style={{zIndex: 1, overflow: 'hidden'}}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {books.map((book) => (
                <div key={book.id} className="w-full flex-shrink-0">
                  <div className="flex flex-col md:flex-row items-center justify-center p-8 md:p-12 gap-8">
                    <div className="relative mb-6 md:mb-0 flex-shrink-0">
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-48 h-64 md:w-56 md:h-72 object-cover rounded-xl shadow-2xl"
                      />
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                        <Star size={16} className="mr-1 fill-current" />
                        {book.averageRating || "N/A"}
                      </div>
                    </div>

                    <div className="text-center md:text-left flex-1 max-w-md">
                      <div className="inline-block bg-blue-500 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        {book.categories?.[0]?.name || "Không phân loại"}
                      </div>
                      <h2 className="text-3xl font-bold mb-3 line-clamp-2 leading-tight">{book.title}</h2>
                      <p className="text-xl text-blue-100 mb-4">
                        bởi {book.author?.username || "Không xác định"}
                      </p>
                      <div className="flex items-center text-blue-100 mb-6">
                        <Eye size={20} className="mr-2" />
                        {(book.viewCount || 0).toLocaleString()} lượt đọc
                      </div>
                      <Link
                        to={`/stories/${book.id}`}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg"
                      >
                        Đọc ngay
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              style={{zIndex: 1}}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              style={{zIndex: 1}}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
