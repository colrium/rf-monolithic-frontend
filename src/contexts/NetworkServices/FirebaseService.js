/** @format */

import React, { useRef, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, updateDoc } from "firebase/firestore"
import { setCurrentUser, ensureMessage, setSettings } from "state/actions"
import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { EventRegister } from "utils"
import { useDidMount, useSetState, useDidUpdate } from "hooks"
import { Api } from "services"

const FirebaseService = props => {
	const { children } = props
	const dispatch = useDispatch()
	const preferences = useSelector(state => ({ ...state.app?.preferences }))
	const settings = useSelector(state => ({ ...state.app?.settings }))
	const { user, isAuthenticated } = useSelector(state => state.auth)
	const appRef = useRef(initializeApp(firebaseConfig))
	const firestoreRef = useRef(getFirestore(appRef.current))
	const authRef = useRef(getAuth(appRef.current))
	const messagingRef = useRef(getMessaging(appRef.current))
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
			let tokens = [token]
			if (!JSON.isEmpty(user) && !String.isEmpty(userId) && !String.isEmpty(token)) {
				let saveToken = true
				if (Array.isArray(user?.tokens)) {
					let token_exists = user.tokens.indexOf(token) > -1
					if (!token_exists) {
						tokens = [...user.tokens, token]
					}
					saveToken = !token_exists
				} else {
					saveToken = true
				}
				////

				if (saveToken) {
					putFirestoreDoc("users", userId, {
						...user,
						tokens: tokens,
					}).then(res=> console.log("FirebaseService registerClientToken res", res)).catch(error => console.error("registerClientToken putFirestoreDoc error", error))
					dispatch(setCurrentUser({ ...user, tokens }))
					/* Api.post("/profile", {tokens: tokens}).then(res=> console.log("FirebaseService registerClientToken res", res)).catch(err => {
						console.log("FirebaseService registerClientToken err", err)
					}) */
				}
				return tokens
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
		auth: authRef.current,
		getFirestoreDoc: getFirestoreDoc,
		putFirestoreDoc: putFirestoreDoc,
		config: firebaseConfig,
		webPushCertificate: firebaseWebPushCertificate,
	})
}

export default React.memo(FirebaseService)
