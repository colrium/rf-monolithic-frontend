/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class QuizesApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "training-questions";
	}
}

export default new QuizesApiService();
