/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class PreferencesApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "preferences";
	}
}

export default new PreferencesApiService();
