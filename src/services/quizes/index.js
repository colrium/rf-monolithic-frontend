/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class QuizesApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "training/quizes";
	}
}

export default new QuizesApiService();
