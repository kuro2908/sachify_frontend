// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../lib/ApiService";
import Ranking from "../components/Rankings";
import HeroSlider from "../components/ui/HeroSlider";
import FeaturedBooks from "../components/ui/FeaturedBooks";
import StatsSection from "../components/ui/StatsSection";
import Footer from "../components/ui/Footer";
import HamsterLoader from "../components/ui/HamsterLoader";

const Home = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [newStoryRankings, setNewStoryRankings] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Recommended
      const recommendedResponse = await apiService.getStoryRankings({
        type: "rating",
        limit: 5,
      });
      setRecommendedBooks(
        recommendedResponse.status === "success"
          ? recommendedResponse.data?.stories || []
          : []
      );

      // New stories
      const newStoriesResponse = await apiService.getStoryRankings({
        type: "newest",
        limit: 8,
      });
      setNewStoryRankings(
        newStoriesResponse.status === "success"
          ? newStoriesResponse.data?.stories || []
          : []
      );

      // Featured
      const featuredResponse = await apiService.getStoryRankings({
        type: "view",
        limit: 4,
      });
      setFeaturedBooks(
        featuredResponse.status === "success"
          ? featuredResponse.data?.stories || []
          : []
      );
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu trang chủ");
      setRecommendedBooks([]);
      setNewStoryRankings([]);
      setFeaturedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <HamsterLoader />
        <p className="text-gray-600 mt-4">Đang tải trang chủ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4 max-w-7xl mx-auto">
          {error}
        </div>
      )}

      <HeroSlider books={recommendedBooks} />

      {/* Phần 2 cột mới */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Khám Phá Truyện</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cột 1: Truyện mới nhất dạng card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Truyện Mới Nhất
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newStoryRankings.slice(0, 4).map((story) => (
                <div
                  key={story.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={
                      story.coverImageUrl ||
                      "https://via.placeholder.com/300x400?text=No+Cover"
                    }
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-bold line-clamp-1">{story.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {story.author?.username || "Không xác định"}
                    </p>
                    <Link
                      to={`/stories/${story.id}`}
                      className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded text-sm transition-colors inline-block text-center"
                    >
                      Đọc ngay
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột 2: Sách nổi bật dạng list */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              Sách Nổi Bật
            </h3>
            <div className="space-y-4">
              {featuredBooks.slice(0, 5).map((book) => (
                <div key={book.id} className="flex items-center border-b pb-4">
                  <img
                    src={
                      book.coverImageUrl ||
                      "https://via.placeholder.com/100x150?text=No+Cover"
                    }
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{book.title}</h4>
                    <p className="text-sm text-gray-600">
                      {book.author?.username || "Không xác định"}
                    </p>
                    <div className="flex items-center mt-1 text-sm">
                      <span>
                        {book.viewCount?.toLocaleString() || 0} lượt xem
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/stories/${book.id}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Đọc
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
