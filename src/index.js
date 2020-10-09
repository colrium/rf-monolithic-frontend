/** @format */

import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";

//import prototype extensions file so as is available globally
import "assets/js/extensions";
import "./index.css";

import App from "./App";

import * as serviceWorker from "./serviceWorker";
import store from "state/store";

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);

serviceWorker.unregister();
