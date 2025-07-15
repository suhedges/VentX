// sw.js – replace old file completely
const CACHE = 'inv-v17';   // bump when anything changes!

const CORE = [
  './',
  'index.html',
  'manifest.json',
  'favicon.ico',
  // external libs
  'https://cdn.jsdelivr.net/npm/idb@8/+esm',
  'https://cdn.skypack.dev/@zxing/library@0.20.0',
  'https://cdn.jsdelivr.net/npm/papaparse@5/+esm',
  'https://cdn.jsdelivr.net/npm/xlsx@0.20.3/+esm'
];

self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(res=>res||fetch(e.request))
  );
});
