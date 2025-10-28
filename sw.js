const CACHE_NAME = 'solar-saver-v1';

// Sự kiện cài đặt: Bỏ qua bước chờ để active ngay lập tức
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Sự kiện kích hoạt: Yêu cầu quyền kiểm soát ngay lập tức
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Sự kiện Fetch: Phục vụ tài nguyên từ cache hoặc mạng
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => caches.match('/'))
    );
});
