import {
	API_CALL_REQUEST,
	API_SET_LOADING,
	API_SET_RESPONSE,
	API_SET_COMPLETE,
	API_SET_ERROR,
} from "state/actions";

const initialState = {
	volatile: true,
	base : {
		options: { uri: "/", type:"records", params:{}, data: {} },
		loading: false,
		response: null,
		complete: false,
		error: null,
		cache: true
	}
};


export default (state = initialState, action = {}) => {
	switch (action.type) {
		case API_CALL_REQUEST: {
			return {
				...state,
				[action.key]: { ...state[action.key], options: action.options, cache: action.cache },
			};
		}
		case API_SET_LOADING: {
			return {
				...state,
				[action.key]: { ...state[action.key], loading: action.loading },
			};
		}
		case API_SET_RESPONSE: {
			return {
				...state,
				[action.key]: { ...state[action.key], response: action.response },
			};
		}
		case API_SET_COMPLETE: {
			return {
				...state,
				[action.key]: { ...state[action.key], complete: action.complete },
			};
		}
		case API_SET_ERROR: {
			return {
				...state,
				[action.key]: { ...state[action.key], error: action.error },
			};
		}		
		default: {
			return state;
		}
	}
};
