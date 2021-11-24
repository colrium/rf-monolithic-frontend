import React from 'react';
import Api from "services/Api";
import Sockets from "services/Sockets";
import Firebase, { messaging as fcMessaging, firestore as fcFirestore, getFirestoreDoc, createUpdateFirestoreDoc } from "services/Firebase";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { onMessage } from "firebase/messaging";
import { connect } from "react-redux";
import * as definations from "definations";
import { setAuthenticated, setCurrentUser, setToken } from 'state/actions/auth';
import { fetchInbox, appendMessage } from 'state/actions/communication';
import { setSettings } from 'state/actions/app';
import { EventRegister } from "utils";
import compose from "recompose/compose";

class NetworkServices extends React.Component/* React.PureComponent */ {
	unsubscribeFcMessagingOnMessage = () => undefined;
	unsubscribeFcFirestoreUserOnSnapshot = () => undefined;
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.initializeFirebaseMessaging = this.initializeFirebaseMessaging.bind(this);
		this.checkMessagingPermission = this.checkMessagingPermission.bind(this);
		this.saveTokenToDatabase = this.saveTokenToDatabase.bind(this);
		this.onFirebaseMessageHandler = this.onFirebaseMessageHandler.bind(this);
		this.onFirebaseBackgroundMessageHandler = this.onFirebaseBackgroundMessageHandler.bind(this);
		this.handleSocketsConnected = this.handleSocketsConnected.bind(this);
		this.handleSocketsReconnected = this.handleSocketsReconnected.bind(this);
		this.handleSocketsDisconnected = this.handleSocketsDisconnected.bind(this);
		this.initializeSockets = this.initializeSockets.bind(this);
		this.handleOnLogin = this.handleOnLogin.bind(this);
		this.handleOnLogout = this.handleOnLogout.bind(this);


		this.onLoginListener = EventRegister.addEventListener('login', this.handleOnLogin);
		this.onLogoutListener = EventRegister.addEventListener('logout', this.handleOnLogout);
		const { auth: { isAuthenticated, user } } = this.props;
		if (isAuthenticated && !JSON.isEmpty(user)) {
			this.initializeFirebaseMessaging(user);
		}

		this.initializeSockets();
		Sockets.on("connect", this.handleSocketsConnected);
		Sockets.on("reconnect", this.handleSocketsReconnected);
		Sockets.on("disconnect", this.handleSocketsDisconnected);

		//const {auth} = this.props;

		////
		this.state = {
			"Api": Api,
			"Sockets": Sockets,
			"Firebase": Firebase,
			"fcmToken": null,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		const { fetchInbox } = this.props;
		if (Function.isFunction(fetchInbox)) {
			fetchInbox();
		}

		console.log()
	}

	componentWillUnmount() {
		this._isMounted = false;
		// this.unsubscribeFcMessagingOnMessage();
		// this.unsubscribeFcFirestoreUserOnSnapshot();
		if (this.onLoginListener) {
			EventRegister.removeEventListener(this.onLoginListener);
		}
		if (this.onLogoutListener) {
			EventRegister.removeEventListener(this.onLogoutListener);
		}
		Sockets.off("identity-set");
		Sockets.off("presence-changed");
		Sockets.off("settings");

	}
	shouldComponentUpdate(nextProps, nextState) {
		return !Object.areEqual(nextProps.auth.isAuthenticated, this.props.auth.isAuthenticated) || !Object.areEqual(nextProps.auth.user, this.props.auth.user);
	}



	initializeSockets() {
		const { auth: { isAuthenticated, user }, setCurrentUser, setSettings } = this.props;
		Sockets.on("identity-set", async (profile) => {
			////
			setCurrentUser(profile);
		});

		Sockets.on("presence-changed", async ({ user, presence }) => {
			////
			setCurrentUser(user);
		});

		Sockets.on("settings", async (settings) => {
			setSettings(settings);
		});

		if (isAuthenticated && !JSON.isEmpty(user) && Sockets && Sockets.connected) {
			Sockets.emit("set-identity", user._id);
			Sockets.emit("get-settings", user._id);
			Sockets.emit("get-inbox", user);
		}


	}

