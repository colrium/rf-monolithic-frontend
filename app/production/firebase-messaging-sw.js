importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-messaging.js');

if (firebase.messaging.isSupported()) {
     /* const firebaseConfig = {
          apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
          authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.REACT_APP_FIREBASE_APP_ID,
          measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
     }
     const firebaseWebPushCertificate = process.env.REACT_APP_FIREBASE_WEB_PUSH_CERTIFICATE; */

     const firebaseConfig = {
          apiKey: "AIzaSyDnzjktxxiPEcfjmkxgxcTT0U1D70c-h9U",
          authDomain: "realfield-io.firebaseapp.com",
          databaseURL: "https://realfield-io.firebaseio.com",
          projectId: "realfield-io",
          storageBucket: "realfield-io.appspot.com",
          messagingSenderId: "47480102815",
          appId: "1:47480102815:web:aef14d1c29e4832f97a7aa",
          measurementId: "G-SPZ1031JXB"
     }
     const firebaseWebPushCertificate = "BCRs2cCvL59gp6AyJybuna4N7migtv4c6O6Twvgpg0-FE8yAhAmEpYNRc7YwV4T4QjhLQkds8U2NUS6ZVxVChXw";

     firebase.initializeApp(firebaseConfig);
     const messaging = firebase.messaging();

     messaging.usePublicVapidKey(firebaseWebPushCertificate);



     messaging.setBackgroundMessageHandler(function (payload) {
          const promiseChain = clients
               .matchAll({
                    type: "window",
                    includeUncontrolled: true,
               })
               .then((windowClients) => {
                    for (let i = 0; i < windowClients.length; i++) {
                         const windowClient = windowClients[i];
                         windowClient.postMessage(payload);
                    }
               })
               .then(() => {
                    const notificationTitle = payload.data.title;
                    const notificationOptions = {
                         body: payload.data.message,
                         icon: payload.data.icon,
                         data: { url: payload.data.onClick }, //the url which we gonna use later
                    };
                    return self.registration.showNotification(notificationTitle, notificationOptions);
               });
          return promiseChain;
     });

     //Code for adding event on click of notification
     self.addEventListener('notificationclick', function (event) {
          let url = event.notification.data.url;
          event.notification.close();
          event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
               // Check if there is already a window/tab open with the target URL
               for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    // If so, just focus it.
                    if (client.url === url && 'focus' in client) {
                         return client.focus();
                    }
               }
               // If not, then open the target URL in a new window/tab.
               if (clients.openWindow) {
                    return clients.openWindow(url);
               }
          }));
     });

}
