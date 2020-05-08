import {
	SET_ONBOARDED,
	SET_INITIALIZED,
	SET_SETTINGS,
	SET_PREFERENCES,	
} from "state/actions";

export function setOnboarded(onboarded) {
	return {
		type: SET_ONBOARDED,
		onboarded,
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
