/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class ResultsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "training/results";
	}
}

export default new ResultsApiService();
