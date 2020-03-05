var isSubscribed = false;
var swRegistration = null;




function updateSubscriptionOnServer(subscription) {
    if (subscription) {
        console.log('Confirmación de suscripción:', JSON.stringify(subscription));
    }
}



function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            console.log('User is subscribed');

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;


        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);

        });
}


function initializeUI() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            updateSubscriptionOnServer(subscription);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }


        });
}

//Register worker,push manager and 
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
    navigator.serviceWorker.register('service-worker.js')
        .then(function (swReg) {
            console.log('Service Worker is registered', swReg);
            swRegistration = swReg;
            Notification.requestPermission();

            if ('sync' in swReg) {

                var buttonFollow = document.getElementById('followButton');
                var followName = document.getElementById('follow_1');

                buttonFollow.addEventListener('click', function (event) {
                    var nameFollower = {
                        'name': followName.textContent
                    }
                    store.outbox('readwrite').then(function (outbox) {
                        return outbox.put(nameFollower);
                    }).then(function () {
                        return swReg.sync.register('followers');
                    }).catch(function (err) {
                        console.error(err);

                    });
                });
            }
            initializeUI();
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });
    navigator.serviceWorker.ready.then(function (swRegistration) {
        return swRegistration.sync.register('myFirstSync');
    });
}


self.addEventListener('sync', function (event) {
    event.waitUntil(
        store.outbox('readonly').then(function (outbox) {
            return outbox.getAll();
        }).then(function (messages) {
            return Promise.all(messages.map(function (message) {
                return fetch('/followers', {
                    method: 'POST',
                    body: JSON.stringify(message),
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    if (data.result === 'success') {
                        return store.outbox('readwrite').then(function (outbox) {
                            return outbox.delete(message.id);
                        });
                    }
                })
            }))
        }).catch(function (err) {
            console.error(err);
        })
    );
})