import React from "react";
import { Link } from "react-router-dom";
import { Trophy, BookOpen, Star, Crown } from "lucide-react";

const AuthorRankings = ({ authors = [], title, description, type }) => {
  if (!Array.isArray(authors)) {
    console.error("Authors prop is not an array:", authors);
    return null;
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-500" />;
    if (rank === 2) return <Trophy className="text-gray-400" />;
    if (rank === 3) return <Trophy className="text-orange-600" />;
    return null;
  };

  return (
    <section className="py-12 bg-white rounded-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {type === "stories" ? (
              <BookOpen className="text-4xl text-blue-600 mr-3" />
            ) : (
              <Star className="text-4xl text-yellow-500 mr-3" />
            )}
            <h3 className="text-3xl font-bold text-gray-800">{title}</h3>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author, index) => (
            <div
              key={author.id}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100"
            >
              <div className="relative p-6">
                {/* Rank Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  {getRankBadge(index + 1)}
                </div>

                {/* Author Info */}
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                    {author.username?.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {author.username}
                  </h4>
                  
                  {/* Stats */}
                  <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{author.storyCount || 0} truyện</span>
                    </div>
                    {type === "rating" && author.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{parseFloat(author.averageRating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Stories Preview */}
                {author.stories && author.stories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700 text-center mb-2">
                      Truyện nổi bật:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {author.stories.slice(0, 4).map((story) => (
                        <div
                          key={story.id}
                          className="bg-white rounded-lg p-2 shadow-sm"
                        >
                          <img
                            src={
                              story.cover_image_url ||
                              "https://via.placeholder.com/80x60?text=No+Image"
                            }
                            alt={story.title}
                            className="w-full h-12 object-cover rounded-md mb-1"
                          />
                          <p className="text-xs text-gray-700 line-clamp-1">
                            {story.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Profile Button */}
                <div className="mt-4">
                  <Link
                    to={`/users/${author.id}`}
                    className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 rounded-lg text-center transition-all duration-300 font-medium"
                  >
                    Xem trang cá nhân
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorRankings;
