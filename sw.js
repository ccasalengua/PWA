var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    'css/main.css',
	'css/messages.css',
    'images/people_1.jpg',
    'images/people_2.jpg',
    'images/people_3.jpg',
    'images/people_4.jpg',
    'images/people_5.jpg',
    'images/people_6.jpg',
    'images/people_7.jpg',
    'images/people_8.jpg',
    'js/sites.js',
    'index.html',
    'messages.html',
    'offline.html',
    'manifest.json',
    'sw.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
            .then(function(response){
                // Cache hit - return response
                if (response){
                    return response;
                }
                return fetch(event.request).then(function(response){
                    if (response.status === 404){
                        console.log('Entra en 404: ', response)
                        return caches.match('offline.html');
                    }
                }).catch(function(){
                    return caches.match('offline.html');
                })
            })
    )
});


self.addEventListener('push', event =>{
    console.log('datos recibidos de push', event);
    console.log(`[Service Worker] Push Received`);
    console.log(`[service Worker] Push had this data: "${event.data.text()}"`);
    let title = 'Push Cusro PWA';
    let options = {
        body: 'Mensaje nuevo',
        icon: 'images/hello.jpg',
        badge: 'images/hello.jpg'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event =>{
    var action = event.action;

    // This looks to see if the current is already open and
    // focuses if it is
    if (action === 'close'){
        event.notification.close();
    } else{
        clients.openWindow('/index.html');
        event.notification.close();
    }
});
