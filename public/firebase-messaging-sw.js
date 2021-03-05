importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

/*import firebase from "firebase";
import { firebase as firebaseConfig } from "config";*/

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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
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
               return registration.showNotification("my notification title");
          });
     return promiseChain;
});
self.addEventListener("notificationclick", function(event) {
     console.log(event);
});