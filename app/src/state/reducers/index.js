import {
	CLEAR_APP_STATE
} from "state/actions";

import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import api from "./api";
import app from "./app";
import auth from "./auth";
import cache from "./cache";
import device from "./device";
import nav from "./ui/nav";
import dashboard from "./ui/layouts/Dashboard";
import landingpage from "./ui/layouts/LandingPage";
import dialog from "./dialog";
import ecommerce from "./ecommerce";
import communication from "./communication";
import forms from "./forms";


const combinedReducer = combineReducers({
	api,
	app,
	auth,
	cache,
	device,
	dialog,
	nav,
	dashboard,
	landingpage,
	form,
	forms,
	ecommerce,
	communication,
});
const appReducer = combineReducers((state = {}) => state);

const rootReducer = (state, action) => {
	if (action.type === CLEAR_APP_STATE) {
		// clear everything but keep the stuff we want to be preserved ..
		const { app } = state;
		state = { app };
		return combinedReducer(state, action);
	}
	return combinedReducer(state, action);
}

export default rootReducer;