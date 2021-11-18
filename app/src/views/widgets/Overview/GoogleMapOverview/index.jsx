/** @format */

import IconButton from "@mui/material/IconButton";
import classNames from "classnames";


import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Icon from '@mdi/react'
import { mdiForwardburger, mdiAccountCircleOutline, mdiFolderOutline } from '@mdi/js';
import Avatar from "components/Avatar";
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { withTheme } from '@mui/styles';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import React from "react";
import { connect } from "react-redux";
import { apiCallRequest, closeDialog, openDialog } from "state/actions";
import { withGlobals } from "contexts/Globals";
import compose from "recompose/compose";
import GoogleMap from "components/GoogleMap";
import Listings from "views/widgets/Listings";
import { SwitchInput } from "components/FormInputs";

import PropTypes from "prop-types";
import ApiService from "services/Api";



let googleMap = false;

let commission_status_colors = {
	scheduled: "#880e4f",
	ongoing: "#e65100",
	complete: "#4caf50",
	cancelled: "#b71c1c",
};

let track_timetype_colors = {
	live: "#4caf50",
	past: "#b71c1c",
};


const icon_names = ["female", "female_1", "female_2", "female_3", "female_4", "female_5", "female_6", "male", "male_1", "male_2", "male_3", "male_4", "male_5", "male_6", "them_1", "them_2", "them_3"];

class GoogleMapOverview extends React.Component {
	state = {
		definations: {},
		services: {},
		defination: null,
		service: null,
		drawerOpen: true,
		show_client_positions: true,
		clients_positions: {},
		context: "commissions",
		context_entry: null,
		defaultZoom: 10,
		multicontexts: true,
		rendered_contexts: [],
		contexts_props: {},
		zoom: 15,
		query: {},
		records: [],
		markers: [],
		circles: [],
		polylines: [],
	};

	constructor(props) {
		super(props);
		const { device, cache, context, contexts, definations, app } = this.props;
		this.elementRef = React.createRef();
		this.prepareForView();
		this.toggleDrawer = this.toggleDrawer.bind(this);

		this.handleOnLoadMap = this.handleOnLoadMap.bind(this);
		this.handleClientListItemClick = this.handleClientListItemClick.bind(this);
		this.handleOnToggleShowClients = this.handleOnToggleShowClients.bind(this);
		this.handleOnClientsPositionsLoaded = this.handleOnClientsPositionsLoaded.bind(this);
		this.handleOnClientPositionAvailable = this.handleOnClientPositionAvailable.bind(this);
		this.handleOnClientPositionUnavailable = this.handleOnClientPositionUnavailable.bind(this);
		this.handleOnClientPositionChanged = this.handleOnClientPositionChanged.bind(this);
		this.handleOnDrawerNavigationValueChange = this.handleOnDrawerNavigationValueChange.bind(this);
		this.handleContextEntryClick = this.handleContextEntryClick.bind(this);
		this.handleToggleContextRender = this.handleToggleContextRender.bind(this);

		this.state = {
			...this.state,
			//context: Object.keys(this.state.definations)[0],
			context: context ? context : this.state.context,
			defaultZoom: app.preferences.data.defaultMapZoom,
			multicontexts: Array.isArray(contexts) ? contexts.length > 1 : false,
			rendered_contexts: context ? [context] : [],
			contexts_props: context ? {
				[context]: {
					query: { page: 1, pagination: app.preferences.data.pagination, populate: 1 },
					element: "marker",
					records: [],
				}
			} : {},
			context_entries: Array.isArray(cache.data[this.state.defination.name]) ? cache.data[this.state.defination.name] : [],
			//drawerOpen: device.window_size.width >= 1280,
			drawerOpen: false,
		};
	}

	isMounted() {
		return this.elementRef.current != null;
	}

	componentDidMount() {
		//



	}