	handleSocketsConnected() {
		const { auth: { isAuthenticated, user }, fetchInbox } = this.props;
		if (isAuthenticated && !JSON.isEmpty(user)) {
			Sockets.emit("set-identity", user._id);
			Sockets.emit("get-settings", user._id);
			Sockets.emit("get-inbox", user);
			fetchInbox();
		}
	}



	handleSocketsReconnected() {

	}

	handleSocketsDisconnected() {

	}

	handleOnLogin({ profile }) {
		const { fetchInbox } = this.props;
		//
		if (!JSON.isEmpty(profile)) {
			// this.initializeFirebaseMessaging(profile);
			if (Sockets && Sockets.connected) {
				Sockets.emit("set-identity", profile._id);
				Sockets.emit("get-settings", profile._id);
			}
			fetchInbox();
		}
	}

	handleOnLogout({ user, token }) {
		const { fcmToken } = this.state;
		//

		this.removeTokenFromDatabase(fcmToken, user);
		if (Sockets && Sockets.connected) {
			Sockets.emit("logout", user);
		}
	}

	initializeFirebaseMessaging(user) {
		const { setCurrentUser } = this.props;
		const userId = !JSON.isEmpty(user) && !String.isEmpty(user._id) ? user._id : false;
		if (userId) {
			this.checkMessagingPermission().then(hasPermission => {
				if (hasPermission) {
					// Get the device token
					fcMessaging.getToken().then(token => {
						//
						if (this._isMounted) {
							this.setState({ fcmToken: token });
						}
						else {
							this.state = { ...this.state, fcmToken: token };
						}
						return this.saveTokenToDatabase(token, user);
					}).catch(err => {
						//
					});

					// If using other push notification providers (ie Amazon SNS, etc)
					// you may need to get the APNs token instead for iOS:
					// if(Platform.OS == 'ios') { fcMessaging.getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

					// Listen to token changes
					return fcMessaging.onTokenRefresh(newToken => {
						if (this._isMounted) {
							this.setState({ fcmToken: newToken });
						}
						else {
							this.state = { ...this.state, fcmToken: newToken };
						}
					});
				}

			}).catch(err => {
				//
			});



			this.unsubscribeFcFirestoreUserOnSnapshot = getFirestoreDoc("users", user._id).then(function (docSnapshot) {
				// 
				if (docSnapshot) {
					let docSnapshotData = docSnapshot.data();
					if (docSnapshotData) {
						setCurrentUser({ ...user, ...docSnapshotData });
					}
				}
			});

			// onBackgroundMessage(fcMessaging, this.onFirebaseBackgroundMessageHandler);
			// fcMessaging.setBackgroundMessageHandler(this.onFirebaseBackgroundMessageHandler);
			this.unsubscribeFcMessagingOnMessage = onMessage(fcMessaging, this.onFirebaseMessageHandler);
		}
		else {
			return;
		}


	}

	async checkMessagingPermission() {
		const authStatus = await fcMessaging.requestPermission();
		const enabled = authStatus === Firebase.messaging.AuthorizationStatus.AUTHORIZED || authStatus === Firebase.messaging.AuthorizationStatus.PROVISIONAL;
		return enabled;
	}


