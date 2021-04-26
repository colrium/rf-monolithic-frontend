/** @format */

import {
	
	SET_MESSAGING_CACHE,
	REMOVE_MESSAGING_CACHE,
	CLEAR_MESSAGING_CACHE,
	SET_EMAILING_CACHE,
	REMOVE_EMAILING_CACHE,
	CLEAR_EMAILING_CACHE,
	CLEAR_COMMUNICATION_CACHE,
} from "state/actions";

const initialState = {
	messaging: {
		unread_count: 0,
		unread_ids: [],
		unsent_messages: [],
		conversations: [],
		drafts: [],
		contacts: [],
		contactactable_contacts_ids: [],
		active_conversation: false,
		active_conversation_messages: [],
		contacts_open: false,
		fetching_inbox: false,
		creating_conversation: false,
	},
	emailing: {
		popup_open: false,
		recipient_address: "",
		recipient_name: "",
		"cc": [],
		"bcc": [],		
		subject: "",
		content: "",		
		context: null,
		record: null,
	},
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_MESSAGING_CACHE: {
			return {
				...state,
				messaging: { ...state.messaging, [action.key]: (Function.isFunction(action.messaging)? action.messaging(state.messaging[action.key]) : action.messaging) },
			};
		}
		case REMOVE_MESSAGING_CACHE: {
			return {
				...state,
				messaging: JSON.removeProperty(state.messaging, action.key),
			};
		}
		case CLEAR_MESSAGING_CACHE: {
			return {
				...state,
				messaging: initialState.messaging,
			};
		}
		case SET_EMAILING_CACHE: {
			return {
				...state,
				emailing: { ...state.emailing, [action.key]: (Function.isFunction(action.emailing)? action.emailing(state.emailing[action.key]) : action.emailing) },
			};
		}
		case REMOVE_EMAILING_CACHE: {
			return {
				...state,
				emailing: JSON.removeProperty(state.emailing, action.key),
			};
		}
		case CLEAR_EMAILING_CACHE: {
			return {
				...state,
				emailing: initialState.emailing,
			};
		}
		case CLEAR_COMMUNICATION_CACHE: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};
