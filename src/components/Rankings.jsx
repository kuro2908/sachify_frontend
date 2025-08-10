import React from "react";
import { Link } from "react-router-dom";
import { Star, Eye, BookOpen, Filter, Trophy, Flame } from "lucide-react";

const Ranking = ({
  stories = [],
  title,
  description,
  showFilters,
  rankingType,
  setRankingType,
}) => {
  

  if (!Array.isArray(stories)) {
    console.error("Stories prop is not an array:", stories);
    return null;
  }

  const getRankBadge = (rank) => `#${rank}`;

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="text-4xl text-yellow-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-800">{title}</h2>
            <Flame className="text-4xl text-red-500 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>

          {showFilters && (
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setRankingType("view")}
                className={`px-4 py-2 rounded-lg ${
                  rankingType === "view"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-orange-500 border border-orange-500"
                }`}
              >
                Xem nhiều nhất
              </button>
              <button
                onClick={() => setRankingType("rating")}
                className={`px-4 py-2 rounded-lg ${
                  rankingType === "rating"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-orange-500 border border-orange-500"
                }`}
              >
                Đánh giá cao
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold">
                {getRankBadge(index + 1)}
              </div>

              <div className="relative">
                <img
                  src={
                    story.coverImageUrl ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={story.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold line-clamp-1">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {story.author?.username || "Không xác định"}
                </p>
                <Link
                  to={`/stories/${story.id}`}
                  className="mt-4 inline-block w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-center transition-colors"
                >
                  Đọc ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ranking;
