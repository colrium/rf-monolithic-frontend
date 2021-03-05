import firebase from "firebase";
import "firebase/messaging";
import "firebase/firestore";
import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config";


const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);
let messaging = initializedFirebaseApp.messaging();
let firestore = initializedFirebaseApp.firestore();



messaging.usePublicVapidKey(firebaseWebPushCertificate);
export default initializedFirebaseApp;
export {firestore, messaging};