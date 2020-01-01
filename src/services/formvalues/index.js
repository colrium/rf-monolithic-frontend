/* eslint-disable */
import ApiService from 'services/api';


class FormValuesApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'forms-values';
	}
	
}

export default new FormValuesApiService();