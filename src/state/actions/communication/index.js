import {
    SET_MESSAGING_CACHE,
    REMOVE_MESSAGING_CACHE,
    CLEAR_MESSAGING_CACHE,
    SET_EMAILING_CACHE,
    REMOVE_EMAILING_CACHE,
    CLEAR_EMAILING_CACHE,
    CLEAR_COMMUNICATION_CACHE,
} from "state/actions";
import {messages as messagesDefination} from "definations";
import ApiService from "services/api";
import notificationSound from "assets/audio/notification.mp3";


let notificationAudio = new Audio(notificationSound);

export function setMessagingCache(key, messaging) {
	return {
		type: SET_MESSAGING_CACHE,
		key: key,
		messaging: messaging,
	};
}

export function removeMessagingCache(key) {
	return {
		type: REMOVE_MESSAGING_CACHE,
		key,
	};
}

export function clearMessagingCache() {
	return {
		type: CLEAR_MESSAGING_CACHE,
	};
}
export function setEmailingCache(key, emailing) {
	return {
		type: SET_EMAILING_CACHE,
		key: key,
		emailing: emailing,
	};
}

export function fetchInbox(params={}, preserve=true) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations}}} = getState();
		
		if (auth.isAuthenticated) {
			dispatch(setMessagingCache("fetching_inbox", true));
			const ApiServiceInstance = new ApiService();
			ApiServiceInstance.refresh();
			ApiServiceInstance.setServiceUri("/inbox");
			const inbox_conversations = await ApiServiceInstance.getRecords(params).then(res => {
                const {data} = res.body;
                return data;
            }).catch(err => {
                return false;
            });

			if (Array.isArray(inbox_conversations)) {
				let conversations_ids = [];
				if (preserve && Array.isArray(conversations)) {
					if (conversations.length > 0) {
						conversations.map(conversation => {
							conversations_ids.push(conversation._id);
						});
					}
				}

				if (preserve && conversations_ids.length > 0) {
					inbox_conversations.forEach(inbox_conversation => {
						let index_of_conversation = conversations_ids.indexOf(inbox_conversation._id);
						if (index_of_conversation !== -1) {
							inbox_conversation.messages = conversations[index_of_conversation].messages;
							if (conversations[index_of_conversation].state) {
								inbox_conversation.state = {
									...conversations[index_of_conversation].state,
									...inbox_conversation.state,
								}
							}
						}
					});
				}
				dispatch(setMessagingCache("fetching_inbox", false));
				dispatch(setMessagingCache("conversations", inbox_conversations));
			}
		}
	};
}


export function fetchContacts(params={}) {
	return async (dispatch, getState) => {
		const {auth} = getState();
		let new_contactactable_contacts_ids = [];
		let new_contacts = [];
		if (auth.isAuthenticated) {
			const ApiServiceInstance = new ApiService();
			ApiServiceInstance.refresh();
			ApiServiceInstance.setServiceUri("/contacts");
			const fetchedContacts = await ApiServiceInstance.getRecords({fields: "_id", ...params}).then(res => {
                const {data} = res.body;
                return data;
            }).catch(err => {
            	console.error("Error fetching contacts. Something went wrong!", err);
                return false;
            });

            
            let preserve_contacts = JSON.isEmpty(params);
			if (Array.isArray(fetchedContacts) && preserve_contacts) {	
						
				fetchedContacts.forEach(fetchedContact => {
					if (Boolean(fetchedContact._id)) {
						new_contactactable_contacts_ids.push(fetchedContact._id);
						new_contacts.push(fetchedContact);
					}
				});
				if (!auth.user.isAdmin) {
					//console.log("fetchedContacts", fetchedContacts);
					dispatch(setMessagingCache("contacts", new_contacts));
					dispatch(setMessagingCache("contactactable_contacts_ids", new_contactactable_contacts_ids));
				}
				
				
			}

			return fetchedContacts;
		}

		return [];

	};
}






