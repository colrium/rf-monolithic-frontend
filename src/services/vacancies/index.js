/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class VacanciesApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "recruitment/vacancies";
	}
}

export default new VacanciesApiService();
