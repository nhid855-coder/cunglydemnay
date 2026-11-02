const CACHE="cunglydemnay-v1";
const CORE=["./","index.html","privacy.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin.includes("fonts.g")){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req).then(hit=>hit||fetch(req).then(res=>{c.put(req,res.clone());return res}))));return;
  }
  if(url.origin!==location.origin) return;
  // trang HTML: lấy bản mới nếu có mạng, mất mạng thì dùng bản đã lưu
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(res=>{caches.open(CACHE).then(c=>c.put(req,res.clone()));return res}).catch(()=>caches.match(req).then(r=>r||caches.match("index.html"))));return;
  }
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});
