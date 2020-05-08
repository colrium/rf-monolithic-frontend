/** @format */

import {
	SET_IDENTITY,
	SET_OPERATING_SYSTEM,
	SET_BROWSER,
	SET_SCREEN_SIZE,
	SET_WINDOW_SIZE,
} from "state/actions/types";

const initialState = {
	identity: {
		type: "Uknown",
		vendor: "Uknown",
		model: "Uknown",
	},
	os: {
		name: "Uknown",
		version: "Uknown",
	},
	browser: {
		name: "Uknown",
		version: "Uknown",
	},
	screen_size: {
		width: 1366,
		height: 768,
		orientation: "potrait",
	},
	window_size: {
		width: 1024,
		height: 768,
		name: "xs",
	},
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_IDENTITY: {
			return {
				...state,
				identity: action.identity,
			};
		}
		case SET_OPERATING_SYSTEM: {
			return {
				...state,
				os: action.os,
			};
		}
		case SET_BROWSER: {
			return {
				...state,
				browser: action.browser,
			};
		}
		case SET_SCREEN_SIZE: {
			return {
				...state,
				screen_size: action.screen_size,
			};
		}
		case SET_WINDOW_SIZE: {
			return {
				...state,
				window_size: action.window_size,
			};
		}
		default: {
			return state;
		}
	}
};
