import io from "socket.io-client";
import { baseUrls, environment, client_id, client_secret } from "config";
import Auth from "utils/Auth";

export const defaultSocket = () => {
	let socket_url = baseUrls[environment].endpoints.default;
	let options = {
		secure: false,
	};
	
	if (environment === "production") {
		options.secure = true;
	}
	if (Auth.getInstance().authTokenSet()) {
		//options.transportOptions.websocket.extraHeaders["Authorization"] = Auth.getInstance().authorization_header()["Authorization"];
	}
	// make sure our socket is connected
	const default_socket = io(socket_url, options);
	return default_socket;
};

export const authSocket = () => {
	let socket_url = baseUrls[environment].endpoints.auth;
	let options = {
		secure: false,
	};

	if (environment === "production") {
		options.secure = true;
	}
	if (Auth.getInstance().authTokenSet()) {
		//options.transportOptions.websocket.extraHeaders["Authorization"] = Auth.getInstance().authorization_header()["Authorization"];
	}
	let auth_socket = io(socket_url, options);
	return auth_socket;
};
