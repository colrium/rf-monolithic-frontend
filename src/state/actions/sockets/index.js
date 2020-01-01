import {
	SET_DEFAULT_SOCKET,
	SET_AUTH_SOCKET,
} from "state/actions/types";

export function setDefaultSocket(socket) {
	return {
		type: SET_DEFAULT_SOCKET,
		socket
	};
}

export function setAuthSocket(socket) {
	return {
		type: SET_AUTH_SOCKET,
		socket
	};
}
