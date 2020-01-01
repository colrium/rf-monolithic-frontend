import React, { Component, lazy } from 'react';
import { Redirect, Switch } from "react-router-dom";
//
import Route from "./Route";
import asyncComponent from "views/widgets/asyncComponent";
import ProgressIndicator from "components/ProgressIndicator";
// Routes components

const HomePage = asyncComponent(() => import("views/pages/LandingPage/Home"));
const RecruitmentPage = asyncComponent(() => import("views/pages/LandingPage/Recruitment"));
const ApplyPage = asyncComponent(() => import("views/pages/LandingPage/Apply"));
const Order = asyncComponent(() => import("views/pages/LandingPage/Order"));
const NotFound = asyncComponent(() => import("views/pages/System/NotFound"));


export default class LandingPageRoutes extends Component {
	render() {
		return (
			<Switch>
				<Redirect exact from={"/".toUriWithLandingPagePrefix()} to={"/home".toUriWithLandingPagePrefix()} />
				<Route exact path={"/home".toUriWithLandingPagePrefix()} component={HomePage} />
				<Route exact path={"/recruitment".toUriWithLandingPagePrefix()} component={RecruitmentPage} />
				<Route exact path={"/apply".toUriWithLandingPagePrefix()} component={ApplyPage} />
				<Route exact path={"/order".toUriWithLandingPagePrefix()} component={Order} />
				<Route exact path={"/request-quote".toUriWithLandingPagePrefix()} component={Order} />				
				<Route path={"*".toUriWithLandingPagePrefix()} component={NotFound} />
			</Switch>
			
		);
	}
}