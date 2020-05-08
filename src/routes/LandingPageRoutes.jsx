/** @format */

import React, { Component, lazy } from "react";
import { Redirect, Switch } from "react-router-dom";
//
import Route from "./Route";
import asyncComponent from "views/widgets/asyncComponent";
import ProgressIndicator from "components/ProgressIndicator";
// Routes components

const HomePage = asyncComponent(() => import("views/pages/LandingPage/Home"));
const RecruitmentPage = asyncComponent(() =>
	import("views/pages/LandingPage/Recruitment")
);
const ApplyPage = asyncComponent(() => import("views/pages/LandingPage/Apply"));
const Order = asyncComponent(() => import("views/pages/LandingPage/Order"));
const Cart = asyncComponent(() => import("views/pages/LandingPage/Cart"));
const Catalog = asyncComponent(() => import("views/pages/LandingPage/Catalog"));
const CatalogItem = asyncComponent(() =>
	import("views/pages/LandingPage/CatalogItem")
);
const Checkout = asyncComponent(() =>
	import("views/pages/LandingPage/Checkout")
);
const Thankyou = asyncComponent(() =>
	import("views/pages/LandingPage/Thankyou")
);
const NotFound = asyncComponent(() => import("views/pages/System/NotFound"));

export default class LandingPageRoutes extends Component {
	render() {
		return (
			<Switch>
				<Redirect
					exact
					from={"/".toUriWithLandingPagePrefix()}
					to={"/home".toUriWithLandingPagePrefix()}
				/>
				<Route
					exact
					path={"/home".toUriWithLandingPagePrefix()}
					component={HomePage}
				/>
				<Route
					exact
					path={"/recruitment".toUriWithLandingPagePrefix()}
					component={RecruitmentPage}
				/>
				<Route
					exact
					path={"/apply".toUriWithLandingPagePrefix()}
					component={ApplyPage}
				/>
				<Route
					exact
					path={"/order".toUriWithLandingPagePrefix()}
					component={Order}
				/>
				<Route
					exact
					path={"/catalog".toUriWithLandingPagePrefix()}
					component={Catalog}
				/>
				<Route
					exact
					path={"/catalog/:id".toUriWithLandingPagePrefix()}
					component={CatalogItem}
				/>
				<Route
					exact
					path={"/request-quote".toUriWithLandingPagePrefix()}
					component={Order}
				/>
				<Route
					exact
					path={"/cart".toUriWithLandingPagePrefix()}
					component={Cart}
				/>
				<Route
					exact
					path={"/checkout".toUriWithLandingPagePrefix()}
					component={Checkout}
				/>
				<Route
					exact
					path={"/thankyou".toUriWithLandingPagePrefix()}
					component={Thankyou}
				/>
				<Route
					path={"*".toUriWithLandingPagePrefix()}
					component={NotFound}
				/>
			</Switch>
		);
	}
}
