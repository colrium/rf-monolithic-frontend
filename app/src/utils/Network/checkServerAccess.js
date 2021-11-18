import makeHttpRequest from './makeHttpRequest';
import {
	DEFAULT_HTTP_METHOD,
	DEFAULT_PING_SERVER_URL,
	DEFAULT_TIMEOUT,
	DEFAULT_CUSTOM_HEADERS,
} from './constants';


const DEFAULT_ARGUMENTS = {
	timeout: DEFAULT_TIMEOUT,
	url: DEFAULT_PING_SERVER_URL,
	method: DEFAULT_HTTP_METHOD,
	customHeaders: DEFAULT_CUSTOM_HEADERS,
};
export default function checkServerAccess(args){
	const {timeout, url, method, customHeaders} = JSON.merge(DEFAULT_ARGUMENTS, args);
	return new Promise((resolve, reject) => {
		makeHttpRequest({ method, url, timeout, customHeaders}).then(()=>{
			resolve(true)
		}).catch(err => {
			resolve(false);
		})
	});
}
