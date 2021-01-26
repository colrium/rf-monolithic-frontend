/** @format */

import axios from "axios";
import { DEFAULT } from "config/api";
import Auth from "hoc/Auth";

class AuthApiService {
	base_url = DEFAULT;
	service_uri = "";
	constructor() {
		this.apiInstance = this.endpoint();
	}

	endpoint() {
		let base_url = this.base_url;
		let axios_instance = axios.create({
			baseURL: base_url,
			//withCredentials: true,
			headers: {
				...Auth.getInstance().authorization_header(),
			},
		});
		return axios_instance;
	}

	reset(){
		this.apiInstance = this.endpoint();
	}

	handleRequestError(error) {
		let resobj = {
			err: {
				code: 400,
				msg: "Request Failed ",
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
		} else if (error.request) {
			resobj = {
				err: {
					code: 500,
					msg: "Request Error: " + error.message,
				},
				body: null,
				code: 500,
				headers: null,
			};
		}

		console.error("Request Error", resobj);

		let request_error = resobj.err;
		throw request_error;
	}

	async login(data) {
		let that = this;
		data.client_id = process.env.REACT_APP_CLIENT_ID;
		data.client_secret = process.env.REACT_APP_CLIENT_SECRET;
		data.grant_type = "password";
		return await this.apiInstance
			.post("login", data)
			.then(response => {
				let resobj = {
					err: false,
					body: response.data,
					code: response.status,
					headers: response.headers,
				};

				this.apiInstance = axios.create({
					baseURL: that.base_url,
					withCredentials: true,
					headers: {
						...Auth.getInstance().authorization_header(),
					},
				});
				return resobj;
			})
			.catch(function(error) {
				console.log("Auth error", error);
				Auth.getInstance().removeAuthToken();
				Auth.getInstance().setAuthorizationHeader(false);
				that.apiInstance = that.endpoint();
				that.handleRequestError(error);
			});
	}

	async profile(data = {}) {
		let that = this;
		return await this.apiInstance
			.get("profile", data)
			.then(function(response) {
				let resobj = {
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

	async update_profile(data = {}) {
		let that = this;
		return await this.apiInstance
			.post("profile", data)
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

	async signup(data) {
		let that = this;
		return await this.apiInstance
			.post("signup", data)
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

	async logout() {
		let that = this;
		return await this.endpoint()
			.get("logout")
			.then(function(response) {
				Auth.getInstance().removeAuthToken();
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

	async logout_all() {
		let that = this;
		return await this.endpoint()
			.get("logout/all")
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
				Auth.getInstance().removeAuthToken();
				that.handleRequestError(error);
			});
	}

	async forgotPassword(data) {
		let that = this;
		return await this.apiInstance
			.post("forgot-password", data)
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

	async resetPassword(data) {
		let that = this;
		return await this.apiInstance
			.post("reset-password", data)
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

	async verifyAccount(data) {
		let that = this;
		return await this.apiInstance
			.post("verify-account", data)
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

	async get_auth_token() {
		let that = this;
		return await this.apiInstance
			.get("token")
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

	async refresh_auth_token() {
		//ToDo:- Refresh token
		return new Promise((resolve, reject) => {});
	}
}

export default new AuthApiService();
