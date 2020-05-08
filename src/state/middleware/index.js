/** @format */

import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import api from "./api";
import { logRedux } from "config";
import { createLogger } from "redux-logger";

const logger = createLogger({});

let middleWare = null;
if (logRedux) {
	middleWare = applyMiddleware(thunk, api,  logger);
} else {
	middleWare = applyMiddleware(thunk, api );
}

export default middleWare;
