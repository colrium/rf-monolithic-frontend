/** @format */

import {
	API_CALL_REQUEST,
	API_SET_LOADING,
	API_SET_RESPONSE,
	API_SET_COMPLETE,
	API_SET_ERROR,
} from "state/actions";

export function apiCallRequest(key, options, cache = true) {
	return {
		type: API_CALL_REQUEST,
		key: key,
		options: options,
		cache: cache,
	};
}

export function setApiCallLoading(key, loading) {
	return {
		type: API_SET_LOADING,
		key: key,
		loading: loading,
	};
}

export function setApiCallResponse(key, response) {
	return {
		type: API_SET_RESPONSE,
		key: key,
		response: response,
	};
}

export function setApiCallComplete(key, complete) {
	return {
		type: API_SET_COMPLETE,
		key: key,
		complete: complete,
	};
}

export function setApiCallError(key, error) {
	return {
		type: API_SET_ERROR,
		key: key,
		error: error,
	};
}
