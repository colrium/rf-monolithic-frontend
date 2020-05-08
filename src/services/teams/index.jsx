/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class TeamsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "teams";
	}
}

export default new TeamsApiService();
