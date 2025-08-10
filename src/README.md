# Cấu trúc dự án React

## Tổ chức thư mục

### `/pages` - Các trang chính
- `Home.jsx` - Trang chủ
- `Stories.jsx` - Trang danh sách truyện
- `StoryDetail.jsx` - Trang chi tiết truyện
- `ChapterReader.jsx` - Trang đọc chương
- `NotFound.jsx` - Trang 404
- `RankingPage.jsx` - Trang xếp hạng
- `UserBookshelfPage.jsx` - Trang tủ truyện
- `UserActivityPage.jsx` - Trang hoạt động
- `SettingsPage.jsx` - Trang cài đặt

### `/components/admin` - Các trang quản trị
- `AdminDashboard.jsx` - Dashboard admin
- `AdminUsers.jsx` - Quản lý người dùng
- `AdminCategories.jsx` - Quản lý danh mục
- `AdminStories.jsx` - Quản lý truyện

### `/components/ui` - Các component UI đơn giản
- `Login.jsx` - Component đăng nhập
- `Register.jsx` - Component đăng ký
- `HeroSlider.jsx` - Slider trang chủ
- `StatsSection.jsx` - Phần thống kê
- `Footer.jsx` - Footer
- `FeaturedBooks.jsx` - Truyện nổi bật
- `Loading.jsx` - Component loading
- `Toast.jsx` - Component thông báo
- `GoogleLoginButton.jsx` - Nút đăng nhập Google

### `/components` - Các component phức tạp
- `Header.jsx` - Header chính
- `AdminLayout.jsx` - Layout cho trang admin
- `Rankings.jsx` - Component xếp hạng
- `LoginModal.jsx` - Modal đăng nhập
- `RegisterModal.jsx` - Modal đăng ký
- `ForgotPasswordModal.jsx` - Modal quên mật khẩu

## Quy tắc đặt tên

1. **Pages**: Viết hoa chữ cái đầu, ví dụ: `Home.jsx`, `StoryDetail.jsx`
2. **Components**: Viết hoa chữ cái đầu, ví dụ: `Header.jsx`, `AdminLayout.jsx`
3. **UI Components**: Viết hoa chữ cái đầu, ví dụ: `Loading.jsx`, `Toast.jsx`

## Cấu trúc import

```javascript
// Import từ pages
import Home from "../pages/Home";

// Import từ components
import Header from "../components/Header";

// Import từ components/admin
import AdminUsers from "../components/admin/AdminUsers";

// Import từ components/ui
import Loading from "../components/ui/Loading";
``` 