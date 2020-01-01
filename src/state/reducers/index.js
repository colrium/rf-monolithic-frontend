import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import auth from "./auth";
import device from "./device";
import sockets from "./sockets";
import nav from "./ui/nav";
import dashboard from "./ui/layouts/Dashboard";
import landingpage from "./ui/layouts/LandingPage";
import dialog from "./dialog";

export default combineReducers({ device, sockets, auth, nav, dashboard, dialog, landingpage, form });
