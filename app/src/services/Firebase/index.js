import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// import { getFirestore } from "firebase/firestore";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore/lite';
// import "firebase/messaging";
// import "firebase/firestore";
import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config";


let initializedFirebaseApp
initializedFirebaseApp = initializeApp(firebaseConfig)
let messaging
messaging = getMessaging()
let firestore
firestore = getFirestore(initializedFirebaseApp)
//messaging.usePublicVapidKey(firebaseWebPushCertificate);

const getFirestoreDoc = (collectionName, entry) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(collection(firestore, collectionName), entry))
			.then(async querySnapshot => {
				resolve(querySnapshot)
			})
			.catch(err => {
				reject(err)
			})
	})
}

const createUpdateFirestoreDoc = (collectionName, entry, data) => {
	return new Promise((resolve, reject) => {
		setDoc(doc(collection(firestore, collectionName), entry), { ...data })
			.then(snap => resolve(snap))
			.catch(err => {
				reject(err)
			})
	})
}

const getFCMToken = () => {
	return new Promise((resolve, reject) => {
		getToken(messaging, { vapidKey: firebaseWebPushCertificate })
			.then(token => {
				if (token) {
					resolve(token)
				}
				else {
					reject("Permission")
				}

			})
			.catch(err => {
				reject(err)
			})
	})
}


export { initializedFirebaseApp as default, messaging, getToken, firestore, getFirestoreDoc, createUpdateFirestoreDoc, getFCMToken }
