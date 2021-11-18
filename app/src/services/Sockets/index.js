/** @format */
import io from "socket.io-client";
import { appName, baseUrls, environment, client_id, client_secret } from "config";
import store from "state/store";

const SocketsSingleton = (function () {
	var instance;


	function createInstance() {
		const { auth } = store.getState();
		let socket_url = baseUrls.api;
		let options = {
			secure: false,
			agent: appName + ' mobile',
			transportOptions: {
				polling: {
					extraHeaders: {
						"x-client-id": client_id,
						"x-client-secret": client_secret,
						'Access-Control-Allow-Credentials': 'omit'
					}
				}
			},
			rememberUpgrade: true,
			rejectUnauthorized: false,
			'reconnection': true,
			'reconnectionDelay': 500,
			'reconnectionAttempts': Infinity,
			'transports': ['websocket', 'polling'],
			extraHeaders: {
				"x-client-id": client_id,
				"x-client-secret": client_secret,
			}
		};

		if (environment === "production") {
			options.secure = true;
		}
		// make sure socket is 
		var socket = io(socket_url, options);
		socket.on('reconnect_attempt', () => {
			////
			socket.io.opts.transportOptions = {
				polling: {
					extraHeaders: {
						"x-client-id": client_id,
						"x-client-secret": client_secret,
					}
				}
			};
			socket.io.opts.extraHeaders = {
				"x-client-id": client_id,
				"x-client-secret": client_secret,
			};
		});

		return socket;
	}

	return {
		getInstance: function () {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
})();
const socket = SocketsSingleton.getInstance();
export {
	socket as default
}