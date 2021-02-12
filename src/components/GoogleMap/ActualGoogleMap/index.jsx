/*global google*/

import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { connect } from "react-redux";
import {
	GoogleMap,
	InfoWindow,
	Circle,
	Marker,
	Polyline,
	withGoogleMap,
	KmlLayer,
	withScriptjs,
} from "react-google-maps";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
import Avatar from '@material-ui/core/Avatar';
import Typography from 'components/Typography';
import { mdiTooltipAccount as clientPositionMarkerPath } from '@mdi/js';
import RotateIcon from "../RotateIcon";
import mapStyles, {mapDarkStyles} from "./mapStyles";
import {LocationInput as LocationSearchInput } from "components/FormInputs";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import {useGlobals} from "contexts/Globals";
import { colors } from "assets/jss/app-theme";
import client_position_marker_icon from "assets/img/maps/marker-person.svg";
import client_position_female_heading_135_icon from "assets/img/maps/heading/female-135.png";
import client_position_female_heading_180_icon from "assets/img/maps/heading/female-180.png";
import client_position_female_heading_225_icon from "assets/img/maps/heading/female-225.png";
import client_position_female_heading_270_icon from "assets/img/maps/heading/female-270.png";
import client_position_female_heading_315_icon from "assets/img/maps/heading/female-315.png";
import client_position_female_heading_360_icon from "assets/img/maps/heading/female-360.png";
import client_position_female_heading_45_icon from "assets/img/maps/heading/female-45.png";
import client_position_female_heading_80_icon from "assets/img/maps/heading/female-90.png";

import client_position_male_heading_135_icon from "assets/img/maps/heading/male-135.png";
import client_position_male_heading_180_icon from "assets/img/maps/heading/male-180.png";
import client_position_male_heading_225_icon from "assets/img/maps/heading/male-225.png";
import client_position_male_heading_270_icon from "assets/img/maps/heading/male-270.png";
import client_position_male_heading_315_icon from "assets/img/maps/heading/male-315.png";
import client_position_male_heading_360_icon from "assets/img/maps/heading/male-360.png";
import client_position_male_heading_45_icon from "assets/img/maps/heading/male-45.png";
import client_position_male_heading_80_icon from "assets/img/maps/heading/male-90.png";

import client_user_female_icon from "assets/img/maps/marker-person-female.png";
import client_user_male_icon from "assets/img/maps/marker-person-male.png";
import Paper from "@material-ui/core/Paper";
import { attachments as AttachmentsService } from "services";
import {
	PersonOutlined as UserIcon,
} from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import { Link } from "react-router-dom";

import { google_maps } from "config";

//

//



const current_position_marker_icon = {
	path: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
	fillColor: "#0076d6",
	fillOpacity: 1,
	strokeOpacity: 0.3,
	strokeWeight: 8,
	strokeColor: "#0076d6",
	scale: 0.1, //to reduce the size of icons
};



/*const client_position_marker_icon = {
	//path: "m 20.073331,0.06216702 c 3.79432,0.41734 7.45896,2.10713998 10.30993,4.75712998 3.00933,2.78519 5.11513,6.71834 5.87973,10.95353 0.31769,1.79439 0.31769,4.86121 -0.0102,6.71834 -0.27835,1.60664 -1.00311,3.95357 -1.68853,5.46632 -1.52968,3.41121 -3.60537,6.36324 -8.75013,12.42444 -3.54611,4.17295 -5.37357,6.5408 -6.85321,8.84641 -0.62567,0.96986 -0.7646,1.00156 -1.23143,0.22959 -1.1124,-1.85663 -3.4368,-4.87192 -7.12135,-9.23212 -3.4168895,-4.04743 -4.6385895,-5.60202 -6.0288595,-7.62599 -3.43681,-5.04896 -5.00584,-10.41119 -4.47975,-15.40811 0.89381,-8.6061 7.00234,-15.47036 15.0772595,-16.93106998 1.33051,-0.2398 3.66463,-0.33367 4.89654,-0.19847 z",
	path: clientPositionMarkerPath,
	fillColor: "#FF0000",
	fillOpacity: 1,
	strokeOpacity: 0,
	scale: 1,
};
*/

let rounded_headings = [360, 315, 270, 225, 180, 135, 90, 45];
rounded_headings.sort((a, b) => {return a-b});
const heading_aware_client_position_marker_icons = {
	male_heading_135: client_position_male_heading_135_icon,
	male_heading_180: client_position_male_heading_180_icon,
	male_heading_225: client_position_male_heading_225_icon,
	male_heading_270: client_position_male_heading_270_icon,
	male_heading_315: client_position_male_heading_315_icon,
	male_heading_360: client_position_male_heading_360_icon,
	male_heading_45: client_position_male_heading_45_icon,
	male_heading_80: client_position_male_heading_80_icon,
	female_heading_135: client_position_female_heading_135_icon,
	female_heading_180: client_position_female_heading_180_icon,
	female_heading_225: client_position_female_heading_225_icon,
	female_heading_270: client_position_female_heading_270_icon,
	female_heading_315: client_position_female_heading_315_icon,
	female_heading_360: client_position_female_heading_360_icon,
	female_heading_45: client_position_female_heading_45_icon,
	female_heading_80: client_position_female_heading_80_icon,
};
const labelSize = 200;
const labelPadding = 8;

