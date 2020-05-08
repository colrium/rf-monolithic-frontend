/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class ResponsesApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "responses";
	}
}

export default new ResponsesApiService();
