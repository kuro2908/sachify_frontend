// src/components/Stories.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../lib/ApiService";
import { Loader2 } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import SearchAndFilter from "../components/ui/SearchAndFilter";
import StoriesCountInfo from "../components/ui/StoriesCountInfo";
import StoriesGrid from "../components/ui/StoriesGrid";

const Stories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || "");
  const [authorFilter, setAuthorFilter] = useState(searchParams.get('author') || "");
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || "updated_desc");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allStories, setAllStories] = useState([]); // Tất cả stories từ backend
  const [loading, setLoading] = useState(false);
  
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [storiesPerPage] = useState(12);

  // Tìm kiếm, lọc và sắp xếp stories ở frontend
  const filteredStories = useMemo(() => {
    let filtered = [...allStories];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchLower) ||
        story.description?.toLowerCase().includes(searchLower) ||
        story.author?.username?.toLowerCase().includes(searchLower)
      );
    }

    // Lọc theo thể loại
    if (categoryFilter) {
      filtered = filtered.filter(story =>
        story.categories?.some(cat => cat.slug === categoryFilter)
      );
    }

    // Lọc theo tác giả
    if (authorFilter) {
      filtered = filtered.filter(story => story.author?.id === parseInt(authorFilter));
    }

    // Sắp xếp stories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated_desc': // Mới cập nhật
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'updated_asc': // Cũ nhất
          return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
        case 'title_asc': // Tên A → Z
          return (a.title || '').localeCompare(b.title || '', 'vi');
        case 'title_desc': // Tên Z → A
          return (b.title || '').localeCompare(a.title || '', 'vi');
        default:
          return 0;
      }
    });

    return filtered;
  }, [allStories, searchTerm, categoryFilter, authorFilter, sortBy]);

  // Tính toán phân trang dựa trên stories đã lọc
  const totalStories = filteredStories.length;
  const totalPages = Math.ceil(totalStories / storiesPerPage);
  
  // Lấy stories cho trang hiện tại
  const currentStories = useMemo(() => {
    const startIndex = (currentPage - 1) * storiesPerPage;
    const endIndex = startIndex + storiesPerPage;
    return filteredStories.slice(startIndex, endIndex);
  }, [filteredStories, currentPage, storiesPerPage]);

  useEffect(() => {
    fetchAllStories();
    fetchAuthors();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset về trang 1 khi thay đổi filter
    if (currentPage !== 1) {
      setCurrentPage(1);
      const params = {
        search: searchTerm || '',
        category: categoryFilter || '',
        author: authorFilter || '',
        sort: sortBy,
        page: 1
      };
      setSearchParams(params);
    }
  }, [searchTerm, categoryFilter, authorFilter, sortBy]);

  // Reset về trang 1 khi thay đổi sortBy
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      const params = {
        search: searchTerm || '',
        category: categoryFilter || '',
        author: authorFilter || '',
        sort: sortBy,
        page: 1
      };
      setSearchParams(params);
    }
  }, [sortBy]);

  // Cập nhật URL khi thay đổi page
  useEffect(() => {
    const params = {
      search: searchTerm || '',
      category: categoryFilter || '',
      author: authorFilter || '',
      sort: sortBy,
      page: currentPage
    };
    setSearchParams(params);
  }, [currentPage, searchTerm, categoryFilter, authorFilter, sortBy]);

  const fetchAllStories = async () => {
    try {
      setLoading(true);
      
      // Lấy tất cả stories từ backend (không có filter)
      const response = await apiService.getStories({ limit: 1000 }); // Lấy nhiều stories
      
      if (
        response.status === "success" &&
        Array.isArray(response.data?.stories)
      ) {
        setAllStories(response.data.stories);
      } else {
        setAllStories([]);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      setAllStories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await apiService.getAuthors();
      
      if (response.status === "success" && Array.isArray(response.data?.authors)) {
        setAuthors(response.data.authors);
      }
    } catch (err) {
      console.error("Error fetching authors:", err);
      setAuthors([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.status === "success" && Array.isArray(response.data?.categories)) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const handleSearch = () => {
    // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          authorFilter={authorFilter}
          setAuthorFilter={setAuthorFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          authors={authors}
        />

        {/* Stories Count Info */}
        <StoriesCountInfo
          storiesCount={currentStories.length}
          totalStories={totalStories}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
        />

        {/* Stories List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        ) : (
          <>
            <StoriesGrid stories={currentStories} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                maxVisiblePages={5}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Stories;
