import React from 'react';
import Api from "services/Api";
import SocketIO from "services/SocketIO"
import Firebase, { messaging, firestore, getFirestoreDoc, createUpdateFirestoreDoc, getFCMToken } from "services/Firebase"
import { getToken, onTokenRefresh } from "firebase/messaging"
// import { initializeApp } from "firebase/app"
// import { getMessaging } from "firebase/messaging"
// // import { getFirestore } from "firebase/firestore";
// import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore/lite"
// import "firebase/messaging";
// import "firebase/firestore";
// import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config"
import { onBackgroundMessage } from "firebase/messaging/sw"
import { onMessage } from "firebase/messaging"
import { connect } from "react-redux"
import * as definations from "definations"
import { setAuthenticated, setCurrentUser, setToken } from "state/actions"
import { fetchInbox, ensureMessage } from "state/actions/communication"
import { setSettings } from "state/actions/app"
import { EventRegister } from "utils"
import compose from "recompose/compose"

class NetworkServices extends React.Component {
	unsubscribeFcMessagingOnMessage = () => undefined
	unsubscribeFcFirestoreUserOnSnapshot = () => undefined
	constructor(props) {
		super(props)
		this._isMounted = false
		this.initializeFirebaseMessaging = this.initializeFirebaseMessaging.bind(this)
		this.checkMessagingPermission = this.checkMessagingPermission.bind(this)
		this.saveTokenToDatabase = this.saveTokenToDatabase.bind(this)
		this.onFirebaseMessageHandler = this.onFirebaseMessageHandler.bind(this)
		this.onFirebaseBackgroundMessageHandler = this.onFirebaseBackgroundMessageHandler.bind(this)
		this.handleSocketsConnected = this.handleSocketsConnected.bind(this)
		this.handleSocketsReconnected = this.handleSocketsReconnected.bind(this)
		this.handleSocketsDisconnected = this.handleSocketsDisconnected.bind(this)
		this.initializeSockets = this.initializeSockets.bind(this)
		this.handleOnLogin = this.handleOnLogin.bind(this)
		this.handleOnLogout = this.handleOnLogout.bind(this)

		this.onLoginListener = EventRegister.on("login", this.handleOnLogin)
		this.onLogoutListener = EventRegister.on("logout", this.handleOnLogout)

		//const {auth} = this.props;

		////
		this.state = {
			Api: Api,
			Firebase: {
				initialized: false,
				token: null,
				app: null,
			},
			fcmToken: null,
		}

		const {
			auth: { isAuthenticated, user },
		} = this.props
	}

	componentDidMount() {
		this._isMounted = true
		const {
			auth: { isAuthenticated, user },
			fetchInbox,
		} = this.props
		if (isAuthenticated && !JSON.isEmpty(user)) {
			this.initializeFirebaseMessaging(user)
		}
		this.initializeSockets()

		if (isAuthenticated) {
			fetchInbox()
		}
	}

	componentWillUnmount() {
		this._isMounted = false
		// this.unsubscribeFcMessagingOnMessage();
		// this.unsubscribeFcFirestoreUserOnSnapshot();

		if (this.onLoginListener) {
			this.onLoginListener.remove()
		}
		if (this.onLogoutListener) {
			this.onLogoutListener.remove()
		}
		SocketIO.off("identity-set")
		SocketIO.off("presence-changed")
		SocketIO.off("settings")
	}

	initializeEventRegister() {
		const {
			auth: { isAuthenticated, user },
			setCurrentUser,
			setSettings,
		} = this.props
		SocketIO.on("connect", this.handleSocketsConnected)
		SocketIO.on("reconnect", this.handleSocketsConnected)
		SocketIO.on("disconnect", this.handleSocketsDisconnected)
	}

	initializeSockets() {
		const {
			auth: { isAuthenticated, user },
			setCurrentUser,
			setSettings,
		} = this.props
		if (!SocketIO.connected) {
			setCurrentUser({ ...user, presence: "offline", prev_presence: user?.presence === "away" ? "offline" : "online" })
		}
		SocketIO.on("connect", this.handleSocketsConnected)
		SocketIO.on("reconnect", this.handleSocketsConnected)
		SocketIO.on("disconnect", this.handleSocketsDisconnected)
	}

