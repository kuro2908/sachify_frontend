import React, { useState, useEffect } from "react";
import apiService from "../lib/ApiService";
import Ranking from "../components/Rankings";
import AuthorRankings from "../components/AuthorRankings";
import { Loader2 } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

const RankingPage = () => {
  const { showError } = useToast();
  const [storiesByViews, setStoriesByViews] = useState([]);
  const [storiesByRating, setStoriesByRating] = useState([]);
  const [topAuthorsByStories, setTopAuthorsByStories] = useState([]);
  const [topAuthorsByRating, setTopAuthorsByRating] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllRankingData = async () => {
      try {
        setLoading(true);

        // Fetch both types of story rankings
        const [storiesByViewsResponse, storiesByRatingResponse, authorsByStoriesResponse, authorsByRatingResponse] = await Promise.all([
          apiService.getStoryRankings({ type: "view", limit: 12 }),
          apiService.getStoryRankings({ type: "rating", limit: 12 }),
          apiService.getTopAuthorsByStoryCount(10),
          apiService.getTopAuthorsByRating(10)
        ]);

        // Handle stories by views
        if (storiesByViewsResponse?.status === "success" && Array.isArray(storiesByViewsResponse.data?.stories)) {
          setStoriesByViews(storiesByViewsResponse.data.stories);
        }

        // Handle stories by rating
        if (storiesByRatingResponse?.status === "success" && Array.isArray(storiesByRatingResponse.data?.stories)) {
          setStoriesByRating(storiesByRatingResponse.data.stories);
        }

        // Handle author rankings by story count
        if (authorsByStoriesResponse?.status === "success" && Array.isArray(authorsByStoriesResponse.data?.authors)) {
          setTopAuthorsByStories(authorsByStoriesResponse.data.authors);
        }

        // Handle author rankings by rating
        if (authorsByRatingResponse?.status === "success" && Array.isArray(authorsByRatingResponse.data?.authors)) {
          setTopAuthorsByRating(authorsByRatingResponse.data.authors);
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        showError(error.message);
        setStoriesByViews([]);
        setStoriesByRating([]);
        setTopAuthorsByStories([]);
        setTopAuthorsByRating([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRankingData();
  }, [showError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stories by Views Rankings */}
        {storiesByViews.length > 0 && (
          <Ranking
            stories={storiesByViews}
            title="Truyện Xem Nhiều Nhất"
            description="Top truyện được đọc nhiều nhất"
            showFilters={false}
          />
        )}

        {/* Stories by Rating Rankings */}
        {storiesByRating.length > 0 && (
          <div className="mt-12">
            <Ranking
              stories={storiesByRating}
              title="Truyện Đánh Giá Cao Nhất"
              description="Top truyện được đánh giá cao nhất"
              showFilters={false}
            />
          </div>
        )}

        {/* Author Rankings by Story Count */}
        {topAuthorsByStories.length > 0 && (
          <div className="mt-12">
            <AuthorRankings
              authors={topAuthorsByStories}
              title="Top Tác Giả Có Nhiều Truyện Nhất"
              description="Những tác giả có nhiều truyện được yêu thích"
              type="stories"
            />
          </div>
        )}

        {/* Author Rankings by Rating */}
        {topAuthorsByRating.length > 0 && (
          <div className="mt-12">
            <AuthorRankings
              authors={topAuthorsByRating}
              title="Top Tác Giả Có Rating Cao Nhất"
              description="Những tác giả có truyện được đánh giá cao nhất"
              type="rating"
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && storiesByViews.length === 0 && storiesByRating.length === 0 && topAuthorsByStories.length === 0 && topAuthorsByRating.length === 0 && (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Không tìm thấy dữ liệu xếp hạng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
