const VERSION='balkan-v4.18.0';
const APP_CACHE=`${VERSION}-app`;
const RUNTIME_CACHE=`${VERSION}-runtime`;
const APP_SHELL=['./','./index.html','./template/styles.css','./trips/balkan-2026.js','./template/app.js','./manifest.webmanifest','./assets/balkan-route-map-v4.13.png','./assets/hvar-day10.jpg','./assets/icons/icon.svg','./assets/icons/icon-192.png','./assets/icons/icon-512.png','./assets/icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(APP_CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>!k.startsWith(VERSION)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const clone=r.clone();caches.open(APP_CACHE).then(c=>c.put('./index.html',clone));return r}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.hostname==='api.open-meteo.com'){
    e.respondWith(fetch(req).then(r=>{const clone=r.clone();caches.open(RUNTIME_CACHE).then(c=>c.put(req,clone));return r}).catch(()=>caches.match(req)));
    return;
  }
  if(url.origin===self.location.origin){
    e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(r=>{const clone=r.clone();caches.open(RUNTIME_CACHE).then(c=>c.put(req,clone));return r}).catch(()=>caches.match('./index.html'))));
  }
});
