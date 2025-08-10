import React from 'react';
import { Search, Filter, User, SortAsc } from 'lucide-react';

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  authorFilter,
  setAuthorFilter,
  sortBy,
  setSortBy,
  categories,
  authors
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      {/* Search Input */}
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/3">
        <Search className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Tìm kiếm truyện..."
          className="flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 w-full md:w-1/4">
        <Filter className="text-gray-500" />
        <select
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Tất cả thể loại</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Author Filter */}
      <div className="flex items-center space-x-2 w-full md:w-1/4">
        <User className="text-gray-500" />
        <select
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
        >
          <option value="">Tất cả tác giả</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.username}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center space-x-2 w-full md:w-1/4">
        <SortAsc className="text-gray-500" />
        <select
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="updated_desc">Mới cập nhật</option>
          <option value="updated_asc">Cũ nhất</option>
          <option value="title_asc">Tên A → Z</option>
          <option value="title_desc">Tên Z → A</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
