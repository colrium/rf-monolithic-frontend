import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/firestore";
import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config";


const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);

export const messaging = initializedFirebaseApp.messaging();
export const  firestore = initializedFirebaseApp.firestore();
messaging.usePublicVapidKey(firebaseWebPushCertificate);


export const getFirestoreDoc = (collection, doc) => {
	return new Promise((resolve, reject) => {
		firestore.collection(collection).doc(doc).get().then(async (querySnapshot) => {
			resolve(querySnapshot.data());
		}).catch(err => {
			reject(err);
		});	
	});
}


export const createUpdateFirestoreDoc = (collection, doc, data) => {
	return new Promise((resolve, reject) => {
		firestore.collection(collection).doc(doc).get().then(async (querySnapshot) => {
			let querySnapshotData = querySnapshot.data();
			let newData = {...querySnapshotData, ...data};
			firestore.collection(collection).doc(doc).set(newData);
			resolve(newData);
		}).catch(err => {
			reject(err);
		});	
	});
}







export default initializedFirebaseApp;