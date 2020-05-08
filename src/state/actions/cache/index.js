/** @format */

import {
	SET_DATA_CACHE,
	REMOVE_DATA_CACHE,
	CLEAR_DATA_CACHE,
	SET_BLOB_CACHE,
	REMOVE_BLOB_CACHE,
	CLEAR_BLOB_CACHE,
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
