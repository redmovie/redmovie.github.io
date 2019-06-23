var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('first-app')
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/details.html',
          '/offline.html',
          '/styles.css',
          '/src/js/app.js',
          'https://code.jquery.com/jquery-3.3.1.slim.min.js',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en'
        ])
      })
  );
  return self.clients.claim();
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  return self.clients.claim();
});


self.addEventListener('fetch', function (event) {
  var url = 'https://httpbin.org/get';

  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (res) {
              cache.put(event.request, res.clone());
              return res;
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open('first-app')
                  .then(function (cache) {
                    return cache.match('/offline.html');
                  });
              });
          }
        })
    );
  }
});

// self.addEventListener('fetch', event => {
//   // Prevent the default, and handle the request ourselves.
//   event.respondWith(async function() {
//     // Try to get the response from a cache.
//     const cachedResponse = await caches.match(event.request);
//     // Return it if we found one.
//     if (cachedResponse) return cachedResponse;
//     // If we didn't find a match in the cache, use the network.
//     return fetch(event.request);
//   }());
// });

// self.addEventListener('fetch', function(event) {
// 	event.respondWith(
// 		caches.match(event.request)
// 			.then(function(res) {
// 				return res || fetch(event.request);
// 			}).catch(function() {
// 			// If both fail, show a generic fallback:
// 				return caches.match('/offline.html');
// 		})
// 	);
// });


// self.addEventListener('fetch', function(event) {
// 	event.respondWith(
// 		fetch(event.request)
// 			.then(function(res) {
// 				return caches.open('dynamic-v2')
// 			.then(function(cache) {
// 				cache.put(event.request.url, res.clone());
// 				return res;
// 			})
// 		})
// 		.catch(function(err) {
// 			return caches.match('/offline.html');
// 		})
// 	);
// });

// self.addEventListener('install', function(event) {
//   console.log('[Service Worker] Installing Service Worker ...', event);
//   event.waitUntil(
//     caches.open('static')
//       .then(function(cache) {
//         console.log('[Service Worker] Precaching App Shell');
//         cache.add('/src/js/app.js')
//       })
//   )
// });

// self.addEventListener('activate', function(event) {
//   console.log('[Service Worker] Activating Service Worker ....', event);
//   return self.clients.claim();
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(fetch(event.request));
// });
