import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { useStore, useDispatch } from 'react-redux'
import { clearApiTasks, clearResponseCache, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser, apiCallRequest, setDeviceLocation, setMessagingCache, clearMessagingCache } from "state/actions";
import AuthHelper from 'hoc/Auth';
import {default_location} from "config";
import { defaultSocket } from "hoc/Sockets";
import * as definations from "definations";
import * as services from "services";
import notificationSound from "assets/audio/notification.mp3";


let models = {};
for (let defination of Object.values(definations)) {
	models[defination.name] = defination.model;
}

let defaultValue = {
	models: models,
	definations: definations,
	services: services,
	sockets: {
		//default: defaultSocket(),
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
	let notificationAudio = new Audio(notificationSound)
	let [value, setValue] = useState(defaultValue);	
	let [valueInitialized, setValueInitialized] = useState(false);	
	let [settingsChangeCallBacks, setSettingsChangeCallBacks] = useState([]);
	let [preferencesChangeCallBacks, setPreferencesChangeCallBacks] = useState([]);	

	let { auth, cache: { data: dataCache, messaging }, api, app, clearApiTasks, clearResponseCache, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser, apiCallRequest, setDeviceLocation, setMessagingCache, clearMessagingCache } = props;
	

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
		console.log("handleOnNewConversation conversation", conversation)

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
				console.error(err);
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
		console.log("handleOnConversationCreated conversation", conversation)
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
				console.error(err);
				if (!Array.isArray(currentConversations)) {
					return [conversation];
				}
				else{
					return currentConversations;
				}
			}
		});
		setMessagingCache("active_conversation", currentActiveConversation => {
			if (!currentActiveConversation) {
				return conversation;
			}
			else {
				return currentActiveConversation;
			}
		});
	}

	const handleOnNewMessage = ({conversation, message, user}) => {
		let sender_id = message.sender;
		if (JSON.isJSON(sender_id)) {
			sender_id = sender_id._id;
		}
		if (sender_id) {
			if (sender_id !== auth.user._id) {
				notificationAudio.play();
			}
			if (sender_id !== auth.user._id) {
				setMessagingCache("unread_ids", currentUnreadIds => {
						
					if (sender_id.toString() !== auth.user._id.toString()) {
						try {
							let newUnreadIds = JSON.parse(JSON.stringify(currentUnreadIds));
							if (Array.isArray(newUnreadIds)) {
								newUnreadIds.unshift(message._id.toString());
							}
							else{
								newUnreadIds = [message._id.toString()];
							}
							return newUnreadIds;
						} catch(err) {
							console.error(err);
							if (!Array.isArray(currentUnreadIds)) {
								return [message._id.toString];
							}
							else{
								return currentUnreadIds;
							}
						}
					}
				});
				if (value.sockets.default) {
					value.sockets.default.emit("mark-message-as-received", {message: message._id, user: auth.user});
				}
				
				setMessagingCache("conversations", currentConversations => {
					
						try {
							let newConversations = JSON.parse(JSON.stringify(currentConversations));
							if (Array.isArray(newConversations)) {
									let message_conversation = message.conversation;
									if (JSON.isJSON(message_conversation)) {
										message_conversation = message_conversation._id;
									}
									let conversation_position = -1;
									newConversations.map((conversationEntry, index) => {
										if (conversation_position === -1 && conversationEntry._id === message_conversation) {
											conversation_position = index;
											if (JSON.isJSON(conversationEntry.state)) {
												conversationEntry.state.total = conversationEntry.state.total > 0? (conversationEntry.state.total + 1) : 1;
												conversationEntry.state.unread = conversationEntry.state.unread > 0? (conversationEntry.state.unread + 1) : 1;
												conversationEntry.state.last_message = message;
											}
											else {
												conversationEntry.state = {
													total: 1,
													unread: 1,
													last_message: message,
												}
											}
										}
									});
									/*newConversations.map((conversationEntry, index) => {
										if (conversation_position === -1 && conversationEntry._id === message_conversation) {
											conversation_position = index;
										}
									});

									if (!conversation_position !== -1) {
										newConversations[conversation_position].state.last_message = message;
										newConversations[conversation_position].state.unread = newConversations[conversation_position].state.unread+1;

									}*/
								
							}
							else{
								//newConversations = [conversation];
							}
							return newConversations;
						} catch(err) {
							console.error(err);
							return currentConversations;
						}
					
								
				});
			}	
		}
				
						
						

	}

	const handleOnMessageSent = ({conversation, message, user}) => {
		let sender_id = message.sender;
		if (JSON.isJSON(sender_id)) {
			sender_id = sender_id._id;
		}
		if (sender_id) {
			if (sender_id === auth.user._id) {
				setMessagingCache("conversations", currentConversations => {
					
						try {
							let newConversations = JSON.parse(JSON.stringify(currentConversations));
							if (Array.isArray(newConversations)) {
									let message_conversation = message.conversation;
									if (JSON.isJSON(message_conversation)) {
										message_conversation = message_conversation._id;
									}
									let conversation_position = -1;
									newConversations.map((conversationEntry, index) => {
										if (conversation_position === -1 && conversationEntry._id === message_conversation) {
											conversation_position = index;
											if (JSON.isJSON(conversationEntry.state)) {
												conversationEntry.state.total = conversationEntry.state.total > 0? (conversationEntry.state.total + 1) : 1;
												conversationEntry.state.last_message = message;
											}
											else {
												conversationEntry.state = {
													total: 1,
													unread: 1,
													last_message: message,
												}
											}
										}
									});
									console.log("\n\n newConversations", newConversations);

									/*if (!conversation_position !== -1) {
										newConversations[conversation_position].state.last_message = message;
									}*/
								
							}
							
							return newConversations;
						} catch(err) {
							console.error(err);
							return currentConversations;
						}
					
								
				});
			}	
		}
	}

	const handleOnInbox = (inbox) => {
						console.log("\n\n inbox", inbox);
						let total_unread = 0;
						if (Array.isArray(inbox)) {
							inbox.map(convo => {
								if (convo.state.unread > 0) {
									total_unread = total_unread+convo.state.unread;
								}							
							});

						}
						console.log("\n\n total_unread", total_unread);
						setMessagingCache("unread_count", total_unread);
						setMessagingCache("conversations", inbox);
	}

	
	
	useEffect(()=> {
		const defaultSocketInstance = defaultSocket();
				defaultSocketInstance.on("create", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					
					if (defination && auth.isAuthenticated ) {
						let cacheData = defination.cache;
						if (!["preferences", "settings"].includes(defination.name) && cacheData && defination.access.view.single(auth.user, action.result)) {
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

				defaultSocketInstance.on("update", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					

					if (defination && auth.isAuthenticated) {
						let cacheData = defination.cache;
						if (["users", "preferences", "settings"].includes(defination.name)) {
							if (defination.name === "users") {
								if (action.result._id === auth.user._id) {
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
									if ( defination.access.view.single(auth.user, action.result)) {
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

				defaultSocketInstance.on("delete", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					if (defination && auth.isAuthenticated) {
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

					

				defaultSocketInstance.on("identity-set", async (profile) => {
					//console.log("\n\n identity-set profile", profile._id);
					setCurrentUser(profile);
				});

				defaultSocketInstance.on("presence-changed", async ({user, presence}) => {
					//console.log("\n\n presence-changed presence", presence);
					setCurrentUser(user);
				});

				defaultSocketInstance.on("settings", async (settings) => {
					setSettings(settings);
				});

				

				
				defaultSocketInstance.on("preferences", async (preferences) => {
							let deepMergePreferences = JSON.deepMerge(app.preferences, preferences);

							Promise.all([deepMergePreferences]).then(results => {
								let newPreferences = results[0];
								//console.log("newPreferences", newPreferences)								
								setPreferences(newPreferences);
							}).catch(e => {
								//Do nothing.
							});
				});

				


				// Socket Emitions
				defaultSocketInstance.emit("get-settings", {user: auth.user});
				if (auth.isAuthenticated) {
					defaultSocketInstance.on("reconnect", () => {
						console.log("reconnect")
						defaultSocketInstance.emit("set-identity", auth.user._id);
						defaultSocketInstance.emit("get-settings", auth.user._id);
						defaultSocketInstance.emit("get-inbox", auth.user);
					});
					
					defaultSocketInstance.on("new-message", handleOnNewMessage);
					defaultSocketInstance.on("message-sent", handleOnMessageSent);
					defaultSocketInstance.on("new-conversation", handleOnNewConversation);
					defaultSocketInstance.on("conversation-created", handleOnConversationCreated);
					defaultSocketInstance.on("inbox", handleOnInbox);
					defaultSocketInstance.emit("set-identity", auth.user._id);
					defaultSocketInstance.emit("get-preferences", auth.user._id);
					defaultSocketInstance.emit("get-inbox", auth.user);
				}
					


		value.sockets = { default: defaultSocketInstance, auth: null, };



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
							console.error(" JSON.deepMerge(app.settings, {[slug]: new_value })", e);
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
						user: auth.user._id,
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
								console.error(" JSON.deepMerge(app.settings, {[slug]: new_value })", e);
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
			//console.log("window", window);
			if (window.navigator.geolocation && auth.isAuthenticated) {
				window.navigator.geolocation.getCurrentPosition((position) => {
					let deviceLocation = { 
						lat: position.coords.latitude, 
						lng: position.coords.longitude,
						altitude: position.coords.altitude? position.coords.altitude : 0,
						accuracy: position.coords.accuracy? position.coords.accuracy : 0,
						altitudeAccuracy: position.coords.altitudeAccuracy? position.coords.altitudeAccuracy : 0,
						heading: position.coords.heading? position.coords.heading : 0,
						speed: position.coords.speed? position.coords.speed : 0,
						timestamp: position.timestamp? position.timestamp : new Date().getTime() / 1000,
					};
					//console.log("deviceLocation", deviceLocation);
					setDeviceLocation(deviceLocation);
				});
			}
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
	


	

	return (
		<GlobalsContext.Provider value={value} >
			{valueInitialized && props.children}
		</GlobalsContext.Provider>
	);
};

const mapStateToProps = state => ({	
	api: state.api,
	app: state.app,
	auth: state.auth,
	cache: state.cache,
});

export default connect(mapStateToProps, { clearApiTasks, clearResponseCache, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser, apiCallRequest, setDeviceLocation, setMessagingCache, clearMessagingCache })(GlobalsProvider);

/*export const useGlobals = () => {
	const context = React.useContext(GlobalsContext);
	if (context === undefined) {
		throw new Error(
			"useGlobals must be used within a GlobalsProvider"
		);
	}
	return context;
};

export const withGlobals = Component => {
	function WithGlobals(props) {
		let context = React.useContext(GlobalsContext);
		
		if (context === undefined) {
			throw new Error("withGlobals must be used within a GlobalsProvider");
		}

		return <Component {...props} globals={context} />;
	}

	return WithGlobals;
};*/


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