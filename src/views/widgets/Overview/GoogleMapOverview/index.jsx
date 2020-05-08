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
import { mdiMapMarkerMultiple, mdiMapMarkerMultipleOutline, mdiMapMarkerOff, mdiForwardburger, mdiTooltipAccount as clientPositionMarkerPath, mdiAccountCircleOutline } from '@mdi/js';
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
import {withGlobals} from "contexts/Globals";
import compose from "recompose/compose";
import GoogleMap from "components/GoogleMap";
import GoogleMapView from "views/widgets/Listings/GoogleMapView";
import {withErrorHandler} from "hoc/ErrorHandler";
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
		context: "clients_positions",
		context_entry: null,

		zoom: 12,
		query: {},
		markers: [],
	};

	constructor(props) {
		super(props);
		const { device, cache } = this.props;
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

		this.state = { 
			...this.state, 
			//context: Object.keys(this.state.definations)[0],
			context_entries: Array.isArray(cache.data[this.state.defination.name])? cache.data[this.state.defination.name] : [],
			drawerOpen: device.window_size.width >= 1280
		};
	}

	componentDidMount() {
		//throw new Error('This is a withErrorHandler test.');


		
	}

	prepareForView() {
		const { auth, definations, services, sockets } = this.props;
		let current_defination = null;
		let current_service = null;
		let possible_definations = {};
		let possible_services = {};
		for (let [name, defination] of Object.entries(definations)) {
			if (!defination.access.restricted(auth.user) && name in services) {
				if (defination.views.listing.googlemapview) {
					possible_definations[name] = defination;
					possible_services[name] = services[name];
					if (current_defination === null) {
						current_defination = defination;
						current_service = services[name];
					}
				}
			}
		}
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

	handleOnLoadMap(map) {
		googleMap = map;
	}


	handleOnClientsPositionsLoaded(clients_positions) {
		this.setState(state => ({ clients_positions: clients_positions }));
	}

	handleOnClientPositionAvailable(socketId, client) {
		this.setState(state => ({ clients_positions: {...state.clients_positions, [socketId]: client } }));
		console.log("handleOnClientPositionAvailable socketId", socketId);
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
		this.setState({ context_entry: socketId });
		if (googleMap) {
			googleMap.panTo({ lat: client.position.latitude, lng: client.position.longitude });
			this.setState(state => ({zoom : 21}));
		}
		
	};

	handleContextEntryClick = (entry) => event => {
		this.setState({ context_entry: entry._id });
		if (googleMap) {
			if (this.state.context === "commissions") {
				googleMap.panTo(entry.focus_center);
				this.setState(state => ({zoom : 21}));
			}
			if (this.state.context === "tracks") {
				if (entry.positions) {
					if (Array.isArray(entry.positions)) {
						if (entry.positions[0].type === "coordinates") {
							googleMap.panTo({ lat: entry.positions[0].latitude, lng: entry.positions[0].longitude });
							this.setState(state => ({zoom : 11}));
						}
					}
				}							
			}				
		}		
	};

	render() {
		const { theme, classes, showAll, device, sockets, definations, services } = this.props;
		const { context, clients_positions, show_client_positions } = this.state;
		console.log("this.state.defination.name", this.state.defination.name);
		return (
			<Card elevation={0} outlineColor="#cfd8dc" className="secondary">
				<CardHeader
					avatar={
						<Avatar style={{backgroundColor: "rgba(0,0,0,0.05)"}}>
							<MapOutlinedIcon />
						</Avatar>
					}
					title={
						"Map Overview"
					}
					subheader="Click on any context marker, route or polyline in the map for more infomation on the context "
					action={
						<div>
							<IconButton
								aria-label="Clients Locations Button"
								className={"mx-1 inverse-text translucent "}
								onClick={this.handleOnToggleShowClients}
								style={{backgroundColor: "rgba(0,0,0,0.05)"}}
							>
								<Icon 
									path={show_client_positions? mdiMapMarkerMultiple : mdiMapMarkerMultipleOutline}
									title="Clients Locations"
									size={0.8}   
									color={theme.palette.background.paper}
								/>
							</IconButton>

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
									color={theme.palette.background.paper}
								/>
							</IconButton>
						</div>
					}

				/>
				<CardContent className="p-0 m-0">
					<GridContainer className="p-0 m-0">
						<GridItem xs={12} className={classes.wrapper}>
							<div className={classNames(classes.content, { [classes.contentDrawerMargin]: device.window_size.width >= 1280,  [classes.contentShift]: this.state.drawerOpen && device.window_size.width >= 1280})} style={{minHeight: device.window_size.height, backgroundColor: theme.palette.background.paper }}>
								{context === "commissions" && <GoogleMapView 
									defination={definations["commissions"]}
									service={services["commissions"]}
									query={this.state.query}
									googleMapProps={{
										mapHeight: device.window_size.height,
										showClientsPositions: this.state.show_client_positions,
										showCurrentPosition: true,
										onLoadClientsPositions: this.handleOnClientsPositionsLoaded,
										onClientPositionAvailable: this.handleOnClientPositionAvailable,
										onClientPositionUnavailable: this.handleOnClientPositionUnavailable,
										onClientPositionChanged: this.handleOnClientPositionChanged,
										//selectedClient: this.state.context_entry,
										defaultZoom: this.state.zoom,
										onMapLoad: this.handleOnLoadMap,
									}}   
								/>}

								{(context === "tracks" || context === "clients_positions") && <GoogleMapView 
									defination={definations["tracks"]}
									service={services["tracks"]}
									query={this.state.query}
									googleMapProps={{
										mapHeight: device.window_size.height,
										showClientsPositions: this.state.show_client_positions,
										showCurrentPosition: true,
										onLoadClientsPositions: this.handleOnClientsPositionsLoaded,
										onClientPositionAvailable: this.handleOnClientPositionAvailable,
										onClientPositionUnavailable: this.handleOnClientPositionUnavailable,
										onClientPositionChanged: this.handleOnClientPositionChanged,
										selectedClient: this.state.context_entry,
										defaultZoom: this.state.zoom,
										onMapLoad: this.handleOnLoadMap,
									}}   
								/>}

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
								<BottomNavigation
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
								</BottomNavigation>

								<List className={classes.root}>
									{context === "clients_positions" && Object.entries(clients_positions).map(([socketId, client_position], index) => (
										client_position.user && <ListItem className={"cursor-pointer hover:bg-gray-400"} onClick={this.handleClientListItemClick(socketId, client_position)} key={"client-"+socketId}>
											<ListItemAvatar>
												{ client_position.user.avatar? ( 
													<Avatar src={ services.attachments.getAttachmentFileUrl(client_position.user.avatar) } /> 
													) : ( 
													<Avatar style={{backgroundColor: "rgba(0,0,0,0.05)"}} > 
														<Icon 
															path={clientPositionMarkerPath} 
															size={1}	   
															className={"error-text"}
														/>
													</Avatar>
													) }
													
											</ListItemAvatar>
											<ListItemText primary={ client_position.user.first_name+" "+client_position.user.last_name } secondary="Position" />
										</ListItem>
									))}

									{context === "commissions" && this.state.context_entries.map((entry, index) => (
										<ListItem className={"cursor-pointer hover:bg-gray-400"} onClick={this.handleContextEntryClick(entry)}  key={"context_entry-"+index}>
											<ListItemAvatar>
												<Avatar style={{backgroundColor: commission_status_colors[entry.status]? commission_status_colors[entry.status] : theme.palette.text.primary, color: theme.palette.background.paper }} > 
													{ this.state.defination.icon }
												</Avatar>
											</ListItemAvatar>
											<ListItemText 
												primary={ entry.status? entry.status.humanize() : "Unknown Status"  } 
												secondary={
													<GridContainer>
														<GridItem>
															<Typography component="div" variant="body2" color="default" className={"mb-2"} >
																Period: {new Date( entry.start_date).format("d M Y H:i:s A")+" To "+new Date(entry.end_date).format("d M Y H:i:s A")}
															</Typography>
															<Typography component="div" variant="body2" color="default" className={"mb-2"} >
																Involvement: {entry.involvement === "team" ? "Team" : "Individual"}
															</Typography>
															<Typography component="div" variant="body2" color="default" className={"mb-2"} >
																Radius: {entry.focus_radius + " " + entry.focus_radius_metric}
															</Typography>
														</GridItem>
													</GridContainer>
												} 
											/>
										</ListItem>

									))}

									{context === "tracks" && this.state.context_entries.map((entry, index) => (
										<ListItem className={"cursor-pointer hover:bg-gray-400"} onClick={this.handleContextEntryClick(entry)}  key={"context_entry-"+index}>
											<ListItemAvatar>
												<Avatar style={{backgroundColor: track_timetype_colors[entry.time_type]? track_timetype_colors[entry.time_type] : theme.palette.text.primary, color: theme.palette.background.paper}} > 
													{ this.state.defination.icon }
												</Avatar>
											</ListItemAvatar>
											<ListItemText 
												primary={(entry.time_type? entry.time_type.humanize() : "")+" Track" } 
												secondary={
													<GridContainer>
														<GridItem>
															<Typography
																component="p"
																variant="body2"
																color="default"
															>
															Start Time: {new Date(entry.start_time).format("d M Y H:i:s A")}
															</Typography>
															<Typography
																component="div"
																variant="body2"
																color="default"
															>
																{entry.user && (
																	<Chip
																		size="small"
																		avatar={
																			entry.user.avatar ? (
																				<Avatar
																					alt={
																						entry.user.first_name
																					}
																					src={services.attachments.getAttachmentFileUrl(entry.user.avatar)}
																				/>
																			) : (
																				<Avatar className="twitter_text">
																					<Icon 
																						path={clientPositionMarkerPath} 
																						size={1}	   
																						className={"error-text"}
																					/>
																				</Avatar>
																			)
																		}
																		label={ entry.user.first_name + " " + entry.user.last_name }
																	/>
																)}
															</Typography>
														</GridItem>
													</GridContainer>
												} 
											/>
										</ListItem>
										
									))}
								</List>



							</SwipeableDrawer>
						</GridItem>
					</GridContainer>
				</CardContent>
				<CardActions>
					<GridContainer className="p-0 m-0">
						<GridItem xs={12}>
							<Typography variant="body2">
								Your Map from a glance
							</Typography>
						</GridItem>
					</GridContainer>
				</CardActions>
			</Card>
		);
	}
}

const mapStateToProps = state => ({
	app: state.app,
	auth: state.auth,
	cache: state.cache,
	device: state.device,
});

export default withGlobals(compose(
	withStyles(styles),
	connect(mapStateToProps, {}),
	withTheme,
	withErrorHandler
)(GoogleMapOverview));
