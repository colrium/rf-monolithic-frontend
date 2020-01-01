/* eslint-disable */
import ApiService from 'services/api';


class CurrenciesApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'currencies';
	}
	
}

export default new CurrenciesApiService();