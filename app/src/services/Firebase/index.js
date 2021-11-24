import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// import { getFirestore } from "firebase/firestore";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore/lite';
// import "firebase/messaging";
// import "firebase/firestore";
import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config";


const initializedFirebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging();
export const firestore = getFirestore(initializedFirebaseApp);
//messaging.usePublicVapidKey(firebaseWebPushCertificate);

export const getFirestoreDoc = (collectionName, entry) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(collection(firestore, collectionName), entry)).then(async (querySnapshot) => {
			resolve(querySnapshot);
		}).catch(err => {
			reject(err);
		});
	});
}


export const createUpdateFirestoreDoc = (collectionName, entry, data) => {
	return new Promise((resolve, reject) => {
		setDoc(doc(collection(firestore, collectionName), entry), { ...data }).then((snap) => resolve(snap)).catch(err => {
			reject(err);
		});
	});
}







export default initializedFirebaseApp;