/*export const fetchMessage = (message, params={}) => {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		let message_id = message?(message._id? message._id : message) : false;
		if (auth.isAuthenticated) {
			if (message_id) {
				const ApiServiceInstance = new ApiService();
				ApiServiceInstance.refresh();
				ApiServiceInstance.setServiceUri("/messages");
				return ApiServiceInstance.getRecordById(message_id, params).then(res => res.body).then(body => body.data);
			}
			else {
				throw "Message Id missing";
			}
		}
		else {
			throw "Unauthorized";			
		}
	}
}*/

export function fetchMessages(conversation, rpp=20, pg=1, query={}, preserve=true){
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		
		if (auth.isAuthenticated) {
			const conversation_id =  conversation? (conversation._id? conversation._id : conversation) : false;
			const active_conversation_id =  active_conversation? (active_conversation._id? active_conversation._id : active_conversation) : false;

			if (conversation_id) {
				let index_of_conversation = -1;

				conversations.map((chat, index) => {
					if (chat._id === conversation_id && index_of_conversation === -1) {
						index_of_conversation = index;
					}
				});
				if (index_of_conversation !== -1) {
                    let loading_messages = conversations[index_of_conversation].state? conversations[index_of_conversation].state.loading_messages : false;
                    if (!loading_messages && conversation_id === active_conversation_id) {
						loading_messages = active_conversation.state? active_conversation.state.loading_messages : false;
					}

                    if (!loading_messages) {
						const ApiServiceInstance = new ApiService();
						ApiServiceInstance.refresh();
						ApiServiceInstance.setServiceUri("/messages");
						if (conversation_id === active_conversation_id) {
							dispatch(setMessagingCache("active_conversation", {...active_conversation, state: {...active_conversation.state, query: query, loading_messages: true}}));
						}
						const { count, page, pages, data:messages } = await ApiServiceInstance.getRecords({...query, conversation: conversation_id, /*asc: "created_on",*/ page:pg, pagination:rpp }).then(res => {
                            return res.body
                        }).catch(err => {
                            return {};
                        });
						if (Array.isArray(messages) && preserve) {
							let newConversations = conversations;
							if (query.pagination && query.page) {
								newConversations[index_of_conversation].state = {
									...newConversations[index_of_conversation].state,
									total: count,
									pages: pages,
									page: page,
									pagination: rpp,
									query: query,
									loading_messages: false,
								}
							}
							let current_messages_ids = [];
							let current_messages = Array.isArray(newConversations[index_of_conversation].messages)? newConversations[index_of_conversation].messages : [];
							if (current_messages.length > 0) {
								current_messages.map(current_message => {
									current_messages_ids.push(current_message._id);
								});
							}
							//append messages checking for duplicates and page skip
							let page_skipped = true
							messages.map(entry => {
								let index_of_entry = current_messages_ids.indexOf(entry._id);
								if (index_of_entry === -1) {
									current_messages.push(entry);
								}
								else{
									current_messages[index_of_entry] = entry;
								}
							});
							//sort all messages 
							let conversation_messages = current_messages.sort((a, b) => new Date(a.created_on) - new Date(b.created_on));
							//remove duplicates
							conversation_messages = conversation_messages.filter((entry, cursor) => {
								return cursor > 0? true : (conversation_messages[(cursor-1)]? (entry._id !== conversation_messages[(cursor-1)]._id) : true);
							});
							newConversations[index_of_conversation].messages = conversation_messages;
							if (conversation_id === active_conversation_id) {
								dispatch(setMessagingCache("active_conversation_messages", conversation_messages));
								dispatch(setActiveConversation({
									...active_conversation, 
									state: {
										...active_conversation.state, 
										total: count,
										pages: pages,
										page: page,
										pagination:rpp,
										loading_messages: false,
										query: query,
									}
								}));
							}
							dispatch(setMessagingCache("conversations", newConversations));
							
						}
					}
                }
				else {
					throw "Conversation does not exist in list of conversations";
				}
			}			
			else {
				throw "Conversation ID is missing";
			}	
				
		}
		else {
			throw "Unauthorized";
		}

	};
}

