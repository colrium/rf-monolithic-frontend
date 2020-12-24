/** @format */

import IconButton from "@material-ui/core/IconButton";
import classNames from "classnames";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@mdi/react'
import { mdiMapMarkerMultiple, mdiMapMarkerMultipleOutline, mdiMapMarkerOff, mdiForwardburger, mdiTooltipAccount as clientPositionMarkerPath, mdiAccountCircleOutline, mdiFolderOutline } from '@mdi/js';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MenuIcon from '@material-ui/icons/Menu';
import ImageIcon from '@material-ui/icons/Image';
import { colors } from "assets/jss/app-theme";
import Avatar from "components/Avatar";
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import Chip from "@material-ui/core/Chip";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withTheme } from '@material-ui/core/styles';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
import PeopleIcon from '@material-ui/icons/People';
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import React from "react";
import { connect } from "react-redux";
import { apiCallRequest, closeDialog, openDialog } from "state/actions";
import {withGlobals} from "contexts/Globals";
import Pagination from '@material-ui/lab/Pagination';
import compose from "recompose/compose";
import GoogleMap from "components/GoogleMap";
import GoogleMapView from "views/widgets/Listings/GoogleMapView";
import Listings from "views/widgets/Listings";
import { SwitchInput } from "components/FormInputs";
import {withErrorHandler} from "hoc/ErrorHandler";
import client_user_female_icon from "assets/img/maps/marker-person-female.png";
import client_user_male_icon from "assets/img/maps/marker-person-male.png";
import PropTypes from "prop-types";
import styles from "./styles";


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
			context: context? context: this.state.context,
			defaultZoom: app.preferences.data.defaultMapZoom,
			multicontexts: Array.isArray(contexts)? contexts.length > 1 : false,
			rendered_contexts: context? [context]: [],
			contexts_props: context? {
				[context]: {
					query: {page: 1, pagination: app.preferences.data.pagination, populate: 1},
					element: "marker",
					records: [],
				}
			}: {},
			context_entries: Array.isArray(cache.data[this.state.defination.name])? cache.data[this.state.defination.name] : [],
			//drawerOpen: device.window_size.width >= 1280,
			drawerOpen: false,
		};
	}

	isMounted() {
		return this.elementRef.current != null;
	}

	componentDidMount() {
		//throw new Error('This is a withErrorHandler test.');


		
	}

	prepareForView() {
		const { auth, definations, services, app } = this.props;
		let current_defination = null;
		let current_service = null;
		let possible_definations = {};
		let possible_services = {};
		let contexts_props = this.state.contexts_props;
		for (let [name, defination] of Object.entries(definations)) {
			if (!defination.access.restricted(auth.user)) {
				if (defination.views.listing.googlemapview && Function.isFunction( defination.views.listing.googlemapview.resolveData )) {
					possible_definations[name] = defination;
					possible_services[name] = services[name];
					contexts_props[name] = {
						query: {page: 1, pagination: app.preferences.data.pagination, populate: 1},
						element: defination.views.listing.googlemapview.type,
						elements: [],
						loaded: false,
					}
					if (current_defination === null) {
						current_defination = defination;
						current_service = services[name];
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

	

	toggleDrawer= (open) => (event) => {
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

	handleOnClientPositionAvailable(socketId, client) {
		this.setState(state => ({ clients_positions: {...state.clients_positions, [socketId]: client } }));
		//console.log("handleOnClientPositionAvailable socketId", socketId);
	}

	handleOnClientPositionUnavailable(socketId, client) {
		let newclientspositions = JSON.fromJSON(this.state.clients_positions);
		delete newclientspositions[socketId];
		this.setState(state => ({ clients_positions: newclientspositions }));
	}

	handleOnClientPositionChanged(socketId, client) {
		if (this.state.drawerOpen) {
			this.setState(state => ({ clients_positions: {...state.clients_positions, [socketId]: client } }));
		}		
	}


	

	handleOnDrawerNavigationValueChange = (event, newValue) => {
		const { definations, services, cache } = this.props;
		
		this.setState(state => ({
			context : newValue,
			context_entry: null,
			context_entries: ["commissions", "tracks"].includes(newValue)? (Array.isArray(cache.data[newValue])? cache.data[newValue] : []) : [],
			defination: ["commissions", "tracks"].includes(newValue)? definations[newValue] : state.defination,
			service: ["commissions", "tracks"].includes(newValue)? services[newValue] : state.service,
		}));
	};

	handleClientListItemClick = (socketId, client) => event => {
		console.log("handleClientListItemClick client", client, "googleMap", googleMap);
		if (googleMap) {		
					googleMap.panTo({ lat: client.position.latitude, lng: client.position.longitude });
					googleMap.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.setZoom(15);
		}
			
			
		
	};

	handleToggleContextRender = (context, renderContext) => {
		const { definations, cache, apiCallRequest, app } = this.props;
		this.setState((prevState)=>{
			let renderedContextIndex = prevState.rendered_contexts.indexOf(context);
			return {
				rendered_contexts: prevState.rendered_contexts.includes(context)? prevState.rendered_contexts.removeAtIndex(renderedContextIndex) : prevState.rendered_contexts.concat([context]),
			}
		}, async ()=>{
			if (definations[context] && renderContext) {
				
				apiCallRequest( definations[context].name, {
					uri: definations[context].endpoint,
					type: "records",
					params: JSON.isJSON(this.state.contexts_props[context])? this.state.contexts_props[context].query : {page: 1, pagination: app.preferences.data.pagination, populate: 1},
					data: {},
					cache: true,
				}).then(data => {
					if (definations[context] && Function.isFunction( definations[context].views.listing.googlemapview.resolveData ) && Array.isArray(data)) {
						definations[context].views.listing.googlemapview.resolveData(data, true).then(resolve => {
							if (this.isMounted()) {
								this.setState(prevState => ({
									context_entry_type : definations[context].views.listing.googlemapview.type,
									context_entry: data.length> 0? 0 : undefined,
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
								this.state.context_entry = data.length> 0? 0 : undefined;
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
									context_entry_type : undefined,
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
		//console.log("handleContextEntryClick index", index);

		this.setState({ context_entry: index });
		/*if (googleMap) {
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
		}*/
	};

	render() {
		const { theme, classes, showAll, device, sockets, definations, services, contexts, actions } = this.props;
		const { context, clients_positions, show_client_positions, rendered_contexts, contexts_props } = this.state;
		let circles = [];
		let markers = [];
		let polylines = [];
		//console.log("rendered_contexts", rendered_contexts);
		rendered_contexts.map(rendered_context => {
			if (definations[rendered_context] && rendered_context in contexts_props ) {

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
		//console.log("circles", circles);
		

		return (
			<Card elevation={0} outlineColor={theme.palette.text.primary} style={{backgroundColor: theme.palette.background.paper }}  ref={this.elementRef}>
				<CardHeader
					avatar={
						<Avatar style={{backgroundColor: "rgba(0,0,0,0.05)", color:theme.palette.text.primary}}>
							<MapOutlinedIcon />
						</Avatar>
					}
					title={this.props.context? (definations[this.props.context]? (definations[this.props.context].label+" Map"): "Map") : "Map Overview"}
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

							{Array.isArray(actions) && actions.map(({onClick, icon, ...rest}, cursor)=> (
								<IconButton
									aria-label="Action"
									className={"mx-1 inverse-text translucent "}
									onClick={onClick}
									style={{backgroundColor: "rgba(0,0,0,0.05)"}}
									key={"action-button-"+cursor}
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
								style={{backgroundColor: "rgba(0,0,0,0.05)"}}
							>
								<Icon 
									path={mdiForwardburger}
									title="Map Overview Drawer Menu"
									rotate={this.state.drawerOpen? 0 : 180}	    
									size={0.8}
									color={theme.palette.text.primary}
								/>
							</IconButton>
						</div>
					}

				/>
				<CardContent className="p-0 m-0 overflow-x-hidden">
					<GridContainer className="p-0 m-0">
						<GridItem xs={12} className={classes.wrapper}>
							<div className={classNames(classes.content, { [classes.contentDrawerMargin]: device.window_size.width >= 1280,  [classes.contentShift]: this.state.drawerOpen && device.window_size.width >= 1280})} style={{minHeight: device.window_size.height, backgroundColor: theme.palette.background.paper }}>
								

								<GoogleMap									
									mapHeight={device.window_size.height}
									showClientsPositions={rendered_contexts.includes("clients_positions")}
									showCurrentPosition={true}
									onLoadClientsPositions={this.handleOnClientsPositionsLoaded}
									onClientPositionAvailable={this.handleOnClientPositionAvailable}
									onClientPositionUnavailable={this.handleOnClientPositionUnavailable}
									onClientPositionChanged={this.handleOnClientPositionChanged}
									selectedEntry={this.state.context_entry} 
									selectedEntryType={this.state.context_entry_type? this.state.context_entry_type : "clients_position"}
									defaultZoom={this.state.defaultZoom}
									zoom={this.state.zoom}
									onMapLoad={this.handleOnLoadMap}
									polylines={polylines}
									markers={markers}
									circles={circles}									  
								/>

							</div>
								
							<SwipeableDrawer
								className={classes.drawer}
								variant={device.window_size.width >= 1280? "persistent" : "temporary" }
								anchor="right"
								open={this.state.drawerOpen}
								onClose={this.toggleDrawer(false)}
            					onOpen={this.toggleDrawer(true)}
								classes={{
									paper: device.window_size.width >= 1280? classes.drawerPaper : classes.temporaryDrawerPaper,
								}}
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
											key={"googlemapview-btn-"+name+"-option"}
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

								
									{context === "clients_positions" && <List className={classes.root}>
										{Object.entries(clients_positions).map(([socketId, client], index) => {
											let show_entry = true;
											if (index > 0) {

												if (client.user._id === clients_positions[(Object.keys(clients_positions)[(index-1)])].user._id) {
													show_entry = false;
												}
											}
											else{
												if (googleMap) {		
													googleMap.panTo({ lat: client.position.latitude, lng: client.position.longitude });
													googleMap.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.setZoom(15);
												}
											}
											if (client.user && show_entry) {
												return (
													<ListItem className={"cursor-pointer hover:bg-gray-400"} onClick={this.handleClientListItemClick(socketId, client)} key={"client-"+socketId}>
														<ListItemAvatar>
															<Avatar src={(String.isString(client.user.gender)? (client.user.gender.trim().toLowerCase()==="female"? client_user_female_icon : client_user_male_icon) : client_user_male_icon)} />
														</ListItemAvatar>
														<ListItemText primary={ client.user.first_name+" "+client.user.last_name } secondary={String.isString(client.user.role)? client.user.role.humanize() : ""} />
													</ListItem>
												);
											}
												
										})}
									</List>}

									{context === "commissions" && <Listings 
										defination={definations.commissions} 
										service={services.commissions}
										query={{}}
										showViewOptions={false}
										showAddBtn={false}
										showSorter={true}
										sorterFormLayoutType={"normal"}
										view={"listview"}
										onLoadData={(loadedData, query)=>{
											if (definations[context] && Function.isFunction( definations[context].views.listing.googlemapview.resolveData ) && Array.isArray(loadedData)) {
												definations[context].views.listing.googlemapview.resolveData(loadedData, true).then(resolve => {
													this.setState(prevState => ({
															contexts_props: {
																...prevState.contexts_props,
																[context]: {
																	...prevState.contexts_props[context],
																	query: query,
																	elements: resolve,
																	loaded: true,
																}
															},
															records: loadedData,
													}));
														
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
										service={services.tracks}										
										showViewOptions={false}
										showAddBtn={false}
										showSorter={true}
										showPagination={true}
										sorterFormLayoutType={"normal"}
										view={"listview"}
										onLoadData={(loadedData, query)=>{
											if (definations[context] && Function.isFunction( definations[context].views.listing.googlemapview.resolveData ) && Array.isArray(loadedData)) {
												definations[context].views.listing.googlemapview.resolveData(loadedData, true).then(resolve => {
													this.setState(prevState => ({
															contexts_props: {
																...prevState.contexts_props,
																[context]: {
																	...prevState.contexts_props[context],
																	query: query,
																	elements: resolve,
																	loaded: true,
																}
															},
															records: loadedData,
													}));
														
												}).catch(err => {
													this.setState(prevState => ({
														contexts_props: {
																...prevState.contexts_props,
																[context]: {
																	...prevState.contexts_props[context],
																	query: query,
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
							<GridItem xs={12} md={Math.round((12 / contexts.length))} className={"flex items-center justify-center"} key={"context_entry_switch-"+cursor}>
									<SwitchInput 
										label={context_entry_name === "clients_positions"? "Users" : (definations[context_entry_name]? definations[context_entry_name].label : context_entry_name) }
										value={this.state.rendered_contexts.includes(context_entry_name)}
										onChange={(new_value)=>{
											this.handleToggleContextRender(context_entry_name, new_value);											
										}}
									/>
										
							</GridItem>
						))}
						<GridItem xs={12}>
							<Typography variant="body2">
								{this.props.context? (definations[this.props.context]? (definations[this.props.context].label+" Map from a glance"): "Map from a glance") : "Map from a glance"}
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
	classes: PropTypes.object,
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
	withStyles(styles),
	connect(mapStateToProps, {apiCallRequest, closeDialog, openDialog}),
	withTheme,
	withErrorHandler
)(GoogleMapOverview));
