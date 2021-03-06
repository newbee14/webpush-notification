

var key, authSecret;
const applicationServerPublicKey = '########################';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
	.replace(/\-/g, '+')
	.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
	console.log('Service Worker and Push is supported');

	navigator.serviceWorker.register('sw.js')
		.then(function(swReg) {
		console.log('Service Worker is registered', swReg);

		swRegistration = swReg;
	})
		.catch(function(error) {
		console.error('Service Worker Error', error);
	});
} else {
	console.warn('Push messaging is not supported');
	pushButton.textContent = 'Push Not Supported';
}
function initialiseUI() {
	pushButton.addEventListener('click', function() {
		pushButton.disabled = true;
		if (isSubscribed) {
			// TODO: Unsubscribe user
		} else {
			subscribeUser();
		}
	});

	// Set the initial subscription value
	swRegistration.pushManager.getSubscription()
		.then(function(subscription) {
		isSubscribed = !(subscription === null);

		updateSubscriptionOnServer(subscription);

		if (isSubscribed) {
			console.log('User IS subscribed.');
		} else {
			console.log('User is NOT subscribed.');
		}

		updateBtn();
	});
}
function updateBtn() {
	if (isSubscribed) {
		pushButton.textContent = 'Disable Push Messaging';
	} else {
		pushButton.textContent = 'Enable Push Messaging';
	}

	pushButton.disabled = false;
}
navigator.serviceWorker.register('sw.js')
	.then(function(swReg) {
	console.log('Service Worker is registered', swReg);

	swRegistration = swReg;
	initialiseUI();
})
function subscribeUser() {
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: applicationServerKey
	})
		.then(function(subscription) {
		console.log('User is subscribed hjgf.', subscription);
		updateSubscriptionOnServer(subscription);

		isSubscribed = true;

		updateBtn();
	})
		.catch(function(err) {
		console.log('Failed to subscribe the user: ', err);
		updateBtn();
	});
}
function updateSubscriptionOnServer(subscription) {
	// TODO: Send subscription to application server

	if(subscription){
		var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
		key = rawKey ?
			btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
		'';
		var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
		authSecret = rawAuthSecret ?
			btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
		'';
		console.log("key", key, authSecret);
		$.ajax({
			method: "POST",
			url: 'http://localhost:8080/firebase_data',
			contentType: "application/x-www-form-urlencoded",
			data : {
			endpoint: subscription.endpoint,
			authkey: authSecret,
			p256dh: key
			}
		}).done(function( msg ) {
			console.log( "Data Saved: " + msg );
		});
		const subscriptionJson = document.querySelector('.js-subscription-json');
		const subscriptionDetails =
			  document.querySelector('.js-subscription-details');

		if (subscription) {
			subscriptionJson.textContent = JSON.stringify(subscription);
			subscriptionDetails.classList.remove('is-invisible');
		} else {
			subscriptionDetails.classList.add('is-invisible');
		}
	}
}