	prepareForView() {
		const { auth, definations, app } = this.props;
		let current_defination = null;
		let current_service = null;
		let possible_definations = {};
		let possible_services = {};
		let contexts_props = this.state.contexts_props;
		for (let [name, defination] of Object.entries(definations)) {
			if (!defination.access.restricted(auth.user)) {
				if (defination.views.listing.googlemapview && Function.isFunction(defination.views.listing.googlemapview.resolveData)) {
					possible_definations[name] = defination;
					possible_services[name] = ApiService.getContextRequests(defination.endpoint);
					contexts_props[name] = {
						query: { page: 1, pagination: app.preferences.data.pagination, populate: 1 },
						element: defination.views.listing.googlemapview.type,
						elements: [],
						loaded: false,
					}
					if (current_defination === null) {
						current_defination = defination;
						current_service = ApiService.getContextRequests(defination.endpoint);
					}
				}
			}
		}
		this.state.contexts_props = contexts_props;
		this.state.definations = possible_definations;
		this.state.services = possible_services;
		this.state.defination = current_defination;
		this.state.service = current_service;


	}



	toggleDrawer = (open) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		if (open !== this.state.drawerOpen) {
			this.setState(state => ({ drawerOpen: open }));
		}

	}

	handleOnToggleShowClients(event) {
		this.setState(state => ({ show_client_positions: !state.show_client_positions }));
	}

	handleOnLoadMap(map, google) {
		googleMap = map;

	}


	handleOnClientsPositionsLoaded(clients_positions) {
		this.setState(state => ({ clients_positions: clients_positions }));
	}

	handleOnClientPositionAvailable(clientId, client) {
		this.setState(prevState => ({ clients_positions: { ...prevState.clients_positions, [clientId]: client } }));

	}

	handleOnClientPositionUnavailable(socketId, client) {
		this.setState(prevState => {
			let newclientspositions = prevState.clients_positions;

			delete newclientspositions[socketId];

			return { clients_positions: newclientspositions }
		});
	}

	handleOnClientPositionChanged(socketId, client) {
		this.setState(state => {
			return { clients_positions: state.drawerOpen ? { ...state.clients_positions, [socketId]: client } : state.clients_positions }
		});

	}




	handleOnDrawerNavigationValueChange = (event, newValue) => {
		const { definations, services, cache } = this.props;
		this.setState(prevState => {
			let renderedContextIndex = prevState.rendered_contexts.indexOf(newValue);
			let rendered_contexts = renderedContextIndex !== -1 ? prevState.rendered_contexts : prevState.rendered_contexts.concat([newValue]);
			return {
				context: newValue,
				context_entry: null,
				context_entries: ["commissions", "tracks"].includes(newValue) ? (Array.isArray(cache.data[newValue]) ? cache.data[newValue] : []) : [],
				defination: ["commissions", "tracks"].includes(newValue) ? definations[newValue] : prevState.defination,
				service: ["commissions", "tracks"].includes(newValue) ? ApiService.getContextRequests(definations[newValue]) : prevState.service,
				rendered_contexts: rendered_contexts,
				context_entry_type: ["commissions", "tracks"].includes(newValue) ? definations[newValue].views.listing.googlemapview.type : "clients_positions",
			}
		});
	};

	handleClientListItemClick = (socketId, client) => event => {
		if (googleMap) {
			googleMap.panTo({ lat: client.position.latitude, lng: client.position.longitude });
			//googleMap.context.setZoom(15);
		}
	};

	handleToggleContextRender = (context, renderContext) => {
		const { definations, cache, apiCallRequest, app } = this.props;
		this.setState((prevState) => {
			let renderedContextIndex = prevState.rendered_contexts.indexOf(context);
			return {
				rendered_contexts: prevState.rendered_contexts.includes(context) ? prevState.rendered_contexts.removeAtIndex(renderedContextIndex) : prevState.rendered_contexts.concat([context]),
			}
		}, async () => {
			if (definations[context] && renderContext) {

				apiCallRequest(definations[context].name, {
					uri: definations[context].endpoint,
					type: "records",
					params: JSON.isJSON(this.state.contexts_props[context]) ? this.state.contexts_props[context].query : { page: 1, pagination: app.preferences.data.pagination, populate: 1 },
					data: {},
					cache: true,
				}).then(res => {
					const { data } = res.body;
					if (definations[context] && Function.isFunction(definations[context].views.listing.googlemapview.resolveData) && Array.isArray(data)) {
						definations[context].views.listing.googlemapview.resolveData(data, true).then(resolve => {
							if (this.isMounted()) {
								this.setState(prevState => ({
									context_entry_type: definations[context].views.listing.googlemapview.type,
									context_entry: data.length > 0 ? 0 : undefined,
									contexts_props: {
										...prevState.contexts_props,
										[context]: {
											...prevState.contexts_props[context],
											elements: resolve,
											element: definations[context].views.listing.googlemapview.type,
											loaded: true,
										}
									}
								}))
							}
							else {
								this.state.context_entry_type = definations[context].views.listing.googlemapview.type;
								this.state.context_entry = data.length > 0 ? 0 : undefined;
								this.state.contexts_props = {
									...this.state.contexts_props,
									[context]: {
										...this.state.contexts_props[context],
										elements: resolve,
										element: definations[context].views.listing.googlemapview.type,
										loaded: true,
									}
								}
							}
						});
					}

				}).catch(e => {

				});
			}
			else if (definations[context]) {
				if (this.isMounted()) {
					this.setState(prevState => ({
						context_entry_type: undefined,
						context_entry: undefined,
						contexts_props: {
							...prevState.contexts_props,
							[context]: {
								...prevState.contexts_props[context],
								elements: [],
								element: definations[context].views.listing.googlemapview.type,
								loaded: false,
							}
						}
					}))
				}
				else {
					this.state.context_entry_type = undefined;
					this.state.context_entry = undefined;
					this.state.contexts_props = {
						...this.state.contexts_props,
						[context]: {
							...this.state.contexts_props[context],
							elements: [],
							element: definations[context].views.listing.googlemapview.type,
							loaded: false,
						}
					}
				}
			}



		});



	};

	handleContextEntryClick = (entry, index) => {
		//

		this.setState({ context_entry: index });
		if (googleMap) {
			if (this.state.context === "commissions") {
				googleMap.panTo(entry.focus_center);
			}
			if (this.state.context === "tracks") {
				if (entry.positions) {
					if (Array.isArray(entry.positions)) {
						if (JSON.isJSON(entry.positions[0])) {
							googleMap.panTo({ lat: entry.positions[0].latitude, lng: entry.positions[0].longitude });
						}
					}
				}
			}
		}
	};


	getclientPositionMarkerIcon = (user) => {
		let computed_icon = JSON.isJSON(user) ? (String.isString(user.icon) ? (user.icon.startsWith(user.gender) ? user.icon : user.gender) : ((String.isString(user.gender) ? user.gender.trim().toLowerCase() : "male")) : "male") : "male";

		if (!computed_icon) {
			computed_icon = "male";
		}



		if (process.env.NODE_ENV === "development") {
			computed_icon = icon_names[Math.floor(Math.random() * icon_names.length)];
		}
		return `${process.env.PUBLIC_URL}/img/avatars/${computed_icon}.png`;
	}

	render() {
		const { theme, showAll, device, sockets, definations, contexts, actions } = this.props;
		const { context, clients_positions, show_client_positions, rendered_contexts, contexts_props } = this.state;
		let circles = [];
		let markers = [];
		let polylines = [];
		//
		rendered_contexts.map(rendered_context => {
			if (definations[rendered_context] && rendered_context in contexts_props) {

				if (contexts_props[rendered_context].element === "marker" && Array.isArray(contexts_props[rendered_context].elements)) {
					markers = markers.concat(contexts_props[rendered_context].elements);
				}
				else if (contexts_props[rendered_context].element === "circle" && Array.isArray(contexts_props[rendered_context].elements)) {
					circles = circles.concat(contexts_props[rendered_context].elements);
				}
				else if (contexts_props[rendered_context].element === "polyline" && Array.isArray(contexts_props[rendered_context].elements)) {
					polylines = polylines.concat(contexts_props[rendered_context].elements);
				}
			}
		});
		//


		return (
			<Card elevation={0} outlineColor={theme.palette.text.primary} style={{ backgroundColor: theme.palette.background.paper }}  >
				<CardHeader
					avatar={
						<Avatar style={{ backgroundColor: "rgba(0,0,0,0.05)", color: theme.palette.text.primary }}>
							<MapOutlinedIcon />
						</Avatar>
					}
					title={this.props.context ? (definations[this.props.context] ? (definations[this.props.context].label + " Map") : "Map") : "Map Overview"}
					subheader="Click on any context marker, route or polyline in the map for more infomation on the context "
					action={
						<div>
							{/*<IconButton
								aria-label="Clients Locations Button"
								className={"mx-1 inverse-text translucent "}
								onClick={this.handleOnToggleShowClients}
								style={{backgroundColor: "rgba(0,0,0,0.05)"}}
							>
								<Icon 
									path={show_client_positions? mdiMapMarkerMultiple : mdiMapMarkerMultipleOutline}
									title="Clients Locations"
									size={0.8}   
									color={theme.palette.text.primary}
								/>
							</IconButton>*/}

							{Array.isArray(actions) && actions.map(({ onClick, icon, ...rest }, cursor) => (
								<IconButton
									aria-label="Action"
									className={"mx-1 inverse-text translucent "}
									onClick={onClick}
									style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
									key={"action-button-" + cursor}
									{...rest}
								>
									{icon}
								</IconButton>
							))}

							<IconButton
								aria-label="menu"
								color={"inherit"}
								className={"mx-1 inverse-text "}
								onClick={this.toggleDrawer(!this.state.drawerOpen)}
								style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
							>
								<Icon
									path={mdiForwardburger}
									title="Map Overview Drawer Menu"
									rotate={this.state.drawerOpen ? 0 : 180}
									size={0.8}
									color={theme.palette.text.primary}
								/>
							</IconButton>
						</div>
					}

				/>
				<CardContent className="p-0 m-0 overflow-x-hidden">
					<GridContainer className="p-0 m-0">
						<GridItem xs={12} className={`m-0 p-0 flex`}>
							<div className={`flex-grow p-0 transition-all`} style={{ minHeight: device.window_size.height, backgroundColor: theme.palette.background.paper }} ref={this.elementRef}>


								<GoogleMap
									mapHeight={device.window_size.height}
									showClientsPositions={rendered_contexts.includes("clients_positions")}
									showCurrentPosition={true}
									onLoadClientsPositions={this.handleOnClientsPositionsLoaded}
									onClientPositionAvailable={this.handleOnClientPositionAvailable}
									onClientPositionUnavailable={this.handleOnClientPositionUnavailable}
									onClientPositionChanged={this.handleOnClientPositionChanged}
									selectedEntry={this.state.context_entry}
									selectedEntryType={this.state.context_entry_type ? this.state.context_entry_type : "clients_position"}
									defaultZoom={this.state.defaultZoom}
									zoom={this.state.zoom}
									onMapLoad={this.handleOnLoadMap}
									polylines={polylines}
									markers={markers}
									circles={circles}
								/>

							</div>

							<SwipeableDrawer
								className={`flex-shrink`}
								variant={device.window_size.width >= 1280 ? "persistent" : "temporary"}
								anchor="right"
								open={this.state.drawerOpen}
								onClose={this.toggleDrawer(false)}
								onOpen={this.toggleDrawer(true)}
							>
								{this.state.multicontexts && <BottomNavigation
									value={context}
									onChange={this.handleOnDrawerNavigationValueChange}
									showLabels
									className={"w-full"}
								>
									<BottomNavigationAction
										value="clients_positions"
										label="Users"
										icon={
											<Icon
												path={mdiAccountCircleOutline}
												title="Clients Postions Users"
												size={1}
											/>
										}
									/>
									{Object.entries(this.state.definations).map(([name, defination], index) => (
										<BottomNavigationAction
											value={name}
											label={defination.label}
											icon={defination.icon}
											key={"googlemapview-btn-" + name + "-option"}
										/>
									))}
								</BottomNavigation>}

								{(context === "clients_positions" && Object.size(clients_positions) === 0) && <GridContainer>
									<GridItem xs={12} className="flex items-center justify-center p-2">
										<Icon
											path={mdiFolderOutline}
											title="No Records available yet."
											color="#CCCCCC"
											size={5}
										/>
									</GridItem>

									<GridItem xs={12} className="flex items-center justify-center p-2">
										<Typography>
											No Records available yet.
										</Typography>
									</GridItem>
								</GridContainer>}


								{context === "clients_positions" && <List className={`p-0`}>
									{Object.entries(clients_positions).map(([socketId, client], index) => {
										let show_entry = true;
										if (index > 0) {

											if (client.user._id === clients_positions[(Object.keys(clients_positions)[(index - 1)])].user._id) {
												show_entry = false;
											}
										}
										else {
											/*if (googleMap) {		
												googleMap.panTo({ lat: client.position.latitude, lng: client.position.longitude });
												googleMap.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.setZoom(15);
											}*/
										}
										if (client.user && show_entry) {
											return (
												<ListItem className={"cursor-pointer hover:bg-gray-400"} onClick={this.handleClientListItemClick(socketId, client)} key={"client-" + socketId}>
													<ListItemAvatar>
														<Avatar src={this.getclientPositionMarkerIcon(client.user)} />
													</ListItemAvatar>
													<ListItemText primary={client.user.first_name + " " + client.user.last_name} secondary={String.isString(client.user.role) ? client.user.role.humanize() : ""} />
												</ListItem>
											);
										}

									})}
								</List>}

								{context === "commissions" && <Listings
									defination={definations.commissions}
									service={ApiService.getContextRequests(definations[context].endpoint)}
									query={{}}
									showViewOptions={false}
									showAddBtn={false}
									showSorter={true}
									sorterFormLayoutType={"normal"}
									view={"listview"}
									onLoadData={(loadedData, query) => {
										if (definations[context] && Function.isFunction(definations[context].views.listing.googlemapview.resolveData) && Array.isArray(loadedData)) {
											definations[context].views.listing.googlemapview.resolveData(loadedData, true).then(resolve => {

												this.setState(prevState => {
													let renderedContextIndex = prevState.rendered_contexts.indexOf(context);
													let rendered_contexts = renderedContextIndex !== -1 ? prevState.rendered_contexts : prevState.rendered_contexts.concat([context]);
													
													return {
														context_entries: Array.isArray(loadedData) ? loadedData : [],
														rendered_contexts: rendered_contexts,
														context_entry_type: definations[context].views.listing.googlemapview.type,
														context_entry: Array.isArray(loadedData) && loadedData.length > 0 ? 0 : undefined,
														contexts_props: {
															...prevState.contexts_props,
															[context]: {
																...prevState.contexts_props[context],
																elements: resolve,
																element: definations[context].views.listing.googlemapview.type,
																loaded: true,
															},
														},
														records: loadedData,
														rendered_contexts: rendered_contexts,
														defination: definations[context],
														service: ApiService.getContextRequests(definations[context].endpoint),
													}
												});

											}).catch(err => {
												this.setState(prevState => ({
													contexts_props: {
														...prevState.contexts_props,
														[context]: {
															...prevState.contexts_props[context],
															elements: [],
															loaded: true,
														}
													},
													records: loadedData,
												}));
											});
										}

									}}
									onClickEntry={this.handleContextEntryClick}
								/>}

								{context === "tracks" && <Listings
									defination={definations.tracks}
									service={ApiService.getContextRequests(definations[context].endpoint)}
									showViewOptions={false}
									showAddBtn={false}
									showSorter={true}
									showPagination={true}
									sorterFormLayoutType={"normal"}
									view={"listview"}
									onLoadData={(loadedData, query) => {
										if (definations[context] && Function.isFunction(definations[context].views.listing.googlemapview.resolveData) && Array.isArray(loadedData)) {
											definations[context].views.listing.googlemapview.resolveData(loadedData, true).then(resolve => {

												this.setState(prevState => {
													let renderedContextIndex = prevState.rendered_contexts.indexOf(context);
													let rendered_contexts = renderedContextIndex !== -1 ? prevState.rendered_contexts : prevState.rendered_contexts.concat([context]);
													
													return {
														context_entries: Array.isArray(loadedData) ? loadedData : [],
														rendered_contexts: rendered_contexts,
														context_entry_type: definations[context].views.listing.googlemapview.type,
														context_entry: Array.isArray(loadedData) && loadedData.length > 0 ? 0 : undefined,
														contexts_props: {
															...prevState.contexts_props,
															[context]: {
																...prevState.contexts_props[context],
																elements: resolve,
																element: definations[context].views.listing.googlemapview.type,
																loaded: true,
															},
														},
														records: loadedData,
														rendered_contexts: rendered_contexts,
														defination: definations[context],
														service: ApiService.getContextRequests(definations[context].endpoint),
													}
												});

											}).catch(err => {
												this.setState(prevState => ({
													contexts_props: {
														...prevState.contexts_props,
														[context]: {
															...prevState.contexts_props[context],
															elements: [],
															loaded: true,
														}
													},
													records: loadedData,
												}));
											});
										}
									}}
									onClickEntry={this.handleContextEntryClick}
								/>}

							</SwipeableDrawer>
						</GridItem>
					</GridContainer>
				</CardContent>
				<CardActions>
					<GridContainer className="p-0 m-0">
						{Array.isArray(contexts) && contexts.map((context_entry_name, cursor) => (
							<GridItem xs={12} md={Math.round((12 / contexts.length))} className={"flex items-center justify-center"} key={"context_entry_switch-" + cursor}>
								<SwitchInput
									label={context_entry_name === "clients_positions" ? "Users" : (definations[context_entry_name] ? definations[context_entry_name].label : context_entry_name)}
									value={this.state.rendered_contexts.includes(context_entry_name)}
									onChange={(new_value) => {
										
										this.handleToggleContextRender(context_entry_name, new_value);
									}}
								/>

							</GridItem>
						))}
						<GridItem xs={12}>
							<Typography variant="body2">
								{this.props.context ? (definations[this.props.context] ? (definations[this.props.context].label + " Map from a glance") : "Map from a glance") : "Map from a glance"}
							</Typography>
						</GridItem>
					</GridContainer>
				</CardActions>
			</Card>
		);
	}
}

GoogleMapOverview.propTypes = {
	className: PropTypes.string,
	contexts: PropTypes.array,
	context: PropTypes.string.isRequired,
	actions: PropTypes.array,
};

GoogleMapOverview.defaultProps = {
	contexts: ["clients_positions", "commissions", "tracks"],
	context: "clients_positions",
	actions: [],
};

const mapStateToProps = state => ({
	app: state.app,
	auth: state.auth,
	cache: state.cache,
	device: state.device,
});

export default withGlobals(compose(

	connect(mapStateToProps, { apiCallRequest, closeDialog, openDialog }),
	withTheme
)(GoogleMapOverview));
