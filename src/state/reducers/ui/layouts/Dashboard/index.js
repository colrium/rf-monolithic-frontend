import { 
	SET_DASHBOARD_LANGUAGE, 
	SET_DASHBOARD_LAYOUT_DIRECTION, 
	SET_DASHBOARD_APPBAR_DISPLAYED, 
	SET_DASHBOARD_DRAWER_DISPLAYED, 
	SET_DASHBOARD_FOOTER_DISPLAYED,
	SET_DASHBOARD_HOMEPAGE_STATE,
	SET_DASHBOARD_LIGHTBOX,
} from "state/actions";

const initialState = {
	language: "en_us",
	layout_direction: "ltr",
	appbar_displayed: true,
	drawer_displayed: true,
	footer_displayed: true,
	lightbox: {
		open: false,
		src: null,
		alt:null,
	},
	homepage_state: {
		sections: {
			"quicklinks" : false,
			"static_aggregates": true,
			"static_map": true, 
			"compact_aggregates": false, 
			"compact_maps": false, 
			"calendar": true,
		}
	},
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_DASHBOARD_LANGUAGE: {
			return {
				...state,
				language: action.language,
			};
		}
		case SET_DASHBOARD_LAYOUT_DIRECTION: {
			return {
				...state,
				layout_direction: action.layout_direction,
			};
		}
		case SET_DASHBOARD_APPBAR_DISPLAYED: {
			return {
				...state,
				appbar_displayed: action.appbar_displayed,
			};
		}
		case SET_DASHBOARD_DRAWER_DISPLAYED: {
			return {
				...state,
				drawer_displayed: action.drawer_displayed,
			};
		}
		case SET_DASHBOARD_FOOTER_DISPLAYED: {
			return {
				...state,
				footer_displayed: action.footer_displayed,
			};
		}
		case SET_DASHBOARD_HOMEPAGE_STATE: {
			return {
				...state,
				homepage_state: action.homepage_state,
			};
		}
		case SET_DASHBOARD_LIGHTBOX: {
			return {
				...state,
				lightbox: action.lightbox,
			};
		}
		default: {
			return state;
		}
	}
};


