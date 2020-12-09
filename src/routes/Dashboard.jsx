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

const Messages = asyncComponent(() =>
	import("views/pages/Dashboard/Messages")
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

				<Route
					exact
					path={"/messages".toUriWithDashboardPrefix()}
					component={Messages}
					authRestrict
				/>

				<Route
					exact
					path={"/chat".toUriWithDashboardPrefix()}
					component={Messages}
					authRestrict
				/>

				<Route
					exact
					path={"/chats".toUriWithDashboardPrefix()}
					component={Messages}
					authRestrict
				/>

				{Array.isArray(contexts) && contexts.map((context, cursor) => (
					<Route
						exact
						path={context.toUriWithDashboardPrefix()}
						component={RecordsListing}
						componentProps={{ context: context }}
						key={"context-route-" + context}
						authRestrict
					/>
				))}

				{Array.isArray(contexts) && contexts.map((context, cursor) => (
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



				{Array.isArray(contexts) && contexts.map((context, cursor) => (
					<Route
						exact
						path={(context + "/add").toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: context }}
						key={"context-add-route-" + context}
						authRestrict
					/>
				))}

				{Array.isArray(contexts) && contexts.map((context, cursor) => (
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

			

				{/*<Route
						path={"/training-courses".toUriWithDashboardPrefix()}
						component={RecordsListing}
						componentProps={{ context: "courses" }}
						authRestrict
				/>

				<Route
						exact
						path={"/training-courses/view/:id".toUriWithDashboardPrefix()}
						component={RecordView}
						componentProps={{ context: "courses" }}
						authRestrict
				/>

				<Route
						path={"/training-courses/add".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "courses" }}
						authRestrict
				/>

				<Route
						path={"/training-courses/edit/:id".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "courses" }}
						authRestrict
				/>


				<Route
						path={"/training-quizes".toUriWithDashboardPrefix()}
						component={RecordsListing}
						componentProps={{ context: "quizes" }}
						authRestrict
				/>

				<Route
						path={"/training-quizes/view/:id".toUriWithDashboardPrefix()}
						component={RecordView}
						componentProps={{ context: "quizes" }}
						authRestrict
				/>

				<Route
						path={"/training-quizes/add".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "quizes" }}
						authRestrict
				/>

				<Route
						path={"/training-quizes/edit/:id".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "quizes" }}
						authRestrict
				/>


				<Route
						path={"/training-questions".toUriWithDashboardPrefix()}
						component={RecordsListing}
						componentProps={{ context: "questions" }}
						authRestrict
				/>

				<Route
						path={"/training-questions/view/:id".toUriWithDashboardPrefix()}
						component={RecordView}
						componentProps={{ context: "questions" }}
						authRestrict
				/>

				<Route
						path={"/training-questions/add".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "questions" }}
						authRestrict
				/>

				<Route
						path={"/training-questions/edit/:id".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "questions" }}
						authRestrict
				/>

				<Route
						path={"/training-answers".toUriWithDashboardPrefix()}
						component={RecordsListing}
						componentProps={{ context: "answers" }}
						authRestrict
				/>

				<Route
						path={"/training-answers/view/:id".toUriWithDashboardPrefix()}
						component={RecordView}
						componentProps={{ context: "answers" }}
						authRestrict
				/>

				<Route
						path={"/training-answers/add".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "answers" }}
						authRestrict
				/>

				<Route
						path={"/training-answers/edit/:id".toUriWithDashboardPrefix()}
						component={RecordForm}
						componentProps={{ context: "answers" }}
						authRestrict
				/>*/}

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
