/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class UsersApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "users";
	}
}

export default new UsersApiService();