	handleSocketsConnected() {
		const {
			auth: { isAuthenticated, user },
			ensureMessage,
			setCurrentUser,
			setSettings,
		} = this.props
		if (isAuthenticated && !JSON.isEmpty(user)) {
			SocketIO.on("presence-changed", ({ presence }) => {
				////
				setCurrentUser({ ...user, presence: presence })
			})
			SocketIO.on("user-changed-presence", data => {
				////
				if (data.user?._id === user._id || data.user === user._id) {
					setCurrentUser({ ...user, presence: data.presence })
				}
			})

			SocketIO.on("message-marked-as-read", ({ message }) => {
				ensureMessage(message)
			})
			SocketIO.on("message-marked-as-received", ({ message }) => {
				ensureMessage(message)
			})
			SocketIO.on("message-deleted-for-all", ({ message }) => {
				ensureMessage(message)
			})
			SocketIO.on("message-sent", message => {
				ensureMessage(message)
			})

			SocketIO.on("new-message", message => {
				ensureMessage(message)
			})

			SocketIO.on("settings", settings => {
				setSettings(settings)
			})
			// SocketIO.on("inbox", inbox => {
			// 	console.log("inbox", inbox)
			// })
			SocketIO.emit("get-settings", user?._id)
			// SocketIO.emit("get-inbox", {})
			SocketIO.on("authorized", ({ user }) => {
				const token = Api.getAccessToken()
				SocketIO.auth = { token: token.access_token }
			})
			SocketIO.on("unauthorized", ({}) => {
				const token = Api.getAccessToken()
				SocketIO.emit("authorization", { token: token.access_token })
			})
			SocketIO.on("authorization-failed", data => {
				console.log("authorization-failed data", data)
				// EventRegister.emit("logout")
			})
		}
	}

	handleSocketsReconnected() {}

	handleSocketsDisconnected() {
		// SocketIO.off("unauthorized")
		// SocketIO.off("authorization-failed")
		// SocketIO.off("inbox")
		// SocketIO.off("authorized")
		// SocketIO.off("presence-changed")
		// SocketIO.off("user-changed-presence")
	}

	handleOnLogin(event) {
		const { profile, token } = event?.detail || {}
		const { fetchInbox, setAuthenticated, setCurrentUser } = this.props
		//

		if (!JSON.isEmpty(profile) && !JSON.isEmpty(token)) {
			setCurrentUser(profile)
			setAuthenticated(true)
			this.initializeFirebaseMessaging(profile)

			if (SocketIO && SocketIO.connected) {
				SocketIO.emit("authorization", { token: token.access_token })
				SocketIO.emit("get-preferences", profile._id)
			}
			fetchInbox()
		}
	}

	handleOnLogout(event) {
		const { fcmToken } = this.state
		//
		const { user, token } = event?.detail || {}
		this.removeTokenFromDatabase(fcmToken, user)
		if (SocketIO && SocketIO.connected) {
			SocketIO.emit("logout", user)
		}
	}

	initializeFirebaseMessaging(user) {
		const { setCurrentUser } = this.props
		const userId = user?._id || user

		if (!String.isEmpty(userId)) {
			this.checkMessagingPermission()
				.then(hasPermission => {
					if (hasPermission) {
						// Get the device token
						getFCMToken()
							.then(token => {
								console.log("initializeFirebaseMessaging  getFCMToken token", token)
								//
								if (this._isMounted) {
									this.setState({ fcmToken: token })
								} else {
									this.state = {
										...this.state,
										fcmToken: token,
									}
								}

								return this.saveTokenToDatabase(token, user)
							})
							.catch(err => {
								//
								console.log("initializeFirebaseMessaging getFCMToken err", err)
							})

						// If using other push notification providers (ie Amazon SNS, etc)
						// you may need to get the APNs token instead for iOS:
						// if(Platform.OS == 'ios') { this.state.Firebase.messaging.getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

						// // Listen to token changes
						// return onTokenRefresh(newToken => {
						// 	if (this._isMounted) {
						// 		this.setState({ fcmToken: newToken })
						// 	} else {
						// 		this.state = {
						// 			...this.state,
						// 			fcmToken: newToken,
						// 		}
						// 	}
						// })
					}
				})
				.catch(error => {
					//
					console.log("initializeFirebaseMessaging error", error)
				})

			this.unsubscribeFcFirestoreUserOnSnapshot = getFirestoreDoc("users", user?._id).then(function (docSnapshot) {
				//
				if (docSnapshot) {
					let docSnapshotData = docSnapshot.data()
					if (docSnapshotData) {
						setCurrentUser({ ...user, ...docSnapshotData })
					}
				}
			})

			// // onBackgroundMessage(this.state.Firebase.messaging, this.onFirebaseBackgroundMessageHandler);
			// // this.state.Firebase.messaging.setBackgroundMessageHandler(this.onFirebaseBackgroundMessageHandler);
			this.unsubscribeFcMessagingOnMessage = onMessage(messaging, this.onFirebaseMessageHandler)
		} else {
			return
		}
	}

