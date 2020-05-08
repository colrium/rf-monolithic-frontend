/** @format */

import React, { Component } from "react";
import { Redirect, Switch } from "react-router-dom";
//
import Route from "./Route";
import ProgressIndicator from "components/ProgressIndicator";
// Route components
import Fairing from "views/Fairing";
import Login from "views/pages/System/Login";
import NotFound from "views/pages/System/NotFound";

const RouteComponentPlaceHolder = () => (
	<ProgressIndicator type="logo" size={200} />
);

export default class Routes extends Component {
	render() {
		return (
			<Switch>
				<Route
					path={"/".toUriWithLandingPagePrefix()}
					component={Fairing}
					placeholder={<RouteComponentPlaceHolder />}
					componentProps={{
						routing: "landingpage",
						layout: "frontend",
						layoutProps: { showHeader: true, showFooter: true },
					}}
				/>
				<Route
					path={"/".toUriWithDashboardPrefix()}
					component={Fairing}
					placeholder={<RouteComponentPlaceHolder />}
					componentProps={{ layout: "dashboard" }}
					authRestrict
				/>
				<Route
					path="/login"
					component={Login}
					placeholder={<RouteComponentPlaceHolder />}
				/>
				<Route
					path="/signin"
					component={Login}
					placeholder={<RouteComponentPlaceHolder />}
				/>
				<Route path="/" entry entryPaths={{unauthenticated: "/recruitment".toUriWithLandingPagePrefix(), authenticated: "/home".toUriWithDashboardPrefix() }} />
				<Route
					path="*"
					component={NotFound}
					placeholder={<RouteComponentPlaceHolder />}
				/>
			</Switch>
		);
	}
}