export function updateMessage(message, persist=true) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		let conversation_messages = [];
		
		if (auth.isAuthenticated) {
			if (JSON.isJSON(message)) {
				message = JSON.parse(JSON.stringify(message));
			}
			let message_id = message? (JSON.isJSON(message)? message._id : message) : false;
			let fetchMessageFromServer = String.isString(message);
			if (fetchMessageFromServer) {				
				const ApiServiceInstance = new ApiService();
				ApiServiceInstance.refresh();
				ApiServiceInstance.setServiceUri("/messages");
				let fetchedMessage = await  ApiServiceInstance.getRecordById(message_id, {}).then(res => {
					return res.body.data
				}).catch(err => {
					return false;
				});
				if (fetchedMessage) {
					message = fetchedMessage;
				}
				//console.log("updateMessage fetchedMessage", fetchedMessage);
			}
			if (JSON.isJSON(message)) {
				//console.log("updateMessage message", message);
				const {conversation, sender, created_on} = message;
				//console.log("conversation", conversation);
				const sender_id = sender? (sender._id? sender._id : sender) : false;
				const is_outgoing = sender_id === auth.user._id;
				const conversation_id = conversation._id? conversation._id : conversation;
				const is_active_conversation_message = conversation_id? (conversation_id === active_conversation._id || conversation_id === active_conversation) : false;

				if (is_active_conversation_message) {

					let new_active_conversation_messages = (Array.isArray(active_conversation_messages)? active_conversation_messages : []).map((active_conversation_message, index) => {
						//Check if the active conversation message is targeted message
						if (active_conversation_message._id === message_id || ((conversation_id === active_conversation_message.conversation || conversation_id === active_conversation_message.conversation._id) && ((sender_id === active_conversation_message.sender || sender_id === active_conversation_message.sender._id)) && created_on == active_conversation_message.created_on)) {
							
							active_conversation_message = {...active_conversation_message, ...message};
						}
						return active_conversation_message;
					});
					
					dispatch(setMessagingCache("active_conversation_messages", new_active_conversation_messages));
				}

				let new_conversations = conversations.map(convo => {
					if (convo._id === conversation_id) {

						if (Array.isArray(convo.messages)) {
							convo.messages.forEach(conversation_message => {
								const conversation_id = conversation._id? conversation._id : conversation;
								if (conversation_id) {
									if (conversation_message._id === message_id || ((conversation_id === conversation_message.conversation || conversation_id === conversation_message.conversation._id) && ((sender_id === conversation_message.sender || sender_id === conversation_message.sender._id)) && created_on == conversation_message.created_on)) {
										conversation_message = {...conversation_message, ...message};
									}
								}
							});
						}

						let current_last_message = convo.state? (JSON.isJSON(convo.state.last_message)? convo.state.last_message : false ) : false;
						let conversation_id = conversation._id? conversation._id : conversation;
						let is_last_message = current_last_message? (current_last_message._id === message._id || (is_outgoing && (current_last_message.conversation?(conversation_id === current_last_message.conversation || conversation_id === current_last_message.conversation._id) : true) && created_on === current_last_message.created_on)) : true;
						let last_message = current_last_message && is_last_message? JSON.merge(current_last_message, message) : (!current_last_message? message : current_last_message);

						convo.state = {
							...convo.state,
							last_message: message,
						}
					}
					return convo;
				});

				dispatch(setMessagingCache("conversations", conversations));

				/*if (persist && message_id && !fetchMessageFromServer) {
					const ApiServiceInstance = new ApiService();
	                ApiServiceInstance.refresh();
	                ApiServiceInstance.setServiceUri("/messages");
	                let persistedServerMessage = await  ApiServiceInstance.update(message_id, message).then(res => {
						return res.body.data
					}).catch(err => {
						return false;
					});

					console.log("persistedServerMessage", persistedServerMessage);
				}*/
			}
				
			return message;
		}
	}
}

