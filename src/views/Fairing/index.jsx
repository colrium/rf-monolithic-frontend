/** @format */

import React from "react";
import { connect } from "react-redux";
import { items as drawer_items } from "config/ui/drawer";

import {withGlobals} from "contexts/Globals";

import DashboardRoutes from "routes/Dashboard";
import LandingPageRoutes from "routes/LandingPageRoutes";

import {
	Dashboard as DashboardLayout,
	LandingPage as LandingPageLayout,
} from "views/layouts";
import {
	apiCallRequest, 
	setDataCache, 
	setSettings, 
	setPreferences, 
	setInitialized, 
	setCurrentUser,
	setDashboardAppBarDisplayed,
	setDashboardDrawerDisplayed,
	setDashboardFooterDisplayed,
} from "state/actions";

import {withErrorHandler} from "hoc/ErrorHandler";

class Fairing extends React.Component {
	constructor(props) {
		super(props);
		const {
			nav,
			componentProps,
			match: { params },
		} = props;
		this.layout = componentProps.layout;
		this.layoutProps = componentProps.layoutProps;
		this.routing = componentProps.routing;

		this.state = { 
			routes_key: props.location.key,
			error: false, 
			errorInfo: null,
		};
		//this.initSocketsEvents();

		this.contexts = [
			"events",
			"notifications",
			"surveys",
			"queries",
			"commissions",
			"responses",
			"teams",
			"tracks",
			"invoices",
			"payments",
			"orders",
			"orderitems",
			"retailitems",
			"coupons",
			"currencies",
			"fulfilments",
			"vacancies",
			"applications",
			"users",
			"forms",
			"attachments",
			"actionlogs",
			"responses",
			"posts",
			"demorequests",
			"quoterequests",
		];
		this.indexUri = Array.isArray(nav.entries) ? (nav.entries.length > 0 ? nav.entries[nav.entries.length - 1].uri : "/home".toUriWithDashboardPrefix()) : "/home".toUriWithDashboardPrefix();
		
	}

	

	render() {
		const {
			nav,
			layout,
			setDashboardAppBarDisplayed,
			setDashboardDrawerDisplayed,
			setDashboardFooterDisplayed,
		} = this.props;

		if (this.layout == "dashboard") {
			//setDashboardAppBarDisplayed(true);
			//setDashboardDrawerDisplayed(true);
			//setDashboardFooterDisplayed(true);

			return (
				<DashboardLayout sidebar_items={drawer_items} >
					<DashboardRoutes
						indexUri={this.indexUri}
						contexts={this.contexts}
						key={"routes" + this.state.routes_key}
					/>
				</DashboardLayout>
			);
		} else {
			return (
				<LandingPageLayout {...this.layoutProps}>
					<LandingPageRoutes />					
				</LandingPageLayout>
			);
		}
	}
}
const mapStateToProps = state => ({
		
	api: state.api,
	app: state.app,
	auth: state.auth,
	cache: state.cache,
	nav: state.nav,
});

export default withGlobals(connect(mapStateToProps, {
	apiCallRequest, 
	setDataCache, 
	setSettings, 
	setPreferences, 
	setInitialized, 
	setCurrentUser,
	setDashboardAppBarDisplayed,
	setDashboardDrawerDisplayed,
	setDashboardFooterDisplayed,
})(withErrorHandler(Fairing)));
