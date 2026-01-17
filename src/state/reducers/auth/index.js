import {
	SET_AUTHENTICATED,
	SET_TOKEN,
	SET_USER,
} from "state/actions/types";

async function initialState() {
	let initial_state = {
		isAuthenticated: false,
		token: {},
		user: {},
	};
	return initial_state;
}

function sanitizeUser(user) {
	let parsedUser = {};
	if (user) {
		parsedUser = user;
		if (Object.keys(user).length > 0) {
			delete parsedUser.login_attempts;
			delete parsedUser.account_verifacation_mode;
			delete parsedUser.password_reset_code;
			delete parsedUser.account_verifacation_code;
			delete parsedUser.password_reset_code_expiration;
			delete parsedUser.provider_account_id;
			delete parsedUser.password;
			delete parsedUser.__v;
			delete parsedUser.last_login_attempt;


			const isOwner = Array.isArray(user?.role)
				? user?.role.includes("owner")
				: user?.role == "owner";
			const isDebugger = Array.isArray(user?.role)
				? user?.role.includes("debugger")
				: user?.role == "debugger";
			const isSuperAdmin = Array.isArray(user?.role)
				? user?.role.includes("superadmin")
				: user?.role == "superadmin";
			const isAdmin =
				isOwner ||
				isDebugger ||
				isSuperAdmin ||
				(Array.isArray(user?.role)
					? user?.role.includes("admin")
					: user?.role == "admin");
			const isCustomer = Array.isArray(user?.role)
				? user?.role.includes("customer")
				: user?.role == "customer";
			const isCollector = Array.isArray(user?.role)
				? user?.role.includes("collector")
				: user?.role == "collector";

			if (isOwner) {
				parsedUser.isOwner = isOwner;
			}

			if (isDebugger) {
				parsedUser.isDebugger = isDebugger;
			}

			if (isSuperAdmin) {
				parsedUser.isSuperAdmin = isSuperAdmin;
			}

			if (isAdmin) {
				parsedUser.isAdmin = isAdmin;
			}

			if (isCustomer) {
				parsedUser.isCustomer = isCustomer;
			}

			if (isCollector) {
				parsedUser.isCollector = isCollector;
			}
		}
	}
	return parsedUser;
}

export default (state = initialState(), action = {}) => {
	switch (action.type) {
		case SET_AUTHENTICATED:
			return {
				...state,
				isAuthenticated: action.authenticated ? true : false,
			};
		case SET_TOKEN:
			return {
				...state,
				token: JSON.isJSON(action.token) ? action.token : {},
			};
		case SET_USER:
			return {
				...state,
				user: sanitizeUser(action.user),
			};
		default:
			return state;
	}
};
