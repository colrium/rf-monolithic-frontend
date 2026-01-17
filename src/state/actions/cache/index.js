/** @format */

import {
	SET_DATA_CACHE,
	REMOVE_DATA_CACHE,
	CLEAR_DATA_CACHE,
	SET_RESPONSE_CACHE,
	REMOVE_RESPONSE_CACHE,
	CLEAR_RESPONSE_CACHE,
	SET_BLOB_CACHE,
	REMOVE_BLOB_CACHE,
	CLEAR_BLOB_CACHE,
	SET_MESSAGING_CACHE,
	REMOVE_MESSAGING_CACHE,
	CLEAR_MESSAGING_CACHE,
	SET_EMAILING_CACHE,
	REMOVE_EMAILING_CACHE,
	CLEAR_EMAILING_CACHE,
	CLEAR_CACHE,
} from "state/actions";

export function setDataCache(key, data) {
	return {
		type: SET_DATA_CACHE,
		key: key,
		data: data,
	};
}

export function removeDataCache(key) {
	return {
		type: REMOVE_DATA_CACHE,
		key,
	};
}

export function clearDataCache() {
	return {
		type: CLEAR_DATA_CACHE,
	};
}

export function setResponseCache(key, res) {
	return {
		type: SET_RESPONSE_CACHE,
		key: key,
		res: res,
	};
}

export function removeResponseCache(key) {
	return {
		type: REMOVE_RESPONSE_CACHE,
		key,
	};
}

export function clearResponseCache() {
	return {
		type: CLEAR_RESPONSE_CACHE,
	};
}

export function setBlobCache(key, blob) {
	return {
		type: SET_BLOB_CACHE,
		key: key,
		blob: blob,
	};
}

export function removeBlobCache(key) {
	return {
		type: REMOVE_BLOB_CACHE,
		key,
	};
}

export function clearBlobCache() {
	return {
		type: CLEAR_BLOB_CACHE,
	};
}

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

export function clearCache() {
	return {
		type: CLEAR_CACHE,
	};
}
