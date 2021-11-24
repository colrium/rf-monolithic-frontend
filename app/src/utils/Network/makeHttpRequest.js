import {
	DEFAULT_HTTP_METHOD,
	DEFAULT_PING_SERVER_URL,
	DEFAULT_TIMEOUT,
	CACHE_HEADER_VALUE,
	DEFAULT_CUSTOM_HEADERS,
} from './constants';




export const headers = {
	'Cache-Control': CACHE_HEADER_VALUE,
	'Pragma': 'no-cache',
	'Expires': '0',
};

/**
 * Utility that promisifies XMLHttpRequest in order to have a nice API that supports cancellation.
 * @param method
 * @param url
 * @param timeout -> Timeout for rejecting the promise and aborting the API request
 * @param testMethod: for testing purposes
 * @param customHeaders: headers received from user configuration.
 * @returns {Promise}
 */

const DEFAULT_OPTIONS = {
	method: DEFAULT_HTTP_METHOD,
	url: DEFAULT_PING_SERVER_URL,
	timeout: DEFAULT_TIMEOUT,
	customHeaders: DEFAULT_CUSTOM_HEADERS,
};
export default function makeHttpRequest(args) {
	const { method, url, timeout, customHeaders, testMethod } = JSON.merge(DEFAULT_OPTIONS, args);
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest(testMethod);
		xhr.open(method, url);
		xhr.timeout = timeout;
		xhr.onload = function onLoad() {

			// 3xx is a valid response for us, since the server was reachable
			if (xhr.status >= 200 && xhr.status < 400) {
				resolve({ status: xhr.status });
			} else {
				reject({ status: xhr.status });
			}
		};
		xhr.onerror = function onError() {
			reject({ status: xhr.status });
		};
		xhr.ontimeout = function onTimeOut() {
			reject({ status: xhr.status });
		};

		const combinedHeaders = { ...headers, ...customHeaders };
		Object.keys(combinedHeaders).forEach(key => {
			xhr.setRequestHeader(key, combinedHeaders[key]);
		});
		xhr.send(null);
	});
}