export function appendMessage(message) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		let conversation_messages = [];

		

		if (auth.isAuthenticated) {
			if (JSON.isJSON(message)) {
				message = JSON.parse(JSON.stringify(message));
			}
			let message_id = message? (JSON.isJSON(message)? message._id : message) : false;
			
			if (String.isString(message)) {
				const ApiServiceInstance = new ApiService();
				ApiServiceInstance.refresh();
				ApiServiceInstance.setServiceUri("/messages");
				let fetchedMessage = await  ApiServiceInstance.getRecordById(message_id, {}).then(res => {
					return res.body.data
				}).catch(err => {
					return false;
				});
				if (fetchedMessage) {
					message = fetchedMessage;
				}
			}
			if (JSON.isJSON(message)) {
				message = JSON.parse(JSON.stringify(message));
				const {conversation, sender, created_on, content, truncated} = message;
				
				if (sender) {
					let sender_id = sender? (sender._id? sender._id : sender) : false;
					
					let is_outgoing = sender_id === auth.user._id;
					let conversation_id = conversation? (conversation._id? conversation._id : conversation) : false;
					let is_active_conversation_message = conversation_id? (conversation_id === active_conversation._id || conversation_id === active_conversation) : false;

					//console.log("appendMessage is_active_conversation_message", is_active_conversation_message);
					

					if (is_active_conversation_message) {
						let new_active_conversation_messages = Array.isArray(active_conversation_messages)? active_conversation_messages : [];
						let active_conversation_messages_state_changed = false;
						let last_active_conversation_message = new_active_conversation_messages.length > 0? new_active_conversation_messages[(new_active_conversation_messages.length-1)] : false;
						let is_last_active_conversation_message = last_active_conversation_message? ((last_active_conversation_message._id? (last_active_conversation_message._id === message._id) : false) && ((last_active_conversation_message.sender? (sender_id === last_active_conversation_message.sender || sender_id === last_active_conversation_message.sender._id) : false) && (conversation_id === last_active_conversation_message.conversation || conversation_id === last_active_conversation_message.conversation._id) && (created_on instanceof Date? created_on.toString() : created_on) === last_active_conversation_message.created_on && content === last_active_conversation_message.content)) : false;
						//console.log("appendMessage is_last_active_conversation_message", is_last_active_conversation_message);
						//console.log("appendMessage last_active_conversation_message", last_active_conversation_message);
						if (/*last_active_conversation_message && */!is_last_active_conversation_message) {
							new_active_conversation_messages.push(message);
							
							dispatch(setMessagingCache("active_conversation_messages", new_active_conversation_messages));
						}
							
					}
					let conversations_state_changed = false;
					let new_conversations = [];
					conversations.map(convo => {
						if (convo._id === conversation_id) {
							if (Array.isArray(convo.messages)) {
								convo.messages.forEach(conversation_message => {
									if (conversation_message._id === message_id || ((conversation_id === conversation_message.conversation || conversation_id === conversation_message.conversation._id) && ((sender_id === conversation_message.sender || sender_id === conversation_message.sender._id)) && created_on == conversation_message.created_on)) {
								
										conversation_message = {...conversation_message, ...message};
									}
								});
							}
							let current_last_message = convo.state? (JSON.isJSON(convo.state.last_message)? convo.state.last_message : false ) : false;
							let is_last_message = current_last_message? ((current_last_message._id? (current_last_message._id === message._id) : false) || (is_outgoing && (current_last_message.conversation? (conversation_id === current_last_message.conversation || conversation_id === current_last_message.conversation._id) : true) && created_on === current_last_message.created_on)) : false;
							if (current_last_message && !is_last_message) {
								convo.messages = Array.isArray(convo.messages)? convo.messages.concat([message]) : [message];
								convo.state = {
									...convo.state,
									total: (is_active_conversation_message? (convo.state.total + 1) : convo.state.total),
									incoming_total: (!is_outgoing? (convo.state.incoming_total + 1) : convo.state.incoming_total),
									outgoing_total: (is_outgoing? (convo.state.outgoing_total + 1) : convo.state.outgoing_total),
									incoming_read: (!is_outgoing && is_active_conversation_message? (convo.state.incoming_read + 1) : convo.state.incoming_read),
									incoming_unread: (!is_outgoing && !is_active_conversation_message? (convo.state.incoming_unread + 1) : 0),
									outgoing_unread: (is_outgoing && is_active_conversation_message? (convo.state.outgoing_unread + 1) : convo.state.outgoing_unread),
									last_message: message
								}
								if (!conversations_state_changed) {
									conversations_state_changed = true;
								}
							}
								
						}
						return convo;
					});
					if (!is_active_conversation_message && conversations_state_changed) {
						if (!is_outgoing) {
							notificationAudio.play();
						}
						dispatch(setMessagingCache("conversations", conversations));
					}
				}
					
			}
		}

			
	};
}

