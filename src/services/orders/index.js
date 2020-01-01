/* eslint-disable */
import ApiService from 'services/api';


class OrdersApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'retail/orders';
	}
	
}

export default new OrdersApiService();