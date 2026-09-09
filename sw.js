/*
 * Offline support.
 *
 * The app shell is cached so the app opens without a connection. Your data is
 * NOT cached here — it is fetched from GitHub and kept in localStorage by the
 * app itself, so it never lands in a shared cache.
 */
/*
 * BUMP THIS NUMBER whenever index.html changes in a way the iPad must see.
 *
 * A browser only reinstalls a service worker when the bytes of THIS file
 * change. The fetch handler below is network-first, so a redeploy is normally
 * picked up on its own -- but a home-screen PWA on iOS can go on serving the
 * shell it installed, and then app code stays frozen at whatever version was
 * current when the worker was first registered. That is what happened between
 * 11 Aug and 9 Sep 2026: paid-off EMI loans kept showing on the iPad although
 * the fix was live on GitHub Pages. Changing this string reinstalls the worker,
 * which claims open pages and deletes every older cache in activate.
 */
var CACHE = "finances-shell-v3";
var SHELL = ["./", "./index.html", "./manifest.json", "./icon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);

  // Never touch the GitHub API — those responses carry private data.
  if (url.hostname !== self.location.hostname) return;
  if (e.request.method !== "GET") return;

  // Network first so a redeployed app is picked up, cache as the fallback.
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || caches.match("./index.html");
      });
    })
  );
});