export function setActiveConversation(conversation) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		let conversation_messages = [];
		let conversation_id = conversation? (conversation._id? conversation._id : conversation) : false;
		let active_conversation_id = active_conversation? (active_conversation._id? active_conversation._id : active_conversation) : false;
		if (auth.isAuthenticated && conversation) {
			
			
			let conversation_found = false;
			if (active_conversation_id !== conversation_id) {
				conversations.map(current_conversation => {
					if (current_conversation._id === conversation_id && !conversation_found) {
						conversation_found = true;
						dispatch(setMessagingCache("active_conversation", current_conversation));
						dispatch(fetchMessages(current_conversation, 20, 1, {}, true));						
					}
				});
			}

		}
		
		else {
			dispatch(setMessagingCache("active_conversation", false));
			dispatch(setMessagingCache("active_conversation_messages", []));
		}

	};
}

export function sendMessage(message) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, unsent_messages, active_conversation, active_conversation_messages}}} = getState();
		// console.log("sendMessage message", message);
		if (auth.isAuthenticated && message) {
			let conversation_id = message.conversation? (message.conversation._id? message.conversation._id : message.conversation) : false;
			if (conversation_id) {
				let message_to_send = {
					...message, 
					"conversation": conversation_id, 
					"created_on": new Date(), 
					"sender": auth.user._id,
				}

				await dispatch(appendMessage({...message_to_send, state: "pending"}));

				const ApiServiceInstance = new ApiService();
				ApiServiceInstance.refresh();
				ApiServiceInstance.setServiceUri("/messages");
				
				let sent_message = await ApiServiceInstance.create(message_to_send).then(res => {
					const { data } = res.body;
					return data;			
				}).catch(e => {
					console.log("sendMessage e", e);			
                    return false;
                });
                
                if (sent_message) {
                	//console.log("sendMessage sent_message", sent_message);
                	dispatch(updateMessage(sent_message));
                	dispatch(sendUnsentMessages());
                }
                else{
                	let new_unsent_messages = Array.isArray(unsent_messages)? unsent_messages.concat([message_to_send]) : [message_to_send];
					dispatch(setMessagingCache("unsent_messages", new_unsent_messages));
                }
                return sent_message;
			}

		}

	};
}

