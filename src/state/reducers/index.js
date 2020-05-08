/** @format */

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

export default combineReducers({
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
	ecommerce,
});
