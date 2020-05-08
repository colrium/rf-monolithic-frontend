/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class QueriesApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "queries";
	}
}

export default new QueriesApiService();
