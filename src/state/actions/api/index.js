/** @format */

import {
	API_CALL_REQUEST,
	API_SET_LOADING,
	API_SET_RESPONSE,
	API_ADD_TASK,
	API_REMOVE_TASK,
	API_CLEAR_TASKS,
	API_SET_COMPLETE,
	API_SET_ERROR,
} from "state/actions";

export function apiCallRequest(key, options) {
	return {
		type: API_CALL_REQUEST,
		key: key,
		options: options,
	};
}

export function setApiCallLoading(key, loading) {
	return {
		type: API_SET_LOADING,
		key: key,
		loading: loading,
	};
}

export function addApiTask(task) {
	return {
		type: API_ADD_TASK,
		task: task,
	};
}

export function removeApiTask(task) {
	return {
		type: API_REMOVE_TASK,
		task: task,
	};
}

export function clearApiTasks() {
	return {
		type: API_CLEAR_TASKS,
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
