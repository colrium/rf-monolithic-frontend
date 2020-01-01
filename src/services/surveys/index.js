/* eslint-disable */
import ApiService from 'services/api';


class SurveysApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'surveys';
	}
	
}

export default new SurveysApiService();