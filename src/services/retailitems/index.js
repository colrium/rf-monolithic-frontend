/* eslint-disable */
import ApiService from 'services/api';


class InvoiceItemsApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'retail/items';
	}
	
}

export default new InvoiceItemsApiService();