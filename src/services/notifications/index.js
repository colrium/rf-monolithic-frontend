/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class NotificationsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "notifications";
	}

	async markAllAsRead() {
		let endpoint_uri = this.service_uri + "/mark/all/read";
		let that = this;
		return await this.apiInstance
			.get(endpoint_uri, {})
			.then(function(response) {
				let resobj = {
					err: false,
					body: response.data,
					code: response.status,
					headers: response.headers,
				};
				return resobj;
			})
			.catch(function(error) {
				that.handleRequestError(error);
			});
	}
}

export default new NotificationsApiService();
