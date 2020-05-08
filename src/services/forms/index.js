/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class FormsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "forms";
	}
}

export default new FormsApiService();
