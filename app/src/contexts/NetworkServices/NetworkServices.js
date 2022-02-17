import React from 'react';
import Api from "services/Api";
import Sockets from "services/Sockets";
import socketIoClient from "socket.io-client"
import { initializeApp } from "firebase/app"
import { getMessaging } from "firebase/messaging"
// import { getFirestore } from "firebase/firestore";
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	getDocs,
	getDoc,
} from "firebase/firestore/lite"
// import "firebase/messaging";
// import "firebase/firestore";
import { firebase as firebaseConfig, firebaseWebPushCertificate } from "config"
import { onBackgroundMessage } from "firebase/messaging/sw"
import { onMessage } from "firebase/messaging"
import { connect } from "react-redux"
import * as definations from "definations"
import { setAuthenticated, setCurrentUser, setToken } from "state/actions/auth"
import { fetchInbox, appendMessage } from "state/actions/communication"
import { setSettings } from "state/actions/app"
import { EventRegister } from "utils"
import compose from "recompose/compose"

class NetworkServices extends React.Component {
	unsubscribeFcMessagingOnMessage = () => undefined
	unsubscribeFcFirestoreUserOnSnapshot = () => undefined
	constructor(props) {
		super(props)
		this._isMounted = false
		this.initializeFirebaseMessaging =
			this.initializeFirebaseMessaging.bind(this)
		this.checkMessagingPermission = this.checkMessagingPermission.bind(this)
		this.saveTokenToDatabase = this.saveTokenToDatabase.bind(this)
		this.onFirebaseMessageHandler = this.onFirebaseMessageHandler.bind(this)
		this.onFirebaseBackgroundMessageHandler =
			this.onFirebaseBackgroundMessageHandler.bind(this)
		this.handleSocketsConnected = this.handleSocketsConnected.bind(this)
		this.handleSocketsReconnected = this.handleSocketsReconnected.bind(this)
		this.handleSocketsDisconnected =
			this.handleSocketsDisconnected.bind(this)
		this.initializeSockets = this.initializeSockets.bind(this)
		this.handleOnLogin = this.handleOnLogin.bind(this)
		this.handleOnLogout = this.handleOnLogout.bind(this)

		this.onLoginListener = EventRegister.on("login", this.handleOnLogin)
		this.onLogoutListener = EventRegister.on("logout", this.handleOnLogout)






		//const {auth} = this.props;

		////
		this.state = {
			Api: Api,
			Sockets: Sockets,
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
		if (isAuthenticated && !JSON.isEmpty(user)) {
			this.initializeFirebaseMessaging(user)
		}

		setTimeout(() => {
			console.log("Sockets.connected", this.state.Sockets.connected)
		}, 5000)
		EventRegister.emit("test", { type: "normal" })
	}

	componentDidMount() {
		this._isMounted = true
		const { fetchInbox } = this.props
		this.initializeSockets()
		this.state.Sockets.on("connect", this.handleSocketsConnected)
		// Sockets.on("reconnect", this.handleSocketsReconnected)
		this.state.Sockets.on("disconnect", this.handleSocketsDisconnected)
		if (Function.isFunction(fetchInbox)) {
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
		Sockets.off("identity-set")
		Sockets.off("presence-changed")
		Sockets.off("settings")
	}

	initializeSockets() {
		const {
			auth: { isAuthenticated, user },
			setCurrentUser,
			setSettings,
		} = this.props
		this.state.Sockets.on("identity-set", async profile => {
			////
			setCurrentUser(profile)
		})

		this.state.Sockets.on(
			"presence-changed",
			async ({ user, presence }) => {
				////
				setCurrentUser(user)
			}
		)

		this.state.Sockets.on("settings", async settings => {
			setSettings(settings)
		})
		this.state.Sockets.on("unauthorized", () => {
			console.log(
				"on unauthorized Api.getAccessToken()",
				Api.getAccessToken()
			)
		})
		this.state.Sockets.on("authenticated", async () => {
			if (isAuthenticated && !JSON.isEmpty(user)) {
				this.state.Sockets.emit("set-identity", user?._id)
				this.state.Sockets.emit("get-settings", user?._id)
				this.state.Sockets.emit("get-inbox", user)
			}
		})
		this.state.Sockets.on("authenticate", async ({}) => {
			const {
				auth: { isAuthenticated, user },
			} = this.props
			if (isAuthenticated && !JSON.isEmpty(user)) {
				console.log("Api.getAccessToken()", Api.getAccessToken())
			}
		})

		this.state.Sockets.onAny((event, ...args) => {
			console.log(`got ${event}`)
		})


	}

	handleSocketsConnected() {
		const {
			auth: { isAuthenticated, user },
			fetchInbox,
		} = this.props
		console.log("Api.getAccessToken()", Api.getAccessToken())
		if (isAuthenticated && !JSON.isEmpty(user)) {
			// this.state.Sockets.emit("authentication", {
			// 	username: "John",
			// 	password: "secret",
			// })
		}
	}

	handleSocketsReconnected() {}

	handleSocketsDisconnected() {}

	handleOnLogin(event) {
		const { profile } = event?.detail || {}
		const { fetchInbox } = this.props
		//
		if (!JSON.isEmpty(profile)) {
			// this.initializeFirebaseMessaging(profile);
			if (Sockets && Sockets.connected) {
				Sockets.emit("set-identity", profile._id)
				Sockets.emit("get-settings", profile._id)
			}
			fetchInbox()
		}
	}

	handleOnLogout(event) {
		const { fcmToken } = this.state
		//
		const { user, token } = event?.detail || {}
		this.removeTokenFromDatabase(fcmToken, user)
		if (this.state.Sockets && this.state.Sockets.connected) {
			this.state.Sockets.emit("logout", user)
		}
	}

	initializeFirebase() {
		let initializedFirebaseApp
		initializedFirebaseApp = initializeApp(firebaseConfig)
		let messaging
		messaging = getMessaging()
		let firestore
		firestore = getFirestore(initializedFirebaseApp)
	}

	initializeFirebaseMessaging(user) {
		const { setCurrentUser } = this.props
		const userId =
			!JSON.isEmpty(user) && !String.isEmpty(user?._id) ? user?._id : false
		if (!this.state?.Firebase?.initialized) {
			return false
		}
		if (userId) {
			this.checkMessagingPermission()
				.then(hasPermission => {
					if (hasPermission) {
						// Get the device token
						this.state.Firebase.messaging
							.getToken()
							.then(token => {
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
							})

						// If using other push notification providers (ie Amazon SNS, etc)
						// you may need to get the APNs token instead for iOS:
						// if(Platform.OS == 'ios') { this.state.Firebase.messaging.getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

						// Listen to token changes
						return this.state.Firebase.messaging.onTokenRefresh(
							newToken => {
								if (this._isMounted) {
									this.setState({ fcmToken: newToken })
								} else {
									this.state = {
										...this.state,
										fcmToken: newToken,
									}
								}
							}
						)
					}
				})
				.catch(err => {
					//
				})

			this.unsubscribeFcFirestoreUserOnSnapshot = getFirestoreDoc(
				"users",
				user?._id
			).then(function (docSnapshot) {
				//
				if (docSnapshot) {
					let docSnapshotData = docSnapshot.data()
					if (docSnapshotData) {
						setCurrentUser({ ...user, ...docSnapshotData })
					}
				}
			})

			// onBackgroundMessage(this.state.Firebase.messaging, this.onFirebaseBackgroundMessageHandler);
			// this.state.Firebase.messaging.setBackgroundMessageHandler(this.onFirebaseBackgroundMessageHandler);
			this.unsubscribeFcMessagingOnMessage = onMessage(
				this.state.Firebase.messaging,
				this.onFirebaseMessageHandler
			)
		} else {
			return
		}
	}

	async checkMessagingPermission() {
		if (!this.state.Firebase?.initialized) {
			return false
		}
		const authStatus =
			await this.state.Firebase.messaging.requestPermission()
		const enabled =
			authStatus ===
				this.state.Firebase?.messaging?.AuthorizationStatus
					?.AUTHORIZED ||
			authStatus ===
				this.Firebase?.messaging?.AuthorizationStatus?.PROVISIONAL
		return enabled
	}

	async saveTokenToDatabase(token, user) {
		const userId =
			!JSON.isEmpty(user) && !String.isEmpty(user?._id) ? user?._id : false
		if (
			userId &&
			!String.isEmpty(token) &&
			this.state.Firebase.initialized
		) {
			return await this.checkMessagingPermission()
				.then(async hasPermission => {
					if (hasPermission) {
						// Assume user is already signed in
						////
						const userId = user?._id
						// Add the token to the users datastore
						////
						let tokens = await getFirestoreDoc(
							"users",
							userId
						).then(async querySnapshot => {
							let tokens = [token]
							let saveToken = true

							if (querySnapshot) {
								let querySnapshotDoc = querySnapshot.data()
								//saveToken = !querySnapshotDoc;

								////

								if (querySnapshotDoc) {
									if (
										Array.isArray(querySnapshotDoc.tokens)
									) {
										let token_exists = false
										querySnapshotDoc.tokens.map(
											token_entry => {
												if (
													token_entry === token &&
													!token_exists
												) {
													token_exists = true
												} else {
													tokens.push(token_entry)
												}
											}
										)
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
		const userId =
			!JSON.isEmpty(user) && !String.isEmpty(user?._id) ? user?._id : false
		if (
			userId &&
			!String.isEmpty(token) &&
			this.state.Firebase.initialized
		) {
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
										if (
											Array.isArray(
												querySnapshotDoc.tokens
											)
										) {
											let token_exists = false
											querySnapshotDoc.tokens.map(
												token_entry => {
													if (
														token_entry === token &&
														!token_exists
													) {
														token_exists = true
													} else {
														tokens.push(token_entry)
													}
												}
											)
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
									this.state.Firebase.firestore
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
										if (
											token_entry === token &&
											!token_existed
										) {
											token_existed = true
										}
										return token_entry !== token
									})
								}
								if (condition) {
								}

								this.state.Firebase.firestore
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
			appendMessage,
			auth: { isAuthenticated },
		} = this.props
		if (isAuthenticated) {
			////);
			const { data } = payload
			if (
				data.event_name === "new-message" ||
				data.event_name === "message-sent"
			) {
				if (data.event_name === "new-message") {
					appendMessage(data._id, true)
				} else {
					//updateMessage(data._id);
					appendMessage(data._id, false)
				}
			}
		}
	}

	async onFirebaseBackgroundMessageHandler(payload) {
		const {
			appendMessage,
			auth: { isAuthenticated },
		} = this.props
		////);
		if (isAuthenticated) {
			const { data } = payload
			if (
				data.event_name === "new-message" ||
				data.event_name === "message-sent"
			) {
				if (data.event_name === "new-message") {
					appendMessage(data._id)
				} else {
					//updateMessage(data._id);
					appendMessage(data._id)
				}
			}
		}
	}
	render() {
		const { children } = this.props
		return children({ ...this.state, definations: definations })
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
})

export default compose(
	connect(mapStateToProps, {
		setCurrentUser,
		appendMessage,
		setSettings,
		fetchInbox,
	})
)(React.memo(NetworkServices))
