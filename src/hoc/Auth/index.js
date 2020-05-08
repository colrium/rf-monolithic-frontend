/** @format */

import Cookies from "universal-cookie";
import axios from "axios";
import decode from "jwt-decode";
import {
	authTokenLocation,
	authTokenName,
	baseUrls,
	environment,
} from "../../config";

export default class Auth {
	static instance;
	access_token;
	access_token_valid = false;
	onAccessTokenChange = [(prev_access_token, access_token) => {}];

	constructor() {
		if (Auth.instance) {
			return Auth.instance;
		} else {
			if (authTokenLocation === "cookie") {
				let cookies = new Cookies();
				let access_token = cookies.get(authTokenName);
				let token_type = cookies.get(authTokenName + "_type");
				let refresh_token = cookies.get(
					authTokenName + "_refresh_token"
				);
				if (access_token && token_type) {
					this.access_token = {
						access_token: access_token,
						token_type: token_type,
						refresh_token: refresh_token,
					};
				}
			}
			this.access_token_valid = this.isAccessTokenValid();
			Auth.instance = this;
			return this;
		}
	}

	static newInstance() {
		Auth.instance = new Auth();
		return Auth.instance;
	}

	static destroyInstance() {
		console.log("destroyInstance() Auth.instance", Auth.instance);
		Auth.instance = undefined;
		return Auth.instance;
	}

	static getInstance() {
		if (!Auth.instance) {
			Auth.instance = new Auth();
		}

		return Auth.instance;
	}

	static getAuthCookies() {
		let cookies = new Cookies();
		let access_token = cookies.get(authTokenName);
		let token_type = cookies.get(authTokenName + "_type");
		let refresh_token = cookies.get(authTokenName + "_refresh_token");
		if (access_token && token_type) {
			return {
				access_token: access_token,
				token_type: token_type,
				refresh_token: refresh_token,
			};
		}
		return null;
	}

	setOnAccessTokenChange(onAccessTokenChange: Function) {
		this.onAccessTokenChange.push(onAccessTokenChange);
	}

	getAccessToken() {
		return this.access_token;
	}

	setAccessToken(access_token: any) {
		const prev_access_token = this.access_token;
		this.access_token = access_token;
		this.setAuthorizationHeader();
		this.access_token_valid = this.isAccessTokenValid();
		if (!JSON.isJSON(access_token)) {
			this.removeAuthToken();
		}
		if (this.onAccessTokenChange.length > 0) {
			this.onAccessTokenChange.forEach(method => {
				method(prev_access_token, access_token);
			});
		}
		return true;
	}

	get_auth_token() {
		let token = this.getAccessToken();
		return typeof token == "object" ? token.access_token : null;
	}

	removeAuthToken() {
		if (authTokenLocation === "cookie") {
			let cookies = new Cookies();
			cookies.remove(authTokenName);
			cookies.remove(authTokenName + "_type");
			cookies.remove(authTokenName + "_refresh_token");
		}
		this.access_token = null;
		this.setAuthorizationHeader();

		return true;
	}

	decode_auth_token(token = false) {
		let access_token = token;
		if (!token && JSON.isJSON(this.access_token)) {
			access_token = this.access_token.access_token;
		}
		if (typeof access_token === "string") {
			try {
				const payload = decode(access_token);
				return payload;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	isAccessTokenValid() {
		let token = this.access_token;
		let isValid = false;
		if (JSON.isJSON(token)) {
			//try to decode token
			try {
				const decodedToken: Object = decode(token.access_token);
				if (decodedToken != null) {
					isValid = true;
				}
			} catch (e) {
				console.log(e);
			}
		}

		return isValid;
	}

	authTokenSet() {
		return this.access_token_valid;
	}

	authorization_header() {
		let token = this.access_token;
		if (JSON.isJSON(token)) {
			return {
				Authorization:
					("token_type" in token ? token.token_type + " " : "") +
					("access_token" in token ? token.access_token : ""),
			};
		}
		return null;
	}

	setAuthorizationHeader() {
		if (JSON.isJSON(this.access_token)) {
			axios.defaults.withCredentials = false;
			if (
				"token_type" in this.access_token &&
				"access_token" in this.access_token
			) {
				axios.defaults.headers.common[
					"Authorization"
				] = `${this.access_token.token_type} ${this.access_token.access_token}`;
			}
		} else {
			axios.defaults.withCredentials = false;
			axios.defaults.headers.common["Authorization"] = "";
		}
		return true;
	}
}
