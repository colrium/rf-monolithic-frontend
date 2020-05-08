/** @format */

import React, { Component, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
//
import Route from "./Route";
import asyncComponent from "views/widgets/asyncComponent";
import { builderIO } from "config";
// Routes components

const NotFound = asyncComponent(() => import("views/pages/System/NotFound"));
const Preferences = asyncComponent(() =>
	import("views/pages/Dashboard/Preferences")
);
const Settings = asyncComponent(() => import("views/pages/Dashboard/Settings"));
const RecordForm = asyncComponent(() =>
	import("views/pages/Dashboard/RecordForm")
);
const RecordsListing = asyncComponent(() =>
	import("views/pages/Dashboard/RecordsListing")
);
const RecordView = asyncComponent(() =>
	import("views/pages/Dashboard/RecordView")
);
const Account = asyncComponent(() => import("views/pages/Dashboard/Account"));
const PageBuilder = asyncComponent(() =>
	import("views/pages/Dashboard/PageBuilder")
);
const Dashboard = asyncComponent(() => import("views/pages/Dashboard/Home"));

export default class DashboardRoutes extends Component {
	render() {
		const { contexts, indexUri } = this.props;
		return (
			<Switch>
				<Redirect
					exact
					from={"/".toUriWithDashboardPrefix()}
					to={indexUri}
				/>
				<Route
					path={"/home".toUriWithDashboardPrefix()}
					component={Dashboard}
					authRestrict
				/>
				<Route
					exact
					path={"/calendar".toUriWithDashboardPrefix()}
					component={RecordsListing}
					componentProps={{ context: "events" }}
					authRestrict
				/>

				{contexts.map((context, cursor) => (
					<Route
						exact
						path={context.toUriWithDashboardPrefix()}
						component={RecordsListing}
						componentProps={{ context: context }}
						key={"context-route-" + context}
						authRestrict
					/>
				))}

				{contexts.map((context, cursor) => (
					<Route
						exact
						path={(
							context + "/view/:id"
						).toUriWithDashboardPrefix()}
						component={RecordView}
						componentProps={{ context: context }}
						key={"context-view-route-" + context}
						authRestrict
					/>
				))}

				{contexts.map((context, cursor) => (
					<Route
						exact
						path={(context + "/add").toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: context }}
						key={"context-add-route-" + context}
						authRestrict
					/>
				))}

				{contexts.map((context, cursor) => (
					<Route
						exact
						path={(
							context + "/edit/:id"
						).toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: context }}
						key={"context-edit-route-" + context}
						authRestrict
					/>
				))}

				<Route
					path={"/page-builder".toUriWithDashboardPrefix()}
					component={PageBuilder}
					authRestrict
				/>

				<Route
					path={"/account".toUriWithDashboardPrefix()}
					component={Account}
					authRestrict
				/>
				<Route
					path={"/preferences".toUriWithDashboardPrefix()}
					component={Preferences}
					authRestrict
				/>
				<Route
					path={"/settings".toUriWithDashboardPrefix()}
					component={Settings}
					authRestrict
				/>

				<Route
					path={"/*".toUriWithDashboardPrefix()}
					component={NotFound}
				/>
			</Switch>
		);
	}
}
