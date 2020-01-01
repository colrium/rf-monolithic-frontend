import {
	APPEND_NAV_HISTORY,
	CLEAR_NAV_HISTORY,
	SET_NAV_HISTORY_THRESHOLD,
	SET_NAV_LOADING
} from "state/actions/types";

function initialState() {
	return {
		threshold: 5,
		entries: [
			{
				name: "home",
				uri: "/home".toUriWithDashboardPrefix(),
				title: "Home",
				view: null,
				color: null,
				scrollTop: 0
			}
		],
		loading: true
	};
}

function appendNavHistory(state, nav) {
	let threshold = state.threshold;
	let shifted_entries = state.entries;
	if (shifted_entries.length > 0) {
		shifted_entries = shifted_entries.filter(entry => {
			return nav.name !== entry.name;
		});
		shifted_entries = Array.isArray(shifted_entries) ? shifted_entries : [];
		if (shifted_entries.length > 0) {
			if (
				shifted_entries.length + 1 > threshold &&
				shifted_entries[shifted_entries.length - 1].name !== nav.name
			) {
				shifted_entries.shift();
				shifted_entries.push(nav);
			} else if (
				shifted_entries[shifted_entries.length - 1].name === nav.name
			) {
				shifted_entries[shifted_entries.length - 1] = nav;
			} else {
				shifted_entries.push(nav);
			}
		}
	}
	return shifted_entries;
}

export default (state = initialState(), action = {}) => {
	switch (action.type) {
		case APPEND_NAV_HISTORY:
			return {
				...state,
				entries: appendNavHistory(state, action.nav)
			};
		case SET_NAV_HISTORY_THRESHOLD:
			return {
				...state,
				threshold: action.threshold ? action.threshold : 1
			};
		case CLEAR_NAV_HISTORY:
			return {
				...state,
				entries: []
			};
		case SET_NAV_LOADING:
			return {
				...state,
				loading: action.loading,
			};
		default:
			return state;
	}
};
