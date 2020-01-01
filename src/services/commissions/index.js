/* eslint-disable */
import ApiService from 'services/api';


class CommissionsApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'commissions';
	}
	
}

export default new CommissionsApiService();