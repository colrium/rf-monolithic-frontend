/** @format */

import Auth from "hoc/Auth";
import AuthService from "services/auth";
import { authTokenLocation } from "config";
import {
	SET_AUTHENTICATED,
	SET_ACCESS_TOKEN,
	SET_USER,
	clearAppState,
} from "state/actions";

export function setAuthenticated(authenticated) {
	return {
		type: SET_AUTHENTICATED,
		authenticated,
	};
}

export function setAccessToken(token) {
	return {
		type: SET_ACCESS_TOKEN,
		token,
	};
}

export function setCurrentUser(user) {
	return {
		type: SET_USER,
		user,
	};
}

export function updateCurrentUser(user) {
	return {
		type: SET_USER,
		user,
	};
}

export function logout() {
	return dispatch => {
		Auth.getInstance().setAccessToken(null);
		dispatch(clearAppState());
		AuthService.reset();
		//Do not call this on logout because views will update too
		//dispatch(setCurrentUser({}));
	};
}

export function login(data) {
	return dispatch => {
		return AuthService.login(data)
			.then(async res => {
				let dataObj = {
					access_token: res.body.data,
					user: false,
				};
				Auth.getInstance().setAccessToken(res.body.data);
				AuthService.reset();
				let user = await AuthService.profile()
					.then(prof_res => {
						return prof_res.body.data;
					})
					.catch(err => {
						console.log(
							"login action AuthService.profile() err",
							err
						);
						throw err;
					});
				if (JSON.isJSON(user)) {
					dataObj.user = user;
				}
				return dataObj;
			})
			.catch(err => {
				console.log("login action AuthService.login() err", err);
				throw err;
			});
	};
}