let crowFleightDistanceinKm = (lat1, lon1, lat2, lon2) => {
	var R = 6371; // km
	var dLat = toRad(lat2 - lat1);
	var dLon = toRad(lon2 - lon1);
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) *
			Math.sin(dLon / 2) *
			Math.cos(lat1) *
			Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
};

// Converts numeric degrees to radians
let toRad = Value => {
	return (Value * Math.PI) / 180;
};

let showInfoWindow = (content, position) => {
	return <InfoWindow position={position}>{content}</InfoWindow>;
};

const ClientInfoWindow = ({user, track, position, history, ...rest}) => {
	

	return (
		<GridContainer style={{maxWidth: 300}}>
			<GridItem xs={12} className={"flex flex-row items-center"}>
				{
													user.avatar ? (
														<Avatar
															className="bg-transparent mr-4"
															alt={user.first_name}
															src={AttachmentsService.getAttachmentFileUrl(user.avatar)}
														/>
													) : (
														<Avatar className="bg-transparent  mr-4">
															<UserIcon />{" "}
														</Avatar>
													)
				}
				<Typography variant="h5" >
					{user.first_name}
				</Typography>
			</GridItem>

			<GridItem xs={12} className={"flex flex-row items-center"}>
				<Typography
					className="mx-2 font-bold"
										variant="body1"
										
									>
					Gender: 
				</Typography>
				<Typography
										variant="body1"
										
									>
					{user.gender? user.gender : "Unspecified"}
				</Typography>
			</GridItem>

			<GridItem xs={12} className={"flex flex-row items-center"}>
				<Typography
					className="mx-2 font-bold"
										variant="body1"
										
									>
					Course of Study: 
				</Typography>
				<Typography
										variant="body1"
										
									>
					{user.course? user.course : "Unspecified"}
				</Typography>
			</GridItem>

			<GridItem xs={12} className={"flex flex-row items-center"}>
				<Typography
					className="mx-2 font-bold"
										variant="body1"
										
									>
					Tasks Completed: 
				</Typography>
				<Typography
										variant="body1"
										
									>
					{user.noof_completed_tasks? user.noof_completed_tasks : "0"}
				</Typography>
			</GridItem>

			<GridItem xs={12} className={"flex flex-row items-center"}>
				<Typography
					className="mx-2 font-bold"
										variant="body1"
										
									>
					Uncompleted Tasks: 
				</Typography>
				<Typography
										variant="body1"
										
									>
					{user.noof_uncompleted_tasks? user.noof_uncompleted_tasks : "0"}
				</Typography>
			</GridItem>
			<GridItem xs={12} className={"flex flex-col"}>
				<Typography
					className="mx-2 font-bold"
										variant="body1"
										
									>
					Rating
				</Typography>
				<Rating name="read-only" value={user.rating? user.rating : 4} readOnly />
			</GridItem>
			

				<GridItem xs={12} className={"flex flex-row items-center justify-center"}>
					<Button href={("/messages?with="+user.email_address).toUriWithDashboardPrefix()} style={{background: "#8C189B", color: "#FFFFFF"}}>Message Me</Button>				
				</GridItem>
			</GridContainer>
	)
};

let _clientsPositionsOpenPopups = [];

let showClientInfoWindow = ({socketId, ...data}, google_map, marker, history) => {
	if (google_map, marker && !_clientsPositionsOpenPopups.includes(socketId)) {
		var infoWindow = new google.maps.InfoWindow({content: ReactDOMServer.renderToStaticMarkup(<ClientInfoWindow history={history} {...data} />)});
		infoWindow.open(google_map, marker);
		_clientsPositionsOpenPopups.push(socketId);
		google.maps.event.addListener(infoWindow,'closeclick',function(){
			let position = _clientsPositionsOpenPopups.indexOf(socketId);
			console.log("position", position)
		   	_clientsPositionsOpenPopups = _clientsPositionsOpenPopups.remove(position);
		   	if (!Array.isArray(_clientsPositionsOpenPopups)) {
		   		_clientsPositionsOpenPopups = [];
		   	}
		});
	}
};

let _map = null;
let _defaultCenter = google_maps.default_center;
let	_defaultZoom = 12;
let	_zoom = 12;
let firstLoad = true;
let _clientsPositions = {};
let regionBoundsClients = {};
let mapBounds = null;

let _searchBox = null;
let user_avatar_shape = {
	coords: [1, 1, 1, 20, 18, 20, 18, 1],
	type: 'poly'
};

