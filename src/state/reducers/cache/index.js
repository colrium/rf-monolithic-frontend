/** @format */

import {
	SET_DATA_CACHE,
	REMOVE_DATA_CACHE,
	CLEAR_DATA_CACHE,
	SET_RESPONSE_CACHE,
	REMOVE_RESPONSE_CACHE,
	CLEAR_RESPONSE_CACHE,
	SET_BLOB_CACHE,
	REMOVE_BLOB_CACHE,
	CLEAR_BLOB_CACHE,
	SET_MESSAGING_CACHE,
	REMOVE_MESSAGING_CACHE,
	CLEAR_MESSAGING_CACHE,
	CLEAR_CACHE
} from "state/actions";

const initialState = {
	data: {},
	blob: {},
	res: {},
	messaging: {
		unread_count: 0,
		unread_ids: [],
		unsent_messages: [],
		conversations: [],
		drafts: [],
		contacts: [],
		active_conversation: false,
	},
};

export default (state = initialState, action = {}) => {

	switch (action.type) {
		case SET_DATA_CACHE: {
			return {
				...state,
				data: { ...state.data, [action.key]: action.data },
			};
		}
		case REMOVE_DATA_CACHE: {
			return {
				...state,
				data: JSON.removeProperty(state.data, action.key),
			};
		}
		case CLEAR_DATA_CACHE: {
			return {
				...state,
				data: initialState.data,
			};
		}
		case SET_RESPONSE_CACHE: {
			return {
				...state,
				res: { ...state.res, [action.key]: action.res },
			};
		}
		case REMOVE_RESPONSE_CACHE: {
			return {
				...state,
				res: JSON.removeProperty(state.res, action.key),
			};
		}
		case CLEAR_RESPONSE_CACHE: {
			return {
				...state,
				res: initialState.res,
			};
		}
		case SET_BLOB_CACHE: {
			return {
				...state,
				blob: { ...state.blob, [action.key]: action.blob },
			};
		}
		case REMOVE_BLOB_CACHE: {
			return {
				...state,
				blob: JSON.removeProperty(state.blob, action.key),
			};
		}
		case CLEAR_BLOB_CACHE: {
			return {
				...state,
				blob: initialState.blob,
			};
		}
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
		case CLEAR_CACHE: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};
