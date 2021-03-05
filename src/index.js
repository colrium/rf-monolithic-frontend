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
import {store} from "state/store";

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);
if ("serviceWorker" in navigator) {
	console.log("serviceWorker in navigator");
	navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`).then(function(registration) {
		console.log("Registration successful, scope is:", registration.scope);
    }).catch(function(err) {
		console.log("Service worker registration failed, error:", err);
    });
}
else {
	console.error("serviceWorker not in navigator");
}
serviceWorker.unregister();
