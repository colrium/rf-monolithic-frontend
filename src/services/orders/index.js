/* eslint-disable */
import ApiService from 'services/api';


class OrdersApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'retail/orders';
	}

	async makeOrder(data){
		let endpoint_uri = this.service_uri+"/make";
		let that = this;
		return await this.apiInstance.post(endpoint_uri, data).then(function (response) {
			return  {
					err: false,
					body: response.data,
					code: response.status,
					headers: response.headers,
			};
		}).catch(function (error) {
			that.handleRequestError(error);
		});
	}
}

export default new OrdersApiService();