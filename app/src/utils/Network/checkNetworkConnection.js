import checkServerAccess from './checkServerAccess';
import { DEFAULT_PING_SERVER_URL, DEFAULT_TIMEOUT, DEFAULT_HTTP_METHOD, DEFAULT_CUSTOM_HEADERS } from './constants';

/**
 * Utility that allows to query for internet connectivity on demand
 * @param url
 * @param timeout
 * @param shouldPing
 * @param method
 * @returns {Promise<boolean>}
 */
export default async function checkNetworkConnection(url = DEFAULT_PING_SERVER_URL, timeout = DEFAULT_TIMEOUT, shouldPing = true, method = DEFAULT_HTTP_METHOD, customHeaders = DEFAULT_CUSTOM_HEADERS) {

	if (shouldPing) {
		const hasNetworkConnection = await checkServerAccess({ timeout, url, method, customHeaders });
		return hasNetworkConnection;
	}
	return connectionState.isConnected;
}
