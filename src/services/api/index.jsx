/**
 * /* eslint-disable
 *
 * @format
 */

import api from "services/backend";

const ApiServiceClass = (function () {
	class ApiService {
		ready = false;

		constructor(service_uri = "") {
			
			this.useRedux = false;
			this.service_uri = service_uri;
			this.apiInstance = this.endpoint();
			
		}
		setAuthorizationToken() {}

		endpoint() {
			let axios_instance = api;
			if (api) {
				axios_instance = api;
				this.base_url = api.endpoint();
			}
			return axios_instance;
		}

		refresh(){
			this.apiInstance = this.endpoint();
		}
		
		resetService(){
			this.apiInstance = this.endpoint();
		}

		setServiceUri(service_uri) {
			if (service_uri.startsWith("/")) {
				let last_index = service_uri.length - 1;

				service_uri = service_uri.substring(1);
			}
			this.service_uri = service_uri;
		}

		handleRequestError(error) {
	        let resobj = {
				msg: "Request Error: ",
				body: null,
				code: 400,
				status: 400,
				headers: null,
			};
	        if (error.response) {

				resobj = {
					msg: error.response.statusText,
					body: error.response.data,
					code: error.response.status,
					status: error.response.status,
					headers: error.response.headers,
				};
				if (error.response.data) {
					if (error.response.data.message) {
						resobj.msg = error.response.data.message;
					}
				}
			} else if (error.request) {
				resobj = {
					msg: "Request Error: " + error.message,
					body: null,
					code: 500,
					status: 500,
					headers: null,
				};
			}
	        throw resobj;
	    }

		async getRecords(params) {
			let endpoint_uri = this.service_uri;
			let that = this;
			return await this.apiInstance
				.get(endpoint_uri, { params: params })
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async get(params) {
			let endpoint_uri = this.service_uri;
			let that = this;
			return await this.apiInstance
				.get(endpoint_uri, { params: params })
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async getRecordsCount(params) {
			let endpoint_uri = this.service_uri + "/count";
			let that = this;
			return await this.apiInstance
				.get(endpoint_uri, { params: params })
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async getAggregatesCount(params) {
			let endpoint_uri = this.service_uri + "/count/aggregates";
			let that = this;
			return await this.apiInstance
				.get(endpoint_uri, { params: params })
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async getRecordById(id, params) {
			let endpoint_uri = this.service_uri;
			let that = this;
			return await this.apiInstance
				.get(endpoint_uri + "/" + id, { params: params })
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async create(data) {
			let endpoint_uri = this.service_uri;
			let that = this;
			return await this.apiInstance
				.post(endpoint_uri, data)
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async update(id, data, params = {}) {
			let endpoint_uri = this.service_uri + "/" + id;
			let that = this;
			return await this.apiInstance
				.put(endpoint_uri, data, { params: params })
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async post(data) {
			let endpoint_uri = this.service_uri;
			let that = this;
			return await this.apiInstance
				.post(endpoint_uri, data)
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async put(data, params = {}) {
			let endpoint_uri = this.service_uri;
			let that = this;
			return await this.apiInstance
				.put(endpoint_uri, data, { params: params })
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						status: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		

		async delete(id) {
			let endpoint_uri = this.service_uri + "/" + id;
			let that = this;
			return await this.apiInstance
				.delete(endpoint_uri)
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async searchGlobally(query) {
			let endpoint_uri = "/search";
			let that = this;
			return await this.apiInstance
				.get(endpoint_uri, {q: query})
				.then(function(response) {
					return {
						err: false,
						body: response.data,
						code: response.status,
						headers: response.headers,
					};
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}
	}

	return ApiService
})();
export default ApiServiceClass;
