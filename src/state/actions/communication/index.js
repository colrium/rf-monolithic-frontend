import firebase from "firebase";
import {
	SET_MESSAGING_CACHE,
	SEND_MESSAGE,
	REMOVE_MESSAGING_CACHE,
	CLEAR_MESSAGING_CACHE,
	SET_EMAILING_CACHE,
	REMOVE_EMAILING_CACHE,
	CLEAR_EMAILING_CACHE,
	CLEAR_COMMUNICATION_CACHE
} from "state/actions";

import firebaseApp, {firestore as fcFirestore, messaging as fcMessaging} from "utils/Firebase";


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

export function sendMessage(message) {
	return async (dispatch, getState) => {
		const {auth, communication: { messaging : {conversations, active_conversation, active_conversation_messages}}} = getState();
		if (auth.isAuthenticated) {
			let notifees_ids = [];
			let targetConversation = active_conversation._id === message.conversation? active_conversation : false;

			if (!targetConversation && Array.isArray(conversations)) {
				for (var i = 0; i < conversations.length; i++) {
					if (conversations[i]._id === message.conversation) {
						targetConversation = conversations[i];
						break;
					}
				}
			}

			if (targetConversation) {
				if (targetConversation.owner !== auth.user._id && targetConversation.owner._id !== auth.user._id) {
					if (active_conversation.owner._id) {
						notifees_ids.push(active_conversation.owner._id);
					}
					else if (active_conversation.owner) {
						notifees_ids.push(active_conversation.owner);
					}
					
				}
				targetConversation.recipients.map(recipient => {
					if (JSON.isJSON(recipient) && "_id" in recipient && recipient._id !== auth.user._id) {
						notifees_ids.push(recipient._id);
					}
					else if (!String.isEmpty(recipient) && recipient !== auth.user._id) {
						notifees_ids.push(recipient);
					}
				});


				let tokens = await firebaseApp.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), 'in', notifees_ids).get().then(querySnapshot => {
				    	let tokensArr = [];
						let docs = querySnapshot.docs;
						
						for (let doc of docs) {
							let tokens = doc.get("tokens");
							tokensArr = tokensArr.concat(tokens);
						}
						return tokensArr;
				});

				console.log("sendMessage tokens", tokens)

				let fcmMessage = {
						"data": {
							...message,
							type: "new-message",
						},
						"tokens": tokens,
						"notification": {
						   "title": auth.user.first_name+" "+auth.user.last_name,
						   "body": message.content
						},
					}

				console.log("sendMessage fcmMessage", fcmMessage)
						
				fcMessaging.sendMulticast(fcmMessage);

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