/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class AnswersApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "training/answers";
	}
}

export default new AnswersApiService();
