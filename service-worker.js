importScripts("cache-polyfill.js");

let CACHE_VERSION = "app-v21";
let CACHE_FILES = [
  "/",
  "index.html",
  "manifest.json",
  "index.js",
  "styles.css",
  "assets/android-icon-36x36.png",
  "assets/android-icon-48x48.png",
  "assets/android-icon-72x72.png",
  "assets/android-icon-96x96.png",
  "assets/android-icon-144x144.png",
  "assets/android-icon-192x192.png",
  "assets/apple-icon-57x57.png",
  "assets/apple-icon-60x60.png",
  "assets/apple-icon-72x72.png",
  "assets/apple-icon-76x76.png",
  "assets/apple-icon-114x114.png",
  "assets/apple-icon-120x120.png",
  "assets/apple-icon-144x144.png",
  "assets/apple-icon-152x152.png",
  "assets/apple-icon-180x180.png",
  "assets/apple-icon-precomposed.png",
  "assets/apple-icon.png",
  "assets/favicon-16x16.png",
  "assets/favicon-32x32.png",
  "assets/favicon-96x96.png",
  "assets/favicon.ico",
  "assets/ms-icon-144x144.png",
  "assets/ms-icon-150x150.png",
  "assets/ms-icon-310x310.png",
  "assets/ms-icon-70x70.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener("fetch", function (event) {
  let online = navigator.onLine;
  if (!online) {
    event.respondWith(
      caches.match(event.request).then(function (res) {
        if (res) {
          return res;
        }
        requestBackend(event);
      })
    );
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key, i) {
          if (key !== CACHE_VERSION) {
            return caches.delete(keys[i]);
          }
        })
      );
    })
  );
});

function requestBackend(event) {
  var url = event.request.clone();
  return fetch(url).then(function (res) {
    //if not a valid response send the error
    if (!res || res.status !== 200 || res.type !== "basic") {
      return res;
    }

    var response = res.clone();

    caches.open(CACHE_VERSION).then(function (cache) {
      cache.put(event.request, response);
    });

    return res;
  });
}
