/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class EventsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "events";
	}
}

export default new EventsApiService();
