/** @format */
import io from "socket.io-client"
import { appName, baseUrls, environment, client_id, client_secret } from "config";

const SocketsSingleton = (function () {
	var instance;


	function createInstance() {
		let socket_url = baseUrls.api;
		let options = {};

		if (environment === "production") {
			// options.secure = true;
		}
		// make sure socket is
		var socket = io(socket_url, options)
		var existingSocketId = null
		socket.on('connect', () => {
			////
			console.log("socket.id", socket)
		});
		return socket;
	}

	return {
		getInstance: function () {
			if (!instance) {
				instance = createInstance()
			}
			return instance
		},
		createInstance,
	}
})();
const socket = SocketsSingleton.getInstance();
export { socket as default}
