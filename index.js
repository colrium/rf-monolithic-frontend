import './wdyr';
import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";

//import prototype extensions file so as is available globally
import "assets/js/extensions";
import "./index.css";

import App from "App";

import * as  from "./serviceWorker";
import {store} from "state/store";


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`).then(function(registration) {}).catch(function(err) {});
	serviceWorker.register();
}
