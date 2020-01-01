/* eslint-disable */
import ApiService from 'services/api';


class DemoRequestsApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'demo-requests';
	}
	
}

export default new DemoRequestsApiService();