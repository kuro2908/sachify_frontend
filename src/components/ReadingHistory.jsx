import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import apiService from '../lib/ApiService';
import Loading from './ui/Loading';

const ReadingHistory = ({ userId }) => {
  const [readingHistory, setReadingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (userId) {
      fetchReadingHistory();
    }
  }, [userId, currentPage]);

  const fetchReadingHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getUserReadingHistory(userId, currentPage, 10);
      
             if (response.status === 'success') {
         setReadingHistory(response.data.readingHistory || []);
         setTotalPages(response.data.pagination?.totalPages || 1);
       }
    } catch (err) {
      console.error('Error fetching reading history:', err);
      setError(err.message || 'Không thể tải lịch sử đọc');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentTypeBadge = (contentType) => {
    const typeConfig = {
      TEXT: { 
        color: "bg-blue-100 text-blue-800", 
        text: "Truyện chữ" 
      },
      IMAGES: { 
        color: "bg-purple-100 text-purple-800", 
        text: "Truyện tranh" 
      }
    };
    
    const config = typeConfig[contentType] || { color: "bg-gray-100 text-gray-800", text: "Không xác định" };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Lịch sử đọc</h3>
          </div>
          <span className="text-sm text-gray-500">
            {readingHistory.length} truyện đã đọc
          </span>
        </div>
      </div>

      {readingHistory.length === 0 ? (
        <div className="p-8 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử đọc</h4>
          <p className="text-gray-600">Bắt đầu đọc truyện để xem lịch sử ở đây</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {readingHistory.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex space-x-4">
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.story.coverImage || '/default-cover.jpg'}
                      alt={item.story.title}
                      className="w-16 h-20 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = '/default-cover.jpg';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/stories/${item.story.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {item.story.title}
                        </Link>
                        
                        <div className="flex items-center space-x-2 mt-1 mb-2">
                          <User size={14} className="text-gray-400" />
                          <Link
                            to={`/users/${item.story.author.id}`}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            {item.story.author.username}
                          </Link>
                        </div>

                        <Link
                          to={`/chapters/${item.chapter.id}`}
                          className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors block truncate"
                          title={`Chương ${item.chapter.chapterNumber}: ${item.chapter.title}`}
                        >
                          Chương {item.chapter.chapterNumber}: {item.chapter.title}
                        </Link>

                        <div className="flex items-center space-x-3 mt-2">
                          {getContentTypeBadge(item.chapter.contentType)}
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {formatDate(item.lastReadAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Trang {currentPage} của {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReadingHistory;
