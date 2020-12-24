/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class QuestionsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "training/questions";
	}
}

export default new QuestionsApiService();