	async saveTokenToDatabase(token, user) {
		const userId = !JSON.isEmpty(user) && !String.isEmpty(user._id) ? user._id : false;
		if (userId && !String.isEmpty(token)) {
			return await this.checkMessagingPermission().then(async hasPermission => {
				if (hasPermission) {
					// Assume user is already signed in				
					////
					const userId = user._id;
					// Add the token to the users datastore
					////
					let tokens = await getFirestoreDoc("users", userId).then(async (querySnapshot) => {
						let tokens = [token];
						let saveToken = true;


						if (querySnapshot) {
							let querySnapshotDoc = querySnapshot.data();
							//saveToken = !querySnapshotDoc;

							////

							if (querySnapshotDoc) {
								if (Array.isArray(querySnapshotDoc.tokens)) {
									let token_exists = false;
									querySnapshotDoc.tokens.map(token_entry => {
										if (token_entry === token && !token_exists) {
											token_exists = true;
										}
										else {
											tokens.push(token_entry);
										}
									});
									saveToken = !token_exists;

								}
							}
							else {
								saveToken = true;
							}


						}
						else {
							saveToken = true;
						}
						////

						if (saveToken) {
							////
							////
							createUpdateFirestoreDoc("users", userId, { ...user, tokens: tokens });
						}
						return tokens;
					});



					return tokens;


				}
			}).catch(err => {
				//
				return;
			});
		}
		else {
			return;
		}

	}

	async removeTokenFromDatabase(token, user) {
		const userId = !JSON.isEmpty(user) && !String.isEmpty(user._id) ? user._id : false;
		if (userId && !String.isEmpty(token)) {
			return await this.checkMessagingPermission().then(async hasPermission => {
				if (hasPermission) {
					// Assume user is already signed in				
					////
					// Add the token to the users datastore
					////

					let tokens = await getFirestoreDoc("users", userId).then(async (querySnapshot) => {
						let tokens = [];
						let removeToken = false;


						if (querySnapshot) {
							let querySnapshotDoc = querySnapshot.data();
							//saveToken = !querySnapshotDoc;

							//

							if (querySnapshotDoc) {
								if (Array.isArray(querySnapshotDoc.tokens)) {
									let token_exists = false;
									querySnapshotDoc.tokens.map(token_entry => {
										if (token_entry === token && !token_exists) {
											token_exists = true;
										}
										else {
											tokens.push(token_entry);
										}
									});
									removeToken = token_exists;

								}
							}
							else {
								removeToken = false;
							}


						}
						else {
							removeToken = false;
						}

						if (removeToken) {
							////
							////
							fcFirestore.collection("users").doc(userId).set({ ...user, tokens: tokens });
						}
						return tokens;
					}).catch(err => {
						let tokens = [];
						let token_existed = false;
						if (Array.isArray(user.tokens)) {
							tokens = user.tokens.filter(token_entry => {
								if (token_entry === token && !token_existed) {
									token_existed = true;
								}
								return token_entry !== token;
							});
						}
						if (condition) {

						}

						fcFirestore.collection("users").doc(userId).set({ ...user, tokens: tokens });

					});



					return tokens;


				}
			}).catch(err => {
				//
				return;
			});
		}
		else {
			return;
		}

	}

	async onFirebaseMessageHandler(payload) {
		const { appendMessage, auth: { isAuthenticated } } = this.props;
		if (isAuthenticated) {
			////);
			const { data } = payload;
			if (data.event_name === "new-message" || data.event_name === "message-sent") {
				if (data.event_name === "new-message") {
					appendMessage(data._id, true);

				}
				else {
					//updateMessage(data._id);
					appendMessage(data._id, false);
				}
			}
		}



	}

	async onFirebaseBackgroundMessageHandler(payload) {
		const { appendMessage, auth: { isAuthenticated } } = this.props;
		////);
		if (isAuthenticated) {
			const { data } = payload;
			if (data.event_name === "new-message" || data.event_name === "message-sent") {
				if (data.event_name === "new-message") {
					appendMessage(data._id);
				}
				else {
					//updateMessage(data._id);
					appendMessage(data._id);
				}
			}
		}



	}
	render() {
		const { children } = this.props;
		return children({ ...this.state, definations: definations });
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});



export default compose(connect(mapStateToProps, { setCurrentUser, appendMessage, setSettings, fetchInbox }))(React.memo(NetworkServices));