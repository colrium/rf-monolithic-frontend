/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class CouponsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "coupons";
	}
}

export default new CouponsApiService();
