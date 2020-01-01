/* eslint-disable */
import ApiService from 'services/api';


class InvoicesApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'invoices';
	}
	
}

export default new InvoicesApiService();