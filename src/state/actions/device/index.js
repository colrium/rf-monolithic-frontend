/** @format */

import {
	SET_IDENTITY,
	SET_OPERATING_SYSTEM,
	SET_BROWSER,
	SET_SCREEN_SIZE,
	SET_WINDOW_SIZE,
	SET_LOCATION,
} from "state/actions/types";

export function setIdentity(identity) {
	return {
		type: SET_IDENTITY,
		identity,
	};
}

export function setOperatingSystem(os) {
	return {
		type: SET_OPERATING_SYSTEM,
		os,
	};
}

export function setBrowser(browser) {
	return {
		type: SET_BROWSER,
		browser,
	};
}

export function setScreenSize(screen_size) {
	return {
		type: SET_SCREEN_SIZE,
		screen_size,
	};
}

export function setWindowSize(window_size) {
	return {
		type: SET_WINDOW_SIZE,
		window_size,
	};
}

export function setDeviceLocation(location) {
	return {
		type: SET_LOCATION,
		location,
	};
}