/*const initialState = {
	clientsPositions: {},
	regionBoundsClients: {},
	mapBounds: null,
};

function reducer(state=initialState, action={}) {
	switch (action.type) {
		case 'ADD_CLIENT_POSITION': {
			return {count: state.count + 1};
		}
		case 'REMOVE_CLIENT_POSITION': {
			return {count: state.count - 1};
		}

		default: {
			return state;
		}
	}
}*/

const mapStateToProps = state => ({
	app: state.app,
	auth: state.auth,
	device: state.device,
});

export default compose(
	withScriptjs,
	withGoogleMap,
	connect(mapStateToProps, {}),
)( React.memo(props => {
	let [map, setMap] = useState(null);
	let history = useHistory();
	

	let clientMarkers = {};


	const { onMapLoad, device, auth, markers, polylines, circles, showDeviceLocation, showClientsPositions, selectedEntry, selectedEntryType, onLoadClientsPositions, onClientPositionAvailable, onClientPositionChanged, onClientPositionUnavailable, onSelectClientPosition, defaultCenter, onBoundsChanged, zoom, defaultZoom} = props;

	let globals = useGlobals();
	let sockets = globals? globals.sockets : {};
	let services = globals? globals.services : {};

	/*let mapMarkers = [];
	let mapPolylines = [];
	let mapCircles = [];*/

	
	const [ socketsInitialized, setSocketsInitialized ] = useState(false);

	useEffect(() => {
		if (firstLoad) {
			_defaultCenter = defaultCenter;
			_defaultZoom = defaultZoom;
			_zoom = zoom;
			firstLoad = false;
		}
		

	}, [firstLoad, defaultCenter, defaultZoom, zoom]);
	

	
	const [ selectedItem, setSelectedItem ] = useState({id: selectedEntry, type: selectedEntryType});
	const [ infoWindowContent, setInfoWindowContent ] = useState(null);
	const [ infoWindowPosition, setInfoWindowPosition ] = useState(null);	
	const [ infoWindowOpen, setInfoWindowOpen ] = useState(false);
	const [ mapMarkers, setMapMarkers ] = useState(Array.isArray(markers)? markers : []);
	const [ mapPolylines, setMapPolylines ] = useState(Array.isArray(polylines)? polylines : []);
	const [ mapCircles, setMapCircles ] = useState(Array.isArray(circles)? circles : []);
	const [ mapCenter, setMapCenter ] = useState(defaultCenter);
	
	



	const getGoogleMap = (__map) => {
		if (__map) {
			return __map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
		}
		return null;
	}

	//Memoized Methods
	const getGoogleMapContextElement = useCallback(() => {
		return getGoogleMap(_map);
	}, [_map]);

	//Memoized Methods
	const getCurrentMap = useCallback(() => {
		return _map;
	}, [_map]);

	
	/*const applyMapMarkers = (newMarkers) => {
		if (Array.isArray(mapMarkers)) {
			mapMarkers.map(mapMarker => {
				if (mapMarker instanceof google.maps.Marker) {
					mapMarker.setMap(null);
				}
			});
		}
		if (Array.isArray(newMarkers)) {
			mapMarkers = newMarkers.map(newMarker => {
				const { infowindow, ...markerProps} = newMarker;
				let newMapMarker = new google.maps.Marker(markerProps);
				newMapMarker.setMap(getCurrentMap());
				return newMapMarker;
			});
		}
		else {
			mapMarkers = [];
		}
			
	};

	const applyMapPolylines = (newPolylines) => {
		if (Array.isArray(mapPolylines)) {
			mapPolylines.map(mapPolyline => {
				if (mapPolyline instanceof google.maps.Polyline) {
					mapPolyline.setMap(null);
				}
			});
		}
		if (Array.isArray(newPolylines)) {
			mapPolylines = newPolylines.map(newPolyline => {
				const { infowindow, ...polylineProps} = newPolyline;
				let newMapPolyline = new google.maps.Polyline(polylineProps);
				newMapPolyline.setMap(getCurrentMap());
				return newMapPolyline;
			});
		}
		else {
			mapPolylines = [];
		}			
	};

	const applyMapCircles = (newCircles) => {
		if (Array.isArray(mapCircles)) {
			mapCircles.map(mapCircle => {
				if (mapCircle instanceof google.maps.Circle) {
					mapCircle.setMap(null);
				}
			});
		}
		if (Array.isArray(newCircles)) {
			mapCircles = newCircles.map((newCircle, index) => {
				const { infowindow, ...circleProps} = newCircle;
				let newMapCircle = new google.maps.Circle({
					options: {
								fillColor: selectedItem.type == "circle" && selectedItem.id === index? colors.hex.accent : (circleProps.fillColor ? circleProps.fillColor : colors.hex.accent),
								strokeColor: circleProps.color ? circleProps.color : colors.hex.accent,
								strokeOpacity: selectedItem.type == "circle" && selectedItem.id === index?  1 : (selectedItem.type != "circle" ? circleProps.opacity : 0.2),
								fillOpacity: selectedItem.type == "circle" && selectedItem.id === index?  0.5 : (selectedItem.type != "circle"? circleProps.opacity : 0.2),
								strokeWeight: selectedItem.type == "circle" && selectedItem.id === index?  4 : (selectedItem.type != "circle" ? circleProps.strokeWeight : 1),
					},
					...circleProps
				});
				newMapCircle.setMap(getCurrentMap());

				google.maps.event.addListener(newMapCircle, 'click', function (event) {
					console.log("newMapCircle click event", event);
				});
				console.log("newMapCircle", newMapCircle);
				return newMapCircle;
			});
		}
		else {
			mapCircles = [];
		}			
	};

	useEffect(() => {				
		applyMapMarkers((Array.isArray(markers)? markers : []));
	}, [, _map]);


	useEffect(() => {
		applyMapPolylines((Array.isArray(polylines)? polylines : []));
	}, [polylines, _map]);

	useEffect(() => {
		applyMapCircles((Array.isArray(circles)? circles : []));
	}, [circles, _map]);

	useEffect(() => {
		applyMapPolylines((Array.isArray(polylines)? polylines : []));
	}, [polylines, _map]);*/


	useEffect(() => {
		setMapMarkers((Array.isArray(markers)? markers : []));
		setMapPolylines((Array.isArray(polylines)? polylines : []));
		setMapCircles((Array.isArray(circles)? circles : []));
	}, [polylines, circles, markers]);
	
	

	


	
	let {user} = auth;

	if (!JSON.isJSON(user) || (JSON.isJSON(user) && !user._id)) {
		user = { _id: null };
	}

	

	
	const getclientPositionHeadingMarkerIcon = (user, position) => {		
		let computed_gender = (JSON.isJSON(user)? (String.isString(user.gender)? user.gender.trim().toLowerCase() : "male") : "male");
		let computed_heading = JSON.isJSON(position)? Number.parseNumber(position.heading, 360) : 360;


		let heading_approach_index = 0;
		if (!rounded_headings.includes(computed_heading)) {
			heading_approach_index = Math.round(((rounded_headings.length * (computed_heading / 360))-1));			
			computed_heading = rounded_headings[heading_approach_index];
		}

		if (computed_gender !== "male" && computed_gender !== "female") {
			computed_gender = "male";
		}
		/*if (!rounded_headings.includes(computed_heading)) {
			computed_heading = 360;
		}*/

		console.log("computed_gender+\"_heading_\"+computed_heading", computed_gender+"_heading_"+computed_heading);

		if (computed_gender === "female") {
			return client_user_female_icon;
		}
		
		return client_user_male_icon;

		//return heading_aware_client_position_marker_icons[computed_gender+"_heading_"+computed_heading];
	}

	/*const getRegionWidth = (target_region = null) => {
		target_region = target_region? target_region : false;
		if (target_region) {
			const lat1 = target_region.latitude - (region.latitudeDelta / 2);
			const lng1 = target_region.longitude;
			const lat2 = target_region.latitude + (region.latitudeDelta / 2);
			const lng2 = target_region.longitude;

			return crowFleightDistanceinKm(lat1, lng1, lat2, lng2);
		}			
	}*/

	const handleOnPressMarker = (socketId, data) => async event => {
		setSelectedItem({type: "clients_positions", id: socketId});
		if (Function.isFunction(onSelectClientPosition)) {
			onSelectClientPosition(socketId, data)
		}
	};

	const animateClientMarkerToPosition = ({socketId, user,  position}) => {
		var options = {
			duration: 1000,
			easing: function (x, t, b, c, d) { // jquery animation: swing (easeOutQuad)
				return -c *(t/=d)*(t-2) + b;
			}
		};

		let newPosition = new google.maps.LatLng(position.latitude, position.longitude);
		let kmph = position.speed? position.speed : 10;



		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

		// save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
		_clientsPositions[socketId].marker.AT_startPosition_lat = _clientsPositions[socketId].marker.getPosition().lat();
		_clientsPositions[socketId].marker.AT_startPosition_lng = _clientsPositions[socketId].marker.getPosition().lng();
		var newPosition_lat = newPosition.lat();
		var newPosition_lng = newPosition.lng();

		// crossing the 180° meridian and going the long way around the earth?
		if (Math.abs(newPosition_lng - _clientsPositions[socketId].marker.AT_startPosition_lng) > 180) {
			if (newPosition_lng > _clientsPositions[socketId].marker.AT_startPosition_lng) {
				newPosition_lng -= 360;
			} else {
				newPosition_lng += 360;
			}
		}

		var animateStep = function(marker, startTime) {
			var ellapsedTime = (new Date()).getTime() - startTime;
			var durationRatio = ellapsedTime / options.duration; // 0 - 1
			var easingDurationRatio = options.easing(durationRatio, ellapsedTime, 0, 1, options.duration);

			if (durationRatio < 1) {
				marker.setMap(getGoogleMapContextElement());
				marker.setPosition({
					lat: (
						marker.AT_startPosition_lat +
						(newPosition_lat - marker.AT_startPosition_lat)*easingDurationRatio
					),
					lng: (
						marker.AT_startPosition_lng +
						(newPosition_lng - marker.AT_startPosition_lng)*easingDurationRatio
					)
				});

				// use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
				if (window.requestAnimationFrame) {
					marker.AT_animationHandler = window.requestAnimationFrame(function() {animateStep(marker, startTime)});
				} else {
					marker.AT_animationHandler = setTimeout(function() {animateStep(marker, startTime)}, 17);
				}

			} else {
				marker.setMap(getGoogleMapContextElement());
				marker.setPosition(newPosition);
			}
			return marker;
		}

		// stop possibly running animation
		if (window.cancelAnimationFrame) {
			window.cancelAnimationFrame(_clientsPositions[socketId].marker.AT_animationHandler);
		} else {
			clearTimeout(_clientsPositions[socketId].marker.AT_animationHandler);
		}

		animateStep(_clientsPositions[socketId].marker, (new Date()).getTime());
	}

	

	const handleOnClientPositionChange = useCallback(({socketId, ...data}) => {	
		let {user, position, track} = data;
		if (!JSON.isEmpty(user) && !JSON.isEmpty(position)) {
			let currentMap = getCurrentMap();
			if (!regionBoundsClients[socketId]) {
				regionBoundsClients[socketId] = {};
					

				if (currentMap) {
					let mapBounds = currentMap.getBounds();
					if (mapBounds.contains({lat: data.position.latitude, lng: position.longitude})) {
						regionBoundsClients[socketId].user = user;
						regionBoundsClients[socketId].position = position;
						regionBoundsClients[socketId].marker = new google.maps.Marker({
										position: {lat: position.latitude, lng: position.longitude },
										title: user.first_name+" "+user.last_name,
										icon: {url: getclientPositionHeadingMarkerIcon(user, position), scaledSize:  new google.maps.Size(30,30)},
										onClick: handleOnPressMarker(socketId, data),
										duration: 250,
										map: currentMap,
						});
					}
				}
				
			}
			else {
				regionBoundsClients[socketId].user = user;
				regionBoundsClients[socketId].position = position;
				if (!regionBoundsClients[socketId].marker) {
					regionBoundsClients[socketId].marker = new google.maps.Marker({
										position: {lat: position.latitude, lng: position.longitude },
										title: user.first_name+" "+user.last_name,
										icon: {url: getclientPositionHeadingMarkerIcon(user, position), scaledSize:  new google.maps.Size(30,30)},
										onClick: handleOnPressMarker(socketId, data),
										duration: 250,
										map: currentMap,
						});
				}
				regionBoundsClients[socketId].marker.setIcon({url: getclientPositionHeadingMarkerIcon(user, position), scaledSize:  new google.maps.Size(30,30)});
				animateClientMarkerToPosition({socketId, ...data});
			}		
			
		}
	}, [regionBoundsClients]);

	const handleOnSocketConnect = () => {
		sockets.default.emit("get-clients-positions", { user: user, type: 'all' });
	};

	

	const applyMapOnAll = (google_map) => {
		mapMarkers.map(mapMarker =>{			
			mapMarker.setMap(google_map);			
		});
		if (JSON.isJSON(regionBoundsClients)) {
			Object.entries(regionBoundsClients).map(([socketId, regionBoundsClient]) => {
				if (regionBoundsClient.marker) {
					regionBoundsClient.marker.setMap(google_map);
				}
			});			
		}

		//console.log("mapCircles", mapCircles)
		mapCircles.map(mapCircle =>{			
			mapCircle.setMap(google_map);			
		});
		mapPolylines.map(mapPolyline =>{			
			mapPolyline.setMap(google_map);			
		});

	};
	//Memoized Method
	const setMapOnAll = useCallback(() => {
		return applyMapOnAll(_map);
	}, [_map, _clientsPositions, regionBoundsClients]);



	

	

	const handleOnSocketDisconnect = useCallback(() => {
		applyMapOnAll(null);
		_clientsPositions = {}; 
		regionBoundsClients = {};
		if (Function.isFunction(onLoadClientsPositions)) {
			onLoadClientsPositions(_clientsPositions);
		}
	}, [_map, _clientsPositions, regionBoundsClients, onLoadClientsPositions]);

	

	const handleOnNewClientPosition = useCallback(async ({socketId, ...data}) => {
		const  {user, position} = data;		
		if (!JSON.isEmpty(user) && !JSON.isEmpty(user)) {

			_clientsPositions = Object.entries(_clientsPositions).reduce((accumulator, [socketId, clientData], index) => {
				if (!JSON.isEmpty(clientData.position) && !JSON.isEmpty(clientData.user)) {
					if (clientData.user !== user._id) {
						accumulator[socketId] = clientData;
					}
				}
				return accumulator;						
			}, {});

			/*regionBoundsClients = Object.entries(regionBoundsClients).reduce((accumulator, [socketId, clientData], index) => {
				if (!JSON.isEmpty(clientData.position) && !JSON.isEmpty(clientData.user)) {
					if (clientData.user !== user._id) {
						accumulator[socketId] = clientData;
					}
				}
				return accumulator;						
			}, {});*/

			_clientsPositions[socketId] = data;
			if (Function.isFunction(onClientPositionAvailable)) {
				onClientPositionAvailable(socketId, data);
			}

		}
				
	}, [_map, _clientsPositions, regionBoundsClients, onClientPositionAvailable]);

	
	const handleOnClientsPositions = useCallback(async (clients_positions) => {	
		let clients_positions_user_ids = []
		_clientsPositions = Object.entries(clients_positions).reduce((accumulator, [socketId, clientData], index) => {
			if (!JSON.isEmpty(clientData.position) && !JSON.isEmpty(clientData.user)) {
				if (!clients_positions_user_ids.includes(user._id)) {
					accumulator[socketId] = clientData;
				}
			}
			return accumulator;						
		}, {});
		

		if (Function.isFunction(onLoadClientsPositions)) {
			onLoadClientsPositions(_clientsPositions);
		}


	}, [_clientsPositions, regionBoundsClients, onLoadClientsPositions]);
	

	const handleOnClientPositionUnavailable = useCallback(({socketId, ...data}) => {
			if (_clientsPositions[socketId]) {
				if (_clientsPositions[socketId].marker) {
					_clientsPositions[socketId].marker.setMap(null);
				}
			}

			if (regionBoundsClients[socketId]) {
				if (regionBoundsClients[socketId].marker) {
					regionBoundsClients[socketId].marker.setMap(null);
				}
			}
				
			delete regionBoundsClients[socketId];
			delete _clientsPositions[socketId];

			if (Function.isFunction(onClientPositionUnavailable)) {
				onClientPositionUnavailable(socketId, data);
			}		
		
	}, [_clientsPositions, regionBoundsClients, onClientPositionUnavailable]);

	

	const initSockets = () => {
		if (sockets.default) {
			sockets.default.on("new-client-position", handleOnNewClientPosition);
			sockets.default.on("clients-positions", handleOnClientsPositions);
			sockets.default.on("client-position-unavailable", handleOnClientPositionUnavailable);
			sockets.default.on("client-position-changed", handleOnClientPositionChange);
			sockets.default.on("disconnect", handleOnSocketDisconnect);
			sockets.default.on("reconnect", handleOnSocketConnect);
			if (sockets.default.connected) {
				sockets.default.emit("get-clients-positions", { user: user, type: 'all' });
			}
			else{
				sockets.default.on("connect", handleOnSocketConnect);
			}
			setSocketsInitialized(true);				
		}
			
	}

	


	const prepareMapBoundsClientsMarkers = useCallback((mapBounds) => {
		if (mapBounds) {
					regionBoundsClients = Object.entries(regionBoundsClients).reduce((accumulator, [socketId, clientData], index) => {
							if (clientData.marker instanceof google.maps.Marker) {
								clientData.marker.setMap(null);
							}	
							return accumulator;						
					}, {});
					regionBoundsClients = Object.entries(_clientsPositions).reduce((accumulator, [socketId, clientData], index) => {		
						if (!JSON.isEmpty(clientData.position) && !JSON.isEmpty(clientData.user)) {
							if (mapBounds.contains({lat: clientData.position.latitude, lng: clientData.position.longitude})) {
								let {user, position} = clientData;
								let marker = clientData.marker;
								if (!marker) {
									marker = new google.maps.Marker({
										position: {lat: position.latitude, lng: position.longitude },
										title: user.first_name+" "+user.last_name,
										icon: {url: getclientPositionHeadingMarkerIcon(user, position), scaledSize:  new google.maps.Size(30,30)},
										onClick: handleOnPressMarker(socketId, clientData),
										duration: 250,
									});
								}
								marker.setPosition({lat: position.latitude, lng: position.longitude });
								marker.setMap(getGoogleMapContextElement());
								google.maps.event.addListener(marker, 'click', function () {
									showClientInfoWindow({socketId: socketId, ...clientData}, getGoogleMapContextElement(), marker, history);
					            });
					            clientData.marker= marker;
								accumulator[socketId] = clientData;
							}
						}			
						return accumulator;						
					}, {});
		}						
	}, [_clientsPositions]);


	

	const handleOnBoundsChanged = useCallback(() => {
		//const { center, zoom, bounds, marginBounds } = event;
		//console.log("handleOnBoundsChanged event", event);
		if (_map) {
			mapBounds = _map.getBounds();
			
			prepareMapBoundsClientsMarkers(mapBounds);
			if (Function.isFunction(onBoundsChanged)) {
				onBoundsChanged(mapBounds);
			}
		}
	}, [_map]);



	
	

	
	/*useEffect(() => {		
		//console.log({type: selectedEntryType, id: selectedEntry});
		if (selectedEntryType && (Number.isNumber(selectedEntry) || String.isString(selectedEntry))) {
			let googlemap = false;
			if (_map) {
				googlemap = _map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
			}
			
			
			if (selectedEntryType === "polyline" && polylines[selectedEntry]) {
				let LatLngList = polylines[selectedEntry].path;
				//  Create a new viewpoint bound
				let bounds = new google.maps.LatLngBounds ();
				//  Go through each...
				for (let i = 0;  i < LatLngList.length; i++) {
				  //  And increase the bounds to take this point
				  bounds.extend(new google.maps.LatLng (LatLngList[i].lat, LatLngList[i].lng));
				}
				if (googlemap) {
					googlemap.fitBounds(bounds);
				}
			}

			if (selectedEntryType === "circle" && circles[selectedEntry]) {
				
				let selectedCircle = new google.maps.Circle({
					...circles[selectedEntry],
				});

				let bounds = new google.maps.LatLngBounds();
				bounds.union(selectedCircle.getBounds());

				if (googlemap) {
					googlemap.fitBounds(bounds);
				}
				
			}

		}
		setSelectedItem({type: selectedEntryType, id: selectedEntry});
		
	}, [selectedEntry, selectedEntryType, _map, polylines, circles, markers]);*/
	


	useLayoutEffect(() => {
		if (_map) {
			if (Function.isFunction(onMapLoad)) {
				onMapLoad(_map, google);
			}
			setMapOnAll(_map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
		}
		else {
			setMapOnAll(null);
		}
	}, [_map]);


	useEffect(() => {	
		if (!socketsInitialized) {
			initSockets();
		}
		return () => {
			sockets.default.off("new-client-position", handleOnNewClientPosition);
			sockets.default.off("client-position-changed", handleOnClientPositionChange);
			sockets.default.off("clients-positions", handleOnClientsPositions);
			sockets.default.off("client-position-unavailable", handleOnClientPositionUnavailable);
			sockets.default.off("connect", handleOnSocketConnect);
			sockets.default.off("reconnect", handleOnSocketConnect);
		}
	}, [sockets]);

	

	


	useEffect(() => {	
		if (infoWindowOpen && selectedItem.type === "clients_position" && selectedItem.id in regionBoundsClients) {
			if (infoWindowPosition.lat !== regionBoundsClients[selectedItem.id].position.latitude || infoWindowPosition.lng !== regionBoundsClients[selectedItem.id].position.longitude) {
				setInfoWindowPosition({lat: regionBoundsClients[selectedItem.id].position.latitude, lng: regionBoundsClients[selectedItem.id].position.longitude })
			}
		}
		else if (infoWindowOpen && selectedItem.type === "clients_position" && !(selectedItem.id in regionBoundsClients)) {
			setInfoWindowContent(null);
			setInfoWindowPosition(null);
			setInfoWindowOpen(false);
		}
		
	}, [infoWindowOpen, selectedItem, infoWindowPosition]);





		return (
			<GoogleMap
				className="relative"
				defaultZoom={defaultZoom}
				zoom={zoom}
				defaultCenter={defaultCenter}
				defaultOptions={{
					styles: props.mapStyles ? props.mapStyles : (props.theme === "dark"? mapDarkStyles : mapStyles),
				}}
				ref={mapRef => {
					_map = mapRef;	
				}}
				onBoundsChanged={handleOnBoundsChanged}
			>
				{props.draw && (
					<DrawingManager
						defaultDrawingMode={google.maps.drawing.OverlayType.CIRCLE}
						defaultOptions={{
							drawingControl: true,
							drawingControlOptions: {
								position: google.maps.ControlPosition.TOP_CENTER,
								drawingModes: [
									google.maps.drawing.OverlayType.CIRCLE,
									google.maps.drawing.OverlayType.POLYGON,
									google.maps.drawing.OverlayType.POLYLINE,
									google.maps.drawing.OverlayType.RECTANGLE,
								],
							},
							circleOptions: {
								fillColor: colors.hex.accent,
								fillOpacity: 0.6,
								strokeColor: colors.hex.accent,
								strokeWeight: 2,
								clickable: false,
								editable: true,
								zIndex: 1,
							},
						}}
					/>
				)}
				{Array.isArray(mapPolylines) &&
					mapPolylines.map((polyline, index) => (
						<Polyline
							path={polyline.path}
							geodesic={true}
							options={{
								strokeColor: selectedItem.type == "polyline" && selectedItem.id === index? colors.hex.accent : (polyline.color ? polyline.color : colors.hex.accent),
								strokeOpacity: selectedItem.type == "polyline" && selectedItem.id === index?  1 : (selectedItem.type != "polyline" ? polyline.opacity : 0.2),
								strokeWeight:selectedItem.type == "polyline" && selectedItem.id === index?  4 : (selectedItem.type != "polyline" ? polyline.strokeWeight : 3),
							}}
							onClick={event => {
								setSelectedItem({type: "polyline", id: index });

								var infowindow = new google.maps.InfoWindow({
									content:
										(polyline.infoWindow? ReactDOMServer.renderToStaticMarkup(polyline.infoWindow): polyline.title ? polyline.title: "") +
										("<br/> Crow fleight distance from Start: " +
											crowFleightDistanceinKm(
												event.latLng.lat(),
												event.latLng.lng(),
												polyline.path[0].lat,
												polyline.path[0].lng
											).toFixed(2) +
											" Km"),
									position: event.latLng,
								});

								infowindow.open(
									_map.context
										.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
								);							}}
							key={"polyline-" + index}
						/>
					))}

				{Array.isArray(mapCircles) &&
					mapCircles.map(({ infoWindow, ...rest }, index) => (
						<Circle
							{...rest}
							options={{
								fillColor: selectedItem.type == "circle" && selectedItem.id === index? colors.hex.accent : (rest.fillColor ? rest.fillColor : colors.hex.accent),
								strokeColor: rest.color ? rest.color : colors.hex.accent,
								strokeOpacity: selectedItem.type == "circle" && selectedItem.id === index?  1 : (selectedItem.type != "circle" ? rest.opacity : 0.2),
								fillOpacity: selectedItem.type == "circle" && selectedItem.id === index?  0.5 : (selectedItem.type != "circle"? rest.opacity : 0.2),
								strokeWeight: selectedItem.type == "circle" && selectedItem.id === index?  4 : (selectedItem.type != "circle" ? rest.strokeWeight : 1),
							}}
							onClick={event => {
								setSelectedItem({type: "polyline", id: index });
								if (infoWindow) {
									new google.maps.InfoWindow({
										content: ReactDOMServer.renderToStaticMarkup(
											infoWindow
										),
										position: event.latLng,
									}).open(
										_map.context
											.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
									);
								}
							}}
							key={"circle-" + index}
						/>
					))}

				{Array.isArray(mapMarkers) &&
					mapMarkers.map(
						({ position, title, infoWindow, ...rest }, index) =>
							typeof google !== undefined && (
								<Marker
									animation={google.maps.Animation.DROP}
									position={position}
									title={title}
									key={"marker-" + index}
									onClick={event => {
										setSelectedItem({type: "circles", id: index });
										var infowindow = new google.maps.InfoWindow(
											{
												content: infoWindow
													? ReactDOMServer.renderToStaticMarkup(
															infoWindow
													  )
													: title
													? title
													: "",
												position: event.latLng,
											}
										);

										infowindow.open(_map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
									}}
									{...rest}
								/>
							)
					)}

				{/*(JSON.isJSON(regionBoundsClients) && showClientsPositions) && Object.entries(regionBoundsClients).map(([socketId, { position, user, ...rest }], index) =>
						(typeof google !== undefined && JSON.isJSON(position) && JSON.isJSON(user)) && (
								<Marker
									position={{lat: position.latitude, lng: position.longitude }}
									title={user.first_name+" "+user.last_name}
									key={"client-marker-" + index}
									icon={{url: client_user_male_icon, scaledSize: { width: 32, height: 32 }, rotation: position.heading } }
									onClick={handleOnPressMarker(socketId, { position: position, user: user, ...rest })}
									style={{transform: "rotate(" + 100 + "deg)"}}
									shape={[16, 16, 8]}
									ref={ _marker => {
										//console.log("_marker", _marker)
									}}
									{...rest}
								/>
						)
					)*/}

				{JSON.isJSON(props.currentDevicePosition) &&
					props.showCurrentPosition && (
						<Marker
							position={props.currentDevicePosition.coordinates}
							title={props.currentDevicePosition.title}
							icon={current_position_marker_icon}
						/>
					)}

				{JSON.isJSON(props.marker) && <Marker {...props.marker} />}
				{JSON.isJSON(props.circle) && <Marker {...props.circle} />}

				{(infoWindowOpen && infoWindowPosition && infoWindowContent) && <InfoWindow position={infoWindowPosition} onCloseClick={() => setInfoWindowOpen(false) }>
					{infoWindowContent}
				</InfoWindow>}

				{props.showSearchBar && (
					<div className={"absolute bottom-0 mb-4 py-1 px-2 sm:w-full md:w-5/6 lg:w-4/6 "} >
						<Paper
							component="div"
							className={"flex items-center w-full relative py-1 px-2"}
						>
							<LocationSearchInput
								variant="plain"
								margin="none"
								controlPosition={google.maps.ControlPosition.BOTTOM_CENTER}
								{...props.searchBarProps}
							/>
						</Paper>
					</div>
					
				)}
			</GoogleMap>
		);


		
	
}));

/*export default compose(
	withScriptjs,
	withGoogleMap,
	connect(mapStateToProps, {}),
)(ActualGoogleMap);*/
//export default connect(mapStateToProps, {})(ActualGoogleMap);
