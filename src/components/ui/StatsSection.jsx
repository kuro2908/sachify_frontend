// src/components/StatsSection.jsx
import React from "react";
import { Users, BookOpen, Eye, Star, BookMarked, TrendingUp } from "lucide-react";

const StatsSection = () => {
  const stats = [
    { label: "Tổng số sách", value: "15,000+", icon: BookOpen },
    { label: "Độc giả tích cực", value: "8,500+", icon: Users },
    { label: "Danh mục", value: "25+", icon: BookMarked },
    { label: "Lượt đọc hàng ngày", value: "2,300+", icon: TrendingUp },
  ];

  return (
    <section className="py-16 bg-white" style={{zIndex: 1}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-white w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
