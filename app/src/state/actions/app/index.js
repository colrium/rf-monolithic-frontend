import {
	SET_VERSION,
	SET_ONBOARDED,
	SET_INITIALIZED,
	SET_SETTINGS,
	SET_PREFERENCES,
	CLEAR_APP_STATE,
} from "state/actions";

export function setOnboarded(onboarded) {
	return {
		type: SET_ONBOARDED,
		onboarded,
	};
}

export function setVersion(version) {
	return {
		type: SET_VERSION,
		version,
	};
}

export function setInitialized(initialized) {
	return {
		type: SET_INITIALIZED,
		initialized,
	};
}

export function setSettings(settings) {
	return {
		type: SET_SETTINGS,
		settings,
	};
}

export function setPreferences(preferences) {
	return {
		type: SET_PREFERENCES,
		preferences,
	};
}

export function clearAppState() {
	return {
		type: CLEAR_APP_STATE
	};
}