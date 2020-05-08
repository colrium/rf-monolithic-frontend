import {
	SET_ONBOARDED,
	SET_INITIALIZED,
	SET_SETTINGS,
	SET_PREFERENCES,
} from "state/actions";

const initialState = {
	onboarded: false,
	initialized: false,
	settings: {
		"general": {
			"seo-title": "Realfield",
			"seo-tagline": "We are not smart, We give you the data to be smart!",
			"copyright": "Copyright YYYY",
			"trademark": "Registered in Eng & wales Co No.",
		},
		"reading": {
			"enable-blog": true,
			"enable-press": true,
			"enable-faq": true,
		},
		"legal": {
			"terms-of-use": "Terms of use",
			"end-user-agreement": "End user agreement",
			"privacy-policy": "Privacy Policy",
			"cookies-consent": "Cookies Consent",
		},
		"social": {
			facebook: null,
			twitter: null,
			instagram: null,
			youtube: null,
			linkedin: null,
			whatsapp: null,
			google_plus: null,
			pinterest: null,
		},
		"mobile": {
			"enabled": true,
			"show-message": false,
			"access-availability": "administrators-only", 
			"message": "",	
		},
		"tracking": {
			"contexts": ["roam", "commission"],
			"interval-type": "distance",
			"interval": 20,
			"min-positions-per-track": 2,
			"max-positions-per-track": 30,
			"trackable-time-window": "any-time",
			"enforce-context-location-availability": true,
			"enforce-onlocation-actions": true,
		},
		"contact": {
			phone: "",
			email: "",
			address: "",
		},
	},
	preferences: {
		"theme": "light",
		"locale": "en",
		"dashboard": {
			"view": "tabs",// or "default"
			"map": {
				"visible": true,
				"position": "0",
				"label": "Explore",
				"icon": "map-outline",
				"color": "#040087",
				"contexts": ["commissions", "responses", "tracks", "surveys"],
				"context": "tracks", 
				"type": "static", //or dynamic
				"width": "12", //1 to 12
				"defaultCenter": false, // Or {latitude: 0, longitude: 0}
			},

			"charts": {
				"visible": true,
				"position": "1",
				"label": "Charts",
				"icon": "chart-arc",
				"color": "#040087",
				"contexts": [],
				"context": "commissions", 
				"type": "static", //or dynamic
				"width": "6", //1 to 12
				"defaultView": "pie", // Or bar
			},

			"actions": {
				"visible": true,
				"position": "2",
				"label": "New",
				"icon": "plus-circle-outline",
				"color": "#00871b",
				"width": "6", //1 to 12
				"defaultView": "icons",
			},

			"timeline": {
				"visible": true,
				"label": "Calendar",
				"icon": "calendar-clock",
				"color": "#bf7300",
				"position": "3",
				"contexts": [],
				"context": "events", 
				"width": "12", //1 to 12
				"defaultView": "calendar", // Or list or table or map
			},
		}
			
	},//user settings	
};


const app = function(state = initialState, action) {
	switch (action.type) {
		case SET_ONBOARDED: {
			return {
				...state,
				onboarded: action.onboarded,
			};
		}
		case SET_INITIALIZED: {
			return {
				...state,
				initialized: action.initialized,
			};
		}
		case SET_SETTINGS: {
			return {
				...state,
				settings: JSON.isJSON(action.settings)? {...initialState.settings, ...state.settings, ...action.settings } : initialState.settings,
			};
		}
		case SET_PREFERENCES: {
			return {
				...state,
				preferences: JSON.isJSON(action.preferences)? {...initialState.preferences, ...state.preferences, ...action.preferences}  : initialState.preferences,
			};
		}
		default: {
			return state;
		}
	}
};

export default app;