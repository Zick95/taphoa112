const CACHE = 'tapho112-v18';

// Không pre-cache trong install — tránh lỗi path sai làm SW mới không activate được
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  // Xóa toàn bộ cache cũ
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: luôn lấy từ server, cache chỉ dùng khi offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
   