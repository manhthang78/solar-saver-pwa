const CACHE_NAME = 'solar-saver-v2'; // Tăng version cache
const OFFLINE_URL = './offline.html'; // Đường dẫn đến trang offline

self.addEventListener('install', event => {
    // Thêm trang offline vào cache ngay trong quá trình cài đặt
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.add(OFFLINE_URL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    // Xóa cache cũ
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                          .map(name => caches.delete(name))
            );
        }).then(() => clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Chỉ xử lý các yêu cầu điều hướng (HTML)
    if (event.request.mode === 'navigate' || 
        (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        
        event.respondWith(
            fetch(event.request).catch(error => {
                // Nếu fetch thất bại (ngoại tuyến), phục vụ trang offline
                return caches.match(OFFLINE_URL);
            })
        );
    } else {
        // Chiến lược cache-first cho các tài nguyên khác
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});
