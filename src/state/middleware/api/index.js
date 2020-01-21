import {
	API_CALL_REQUEST,
	setApiCallLoading,
	setApiCallResponse,
	setApiCallComplete,
	setApiCallError,
	setDataCache,
} from "state/actions";
import ApiService from 'services/api';

const ApiServiceInstance = new ApiService();

const api = ({ dispatch, getState }) => next => (action) => {
	function onApiCallStart(action) {
		const { key } = action;
		dispatch(setApiCallLoading(key, true));
		dispatch(setApiCallComplete(key, false));
		dispatch(setApiCallError(key, null));
		dispatch(setApiCallResponse(key, null));
	}

	function onApiCallComplete(action, res, error){
		const { key, options, cache } = action;
		if (key && options) {
			if (error) {
				dispatch(setApiCallLoading(key, false));
				dispatch(setApiCallComplete(key, true));
				dispatch(setApiCallError(key, error));
				dispatch(setApiCallResponse(key, null));
			}
			else if (res) {
				dispatch(setApiCallLoading(key, false));
				dispatch(setApiCallComplete(key, true));
				dispatch(setApiCallError(key, null));
				dispatch(setApiCallResponse(key, res));
				if (cache) {
					dispatch(setDataCache(key, res.body.data));
				}
			}
			else {
				dispatch(setApiCallLoading(key, false));
				dispatch(setApiCallComplete(key, true));
				dispatch(setApiCallError(key, null));
			}		
		}
	}
	if (action.type === API_CALL_REQUEST) {
		const { key, options, cache } = action;
		if (key && options) {
			const { uri, type, params, data } = options;
			onApiCallStart(action);
			ApiServiceInstance.setServiceUri(uri);
			if (type === "records") {				
				ApiServiceInstance.getRecords(params).then(res => {
					onApiCallComplete(action, res, false)
				}).catch(e=>{
					onApiCallComplete(action, false, e);
				});
			}
			else if (type === "aggregates") {				
				ApiServiceInstance.getAggregatesCount(params).then(res => {
					onApiCallComplete(action, res, false);
				}).catch(e=>{
					onApiCallComplete(action, false, e);
				});
			}
		}
		next(action);

	}
	else{
		next(action);
	}
		
};

export default api;