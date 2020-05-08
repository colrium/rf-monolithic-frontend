/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class FulfilmentsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "retail/fulfilments";
	}
}

export default new FulfilmentsApiService();
