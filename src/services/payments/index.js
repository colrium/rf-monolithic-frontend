/* eslint-disable */
import ApiService from 'services/api';

class PaymentsApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'payments';
	}

	async gatewayData(data){
		let endpoint_uri = this.service_uri+"/gateway";
		let that = this;
		return await this.apiInstance.post(endpoint_uri, data)
								.then(function (response) {
									let resobj = {
													err: false,
													body: response.data,
													code: response.status,
													headers: response.headers,
												};
									return resobj;
								})
								.catch(function (error) {
									that.handleRequestError(error);
								});
	}
}
export default new PaymentsApiService();