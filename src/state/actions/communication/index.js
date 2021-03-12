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

export function setActiveConversation(conversation) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		let conversation_messages = [];
		if (auth.isAuthenticated && conversation) {
			let conversation_id = conversation._id? conversation._id : conversation;
			const ApiServiceInstance = new ApiService();
			ApiServiceInstance.refresh();
			ApiServiceInstance.setServiceUri(messagesDefination.endpoint);
			if (active_conversation._id !== conversation_id) {
				dispatch(setMessagingCache("active_conversation_messages", []));
				dispatch(setMessagingCache("active_conversation", conversation));
			}
			
			conversation_messages = await ApiServiceInstance.getRecords({conversation: conversation_id, asc: "created_on", p: "1", page: 1, pagination: 100}).then(res => {
				//console.log("setActiveConversation active_conversation_messages res.body", res.body);
				const { count, page, pages, data } = res.body;
				//dispatch(setMessagingCache("active_conversation", {...conversation, page: page, pages: pages}));
				if (Array.isArray(data)) {
					return data;
				}

				return [];				
			}).catch(e => {				
				console.error("setActiveConversation active_conversation_messages e"+ e);
				return [];
			});
			dispatch(setMessagingCache("active_conversation_messages", conversation_messages));


		}
		else {
			dispatch(setMessagingCache("active_conversation", false));
			dispatch(setMessagingCache("active_conversation_messages", []));
		}

	}
}

export function sendMessage(message) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		
		if (auth.isAuthenticated && message) {
			let conversation_id = message.conversation? (message.conversation._id? message.conversation._id : message.conversation) : false;
			if (conversation_id) {
				const ApiServiceInstance = new ApiService();
				ApiServiceInstance.refresh();
				ApiServiceInstance.setServiceUri(messagesDefination.endpoint);
				
				let conversation_message = await ApiServiceInstance.create({...message, conversation: conversation_id, "created_on": new Date(), sender: auth.user._id}).then(res => {
					const { data } = res.body;
					return data;			
				}).catch(e => {				
					console.error("sendMessage e"+ e);
					return false;
				});

				if (active_conversation && conversation_message) {
					if (active_conversation._id === conversation_id) {
						let new_active_conversation_messages = active_conversation_messages;
						new_active_conversation_messages.push(conversation_message);
						dispatch(setMessagingCache("active_conversation_messages", new_active_conversation_messages));
					}
				}
				let new_conversations = conversations.map(conversation => {
					if (conversation._id == conversation_id) {
						conversation.state = {
							...conversation.state,
							total: conversation.state.total+1,
							outgoing_total: conversation.state.outgoing_total+1,
							last_message: conversation_message
						}
					}

					return conversation;
				});
				dispatch(setMessagingCache("conversations", new_conversations));


			}

		}

	}
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