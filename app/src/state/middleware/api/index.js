/** @format */

import {
	API_CALL_REQUEST,
	setApiCallLoading,
	setApiCallResponse,
	setApiCallComplete,
	setApiCallError,
	setDataCache,
	setResponseCache,
	removeResponseCache,
	addApiTask,
	removeApiTask,
} from "state/actions";
import ApiService from "services/Api";




const api = ({ dispatch, getState }) => next => action => {
	function onApiCallStart(action) {
		const { key } = action;
		dispatch(setApiCallLoading(key, true));
		dispatch(setApiCallComplete(key, false));
		dispatch(setApiCallError(key, null));
		dispatch(setApiCallResponse(key, null));
	}

	function onApiCallComplete(action, res, error) {
		const { key, options, cache } = action;
		if (key && options) {
			if (error) {
				dispatch(setApiCallLoading(key, false));
				dispatch(setApiCallComplete(key, true));
				dispatch(setApiCallError(key, error));
				dispatch(setApiCallResponse(key, null));
			} else if (res) {
				dispatch(setApiCallLoading(key, false));
				dispatch(setApiCallComplete(key, true));
				dispatch(setApiCallError(key, null));
				dispatch(setApiCallResponse(key, res));
				if (cache) {
					dispatch(setDataCache(key, res.body));
				}
			} else {
				dispatch(setApiCallLoading(key, false));
				dispatch(setApiCallComplete(key, true));
				dispatch(setApiCallError(key, null));
			}
		}
	}

	const executeRequest = async () => {
		const state = getState();
		const { key, options } = action;
		const apiTask = { key: String.uid(50), ...options };
		if (key && options) {
			const { uri, type, params, data, cache, silent, id } = options;
			//onApiCallStart(action);
			const ApiServiceInstance = ApiService.getContextRequests(String.isString(uri) ? uri : "/");
			if (type === "records") {
				//
				if (!silent) {
					dispatch(addApiTask(apiTask));
					if (cache) {
						dispatch(removeResponseCache(key));
					}
				}

				return await ApiServiceInstance.getRecords(params).then(res => {
					//
					if (cache) {
						let { data, ...rest } = res.body;
						dispatch(setResponseCache(key, rest));
						if (Array.isArray(data)) {
							if (data.length <= 50) {
								dispatch(setDataCache(key, data));
							}
							else {
								const items = data.slice(0, 50)
								dispatch(setDataCache(key, items));
							}
						}
						else {
							dispatch(setDataCache(key, []));
						}
					}
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}

					return res;
				}).catch(e => {
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					throw e;
				});
			}
			if (type === "count") {
				//
				dispatch(addApiTask(apiTask));
				if (cache) {
					dispatch(removeResponseCache(key));
				}
				return await ApiServiceInstance.getRecordsCount(params).then(res => {
					if (cache) {
						let { data, ...rest } = res.body;
						dispatch(setResponseCache(key, rest));
						dispatch(setDataCache(key, data.count));
					}
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					if (res.err) {
						throw res.err;
					}
					else {
						return res;
					}
				}).catch(e => {
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					throw e;
				});
			}
			else if (type === "aggregates") {
				dispatch(addApiTask(apiTask));

				if (cache) {
					dispatch(removeResponseCache(key));
				}

				return await ApiServiceInstance.getAggregatesCount(params).then(res => {
					if (cache) {
						let { data, ...rest } = res.body;
						dispatch(setResponseCache(key, rest));
						dispatch(setDataCache(key, data));
					}
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					if (res.err) {
						throw res.err;
					}
					else {
						return res;
					}
				}).catch(e => {
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					dispatch(setResponseCache(key, e));
					throw e;
				});
			}

			else if (type === "create") {
				dispatch(addApiTask(apiTask));
				if (cache) {
					dispatch(removeResponseCache(key));
				}
				return await ApiServiceInstance.create(data).then(res => {
					if (cache) {
						let { data, ...rest } = res.body;
						dispatch(setResponseCache(key, rest));
						/*let newCache = Array.isArray(cache[key])? cache[key] : [];
						//newCache.push(res.body);
						dispatch(setDataCache(key, newCache));*/
					}
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					if (res.err) {
						throw res.err;
					}
					else {
						return res;
					}
				}).catch(e => {
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					throw e;
				});
			}

			else if (type === "update") {
				dispatch(addApiTask(apiTask));
				if (cache) {
					dispatch(removeResponseCache(key));
				}
				return await ApiServiceInstance.update(id, data, params).then(res => {
					if (cache) {
						let { data, ...rest } = res.body;
						dispatch(setResponseCache(key, rest));
						/*let newCache = Array.isArray(cache[key])? cache[key] : [];

						if (newCache.length > 0) {
							let exists = false;
							newCache = newCache.map((entry, index) => {
								if (entry._id === id) {
									exists = true;
									return res;
								}
								return entry;
							});
							if (!exists) {
								newCache.push(res.body);
							}

						}
						else{
							newCache.push(res.body);
						}

						dispatch(setDataCache(key, newCache));
						*/
					}
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					if (res.err) {
						throw res.err;
					}
					else {
						return res;
					}

				}).catch(e => {
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					throw e;
				});
			}

			else if (type === "delete") {
				dispatch(addApiTask(apiTask));
				if (cache) {
					dispatch(removeResponseCache(key));
				}
				return await ApiServiceInstance.deleteRecordById(id).then(res => {
					if (cache) {
						let { data, ...rest } = res.body;
						dispatch(setResponseCache(key, rest));
						//dispatch(setDataCache(key, res.body));
					}
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					return res;
				}).catch(e => {
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					throw e;
				});
			}

			else if (type === "search") {
				dispatch(addApiTask(apiTask));
				if (cache) {
					dispatch(removeResponseCache(key));
				}
				let searchKeyword = "";
				if (JSON.isJSON(params) && (String.isString(params.q) || String.isString(params.query))) {
					searchKeyword = String.isString(params.q) ? params.q : params.query;
					searchKeyword = searchKeyword.trim();
				}

				if (searchKeyword !== "") {
					if (cache) {
						let search_history = Array.isArray(state.cache.data.search_history) ? state.cache.data.search_history : [];
						search_history.unshift(searchKeyword);

						let unique_search_history = search_history.unique();
						dispatch(setDataCache("search_history", unique_search_history));
					}
					return await ApiServiceInstance.searchGlobally(searchKeyword).then(res => {
						if (cache) {
							let { data, ...rest } = res;
							dispatch(setResponseCache(key, rest));
						}
						if (!silent) {
							dispatch(removeApiTask(apiTask));
						}
						return res.data;
					}).catch(e => {
						if (!silent) {
							dispatch(removeApiTask(apiTask));
						}
						throw e;
					});
				}
				else {
					if (!silent) {
						dispatch(removeApiTask(apiTask));
					}
					return [];
				}

			}
		}
	}
	if (action) {
		if (action.type === API_CALL_REQUEST) {
			return executeRequest();
		} else {
			next(action);
		}
	}

};

export default api;
