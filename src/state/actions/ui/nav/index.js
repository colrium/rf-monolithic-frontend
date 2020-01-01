import {
	APPEND_NAV_HISTORY,
	CLEAR_NAV_HISTORY,
	SET_NAV_HISTORY_THRESHOLD,
	SET_NAV_LOADING
} from "state/actions/types";

export function appendNavHistory(nav) {
	return {
		type: APPEND_NAV_HISTORY,
		nav
	};
}

export function setNavHistoryThreshold(count) {
	return {
		type: SET_NAV_HISTORY_THRESHOLD,
		count
	};
}

export function clearNavHistory() {
	return {
		type: CLEAR_NAV_HISTORY
	};
}

export function setNavLoading(loading) {
	return {
		type: SET_NAV_LOADING,
		loading
	};
}
