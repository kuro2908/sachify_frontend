# Sachify Frontend

Frontend React application cho ứng dụng đọc truyện Sachify, được xây dựng với React 19, Vite và Tailwind CSS.

## 🚀 Tính năng chính

- **User Interface**: Giao diện đọc truyện hiện đại và responsive
- **Authentication**: Đăng ký, đăng nhập, Google OAuth
- **Story Reading**: Đọc truyện với nhiều tùy chọn (font size, theme, line height)
- **User Dashboard**: Profile, bookmark, lịch sử đọc
- **Author Tools**: Tạo và quản lý truyện, chương
- **Admin Panel**: Quản lý users, stories, categories
- **Search & Filter**: Tìm kiếm và lọc truyện
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **Dark/Light Theme**: Hỗ trợ nhiều theme
- **Reading Progress**: Theo dõi tiến độ đọc

## 🛠️ Công nghệ sử dụng

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Styled Components
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom components
- **Form Handling**: React Hook Form
- **Validation**: Yup

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 8.0.0 hoặc yarn >= 1.22.0
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd sachify_frontend
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường
Tạo file `.env` trong thư mục gốc:

```env
# App Configuration
VITE_APP_NAME=Sachify
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Ứng dụng đọc truyện online

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=false
VITE_ENABLE_OFFLINE_MODE=false

# External Services
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Development
VITE_DEV_MODE=true
VITE_ENABLE_HOT_RELOAD=true
VITE_ENABLE_DEBUG_TOOLS=true

# Production
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_CACHING=true
VITE_ENABLE_CDN=false
```

### 4. Khởi chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

### 5. Build cho production
```bash
npm run build
# hoặc
yarn build
```

### 6. Preview production build
```bash
npm run preview
# hoặc
yarn preview
```

## 📁 Cấu trúc thư mục

```
sachify_frontend/
├── public/                 # Static files
│   ├── _redirects         # Netlify redirects
│   ├── css/               # Global CSS
│   ├── js/                # Global JS
│   └── vite.svg           # Vite logo
├── src/                    # Source code
│   ├── assets/            # Images, fonts, icons
│   ├── components/        # Reusable components
│   │   ├── admin/         # Admin components
│   │   ├── ui/            # UI components
│   │   └── ...            # Other components
│   ├── config/            # Configuration files
│   │   └── api.js         # API configuration
│   ├── contexts/          # React contexts
│   │   └── ToastContext.jsx # Toast notifications
│   ├── hooks/             # Custom hooks
│   │   ├── useApiService.js # API service hook
│   │   └── useErrorHandler.js # Error handling hook
│   ├── lib/               # Utility libraries
│   │   └── ApiService.js  # API service
│   ├── pages/             # Page components
│   │   ├── author/        # Author pages
│   │   └── ...            # Other pages
│   ├── router/            # Routing configuration
│   │   └── Router.jsx     # Main router
│   ├── store/             # State management
│   │   └── authStore.js   # Authentication store
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                    # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🔧 Scripts có sẵn

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 🌍 Chuyển đổi môi trường

### Development → Production

**Cập nhật biến môi trường**

/src/config/api.js
Line 23: export const API_BASE_URL = API_CONFIG.PRODUCTION;
(Chuyển hướng production)

```

### Production → Development

/src/config/api.js
Line 23: export const API_BASE_URL = API_CONFIG.LOCAL;
(Chuyển hướng production)

Đổi port ở line 3-15

2. **Khởi chạy development server**
```bash
npm run dev
```

## 🔐 Biến môi trường quan trọng

### Bắt buộc
- `VITE_API_BASE_URL`: URL của backend API
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

### Quan trọng cho production
- `VITE_APP_ENV`: Môi trường (development/production)
- `VITE_ENABLE_COMPRESSION`: Bật nén file
- `VITE_ENABLE_CACHING`: Bật caching
- `VITE_ENABLE_CDN`: Sử dụng CDN

### Feature flags
- `VITE_ENABLE_ANALYTICS`: Bật Google Analytics
- `VITE_ENABLE_PWA`: Bật Progressive Web App
- `VITE_ENABLE_OFFLINE_MODE`: Bật offline mode

### External services
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary configuration
- `VITE_FIREBASE_*`: Firebase configuration

## 🎨 Styling và UI

### Tailwind CSS
```bash
# Customize Tailwind config
npx tailwindcss init -p
```

### Styled Components
```bash
# Install styled-components
npm install styled-components
```

### CSS Variables
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #7c3aed;
  --accent-color: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Component Examples
```jsx
// Responsive component
const ResponsiveComponent = () => (
  <div className="
    grid 
    grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3 
    gap-4 
    p-4 
    md:p-6 
    lg:p-8
  ">
    {/* Content */}
  </div>
);
```

## 🚀 Performance Optimization

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

### Image Optimization
```jsx
// Lazy loading images
<img 
  src={imageUrl} 
  alt={alt}
  loading="lazy"
  className="w-full h-auto"
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🧪 Testing

### Setup Testing
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Test Examples
```jsx
// Component test
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📦 Build và Deployment

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

### Environment-specific Builds
```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Staging build
npm run build:staging
```

## 🚀 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy (drag & drop dist/ folder)
```

### Docker
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔒 Security

### Environment Variables
- Không commit file `.env` vào git
- Sử dụng `.env.example` làm template
- Validate environment variables

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

### HTTPS
```javascript
// Force HTTPS in production
if (import.meta.env.PROD && location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

## 📊 Monitoring và Analytics

### Error Tracking
```javascript
// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to service (Sentry, LogRocket, etc.)
    console.error('Error:', error, errorInfo);
  }
}
```

### Performance Monitoring
```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🐛 Troubleshooting

### Common Issues

#### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Build errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Styling issues
```bash
# Rebuild Tailwind CSS
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Enable React DevTools
npm install -D @vitejs/plugin-react
```

## 📞 Support

- **Issues**: Tạo issue trên GitHub
- **Documentation**: Xem component docs
- **Discord**: Join our community
- **Email**: support@sachify.com

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📈 Roadmap

- [ ] PWA support
- [ ] Offline reading
- [ ] Advanced search filters
- [ ] Reading statistics
- [ ] Social features
- [ ] Multi-language support
- [ ] Audio books
- [ ] Reading groups
