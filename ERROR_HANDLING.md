# Hệ Thống Xử Lý Lỗi

## Tổng Quan

Hệ thống xử lý lỗi đã được cải thiện để xử lý các loại lỗi network một cách hiệu quả, bao gồm:

- **Network Errors**: Lỗi kết nối đến máy chủ
- **Timeout Errors**: Máy chủ phản hồi quá chậm
- **Abort Errors**: Yêu cầu bị hủy
- **Server Errors**: Lỗi từ máy chủ
- **Not Found Errors**: Trang không tồn tại

## Các Thành Phần Chính

### 1. ApiService (`src/lib/ApiService.js`)

- **Timeout Handling**: Tự động hủy request sau 10 giây
- **Network Error Detection**: Phát hiện lỗi "Failed to fetch" và các lỗi network khác
- **Error Classification**: Phân loại lỗi thành các loại cụ thể
- **Account Lock Detection**: Phát hiện lỗi tài khoản bị khóa (status code 403)

```javascript
// Ví dụ xử lý lỗi network
if (error.name === 'TypeError' && error.message.includes('fetch')) {
  const networkError = new Error('Không thể kết nối đến máy chủ');
  networkError.code = 'NETWORK';
  networkError.isNetworkError = true;
  throw networkError;
}
```

### 2. useApiService Hook (`src/hooks/useApiService.js`)

- **Automatic Error Handling**: Tự động xử lý và phân loại lỗi
- **Error Redirection**: Chuyển hướng đến trang error phù hợp
- **Toast Notifications**: Hiển thị thông báo lỗi cho người dùng

```javascript
const { fetchData, mutate, loading, error } = useApiService();

// Lỗi network sẽ tự động chuyển hướng đến /error/NETWORK
try {
  await fetchData('getStories');
} catch (error) {
  // Error đã được xử lý tự động
}
```

### 3. ErrorPage Component (`src/components/ErrorPage.jsx`)

- **Dynamic Error Display**: Hiển thị thông tin lỗi phù hợp với từng loại
- **Custom Icons**: Icon khác nhau cho từng loại lỗi
- **Action Buttons**: Nút "Thử lại" và "Về trang chủ"

### 4. NetworkStatus Component (`src/components/NetworkStatus.jsx`)

- **Real-time Monitoring**: Giám sát trạng thái mạng và máy chủ
- **Automatic Redirects**: Tự động chuyển hướng khi có vấn đề
- **Status Banners**: Hiển thị banner thông báo trạng thái

### 5. Auth Store (`src/store/authStore.js`)

- **Account Lock Detection**: Kiểm tra trạng thái tài khoản bị khóa
- **Status Monitoring**: Theo dõi trạng thái user.status
- **Lock Prevention**: Ngăn chặn các hành động khi tài khoản bị khóa

### 6. Auth Middleware (Server-side)

- **Login Prevention**: Ngăn đăng nhập khi tài khoản bị khóa
- **Action Blocking**: Chặn comment, bookmark và các hành động khác
- **Status Validation**: Kiểm tra status trước mỗi request được bảo vệ

## Các Loại Lỗi Được Hỗ Trợ

### NETWORK
- **Code**: `NETWORK`
- **Title**: "Không thể kết nối đến máy chủ"
- **Message**: "Vui lòng kiểm tra kết nối mạng và thử lại. Máy chủ có thể đang bảo trì hoặc không khả dụng."
- **Icon**: WifiOff icon
- **Actions**: Có nút "Thử lại"

### TIMEOUT
- **Code**: `TIMEOUT`
- **Title**: "Yêu cầu quá thời gian chờ"
- **Message**: "Máy chủ phản hồi quá chậm. Vui lòng thử lại sau."
- **Icon**: Clock icon
- **Actions**: Có nút "Thử lại"

### ABORTED
- **Code**: `ABORTED`
- **Title**: "Yêu cầu đã bị hủy"
- **Message**: "Yêu cầu của bạn đã bị hủy. Vui lòng thử lại."
- **Icon**: Clock icon
- **Actions**: Có nút "Thử lại"

### 500 (Server Error)
- **Code**: `500`
- **Title**: "Đã có lỗi xảy ra"
- **Message**: "Đã có lỗi xảy ra, mong bạn quay lại sau."
- **Icon**: Text emoji
- **Actions**: Có nút "Thử lại"

