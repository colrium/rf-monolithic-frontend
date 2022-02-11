/** @format */

import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import api from "./api";
import { logRedux } from "config";
import { createLogger } from "redux-logger";

const logger = createLogger({});

let middleWare = null;
if (logRedux) {
	middleWare = applyMiddleware(thunk, api, logger)
	// middleWare = applyMiddleware(thunk, logger)
} else {
	middleWare = applyMiddleware(thunk, api)
	// middleWare = applyMiddleware(thunk)
}

export default middleWare;
