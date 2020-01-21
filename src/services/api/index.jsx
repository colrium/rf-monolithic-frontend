/* eslint-disable */
import axios from 'axios';
import { DEFAULT } from 'config/api';
import Auth from "utils/Auth";


class ApiService{
	base_url = DEFAULT;
	service_uri = '';
	useRedux = false;

	constructor(){
		this.apiInstance = this.endpoint();
	}
	setAuthorizationToken(){
		
	}

	endpoint(){
		let that = this;
		let axios_instance = axios.create({
			baseURL: that.base_url,
			withCredentials: true,
			headers: {
				...Auth.getInstance().authorization_header()
			},
		});
		return axios_instance;
	}
	setServiceUri(service_uri){
		if (service_uri.startsWith("/")) {
			let last_index = service_uri.length -1;

			service_uri = service_uri.substring(1);
		}
		this.service_uri = service_uri;
	}

	handleRequestError(error){
		let resobj = {
			err: {
				code: 400,
				msg: "Request Error: ",
			},
			body: null,
			code: 400,
			headers: null,
		};
		if (error.response) {
			resobj = {
					err: {
						code: error.response.status,
						msg: error.response.statusText,
					},
					body: error.response.data,
					code: error.response.status,
					headers: error.response.headers,
				};
			if (error.response.data) {
				if (error.response.data.message) {
					resobj.err.msg = error.response.data.message;
				}
			}
		} 
		else if (error.request) {
			resobj = {
					err: {
						code: 500,
						msg: "Request Error: "+error.message,
					},
					body: null,
					code: 500,
					headers: null,
				};
		} 
			
		let request_error = resobj.err;
		throw request_error;
	}

	async getRecords(params) {
		let endpoint_uri = this.service_uri;
		let that = this;
		return await this.apiInstance.get(endpoint_uri, {params: params}).then(function (response) {
			return {
				err: false,
				body: response.data,
				code: response.status,
				headers: response.headers,
			};
		}).catch(function (error) {
			that.handleRequestError(error);
		});

	}

	async getRecordsCount(params) {
		let endpoint_uri = this.service_uri+'/count';
		let that = this;
		return await this.apiInstance.get(endpoint_uri, {params: params}).then(function (response) {
			return {
				err: false,
				body: response.data,
				code: response.status,
				headers: response.headers,
			};
		}).catch(function (error) {
			that.handleRequestError(error);
		});
	}

	async getAggregatesCount(params) {
		let endpoint_uri = this.service_uri+'/count/aggregates';
		let that = this;
		return await this.apiInstance.get(endpoint_uri, {params: params}).then(function (response) {
			return {
				err: false,
				body: response.data,
				code: response.status,
				headers: response.headers,
			};
		}).catch(function (error) {
			that.handleRequestError(error);
		});
	}

	async getRecordById(id, params) {
		let endpoint_uri = this.service_uri;
		let that = this;
		return await this.apiInstance.get(endpoint_uri+'/'+id, {params: params}).then(function (response) {
			return {
				err: false,
				body: response.data,
				code: response.status,
				headers: response.headers,
			};
		}).catch(function (error) {
			that.handleRequestError(error);
		});
	}

	async create(data) {
		let endpoint_uri = this.service_uri;
		let that = this;
		return await this.apiInstance.post(endpoint_uri, data).then(function (response) {
			return {
				err: false,
				body: response.data,
				code: response.status,
				headers: response.headers,
			};
		})
		.catch(function (error) {
			that.handleRequestError(error);
		});
	}

	async update(id, data) {
		let endpoint_uri = this.service_uri+'/'+id;
		let that = this;
		return await this.apiInstance.put(endpoint_uri, data).then(function (response) {
			return {
				err: false,
				body: response.data,
				code: response.status,
				headers: response.headers,
			};
		}).catch(function (error) {
			that.handleRequestError(error);
		});
	}

	async delete(id) {
		let endpoint_uri = this.service_uri+'/'+id;
		let that = this;
		return await this.apiInstance.delete(endpoint_uri).then(function (response) {
			return {
				err: false,
				body: response.data,
				code: response.status,
				headers: response.headers,
			};
		}).catch(function (error) {
			that.handleRequestError(error);
		});
	}
}

export default ApiService;