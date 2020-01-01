/* eslint-disable */
import ApiService from 'services/api';


class VacanciesApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'recruitment/applications';
	}
}

export default new VacanciesApiService();