### 404 (Not Found)
- **Code**: `404`
- **Title**: "Không tìm thấy trang"
- **Message**: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
- **Icon**: Text emoji
- **Actions**: Không có nút "Thử lại"

### ACCOUNT_LOCKED
- **Code**: `ACCOUNT_LOCKED`
- **Title**: "Tài khoản bị khóa"
- **Message**: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ."
- **Icon**: AlertTriangle icon
- **Actions**: Không có nút "Thử lại"
- **Special Help**: Hiển thị hướng dẫn liên hệ admin

## Cách Sử Dụng

### 1. Sử Dụng useApiService Hook

```javascript
import { useApiService } from '../hooks/useApiService';

function MyComponent() {
  const { fetchData, mutate, loading, error } = useApiService();

  const loadData = async () => {
    try {
      const data = await fetchData('getStories');
      // Xử lý dữ liệu
    } catch (error) {
      // Lỗi đã được xử lý tự động
      // Network errors sẽ chuyển hướng đến trang error
```

### 2. Kiểm Tra Tài Khoản Bị Khóa

```javascript
import useAuthStore from '../store/authStore';

function MyComponent() {
  const { isAccountLocked } = useAuthStore();

  // Kiểm tra xem tài khoản có bị khóa không
  if (isAccountLocked()) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
        Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.
      </div>
    );
  }

  // Tiếp tục render component bình thường
  return <div>Nội dung component</div>;
}
```

### 3. Xử Lý Lỗi Tài Khoản Bị Khóa

```javascript
// Lỗi sẽ tự động được phát hiện và xử lý
// Status code 403 với message chứa "khóa" sẽ được chuyển hướng đến /error/ACCOUNT_LOCKED

// Server sẽ trả về lỗi 403 khi:
// - User đăng nhập với tài khoản bị khóa
// - User thực hiện hành động (comment, bookmark) với tài khoản bị khóa
```
    }
  };

  return (
    <div>
      {loading && <p>Đang tải...</p>}
      {error && <p>Lỗi: {error}</p>}
      <button onClick={loadData}>Tải dữ liệu</button>
    </div>
  );
}
```

### 2. Test Các Loại Lỗi

Truy cập `/error-demo` để test các loại lỗi khác nhau:

- Test các trang error
- Test xử lý lỗi
- Xem thông tin về các loại lỗi

### 3. Custom Error Handling

```javascript
import { useErrorHandler } from '../hooks/useErrorHandler';

function MyComponent() {
  const { handleError } = useErrorHandler();

  const handleCustomError = () => {
    handleError({
      code: 'CUSTOM',
      title: 'Lỗi tùy chỉnh',
      message: 'Đây là lỗi tùy chỉnh',
      showRefresh: true
    });
  };

  return (
    <button onClick={handleCustomError}>
      Trigger Custom Error
    </button>
  );
}
```

## Cấu Hình

### Timeout Settings

```javascript
// Trong ApiService.js
const REQUEST_TIMEOUT = 10000; // 10 giây

// Trong NetworkStatus.js
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 giây cho health check
```

### Error Redirect Delays

```javascript
// Trong NetworkStatus.js
// Redirect sau 3 giây khi offline
setTimeout(() => {
  navigate('/error/NETWORK');
}, 3000);

// Redirect sau 2 giây khi server có vấn đề
setTimeout(() => {
  navigate('/error/NETWORK');
}, 2000);
```

## Lưu Ý

1. **Automatic Redirects**: Lỗi network sẽ tự động chuyển hướng đến trang error
2. **Error Boundaries**: Sử dụng ErrorBoundary để bắt lỗi React
3. **Network Monitoring**: NetworkStatus component giám sát liên tục
4. **User Experience**: Hiển thị thông báo rõ ràng và hướng dẫn khắc phục

## Troubleshooting

### Lỗi "Failed to fetch"
- Kiểm tra kết nối mạng
- Kiểm tra server có đang chạy không
- Kiểm tra CORS settings

### Lỗi Timeout
- Tăng REQUEST_TIMEOUT nếu cần
- Kiểm tra hiệu suất server
- Xem xét sử dụng caching

### Lỗi Abort
- Kiểm tra xem có component nào đang abort request không
- Kiểm tra cleanup functions trong useEffect
