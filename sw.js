'use strict';
var url = "";
this.addEventListener('install', function(event) {
	console.log("hello sw");
  event.waitUntil(
    caches.open('v1').then(function(cache) {
	return cache.addAll([
        config.webpages
	   ]);	
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v1').then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match(' /gallery/myLittleVader.jpg');
  }));
});

self.addEventListener('push', function(event) {
	
	console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
	var obj = event.data.json();
	const title = obj.title;
	console.log(obj);
	const options = {
		body: obj.msg,
		icon: 'images/icon.png',
		badge: 'images/badge.png',
		data:{
			url:obj.url
		}
	};
	event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(event) {
	var url = event.notification.data.url;
	event.notification.close();
	event.waitUntil(
		clients.openWindow(url)
	);
});

/*
self.addEventListener('sync', function(sync_event) {
  var responseData;
  fetch(new Request("/sample.json", {cache: "no-store"}))
  .then(response => {
    if (response.status == 200) {
      return response.text();
    } else {
      throw new Error("" + response.status + " " + response.statusText);
    }
  })*/
