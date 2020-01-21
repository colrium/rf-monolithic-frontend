import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import api from "./api";
import auth from "./auth";
import cache from "./cache";
import device from "./device";
import sockets from "./sockets";
import nav from "./ui/nav";
import dashboard from "./ui/layouts/Dashboard";
import landingpage from "./ui/layouts/LandingPage";
import dialog from "./dialog";
import ecommerce from "./ecommerce";

export default combineReducers({ api, auth, cache, device, dialog, sockets, nav, dashboard, landingpage, form, ecommerce });