	async checkMessagingPermission() {
		return true
		const authStatus = await messaging.requestPermission()
		const enabled =
			authStatus === messaging?.AuthorizationStatus?.AUTHORIZED || authStatus === messaging?.AuthorizationStatus?.PROVISIONAL
		return enabled
	}

	async saveTokenToDatabase(token, user) {
		const userId = !JSON.isEmpty(user) && !String.isEmpty(user?._id) ? user?._id : false
		if (userId && !String.isEmpty(token) && this.state.Firebase.initialized) {
			return await this.checkMessagingPermission()
				.then(async hasPermission => {
					if (hasPermission) {
						// Assume user is already signed in
						////
						const userId = user?._id
						// Add the token to the users datastore
						////
						let tokens = await getFirestoreDoc("users", userId).then(async querySnapshot => {
							let tokens = [token]
							let saveToken = true

							if (querySnapshot) {
								let querySnapshotDoc = querySnapshot.data()
								//saveToken = !querySnapshotDoc;

								////

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
								////
								////
								createUpdateFirestoreDoc("users", userId, {
									...user,
									tokens: tokens,
								})
							}
							return tokens
						})

						return tokens
					}
				})
				.catch(err => {
					//
					return
				})
		} else {
			return
		}
	}

	async removeTokenFromDatabase(token, user) {
		const userId = !JSON.isEmpty(user) && !String.isEmpty(user?._id) ? user?._id : false
		if (userId && !String.isEmpty(token) && this.state.Firebase.initialized) {
			return await this.checkMessagingPermission()
				.then(async hasPermission => {
					if (hasPermission) {
						// Assume user is already signed in
						////
						// Add the token to the users datastore
						////

						let tokens = await getFirestoreDoc("users", userId)
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
									firestore
										.collection("users")
										.doc(userId)
										.set({ ...user, tokens: tokens })
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
								if (condition) {
								}

								firestore
									.collection("users")
									.doc(userId)
									.set({ ...user, tokens: tokens })
							})

						return tokens
					}
				})
				.catch(err => {
					//
					return
				})
		} else {
			return
		}
	}

	async onFirebaseMessageHandler(payload) {
		const {
			ensureMessage,
			auth: { isAuthenticated },
		} = this.props
		if (isAuthenticated) {
			console.log("onFirebaseMessageHandler payload", payload)
			const { data } = payload
			if (data.event_name === "new-message" || data.event_name === "message-sent") {
				ensureMessage(data._id, false)
			}
		}
	}

	async onFirebaseBackgroundMessageHandler(payload) {
		const {
			ensureMessage,
			auth: { isAuthenticated },
		} = this.props
		////);
		console.log("onFirebaseBackgroundMessageHandler payload", payload)
		if (isAuthenticated) {
			const { data } = payload
			if (data.event_name === "new-message" || data.event_name === "message-sent") {
				ensureMessage(data._id)
			}
		}
	}
	render() {
		const { children } = this.props
		return children({ ...this.state, SocketIO: SocketIO, definations: definations })
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
})

export default compose(
	connect(mapStateToProps, {
		setAuthenticated,
		setCurrentUser,
		ensureMessage,
		setSettings,
		fetchInbox,
	})
)(React.memo(NetworkServices))
