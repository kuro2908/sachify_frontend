 // src/services/ApiService.js
 import { API_BASE_URL } from '../config/api.js';
 const REQUEST_TIMEOUT = 60000; // 60 seconds - tăng từ 10s lên 60s
 const UPLOAD_TIMEOUT = 120000; // 120 seconds - timeout riêng cho upload

 class ApiService {
   constructor() {
     this.baseURL = API_BASE_URL;
   }

   // =====================
   // 🔑 Utility Methods
   // =====================
   getAuthToken() {
     try {
       const authStorage = localStorage.getItem("auth-storage");
       return authStorage ? JSON.parse(authStorage).state.token : null;
     } catch (error) {
       console.error("Error parsing auth token:", error);
       return null;
     }
   }

   getHeaders() {
     const headers = { "Content-Type": "application/json" };
     const token = this.getAuthToken();
     if (token) headers["Authorization"] = `Bearer ${token}`;
     return headers;
   }

   getFormHeaders() {
     const headers = {};
     const token = this.getAuthToken();
     if (token) headers["Authorization"] = `Bearer ${token}`;
     return headers;
   }

   // Helper method to create timeout promise
   createTimeoutPromise(timeoutMs = REQUEST_TIMEOUT) {
     return new Promise((_, reject) => {
       setTimeout(() => {
         reject(new Error('Request timeout'));
       }, timeoutMs);
     });
   }

   // Helper method to create timeout promise cho upload
   createUploadTimeoutPromise(timeoutMs = UPLOAD_TIMEOUT) {
     return new Promise((_, reject) => {
       setTimeout(() => {
         reject(new Error('Upload timeout - Vui lòng thử lại'));
       }, timeoutMs);
     });
   }

   // Helper method to handle network errors
   handleNetworkError(error, endpoint) {
     console.error(`API request to ${endpoint} failed:`, error);
     
     if (error.message === 'Request timeout') {
       const timeoutError = new Error('Yêu cầu quá thời gian chờ');
       timeoutError.code = 'TIMEOUT';
       timeoutError.isTimeout = true;
       timeoutError.originalError = error;
       throw timeoutError;
     }
     
     if (error.name === 'TypeError' && error.message.includes('fetch')) {
       const networkError = new Error('Không thể kết nối đến máy chủ');
       networkError.code = 'NETWORK';
       networkError.isNetworkError = true;
       networkError.originalError = error;
       throw networkError;
     } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
       const networkError = new Error('Không thể kết nối đến máy chủ');
       networkError.code = 'NETWORK';
       networkError.isNetworkError = true;
       networkError.originalError = error;
       throw networkError;
     } else if (error.name === 'AbortError') {
       const abortError = new Error('Yêu cầu đã bị hủy');
       abortError.code = 'ABORTED';
       abortError.isAborted = true;
       throw abortError;
     }
     
     throw error;
   }

   async handleResponse(response) {
     const contentType = response.headers.get("content-type");
     let data;

     try {
       data = contentType?.includes("application/json")
         ? await response.json()
         : await response.text();
     } catch (error) {
       throw new Error(`Failed to parse response: ${error.message}`);
     }

     if (!response.ok) {
       if (data.message?.includes("password_reset_token")) {
         console.warn("Ignoring password_reset_token error");
         return data;
       }
       const error = new Error(
         data.message || `HTTP error! status: ${response.status}`
       );
       error.status = response.status;
       error.data = data;
       throw error;
     }
     return data;
   }

     async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      method: "GET",
      headers: this.getHeaders(),
      ...options,
    };

    if (
      options.body &&
      typeof options.body === "object" &&
      !(options.body instanceof FormData)
    ) {
      config.body = JSON.stringify(options.body);
    }

    // Kiểm tra xem có phải là upload không
    const isUpload = options.body instanceof FormData && 
      Array.from(options.body.entries()).some(([key, value]) => 
        key === 'files' || (value instanceof File)
      );

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      // Sử dụng timeout dài hơn cho upload
      const timeoutPromise = isUpload ? 
        this.createUploadTimeoutPromise() : 
        this.createTimeoutPromise();
      
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(url, { ...config, signal: controller.signal }),
        timeoutPromise.then(() => {
          controller.abort();
          throw new Error(isUpload ? 'Upload timeout - Vui lòng thử lại' : 'Request timeout');
        })
      ]);
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleNetworkError(error, endpoint);
    }
  }

     async formRequest(endpoint, formData, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      method: "POST",
      headers: this.getFormHeaders(),
      body: formData,
      ...options,
    };
    
    // Kiểm tra xem có phải là upload không (có files trong formData)
    const hasFiles = Array.from(formData.entries()).some(([key, value]) => 
      key === 'files' || (value instanceof File)
    );
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      // Sử dụng timeout dài hơn cho upload
      const timeoutPromise = hasFiles ? 
        this.createUploadTimeoutPromise() : 
        this.createTimeoutPromise();
      
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(url, { ...config, signal: controller.signal }),
        timeoutPromise.then(() => {
          controller.abort();
          throw new Error(hasFiles ? 'Upload timeout - Vui lòng thử lại' : 'Request timeout');
        })
      ]);
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleNetworkError(error, endpoint);
    }
  }
 
   // =====================
   // 👤 Authentication
   // =====================
   async register(userData) {
     return this.request("/auth/register", { method: "POST", body: userData });
   }
 
   async login(credentials) {
     return this.request("/auth/login", { method: "POST", body: credentials });
   }
 
   async forgotPassword(emailData) {
     return this.request("/auth/forgot-password", {
       method: "POST",
       body: emailData,
     });
   }
 
   async resetPassword(token, passwordData) {
     return this.request(`/auth/reset-password/${token}`, {
       method: "PATCH",
       body: passwordData,
     });
   }
 
   async googleLogin(credential) {
     return this.request("/auth/google-login", {
       method: "POST",
       body: { credential },
     });
   }
 
   // =====================
   // 📚 Stories
   // =====================
   async getStories(params = {}) {
     const queryString = new URLSearchParams(params).toString();
     return this.request(`/stories?${queryString}`);
   }
 
   async getStory(id) {
     return this.request(`/stories/${id}`);
   }

   async updateStory(id, storyData) {
     // Nếu storyData đã là FormData, sử dụng trực tiếp
     if (storyData instanceof FormData) {
       return this.formRequest(`/stories/${id}`, storyData, { method: "PATCH" });
     }
     
     // Nếu không, tạo FormData từ object
     const formData = new FormData();
     Object.entries(storyData).forEach(([key, value]) => {
       if (value !== undefined && value !== null) formData.append(key, value);
     });
     return this.formRequest(`/stories/${id}`, formData, { method: "PATCH" });
   }
 
     async getStoryRankings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/stories/rankings?${queryString}`;
    return this.request(url);
  }
 
     async createStory(storyData) {
    const formData = new FormData();
    Object.entries(storyData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    return this.formRequest("/stories", formData);
  }

  async deleteStory(id) {
    return this.request(`/stories/${id}`, { method: "DELETE" });
  }
 
   // =====================
   // 🗂️ Categories & Authors
   // =====================
   async getCategories() {
     return this.request("/categories");
   }
 
   async createCategory(categoryData) {
     return this.request("/categories", { method: "POST", body: categoryData });
   }
 
   async getAuthors() {
     return this.request("/authors");
   }
 
   // =====================
   // 📖 Chapters
   // =====================
     async getChapter(id) {
    return this.request(`/chapters/${id}`);
  }

  async getStoryChapters(storyId) {
    return this.request(`/stories/${storyId}/chapters`);
  }

  async createChapter(chapterData) {
     // Nếu chapterData đã là FormData, sử dụng trực tiếp
     if (chapterData instanceof FormData) {
       return this.formRequest("/chapters", chapterData);
     }
     
     // Nếu không, tạo FormData từ object
     const formData = new FormData();
     Object.entries(chapterData).forEach(([key, value]) => {
       if (value === undefined || value === null) return;
       if (key === "files") {
         Array.isArray(value)
           ? value.forEach((file) => formData.append("files", file))
           : formData.append("files", value);
       } else {
         formData.append(key, value);
       }
     });
     return this.formRequest("/chapters", formData);
   }

   async getAuthorChapter(chapterId) {
     return this.request(`/chapters/${chapterId}`);
   }

     async updateAuthorChapter(chapterId, chapterData) {
    return this.formRequest(`/chapters/${chapterId}`, chapterData, { method: "PATCH" });
  }

  async deleteChapter(chapterId) {
    return this.request(`/chapters/${chapterId}`, {
      method: "DELETE"
    });
  }

  // Reading History APIs
  async saveReadingProgress(chapterId) {
    return this.request(`/reading-history/chapters/${chapterId}/progress`, { method: 'POST' });
  }

  async getUserReadingHistory(userId, page = 1, limit = 10) {
    return this.request(`/reading-history/users/${userId}/history?page=${page}&limit=${limit}`);
  }

  async getCurrentReadingProgress(storyId) {
    return this.request(`/reading-history/stories/${storyId}/progress`);
  }
 
   // =====================
   // ⭐ User Interactions
   // =====================
   async addBookmark(storyId) {
     return this.request(`/users/bookmarks/${storyId}`, { method: "POST" });
   }
 
   async removeBookmark(storyId) {
     return this.request(`/users/bookmarks/${storyId}`, { method: "DELETE" });
   }
 
   async getBookmarks() {
     return this.request("/users/me/bookmarks");
   }
 
   async addReadingHistory(chapterId) {
     return this.request("/users/me/history", {
       method: "POST",
       body: { chapterId },
     });
   }
 
   async getReadingHistory() {
     return this.request("/users/me/history");
   }

   async postReview(storyId, reviewData) {
     return this.request(`/reviews/${storyId}`, {
       method: "POST",
       body: reviewData,
     });
   }

   async getReviewsForStory(storyId, params = {}) {
     const queryString = new URLSearchParams(params).toString();
     return this.request(`/reviews/${storyId}?${queryString}`);
   }

   async postChapterComment(chapterId, commentData) {
    return this.request(`/comments/chapter/${chapterId}`, {
      method: "POST",
      body: commentData,
    });
  }

  async getChapterComments(chapterId) {
    return this.request(`/comments/chapter/${chapterId}`);
  }

  async getStoryComments(storyId) {
    return this.request(`/comments/story/${storyId}`);
  }

  async deleteComment(commentId) {
    return this.request(`/comments/${commentId}`, {
      method: "DELETE",
    });
  }

  async postProfileComment(userId, commentData) {
    return this.request(`/users/${userId}/comments`, {
      method: "POST",
      body: commentData,
    });
  }
 
   async followUser(userId) {
     return this.request(`/users/${userId}/follow`, { method: "POST" });
   }
 
   async unfollowUser(userId) {
     return this.request(`/users/${userId}/follow`, { method: "DELETE" });
   }
 
   // =====================
   // ☁️ Upload
   // =====================
   async uploadCoverImage(file) {
     const formData = new FormData();
     formData.append("file", file);
     return this.formRequest("/uploads/cover-image", formData);
   }
 
   // =====================
   // 🛠️ Admin APIs
   // =====================
   async getPendingStories() {
     return this.request("/admin/stories/pending");
   }
 
   async approveStory(id) {
     return this.request(`/admin/stories/${id}/approve`, { method: "PATCH" });
   }
 
   async rejectStory(id) {
     return this.request(`/admin/stories/${id}/reject`, { 
       method: "PATCH",
       body: {} // Gửi body rỗng để tránh lỗi
     });
   }
 
   async hideStory(id) {
     return this.request(`/admin/stories/${id}/hide`, { 
       method: "PATCH",
       body: {} // Gửi body rỗng để tránh lỗi
     });
   }
 
   async unhideStory(id) {
     return this.request(`/admin/stories/${id}/unhide`, { 
       method: "PATCH",
       body: {} // Gửi body rỗng để tránh lỗi
     });
   }
 
   async getUsers(params = {}) {
     const queryString = new URLSearchParams(params).toString();
     return this.request(`/admin/users?${queryString}`);
   }
 
   async updateUserRole(userId, roleData) {
     return this.request(`/admin/users/${userId}/role`, {
       method: "PATCH",
       body: roleData,
     });
   }
 
   async updateUserStatus(userId, statusData) {
     return this.request(`/admin/users/${userId}/status`, {
       method: "PATCH",
       body: statusData,
     });
   }
 
   async updateCategory(id, data) {
     return this.request(`/categories/${id}`, { method: "PATCH", body: data });
   }
 
   async deleteCategory(id) {
     return this.request(`/categories/${id}`, { method: "DELETE" });
   }
 
   async getAdminStats() {
     return this.request("/admin/stats");
   }
 
   async getAdminStories(params = {}) {
     const queryString = new URLSearchParams(params).toString();
     return this.request(`/admin/stories?${queryString}`);
   }
 
   // =====================
   // 👤 User Profile APIs
   // =====================
   async updateProfile(profileData) {
     return this.request("/users/me/profile", {
       method: "PATCH",
       body: profileData,
     });
   }
 
   async changePassword(passwordData) {
     return this.request("/users/me/password", {
       method: "PATCH",
       body: passwordData,
     });
   }
 
   async updateNotificationSettings(settings) {
     return this.request("/users/me/notifications", {
       method: "PATCH",
       body: settings,
     });
   }
 
     async deleteAccount() {
    return this.request("/users/me", { method: "DELETE" });
  }

  async requestAuthorRole() {
    return this.request("/users/request-author-role", { method: "POST" });
  }

   
 }
 
 
 const apiService = new ApiService();
export default apiService;
 