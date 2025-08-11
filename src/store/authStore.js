import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiService from "../lib/ApiService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 👉 State mặc định
      user: null, // Thông tin người dùng
      token: null, // JWT token
      isLoading: false,
      error: null,

      // 👉 Đăng nhập
      login: (userData, token) => {
        set({
          user: userData,
          token,
          error: null,
          isLoading: false,
        });
      },

      // 👉 Kiểm tra tài khoản bị khóa
      isAccountLocked: () => {
        const { user } = get();
        return user?.status === 'locked';
      },

      // 👉 Đăng xuất
      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
          isLoading: false,
        });
        localStorage.removeItem("auth-storage");
      },

      // 👉 Loading & Error
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      clearError: () => set({ error: null }),

      // 👉 Update user info
      updateUser: (userData) => {
        const currentUser = get().user;
        set({ user: currentUser ? { ...currentUser, ...userData } : userData });
      },

      // 👉 Getters
      isAuthenticated: () => {
        const { token, user } = get();
        return Boolean(token && user);
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },

      autoLogin: () => {
        const { token, user } = get();

        // Nếu có token và user đã lưu → set lại state (thực ra Zustand + persist đã tự set)
        if (token && user) {
          set({ user, token });
          return true;
        }
        return false;
      },

      isAuthorOrAdmin: () => {
        const { user } = get();
        return ["author", "admin"].includes(user?.role);
      },

      // Kiểm tra quyền xóa comment
      canDeleteComment: (commentUserId, storyAuthorId) => {
        const { user } = get();
        if (!user) return false;
        
        // Admin có thể xóa mọi comment
        if (user.role === "admin") return true;
        
        // Manager có thể xóa mọi comment
        if (user.role === "manager") return true;
        
        // Author của truyện có thể xóa mọi comment trong truyện của mình
        if (user.role === "author" && storyAuthorId && user.id === storyAuthorId) return true;
        
        // Người đăng comment có thể xóa comment của mình
        if (user.id === commentUserId) return true;
        
        return false;
      },

      getCurrentUser: () => get().user,
      getToken: () => get().token,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