export function sendUnsentMessages() {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, unsent_messages, active_conversation, active_conversation_messages}}} = getState();		
		if (auth.isAuthenticated && Array.isArray(unsent_messages)) {			
			if (unsent_messages.length > 0) {
				const prev_unsent_messages = JSON.parse(JSON.stringify(unsent_messages));
				dispatch(setMessagingCache("unsent_messages", []));
				const ApiServiceInstance = new ApiService();
				ApiServiceInstance.refresh();
				ApiServiceInstance.setServiceUri("/messages");
				let unsent_messages_requests = [];
				let sent_messages = [];
				prev_unsent_messages.map((unsent_message, index) => {
					ApiServiceInstance.create(unsent_message).then(sent_message => {
						//Remove from current unsent messages
						const {communication: { messaging : {unsent_messages:current_unsent_messages}}} = getState();
						let new_unsent_messages = JSON.parse(JSON.stringify(unsent_messages));
						if (Array.isArray(new_unsent_messages)) {
							new_unsent_messages.splice(index);
							
						}
						else {
							new_unsent_messages = [];
						}
						dispatch(setMessagingCache("unsent_messages", new_unsent_messages));
							
					
					}).catch(err => {
						//Do nothing, just log if needed
					});	                
				});		
			}
		}
	};
}

export function createConversation(conversation, activate=true) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations}}} = getState();
		
		if (auth.isAuthenticated) {
			dispatch(setMessagingCache("creating_conversation", true));
			


			const ApiServiceInstance = new ApiService();
			ApiServiceInstance.refresh();
			ApiServiceInstance.setServiceUri("/conversations");
			const created_conversation = await ApiServiceInstance.post(conversation).then(async res => {
                const { data } = res.body;
                let new_conversation = data;
                let new_conversations = conversations;
            	if (Array.isArray(new_conversations)) {
            		new_conversations.unshift(new_conversation);
            	}
            	else {
            		new_conversations = [new_conversation];
            		
            	}
            	
            	if (activate) {
            		await dispatch(setMessagingCache("active_conversation", new_conversations[0]));
            	}
            		
            	await dispatch(fetchInbox());

            	dispatch(setMessagingCache("creating_conversation", false));
               
                return data;
            }).catch(err => {
            	if (err.status === 409 && err.body) {
            		if (JSON.isJSON(err.body.data)) {
            			let new_conversation = {
		                	...err.body.data, 
		                	state: err.body.data.state? err.body.data.state : {
		                		"conversation": err.body.data._id,
								"total": 0,
								"read": 0,
								"unread": 0,
								"incoming_total": 0,
								"incoming_read": 0,
								"incoming_unread": 0,
								"outgoing_total": 0,
								"outgoing_read": 0,
								"outgoing_unread": 0,

								"last_message": {
									"content": "",
									"sender": null,
									"type": "text",
									"context": null,
									"record": null,
									"attachments": [],
									"status": "available",
									"reads": [],
									"receipts": [],
									"is_reply": false,
									"reply_for": null,
									"created_on": new Date(),
								}
		                	}
		                };
            			let new_conversations = conversations;
            			let index_of_conversation = -1;
            			if (Array.isArray(conversations)) {
            				
            				new_conversations.map((current_conversation, cursor) => {
            					if (index_of_conversation === -1 && current_conversation._id === new_conversation._id) {
            						index_of_conversation = cursor;
            					}
            				});
            				if (index_of_conversation === -1) {
            					new_conversations.unshift(new_conversation);
            					index_of_conversation = 0;
            				}
            				
            				
            			}
            			else{
            				new_conversations = [new_conversation];
            				index_of_conversation = 0;
            			}
            			
            			dispatch(setMessagingCache("conversations", new_conversations));
            			
            			if (activate) {
            				dispatch(setMessagingCache("active_conversation", new_conversations[index_of_conversation]));
            			}

            			dispatch(setMessagingCache("creating_conversation", false));
            			
            			return new_conversations[index_of_conversation]
            		}
            	}
            	
                throw err;
            });

            
			
			//dispatch(setMessagingCache("conversations", inbox_conversations));
			return created_conversation;
		}
		else {
			return false;
		}
	};
}


export function removeEmailingCache(key) {
	return {
		type: REMOVE_EMAILING_CACHE,
		key,
	};
}

export function clearEmailingCache() {
	return {
		type: CLEAR_EMAILING_CACHE,
	};
}

export function clearCommunication() {
	return {
		type: CLEAR_COMMUNICATION_CACHE,
	};
}