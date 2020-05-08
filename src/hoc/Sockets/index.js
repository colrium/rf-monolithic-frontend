/** @format */

import io from "socket.io-client";
import { appName, baseUrls, environment, apiClient } from "config";
import Auth from "hoc/Auth";

export const defaultSocket = () => {
	let socket_url = baseUrls[environment].endpoints.default;
	let options = {
		secure: false,
		/*transportOptions: {
			polling: {
				extraHeaders: {
					//"x-client-id": apiClient.client_id,
					//"x-client-secret": apiClient.client_secret,
					"Authorization": Auth.getInstance().authTokenSet()? Auth.getInstance().authorization_header()["Authorization"] : undefined,
				}
			}
		},*/
		query : {
			"x-client-id": apiClient.client_id,
			"x-client-secret": apiClient.client_secret,
			"Authorization": Auth.getInstance().authTokenSet()? Auth.getInstance().authorization_header()["Authorization"] : undefined,
		},
		rememberUpgrade: true,
		rejectUnauthorized: false,
		timeout: 10000,
	};

	if (environment === "production") {
		options.secure = true;
	}
	// make sure socket is 
	let socket = io(socket_url, options);
	//console.log("defaultSocket socket", socket);
	socket.on('reconnect_attempt', () => {
		//console.log("reconnect_attempt called");
		/*socket.io.opts.transportOptions = {
			polling: {
				extraHeaders: {
					"x-client-id": apiClient.client_id,
					"x-client-secret": apiClient.client_secret,
					"Authorization": Auth.getInstance().authTokenSet()? Auth.getInstance().authorization_header()["Authorization"] : undefined,
				}
			}
		};*/
		socket.io.opts.query = {
			"x-client-id": apiClient.client_id,
			"x-client-secret": apiClient.client_secret,
			"Authorization": Auth.getInstance().authTokenSet()? Auth.getInstance().authorization_header()["Authorization"] : undefined,
		};
	});
	return socket;
};

export const authSocket = () => {
	let socket_url = baseUrls[environment].endpoints.auth;
	let options = {
		secure: false,
		key: apiClient.client_id, // Using client auth.
		passphrase: apiClient.client_secret, // Using client auth.
		/*timeout: 10000,
		jsonp: false,
		transports: ['websocket'],
		autoConnect: false,
		agent: appName+' mobile',
		path: '/', // Whatever your path is
		pfx: '-',
		key: apiClient.client_id, // Using client auth.
		passphrase: apiClient.client_secret, // Using client auth.
		cert: '-',
		ca: '-',
		ciphers: '-',
		rejectUnauthorized: '-',
		perMessageDeflate: '-'*/
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