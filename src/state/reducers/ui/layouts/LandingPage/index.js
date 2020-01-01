import { 
	SET_LANDINGPAGE_LANGUAGE,
	SET_LANDINGPAGE_LAYOUT_DIRECTION, 
	SET_LANDINGPAGE_NAVBAR_DISPLAYED, 
	SET_LANDINGPAGE_FOOTER_DISPLAYED,
	SET_LANDINGPAGE_ORDERPAGE_STATE, 
} from "state/actions";

const initialState = {
	language: "en_us",
	layout_direction: "ltr",
	navbar_displayed: true,
	footer_displayed: true,
	orderpage_state: {
		order_progress: {
			step_name: "start",
			steps_data: {},
		},
	},
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_LANDINGPAGE_LANGUAGE: {
			return {
				...state,
				language: action.language,
			};
		}
		case SET_LANDINGPAGE_LAYOUT_DIRECTION: {
			return {
				...state,
				layout_direction: action.layout_direction,
			};
		}
		case SET_LANDINGPAGE_NAVBAR_DISPLAYED: {
			return {
				...state,
				navbar_displayed: action.navbar_displayed,
			};
		}
		case SET_LANDINGPAGE_FOOTER_DISPLAYED: {
			return {
				...state,
				footer_displayed: action.footer_displayed,
			};
		}
		case SET_LANDINGPAGE_ORDERPAGE_STATE: {
			return {
				...state,
				orderpage_state: action.orderpage_state,
			};
		}
		default: {
			return state;
		}
	}
};


