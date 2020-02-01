import {
	SET_DEFAULT_SOCKET,
	SET_AUTH_SOCKET,
	setDataCache,
	apiCallRequest,
} from "state/actions";

import * as definations from "definations";

let modelToDefinations = {};
for (let defination of Object.values(definations)) {
	modelToDefinations[defination.model] = defination.name;
}

const sockets = ({ dispatch, getState }) => next => (action) => {	
	if ( action.type === SET_DEFAULT_SOCKET || action.type === SET_AUTH_SOCKET) {		
		let { socket:actionSocket } = action;
		if ( actionSocket ) {
			const { auth, cache:{ data: dataCache }, api } = getState();
			actionSocket.on("create", async ({ context, action }) => {
				let defination = definations[modelToDefinations[context]];
				if (defination) {
					if (defination.cache && defination.access.view.single(auth.user, action.result )) {
						let newDataCache = Array.isArray(dataCache[defination.name])? dataCache[defination.name] : [];
						newDataCache.unshift(action.result);
						dispatch(setDataCache(defination.name, newDataCache));
						let aggregatesApiCallRequest = api[(defination.name+"_aggregates")];
						if (aggregatesApiCallRequest) {
							dispatch(apiCallRequest(defination.name+"_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache));
						}
					}
				}
			});

			actionSocket.on("update", async ({ context, action }) => {
				let defination = definations[modelToDefinations[context]];
				if (defination) {
					if (defination.cache) {
						let newDataCache = Array.isArray(dataCache[defination.name])? dataCache[defination.name] : [];
						if (newDataCache.length > 0) {
							let cacheEntryFound = false
							newDataCache = newDataCache.map((cacheEntry, index) => {
								if (cacheEntry._id === action.record ) {
									cacheEntryFound = true;
									return action.result;
								}
								else{
									return cacheEntry;
								}
							});
							if (!cacheEntryFound) {
								if (defination.access.view.single(auth.user, action.result )) {
									newDataCache.unshift(action.result);
								}
							}
						}											
						dispatch(setDataCache(defination.name, newDataCache));
						let aggregatesApiCallRequest = api[(defination.name+"_aggregates")];
						if (aggregatesApiCallRequest) {
							dispatch(apiCallRequest(defination.name+"_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache));
						}
					}
						
				}
			});

			actionSocket.on("delete", async ({ context, action }) => {
				let defination = definations[modelToDefinations[context]];
				if (defination) {
					if (defination.cache) {
						let newDataCache = Array.isArray(dataCache[defination.name])? dataCache[defination.name] : [];
						if (newDataCache.length > 0) {
							newDataCache = newDataCache.filter((cacheEntry, index) => {
								if (cacheEntry._id === action.record ) {
									return false;
								}
								return true;
							});
						}						
						dispatch(setDataCache(defination.name, newDataCache));
						let aggregatesApiCallRequest = api[(defination.name+"_aggregates")];
						if (aggregatesApiCallRequest) {
							dispatch(apiCallRequest(defination.name+"_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache));
						}
					}						
				}
			});

			action.socket = actionSocket;
		}
		next(action);

	}
	else{
		next(action);
	}
		
};

export default sockets;