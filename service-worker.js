// Tên Cache. Thường tăng số khi cập nhật nội dung
const CACHE_NAME = 'solar-saver-cache-v1';
// Danh sách các file cần được cache ngay lập tức khi cài đặt
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.jsdelivr.net/npm/recharts/umd/Recharts.min.js',
  // Icon PWA
  'https://placehold.co/192x192/10b981/ffffff?text=%E2%98%80',
  'https://placehold.co/512x512/10b981/ffffff?text=%E2%98%80'
];

// Sự kiện cài đặt (Install event): Cache các tài nguyên cơ bản
self.addEventListener('install', (event) => {
  console.log('Service Worker: Đang cài đặt và cache...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Đã mở cache, thêm files.');
        return cache.addAll(urlsToCache).catch(err => {
            console.error('Service Worker: Lỗi khi thêm files vào cache:', err);
        });
      })
  );
});

// Sự kiện kích hoạt (Activate event): Xóa các cache cũ
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Đang kích hoạt và dọn dẹp cache cũ.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Đang xóa cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Sự kiện tìm nạp (Fetch event): Phục vụ tài nguyên từ cache (Offline-first)
self.addEventListener('fetch', (event) => {
  // Chỉ xử lý các yêu cầu HTTP/HTTPS
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Trả về từ cache nếu có
          if (response) {
            return response;
          }
          // Nếu không có trong cache, fetch từ mạng
          return fetch(event.request).then(
            (response) => {
              // Kiểm tra xem chúng ta có nhận được phản hồi hợp lệ không
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone phản hồi để có thể sử dụng response gốc và lưu vào cache
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
    );
  }
});
