/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class OrdersItemsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "/retail/order-items";
	}
}

export default new OrdersItemsApiService();
