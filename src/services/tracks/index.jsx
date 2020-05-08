/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class TracksApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "tracks";
	}
}

export default new TracksApiService();
