/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";

class ProposalRequestsApiService extends ApiService {
	constructor() {
		super();
		this.service_uri = "quote-requests";
	}
}

export default new ProposalRequestsApiService();
