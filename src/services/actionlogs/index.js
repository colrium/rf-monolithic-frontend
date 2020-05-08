/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class ActionLogsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "logs/actions";
	}
}

export default new ActionLogsApiService();
