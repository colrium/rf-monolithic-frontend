/** @format */

import React, { useRef, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, updateDoc } from "firebase/firestore/lite"
import { setCurrentUser, ensureMessage, setSettings } from "state/actions"
import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import Api from "services/Api"
import { EventRegister } from "utils"
import { useDidMount, useSetState, useDidUpdate } from "hooks"
import { usePermission } from "react-use"

const FirebaseService = props => {
	const { children } = props
	const dispatch = useDispatch()
	const preferences = useSelector(state => ({ ...state.app?.preferences }))
	const settings = useSelector(state => ({ ...state.app?.settings }))
	const { user, isAuthenticated } = useSelector(state => state.auth)
	const appRef = useRef(initializeApp(firebaseConfig))
	const firestoreRef = useRef(getFirestore(appRef.current))
	const messagingRef = useRef(getMessaging())
	// messagingRef.current.usePublicVapidKey(firebaseWebPushCertificate)
	const notificationPermission = usePermission({ name: "notification" })
	const [state, setState, getState] = useSetState({
		token: null,
		tokens: [],
	})

	const getFirestoreDoc = async (collectionName, entry) => {
		return await getDoc(doc(collection(firestoreRef.current, collectionName), entry))
	}

	const putFirestoreDoc = async (collectionName, entry, data) => {
		return await setDoc(doc(collection(firestoreRef.current, collectionName), entry), { ...data })
	}

	const getFCMToken = (requestPermission = true) => {
		return new Promise((resolve, reject) => {
			getToken(messagingRef.current, { vapidKey: firebaseWebPushCertificate })
				.then(token => {
					if (token) {
						resolve(token)
					} else {
						reject("Permission")
					}
				})
				.catch(err => {
					reject(err)
				})
		})
	}

	const unregisterClientToken = useCallback(async (userId, token) => {
		if (!String.isEmpty(userId) && !String.isEmpty(token)) {
			return await getFirestoreDoc("users", userId)
				.then(async querySnapshot => {
					let tokens = []
					let removeToken = false

					if (querySnapshot) {
						let querySnapshotDoc = querySnapshot.data()
						//saveToken = !querySnapshotDoc;

						//

						if (querySnapshotDoc) {
							if (Array.isArray(querySnapshotDoc.tokens)) {
								let token_exists = false
								querySnapshotDoc.tokens.map(token_entry => {
									if (token_entry === token && !token_exists) {
										token_exists = true
									} else {
										tokens.push(token_entry)
									}
								})
								removeToken = token_exists
							}
						} else {
							removeToken = false
						}
					} else {
						removeToken = false
					}

					if (removeToken) {
						////
						////
						putFirestoreDoc("users", userId, {
							tokens: tokens,
						})
					}
					return tokens
				})
				.catch(err => {
					let tokens = []
					let token_existed = false
					if (Array.isArray(user?.tokens)) {
						tokens = user?.tokens.filter(token_entry => {
							if (token_entry === token && !token_existed) {
								token_existed = true
							}
							return token_entry !== token
						})
					}
					if (token_existed) {
						putFirestoreDoc("users", userId, {
							tokens: tokens,
						})
					}

					return tokens
				})
		} else {
			return []
		}
	}, [])

	const registerClientToken = useCallback(
		async (userId, token) => {
			if (!String.isEmpty(userId) && !String.isEmpty(token)) {
				return await getFirestoreDoc("users", userId)
					.then(async querySnapshot => {
						let tokens = [token]
						let saveToken = true
						if (querySnapshot) {
							let querySnapshotDoc = querySnapshot.data()

							// querySnapshot.docChanges().forEach(change => {
							// 	if (isAuthenticated && user?._id === userId) {
							// 		if (change.type === "modified") {
							// 			console.log("User modified: ", change.doc.data())
							// 		}
							// 		if (change.type === "removed") {
							// 			console.log("User modified: ", change.doc.data())
							// 		}
							// 	}
							// })
							////

							if (querySnapshotDoc) {
								if (Array.isArray(querySnapshotDoc?.tokens)) {
									let token_exists = false
									querySnapshotDoc.tokens.map(token_entry => {
										if (token_entry === token && !token_exists) {
											token_exists = true
										} else {
											tokens.push(token_entry)
										}
									})
									saveToken = !token_exists
								}
							} else {
								saveToken = true
							}
						} else {
							saveToken = true
						}
						////

						if (saveToken) {
							putFirestoreDoc("users", userId, {
								...user,
								tokens: tokens,
							}).catch(error => console.error("registerClientToken putFirestoreDoc error", error))
						}
						return tokens
					})
					.catch(err => {
						//
						console.error("registerClientToken getFirestoreDoc error", err)
						return []
					})
			} else {
				return []
			}
		},
		[isAuthenticated, user]
	)

	const initializeClientToken = useCallback(async userId => {
		if (!String.isEmpty(userId)) {
			let tokens = []
			const token = await getFCMToken().catch(error => {
				console.error("Get Firebase Token error", error)
				return null
			})
			if (!String.isEmpty(token)) {
				tokens = await registerClientToken(userId, token).catch(error => {
					console.error("Ensure Firebase Token in Firestore error", error)
					return []
				})
			}
			setState({ token: token, tokens: tokens })
		} else {
			const token = await getFCMToken().catch(error => {
				console.error("Get Firebase Token error", error)
				return null
			})

			setState({ token: token })
		}
	}, [])

	const onMessageHandler = useCallback(
		async payload => {
			console.log("onFirebaseMessageHandler payload", payload)
			if (isAuthenticated) {
				const { data } = payload
				if (data.event_name === "new-message" || data.event_name === "message-sent") {
					dispatch(ensureMessage(data._id, true))
				}
			}
		},
		[isAuthenticated]
	)

	const handleOnLogin = useCallback(event => {
		const { profile } = { ...event.detail }
		if (JSON.isJSON(profile) && !JSON.isEmpty(profile)) {
			initializeClientToken(profile._id)
		}
	}, [])

	const handleOnLogout = useCallback(event => {
		const { profile } = { ...event.detail }
		const { token } = getState()
		if (JSON.isJSON(profile) && !JSON.isEmpty(profile) && !String.isEmpty(token)) {
			unregisterClientToken(profile._id, token)
		}
	}, [])

	const observeUserChanges = useCallback(
		user => {
			if (isAuthenticated) {
				db.collection("cities")
					.where("state", "==", "CA")
					.onSnapshot(querySnapshot => {
						querySnapshot.docChanges().forEach(change => {
							if (change.type === "added") {
								console.log("New city: ", change.doc.data())
							}
							if (change.type === "modified") {
								console.log("Modified city: ", change.doc.data())
							}
							if (change.type === "removed") {
								console.log("Removed city: ", change.doc.data())
							}
						})
					})
			}
		},
		[isAuthenticated]
	)

	useDidMount(() => {
		if (isAuthenticated) {
			initializeClientToken(user?._id)
		}
		const unsubscribeFcMessagingOnMessage = onMessage(messagingRef.current, onMessageHandler)

		const onLoginListener = EventRegister.on("login", handleOnLogin)
		const onLogoutListener = EventRegister.on("logout", handleOnLogout)
		return () => {
			onLoginListener.remove()
			onLogoutListener.remove()
			unsubscribeFcMessagingOnMessage()
		}
	})

	return children({
		...state,
		app: appRef.current,
		firestore: firestoreRef.current,
		messaging: messagingRef.current,
		getFirestoreDoc: getFirestoreDoc,
		putFirestoreDoc: putFirestoreDoc,
	})
}

export default React.memo(FirebaseService)
