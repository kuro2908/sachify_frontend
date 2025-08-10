import React, { useState, useEffect } from "react";
import apiService from "../lib/ApiService";
import Ranking from "../components/Rankings";
import { Loader2 } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

const RankingPage = () => {
  const { showError } = useToast();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingType, setRankingType] = useState("view");

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setLoading(true);
    

        const response = await apiService.getStoryRankings({
          type: rankingType,
          limit: 12,
        });



        if (!response) {
          throw new Error("Không nhận được phản hồi từ server");
        }

        if (response.status !== "success") {
          throw new Error(response.message || "Lỗi từ API");
        }

        if (!Array.isArray(response.data?.stories)) {
          throw new Error("Dữ liệu truyện không hợp lệ");
        }

        setStories(response.data.stories);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        showError(error.message);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, [rankingType, showError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!loading && stories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy truyện nào</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-16">
      <Ranking
        stories={stories}
        title="Bảng Xếp Hạng"
        description="Top truyện được yêu thích nhất"
        showFilters={true}
        rankingType={rankingType}
        setRankingType={setRankingType}
      />
    </div>
  );
};

export default RankingPage;
