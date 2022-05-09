import ApiService from "services/Api";
import {
	SET_AUTHENTICATED,
	SET_TOKEN,
	SET_USER,
	clearAppState,
} from "state/actions";

export function setAuthenticated(authenticated) {
	return {
		type: SET_AUTHENTICATED,
		authenticated,
	};
}

export function setToken(token) {
	return {
		type: SET_TOKEN,
		token,
	};
}

export function setCurrentUser(user) {
	return {
		type: SET_USER,
		user,
	};
}

export function updateCurrentUser(profile) {
	return async (dispatch, getState) => {
		const { auth, user } = getState()
		if (auth.isAuthenticated) {
			dispatch(setCurrentUser(profile))
			let persistedServerUser = await ApiService.post("/profile", { ...user, ...profile })
				.then(res => {
					return res.body.data
				})
				.catch(err => {
					return false
				})
		}
	}
}

export function logout() {
	return dispatch => {
		return ApiService.logout().then(res => {}).catch(err => {
            throw err;
        });
	};

}

export function login(data) {
	return dispatch => {
		return ApiService.login(data).then(res => {
			return res;
		}).catch(err => {
            throw err;
        });
	};
}
