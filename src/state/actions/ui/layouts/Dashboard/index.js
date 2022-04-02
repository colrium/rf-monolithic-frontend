/** @format */

import { SET_DASHBOARD_APPBAR_DISPLAYED, SET_DASHBOARD_DRAWER_DISPLAYED, SET_DASHBOARD_FOOTER_DISPLAYED, SET_DASHBOARD_HOMEPAGE_STATE, SET_DASHBOARD_LANGUAGE, SET_DASHBOARD_LAYOUT_DIRECTION, SET_DASHBOARD_LIGHTBOX, SET_DASHBOARD_SEARCHBAR_DISPLAYED } from "state/actions";

export function setDashboardLanguage(language) {
	return {
		type: SET_DASHBOARD_LANGUAGE,
		language,
	};
}

export function setDashboardLayoutDirection(layout_direction) {
	return {
		type: SET_DASHBOARD_LAYOUT_DIRECTION,
		layout_direction,
	};
}

export function setDashboardAppBarDisplayed(appbar_displayed) {
	return {
		type: SET_DASHBOARD_APPBAR_DISPLAYED,
		appbar_displayed,
	};
}

export function setDashboardDrawerDisplayed(drawer_displayed) {
	return {
		type: SET_DASHBOARD_DRAWER_DISPLAYED,
		drawer_displayed,
	};
}

export function setDashboardSearchbarDisplayed(searchbar_displayed) {
	return {
		type: SET_DASHBOARD_SEARCHBAR_DISPLAYED,
		searchbar_displayed,
	};
}

export function setDashboardFooterDisplayed(footer_displayed) {
	return {
		type: SET_DASHBOARD_FOOTER_DISPLAYED,
		footer_displayed,
	};
}

export function setDashboardHomePageState(homepage_state) {
	return {
		type: SET_DASHBOARD_HOMEPAGE_STATE,
		homepage_state,
	};
}

export function setLightBoxOpen(lightbox) {
	return {
		type: SET_DASHBOARD_LIGHTBOX,
		lightbox,
	};
}
