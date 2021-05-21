import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { osName, osVersion, browserName, fullBrowserVersion } from 'react-device-detect';

import { clearApiTasks, clearResponseCache, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser, apiCallRequest, setDeviceLocation } from "state/actions";
import { setMessagingCache, sendUnsentMessages, fetchInbox, updateMessage, appendMessage, fetchContacts } from "state/actions/communication";
import ApiService from "services/Api";
import {default_location, environment} from "config";
import defaultSocket from "services/Sockets";
import * as definations from "definations";

import {firestore as fcFirestore, messaging as fcMessaging, getFirestoreDoc, createUpdateFirestoreDoc} from "services/Firebase";

let services = {};
for (let defination of Object.values(definations)) {
	services[defination.name] = ApiService.getContextRequests(defination.endpoint);
}



let models = {
	actionlogs: "ActionTrail",
	answers: "Answer",
	applications: "Application",
	attachments: "Attachment",
	commissions: "Commission",
	conversations: "Conversation",
	coupons: "Coupon",
	courses: "Course",
	currencies: "Currency",
	demorequests: "DemoRequest",
	emails: "Email",
	events: "Event",
	forms: 'Form',
	formvalues: "FormValue",
	fulfilments: "Fulfilment",
	invoices: "Invoice",
	messages: "Message",
	notifications: "Notification",
	orderitems: "OrderItem",
	orders: "Order",
	payments: "Payment",
	posts: "Post",
	preferences: "Preference",
	queries: "SurveyQuery",
	questions: "Question",
	quizes: "Quiz",
	quoterequests: "ProposalRequest",
	responses: "Response",
	results: "Result",
	retailitems: "RetailItem",
	settings: "Setting",
	surveys: "Survey",
	teams: "Team",
	tracks: "Track",
	users: "User",
	vacancies: "Vacancy",
};
//console.log("definations", definations)
/*
for (let defination of Object.values(definations)) {
	models[defination.name] = defination.model;
}
*/
let defaultValue = {
	models: models,
	definations: definations,
	services: services,
	sockets: {
		default: defaultSocket,
		default: null,
		auth: null,
	},
	internet: {
		available: false,
		checked: false,
	},
	location: default_location,
	route: null,
};

function loadScript(src, position, id) {
	if (!position) {
		return;
	}

	const script = document.createElement('script');
	script.setAttribute('async', '');
	script.setAttribute('id', id);
	script.src = src;
	position.appendChild(script);
}

export const GlobalsContext = React.createContext(defaultValue);

