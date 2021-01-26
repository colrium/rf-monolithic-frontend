/** @format */
import io from "socket.io-client";
import { appName, baseUrls, environment, apiClient } from "config";
import { store } from "state/store";

const SocketsSingleton = (function () {
    var instance;

    function createInstance() {
    	const { auth } = store.getState();
		let socket_url = baseUrls[environment].endpoints.default;
		let options = {
			secure: false,
			agent: appName+' fontend',
			'rememberUpgrade': true,
			'rejectUnauthorized': false,
			'reconnection': true,
          	'reconnectionDelay': 500,
			'reconnectionAttempts': Infinity, 
			'transports': ['websocket', 'polling'],
		};

		if (environment === "production") {
			options.secure = true;
		}
		// make sure socket is 
		var socket = io(socket_url, options);
		

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
export const socket = SocketsSingleton.getInstance();
