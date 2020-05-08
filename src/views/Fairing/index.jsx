/** @format */

import React from "react";
import { connect } from "react-redux";
import { items as drawer_items } from "config/ui/drawer";
import DashboardRoutes from "routes/Dashboard";
import LandingPageRoutes from "routes/LandingPageRoutes";
import {withGlobals} from "contexts/Globals";
import {
	Dashboard as DashboardLayout,
	Frontend as FrontendLayout,
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
		this.indexUri = Array.isArray(nav.entries)
			? nav.entries.length > 0
				? nav.entries[nav.entries.length - 1].uri
				: "/home".toUriWithDashboardPrefix()
			: "/home".toUriWithDashboardPrefix();
		this.initSocketsEvents();
	}

	initSocketsEvents(){
		const { auth, definations, sockets, services, models, cache: { data: dataCache }, api, app, apiCallRequest, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser } = this.props;

		if (sockets && sockets.default) {
			if (auth.isAuthenticated) {
				sockets.default.on("create", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					let cacheData = defination.cache;
					if (defination) {
						if (["preferences", "settings"].includes(defination.name)) {
							if (defination.name === "settings") {
								if (action.catalyst !== auth.user._id && !action.result.private) {
									let newSettings = {[action.result.slug]: action.result.value};
									setSettings(newSettings);
								}
							}
							else if (defination.name === "preferences") {
								if (action.catalyst !== auth.user._id) {
									if (( JSON.isJSON(action.result.user) && action.result.user._id === auth.user._id ) || action.result.user === auth.user._id) {
										let newPreferences = {[action.result.slug]: action.result.value};
										setPreferences(newPreferences);
									}
								}															
							}
						}
						
						else if (cacheData && defination.access.view.single(auth.user, action.result)) {
							let newDataCache = Array.isArray(dataCache[defination.name])? dataCache[defination.name] : [];
							newDataCache.unshift(action.result);
							setDataCache(defination.name, newDataCache);
							let aggregatesApiCallRequest = api[defination.name + "_aggregates"];
							if (aggregatesApiCallRequest) {
								apiCallRequest(defination.name + "_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache );
							}
						}
					}
				});

				sockets.default.on("update", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					let cacheData = defination.cache;

					if (defination) {
						if (["users", "preferences", "settings"].includes(defination.name)) {
							if (defination.name === "users") {
								if (action.result._id === auth.user._id) {
									setCurrentUser(action.result);
								}
							}
							else if (defination.name === "settings") {
								if (action.catalyst !== auth.user._id && !action.result.private) {
									let newSettings = {[action.result.slug]: action.result.value};
									setSettings(newSettings);
								}
							}
							else if (defination.name === "preferences") {
								if (action.catalyst !== auth.user._id) {
									if (( JSON.isJSON(action.result.user) && action.result.user._id === auth.user._id ) || action.result.user === auth.user._id) {
										let newPreferences = {[action.result.slug]: action.result.value};
										setPreferences(newPreferences);
									}
								}
																
							}
						}
									
						else if (cacheData) {
							let newDataCache = Array.isArray(dataCache[defination.name])? dataCache[defination.name]: [];
							if (newDataCache.length > 0) {
								let cacheEntryFound = false;
								newDataCache = newDataCache.map((cacheEntry, index) => {
									if (cacheEntry._id === action.record) {
										cacheEntryFound = true;
										return action.result;
									} else {
										return cacheEntry;
									}
								});
								if (!cacheEntryFound) {
									if ( defination.access.view.single(auth.user, action.result)) {
										newDataCache.unshift(action.result);
									}
								}
							}
							setDataCache(defination.name, newDataCache);
							let aggregatesApiCallRequest = api[defination.name + "_aggregates"];
							if (aggregatesApiCallRequest) {
								apiCallRequest(defination.name + "_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache );
							}
						}
					}
				});

				sockets.default.on("delete", async ({ context, action }) => {
					let defination = definations[JSON.keyOf(models, context)];
					if (defination) {
						if (defination.cache) {
							let newDataCache = Array.isArray( dataCache[defination.name] )? dataCache[defination.name] : [];
							if (newDataCache.length > 0) {
								newDataCache = newDataCache.filter((cacheEntry, index) => {
									if (cacheEntry._id === action.record) {
										return false;
									}
									return true;
								});
							}
							setDataCache(defination.name, newDataCache);
							let aggregatesApiCallRequest = api[defination.name + "_aggregates"];
							if (aggregatesApiCallRequest) {
								apiCallRequest( defination.name + "_aggregates", aggregatesApiCallRequest.options, aggregatesApiCallRequest.cache );
							}
						}
					}
				});
			}

				

			sockets.default.on("settings", async (settings) => {
				//console.log("\n\n socket settings", settings);
				setSettings(settings);
			});

			sockets.default.on("connect", () => {
				if (auth.isAuthenticated) {
					sockets.default.emit("set-identity", auth.user._id);
					sockets.default.on("identity-set", async (profile) => {
						if (auth.isAuthenticated) {
							setCurrentUser(profile);
						}
					});

					sockets.default.on("presence-changed", async (profile) => {
						if (auth.isAuthenticated) {
							setCurrentUser(profile);
						}
					});

					sockets.default.on("profile-changed", async (profile) => {
						if (auth.isAuthenticated) {
							setCurrentUser(profile);
						}
					});
				}
				sockets.default.emit("get-settings", {user: auth.user});
			});
		}
			
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.key !== this.props.location.key) {
			this.setState({ routes_key: nextProps.location.key });
		}
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
			setDashboardAppBarDisplayed(true);
			setDashboardDrawerDisplayed(true);
			//setDashboardFooterDisplayed(true);

			return (
				<DashboardLayout sidebar_items={drawer_items}>
					<DashboardRoutes
						indexUri={this.indexUri}
						contexts={this.contexts}
						key={"routes" + this.state.routes_key}
					/>
				</DashboardLayout>
			);
		} else {
			return (
				<FrontendLayout {...this.layoutProps}>
					<LandingPageRoutes />					
				</FrontendLayout>
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
