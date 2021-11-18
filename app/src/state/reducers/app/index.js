import {
	SET_ONBOARDED,
	SET_VERSION,
	SET_INITIALIZED,
	SET_SETTINGS,
	SET_PREFERENCES,
} from "state/actions";

import {appName} from "config";

const initialState={
	version: "0.0.0",
	onboarded: false,
	initialized: false,
	settings: {
		"general": {
			"seo-title": "Realfield",
			"seo-tagline": "We are not smart, We give you the data to be smart!",
			"copyright": "Copyright YYYY",
			"trademark": "Registered in Eng & wales Co No.",
			"landing-page-routing": "sections",
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
			"cookies-consent": "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services",
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
			"commission-embarkment": true,
			"response-submission": true,
			"user-registration": true,
			"new-logins": true,
			"oath2-logins": true,
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
		"mail": {
			smtp_host: "smtp.gmail.com",
			smtp_port: 465,
			smtp_tls_ssl: true,
			smtp_user: "",
			smtp_password: "",
			smtp_sender_name: appName,
		},
		"auth": {
			logins_enabled: true,
			registrations_enabled: true,
			account_recovery_enabled: true,
			OAuth2_enabled: false,
			google: {
				enabled: false,
				client_id: "",
				client_secret: "",
				client_callback_url: "",
			},
			twitter: {
				enabled: false,
				client_id: "",
				client_secret: "",
				client_callback_url: "",
			},
			facebook: {
				enabled: false,
				client_id: "",
				client_secret: "",
				client_callback_url: "",
			},
			linkedin: {
				enabled: false,
				client_id: "",
				client_secret: "",
				client_callback_url: "",
			},
			github: {
				enabled: false,
				client_id: "",
				client_secret: "",
				client_callback_url: "",
			},
		},
	},
	preferences: {
		"theme": "light",
		"locale": "en",
		"data": {
			pagination: 10,
			defaultMapZoom: 15,
		},
		"presentation": {
			"formats": {
				"date": "iso",
				"time": "iso"
			},
			"views": {
				"records": "tableview",
				"record": "basic"
			}
		},
		"notifications": {
			"all": {
				"push": true,
				"sms": true,
				"email": true,
			},
			"activity": {
				"push": true,
				"sms": true,
				"email": true,
			},
			"subscriptions": {
				"push": true,
				"sms": true,
				"email": true,
			},
			"features": {
				"push": true,
				"sms": true,
				"email": true,
			},
			"financial": {
				"push": true,
				"sms": true,
				"email": true,
			},
		},
		"subscriptions": {
			"newsletter": true,
			"posts": true,
			"updates": true,
		},
		"cookies": {
			"necessary": true,
			"statistics": false,
			"preferences": false,
			"marketing": false,
		},
		/*"dashboard": {
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
		}*/

	},//user settings	
};


const app=function (state=initialState, action) {
	switch(action.type) {
		case SET_VERSION: {
			return {
				...state,
				version: action.version,
			};
		}
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
				settings: JSON.isJSON(action.settings)? JSON.merge(initialState.settings, action.settings):initialState.settings,
			};
		}
		case SET_PREFERENCES: {
			return {
				...state,
				preferences: JSON.isJSON(action.preferences)? JSON.merge(initialState.preferences, action.preferences):initialState.preferences,
			};
		}
		default: {
			return state;
		}
	}
};

export default app;