const GlobalsProvider = props => {

	let { auth: {isAuthenticated, token, user:auth_user}, cache: { data: dataCache}, communication: {messaging}, api, app,clearApiTasks, clearResponseCache, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser, apiCallRequest, setDeviceLocation, setMessagingCache, fetchInbox, updateMessage, appendMessage, sendUnsentMessages, fetchContacts, children } = props;

	const dispatch = useDispatch();
	
	let [value, setValue] = useState(defaultValue);	
	let [valueInitialized, setValueInitialized] = useState(false);	
	let [settingsChangeCallBacks, setSettingsChangeCallBacks] = useState([]);
	let [preferencesChangeCallBacks, setPreferencesChangeCallBacks] = useState([]);	

	
	

	const handleOnInternetAvailabilityChange = () => {
		const condition = navigator.onLine ? 'online' : 'offline';
		if (condition === 'online') {
				const webPing = setInterval(() => {
						fetch('//google.com', { mode: 'no-cors', }).then(() => {							
							setValue({...value, internet: { available: true, checked: true } });
							return clearInterval(webPing)							
						}).catch(() => {
							//console.log("internet", value.internet);
							if (value.internet.available) {
								setValue({...value, internet: { available: false, checked: true }});
							}
						});
					}, 10000);
				return;
		}
		return setValue({...value, internet: { available: false, checked: false }});
	}

	const handleOnHashChange = (event) => {
		//console.log('The hash has changed!', event);
		const newUrl = event.newURL;
		if (newUrl.indexOf("#") != -1) {
			let elementId = newUrl.substr(newUrl.indexOf("#")).replace("#", "");
			let section = document.getElementById(elementId);
			if (section) {						
				section.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
			}	
		}
		

	}

	const handleOnNewConversation = (conversation) => {
        setMessagingCache("conversations", currentConversations => {
			try {
				let newConversations = JSON.parse(JSON.stringify(currentConversations));
				if (Array.isArray(newConversations)) {
					newConversations.unshift(conversation);
				}
				else{
					newConversations = [conversation];
				}
				return newConversations;
			} catch(err) {
                if (!Array.isArray(currentConversations)) {
					return [conversation];
				}
				else{
					return currentConversations;
				}
            }
		});
    }

	const handleOnConversationCreated = (conversation) => {
        setMessagingCache("conversations", currentConversations => {
			try {
				let newConversations = JSON.parse(JSON.stringify(currentConversations));
				if (Array.isArray(newConversations)) {
					newConversations.unshift(conversation);
				}
				else{
					newConversations = [conversation];
				}
				return newConversations;
			} catch(err) {
                if (!Array.isArray(currentConversations)) {
					return [conversation];
				}
				else{
					return currentConversations;
				}
            }
		});
        setMessagingCache("active_conversation", conversation);
    }

	const handleOnCreatingConversationExists = (conversation) => {		
		setMessagingCache("active_conversation", conversation);
	}

	
	

	

	const handleOnInbox = (inbox) => {
        let total_unread = 0;
        if (Array.isArray(inbox)) {
			inbox.map(convo => {
				if (convo.state.incoming_unread > 0) {
					total_unread = total_unread+convo.state.incoming_unread;
				}							
			});

		}
        setMessagingCache("unread_count", total_unread);
        setMessagingCache("conversations", inbox);
    }

	
	
	useEffect(()=> {
				defaultSocket.on("create", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					
					if (defination && isAuthenticated ) {
						let cacheData = defination.cache;
						if (!["preferences", "settings"].includes(defination.name) && cacheData && defination.access.view.single(auth_user, action.result)) {
							let newDataCache = Array.isArray(dataCache[defination.name])? dataCache[defination.name] : [];
							newDataCache.unshift(action.result);
							setDataCache(defination.name, newDataCache);
							let aggregatesApiCallRequest = api[defination.name + "_aggregates"];
							if (aggregatesApiCallRequest) {
								apiCallRequest(defination.name + "_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache );
							}
						}
					}
				});

				defaultSocket.on("update", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					

					if (defination && isAuthenticated) {
						let cacheData = defination.cache;
						if (["users", "preferences", "settings"].includes(defination.name)) {
							if (defination.name === "users") {
								if (action.result._id === auth_user._id) {
									setCurrentUser(action.result);
								}
							}
							
						}
							
						else if (defination.cache) {
							let newDataCache = Array.isArray(dataCache[defination.name])? dataCache[defination.name]: [];
							if (newDataCache.length > 0) {
								let cacheEntryFound = false;
								newDataCache = newDataCache.map((cacheEntry, index) => {
									if (cacheEntry._id === action.record) {
										cacheEntryFound = true;
										return action.result;
									} else {
										return cacheEntry;
									}
								});
								if (!cacheEntryFound) {
									if ( defination.access.view.single(auth_user, action.result)) {
										newDataCache.unshift(action.result);
									}
								}
							}
							setDataCache(defination.name, newDataCache);
							let aggregatesApiCallRequest = api[defination.name + "_aggregates"];
							if (aggregatesApiCallRequest) {
								apiCallRequest(defination.name + "_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache );
							}
						}
					}
				});

				defaultSocket.on("delete", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					if (defination && isAuthenticated) {
						if (defination.cache) {
							let newDataCache = Array.isArray( dataCache[defination.name] )? dataCache[defination.name] : [];
							if (newDataCache.length > 0) {
								newDataCache = newDataCache.filter((cacheEntry, index) => {
									if (cacheEntry._id === action.record) {
										return false;
									}
									return true;
								});
							}
							setDataCache(defination.name, newDataCache);
							let aggregatesApiCallRequest = api[defination.name + "_aggregates"];
							if (aggregatesApiCallRequest) {
								apiCallRequest( defination.name + "_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache );
							}
						}
					}
				});

					

				defaultSocket.on("identity-set", async (profile) => {
					//console.log("\n\n identity-set profile", profile._id);
					setCurrentUser(profile);
				});

				defaultSocket.on("presence-changed", async ({user, presence}) => {
					//console.log("\n\n presence-changed presence", presence);
					setCurrentUser(user);
				});

				defaultSocket.on("settings", async (settings) => {
					setSettings(settings);
				});

				

				
				defaultSocket.on("preferences", async (preferences) => {
							let deepMergePreferences = JSON.deepMerge(app.preferences, preferences);

							Promise.all([deepMergePreferences]).then(results => {
								let newPreferences = results[0];
								//console.log("newPreferences", newPreferences)								
								setPreferences(newPreferences);
							}).catch(e => {
								//Do nothing.
							});
				});

				

				defaultSocket.on("connect", () => {
                    if (isAuthenticated) {
						defaultSocket.emit("set-identity", auth_user._id);
						defaultSocket.emit("get-settings", auth_user._id);
						defaultSocket.emit("get-inbox", auth_user);
						defaultSocket.emit("get-clients-positions", { user: auth_user, type: 'all' });
					}
                });

				defaultSocket.on("disconnect", () => {});


				// Socket Emitions
				defaultSocket.emit("get-settings", {user: auth_user});
				if (isAuthenticated) {
					/*defaultSocket.on("reconnect", () => {						
						defaultSocket.emit("set-identity", auth_user._id);
						defaultSocket.emit("get-settings", auth_user._id);
						defaultSocket.emit("get-inbox", auth_user);
						defaultSocket.emit("get-clients-positions", { user: auth_user, type: 'all' });
					});*/
					
					defaultSocket.on("new-message", appendMessage);
					//defaultSocket.on("message-sent", updateMessage);
					defaultSocket.on("new-conversation", handleOnNewConversation);
					defaultSocket.on("conversation-created", handleOnConversationCreated);
					defaultSocket.on("creating-conversation-exists", handleOnCreatingConversationExists);
					defaultSocket.on("inbox", handleOnInbox);
					defaultSocket.emit("set-identity", auth_user._id);
					defaultSocket.emit("get-preferences", auth_user._id);
					defaultSocket.emit("get-inbox", auth_user);
				}
					


		value.sockets = { default: defaultSocket, auth: null, };



		value.updateSettings = async (name, new_value, writeonly=false) => {
			if (String.isString(name)) {
				let slug = name.toLowerCase().variablelize("-");
				if (new_value !== value[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
						private: writeonly,
					};
					return await services.settings.update(slug, postData, { create: 1, placement: "slug"}).then(res => {
						let deepMergeSettings = JSON.deepMerge(app.settings, {[slug]: new_value });
						Promise.all([deepMergeSettings]).then(results => {
							let newSettings = results[0];
							for (var i = 0; i < settingsChangeCallBacks.length; i++) {
								settingsChangeCallBacks[i](newSettings);
							}
							/*setSettings(newSettings);
							console.error("newSettings", newSettings);*/
							return newSettings;
						}).catch(e => {
                            return false;
                        });
							
					}).catch(e => {
						return false;
					});
				}
			} else {
				return false;
			}
		};
		value.onSettingsChange = (cb) => {
			if (Function.isFunction(cb)) {
				setSettingsChangeCallBacks(settingsChangeCallBacks.concat([cb]));
			}
		}

		value.updatePreferences = async (name, new_value) => {
			let updatedValue = false;
			if (String.isString(name)) {
				let slug = name.toLowerCase().variablelize("-");
				if (new_value !== value[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
						user: auth_user._id,
					};
					return await services.preferences.update(slug, postData, { create: 1, placement: "slug" }).then(res => {
							let deepMergePreferences = JSON.deepMerge(app.preferences, {[slug]: new_value });
							Promise.all([deepMergePreferences]).then(results => {
								let newPreferences = results[0];
								for (var i = 0; i < preferencesChangeCallBacks.length; i++) {
									preferencesChangeCallBacks[i](newPreferences);
								}
								setPreferences(newPreferences);
								return newPreferences;
							}).catch(e => {
                                return false;
                            });
						}).catch(e => {
							return false;
						});
				}
			} else {
				return false;
			}
		}

		value.onPreferencesChange = (cb) => {
			if (Function.isFunction(cb)) {
				setPreferencesChangeCallBacks(preferencesChangeCallBacks.concat([cb]));
			}
		}

		value.loadScript = (src, position, id) => {
			if (!position) {
				return;
			}
			const script = document.createElement('script');
			script.setAttribute('async', '');
			script.setAttribute('id', id);
			script.src = src;
			position.appendChild(script);
		}

		if (window) {
			window.addEventListener('online', handleOnInternetAvailabilityChange);
			window.addEventListener('offline', handleOnInternetAvailabilityChange);
			window.addEventListener('hashchange', handleOnHashChange, false);
			window.onload = function() {
			    let bodyList = document.querySelector("body");
			    let oldHref = document.location.href;
			    let observer = new MutationObserver(function(mutations) {
			            mutations.forEach(function(mutation) {
			                if (oldHref != document.location.href) {
			                    oldHref = document.location.href;

			                    /* Changed ! your code here */
			                    //console.log("document.location.href", document.location.href)
			                }

			            });

			        });

			    var config = {
			        childList: true,
			        subtree: true
			    };

			    observer.observe(bodyList, config);

			};
		}
		
		//Invoke initial methods
		fetchContacts({});
		sendUnsentMessages();
			
		setInitialized(true);
		setValueInitialized(true);	

		return () => {
			window.removeEventListener('online', handleOnInternetAvailabilityChange);
			window.removeEventListener('offline', handleOnInternetAvailabilityChange);
			setInitialized(false);
			clearApiTasks();
			clearResponseCache();
		}
	},[]);


	
	const onFirebaseMessageHandler = async (payload) => {
		//console.log('A new FCM message arrived!', JSON.stringify(payload));
	    	const {data} = payload;
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

	const onFirebaseBackgroundMessageHandler = async (payload) => {
	    	
			//console.log('Message handled in the background!', JSON.stringify(payload));
			const {data} = payload;
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

	



	useEffect(()=>{
		if (isAuthenticated && Object.size(auth_user) > 0 && environment !== "development") {

			fcMessaging.requestPermission().then(async function() {
				const token = await fcMessaging.getToken();
				//console.log("fcMessaging.requestPermission token", token);
				let tokens = await getFirestoreDoc("users", auth_user._id).then(async (querySnapshotDoc) => {
					let tokens = [token];
					let saveToken = !querySnapshotDoc;
					if (querySnapshotDoc) {
						if (Array.isArray(querySnapshotDoc.tokens)) {

							if (!querySnapshotDoc.tokens.includes(token)) {
								tokens = tokens.concat(querySnapshotDoc.tokens);
								saveToken = true;
							}
						}
					}
					//console.log("querySnapshotDoc", querySnapshotDoc);

					if (saveToken) {
                        //createUpdateFirestoreDoc("users", auth_user._id, {...auth_user, tokens: tokens});
                        //fcFirestore.collection("users").doc(auth_user._id).set({...auth_user, tokens: tokens});
                    }
					return tokens;
				});		
				
			}).catch(function(err) {});

			let unsubscribeFcMessagingOnMessage =  fcMessaging.onMessage(onFirebaseMessageHandler);
			//fcMessaging.setBackgroundMessageHandler(onFirebaseBackgroundMessageHandler);

			/*let unsubscribeFcFirestoreUserOnSnapshot =  fcFirestore.collection("users").doc(auth_user._id).onSnapshot(function(docSnapshot) {
				if (docSnapshot) {
					let docSnapshotData = docSnapshot.data();
					if (docSnapshotData) {
						setCurrentUser({...auth_user, ...docSnapshotData});
					}
				}
					
			});*/

			if (window) {
				window.navigator.geolocation.getCurrentPosition((position) => {
                    let deviceLocation = { 
                        longitude: position.coords.latitude, 
                        longitude: position.coords.longitude,
                        altitude: position.coords.altitude? position.coords.altitude : 0,
                        accuracy: position.coords.accuracy? position.coords.accuracy : 0,
                        altitudeAccuracy: position.coords.altitudeAccuracy? position.coords.altitudeAccuracy : 0,
                        heading: position.coords.heading? position.coords.heading : 0,
                        speed: position.coords.speed? position.coords.speed : 0,
                        timestamp: new Date().toString(),
                        provider: +osName+" "+osVersion+", "+browserName+" "+fullBrowserVersion,
                    };

                    //createUpdateFirestoreDoc("users", auth_user._id, {...auth_user, last_known_position: deviceLocation});
                });

			}

			return () => {
				unsubscribeFcMessagingOnMessage();
				//unsubscribeFcFirestoreUserOnSnapshot();
			}
			
		}
	}, [isAuthenticated]);


	useEffect(() => {
		fetchInbox({}, true);
	}, [])


	

	return (
		<GlobalsContext.Provider value={value} >
			{valueInitialized && children}
		</GlobalsContext.Provider>
	);
};

const mapStateToProps = state => ({	
	api: state.api,
	app: state.app,
	auth: state.auth,
	cache: state.cache,
	communication: state.communication,
});

export default connect(mapStateToProps, { clearApiTasks, clearResponseCache, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser, apiCallRequest, setDeviceLocation, setMessagingCache, sendUnsentMessages, fetchInbox, updateMessage, appendMessage, fetchContacts })(GlobalsProvider);



export const useGlobals = () => {
	return React.useContext(GlobalsContext);
};


export const withGlobals = Component => {
	function WithGlobals(props) {
		let context = useGlobals();

		if (context === undefined) {
			//throw new Error("withGlobals must be used within a GlobalsProvider");
			//context = defaultValue;
		}

		return <Component {...props} {...context} />;
	}

	return WithGlobals;
};