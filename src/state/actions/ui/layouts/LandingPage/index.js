/** @format */

import { SET_LANDINGPAGE_FOOTER_DISPLAYED, SET_LANDINGPAGE_LANGUAGE, SET_LANDINGPAGE_LAYOUT_DIRECTION, SET_LANDINGPAGE_NAVBAR_DISPLAYED } from "state/actions";

export function setLandingPageLanguage(language) {
	return {
		type: SET_LANDINGPAGE_LANGUAGE,
		language,
	};
}

export function setLandingPageLayoutDirection(direction) {
	return {
		type: SET_LANDINGPAGE_LAYOUT_DIRECTION,
		direction,
	};
}

export function setLandingPageNavBarDisplayed(displayed) {
	return {
		type: SET_LANDINGPAGE_NAVBAR_DISPLAYED,
		displayed,
	};
}

export function setLandingPageFooterDisplayed(displayed) {
	return {
		type: SET_LANDINGPAGE_FOOTER_DISPLAYED,
		displayed,
	};
}
