/** @format */
import io from "socket.io-client"
import { appName, baseUrls, environment, client_id, client_secret } from "config"

const SocketsSingleton = (function () {
	var instance

	function createInstance() {
		let socket_url = baseUrls.api
		let options = {
			transports: ["websocket"],
		}

		if (environment === "production") {
			options.secure = true
		}
		let socket = io(socket_url, options)
		let existingSocketId = null

		return socket
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
})()
const socket = SocketsSingleton.getInstance()
export default socket
