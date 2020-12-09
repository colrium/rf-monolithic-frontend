import {
	SET_MESSAGING_CACHE,
	REMOVE_MESSAGING_CACHE,
	CLEAR_MESSAGING_CACHE,
	SET_EMAILING_CACHE,
	REMOVE_EMAILING_CACHE,
	CLEAR_EMAILING_CACHE,
	CLEAR_COMMUNICATION_CACHE
} from "state/actions";

export function setMessagingCache(key, messaging) {
	return {
		type: SET_MESSAGING_CACHE,
		key: key,
		messaging: messaging,
	};
}

export function removeMessagingCache(key) {
	return {
		type: REMOVE_MESSAGING_CACHE,
		key,
	};
}

export function clearMessagingCache() {
	return {
		type: CLEAR_MESSAGING_CACHE,
	};
}
export function setEmailingCache(key, emailing) {
	return {
		type: SET_EMAILING_CACHE,
		key: key,
		emailing: emailing,
	};
}

export function removeEmailingCache(key) {
	return {
		type: REMOVE_EMAILING_CACHE,
		key,
	};
}

export function clearEmailingCache() {
	return {
		type: CLEAR_EMAILING_CACHE,
	};
}

export function clearCommunication() {
	return {
		type: CLEAR_COMMUNICATION_CACHE,
	};
}