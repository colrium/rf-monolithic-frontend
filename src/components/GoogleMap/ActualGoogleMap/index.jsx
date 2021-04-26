/*global google*/

import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
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
    withScriptjs,
} from "react-google-maps";
import { ThemeProvider } from '@material-ui/core/styles';
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
import Avatar from '@material-ui/core/Avatar';
import Typography from 'components/Typography';
import mapStyles, {mapDarkStyles} from "./mapStyles";
import {LocationInput as LocationSearchInput } from "components/FormInputs";
import { compose } from "recompose";
import { useHistory } from "react-router-dom";

import {useGlobals} from "contexts/Globals";
import { colors } from "assets/jss/app-theme";
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
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';

import { google_maps } from "config";
import { theme, theme_dark } from "assets/jss/app-theme";
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


const icon_names = ["female", "female_1", "female_2", "female_3", "female_4", "female_5", "female_6", "male", "male_1", "male_2", "male_3", "male_4", "male_5", "male_6", "them_1", "them_2", "them_3" ];


// Pick your pin (hole or no hole)
    


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

const ClientInfoWindow = ({user, track, position, history, app, ...rest}) => {
	const { preferences } = app;

	return (
		<ThemeProvider theme={preferences? (preferences.theme==="dark"? theme_dark :  theme) :  theme}>
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
		</ThemeProvider>
	)
};

let _clientsPositionsOpenPopups = [];

let showClientInfoWindow = ({socketId, ...data}, google_map, marker, history, app) => {
	if (google_map, marker && !_clientsPositionsOpenPopups.includes(socketId)) {
		var infoWindow = new google.maps.InfoWindow({content: ReactDOMServer.renderToStaticMarkup(<ClientInfoWindow history={history} app={app} {...data} />)});
		infoWindow.open(google_map, marker);
		_clientsPositionsOpenPopups.push(socketId);
		google.maps.event.addListener(infoWindow,'closeclick',function(){
            let position = _clientsPositionsOpenPopups.indexOf(socketId);
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
	communication: state.communication,
});

export default compose(
	withScriptjs,
	withGoogleMap,
	connect(mapStateToProps, {}),
)( React.memo(props => {
	let [map, setMap] = useState(null);
	let history = useHistory();
	

	let clientMarkers = {};


	const { onMapLoad, device, auth, app, markers, polylines, circles, showDeviceLocation, showClientsPositions, selectedEntry, selectedEntryType, onLoadClientsPositions, onClientPositionAvailable, onClientPositionChanged, onClientPositionUnavailable, onSelectClientPosition, defaultCenter, onBoundsChanged, zoom, defaultZoom, currentDevicePosition, communication:{ messaging: contactactable_contacts_ids }} = props;

	

	let globals = useGlobals();
	let sockets = globals? globals.sockets : {};
	let services = globals? globals.services : {};

	

	
	const [ socketsInitialized, setSocketsInitialized ] = useState(false);

	

	
	const [ selectedItem, setSelectedItem ] = useState({id: selectedEntry, type: selectedEntryType});
	const [ infoWindowContent, setInfoWindowContent ] = useState(null);
	const [ infoWindowPosition, setInfoWindowPosition ] = useState(null);	
	const [ infoWindowOpen, setInfoWindowOpen ] = useState(false);
	const [ mapMarkers, setMapMarkers ] = useState(Array.isArray(markers)? markers : []);
	const [ mapPolylines, setMapPolylines ] = useState(Array.isArray(polylines)? polylines : []);
	const [ mapCircles, setMapCircles ] = useState(Array.isArray(circles)? circles : []);

	const [ mapCenter, setMapCenter ] = useState(defaultCenter);
	const [ mapZoom, setMapZoom ] = useState(defaultZoom);
	
	


	var pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
    var labelOriginHole = new google.maps.Point(12,15);
    var pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
    var labelOriginFilled =  new google.maps.Point(12,9);


    var polylineMarkerImage = {
        path: pinSVGHole,
        anchor: new google.maps.Point(12,17),
        fillOpacity: 1,
        fillColor: "#8C189B",
        strokeWeight: 2.5,
        strokeColor: "white",
        scale: 1.5,
        labelOrigin: labelOriginFilled
    };
	

	//Memoized Methods
	const getActualGoogleMapInstance = useCallback(() => {
		if (_map) {			
			if (_map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED instanceof google.maps.Map) {
				return _map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
			}			
		}
		return null;
	}, [_map]);

	//Memoized Methods
	const getCurrentMap = useCallback(() => {
		return _map;
	}, [_map]);

	


	
	

	


	
	let {user} = auth;

	if (!JSON.isJSON(user) || (JSON.isJSON(user) && !user._id)) {
		user = { _id: null };
	}

	

	
	const getclientPositionHeadingMarkerIcon = (user, position) => {		
		let computed_icon = JSON.isJSON(user)? (String.isString(user.icon)? (user.icon.startsWith(user.gender)? user.icon : user.gender) : ((String.isString(user.gender)? user.gender.trim().toLowerCase() : "male")) : "male") : "male";
		
		if (!computed_icon) {
			computed_icon = "male";
		}

		//console.log("computed_icon", computed_icon);

		if (process.env.NODE_ENV === "development") {
			computed_icon = icon_names[Math.floor(Math.random() * icon_names.length)];
		}
		
		
		return `${process.env.PUBLIC_URL}/img/${computed_icon}.png`
		
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

	const animateClientMarkerToPosition = (marker, {socketId, user,  position}) => {
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
		marker.AT_startPosition_lat = marker.getPosition().lat();
		marker.AT_startPosition_lng = marker.getPosition().lng();
		var newPosition_lat = newPosition.lat();
		var newPosition_lng = newPosition.lng();

		// crossing the 180° meridian and going the long way around the earth?
		if (Math.abs(newPosition_lng - marker.AT_startPosition_lng) > 180) {
			if (newPosition_lng > marker.AT_startPosition_lng) {
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
				marker.setMap(getActualGoogleMapInstance());
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
				marker.setMap(getActualGoogleMapInstance());
				marker.setPosition(newPosition);
			}
			return marker;
		}

		// stop possibly running animation
		if (window.cancelAnimationFrame) {
			window.cancelAnimationFrame(marker.AT_animationHandler);
		} else {
			clearTimeout(marker.AT_animationHandler);
		}

		animateStep(marker, (new Date()).getTime());
	}

	

	const handleOnClientPositionChange = useCallback(({socketId, ...data}) => {	
		let {user, position, track} = data;
		if (!JSON.isEmpty(user) && !JSON.isEmpty(position)) {
			let clientInList = auth.user.isAdmin || (Array.isArray(contactactable_contacts_ids)? contactactable_contacts_ids.includes(user._id) : false);
			if (clientInList) {
				let currentMap = getActualGoogleMapInstance();

				if (!regionBoundsClients[socketId]) {
					regionBoundsClients[socketId] = {};
						

					if (currentMap) {
						let mapBounds = currentMap.getBounds();
						if (mapBounds) {
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
					animateClientMarkerToPosition(regionBoundsClients[socketId].marker, {socketId, ...data});
				}	
			}
					
			
		}
	}, [regionBoundsClients, contactactable_contacts_ids]);

	const handleOnSocketConnect = () => {
        sockets.default.emit("get-clients-positions", { user: user, type: 'all' });
    };

	

	const applyMapOnAll = (google_map, clients_positions_only=false) => {
		if (Array.isArray(markers) && !clients_positions_only) {
			markers.map(mapMarker =>{
                if (Function.isFunction(mapMarker.setMap)) {
					mapMarker.setMap(google_map);	
				}
            });
		}
			
		if (JSON.isJSON(regionBoundsClients)) {
			Object.entries(regionBoundsClients).map(([socketId, regionBoundsClient]) => {
				if (regionBoundsClient.marker) {
					regionBoundsClient.marker.setMap(google_map);
				}
			});			
		}

		if (JSON.isJSON(_clientsPositions)) {
			Object.entries(_clientsPositions).map(([socketId, clientsPosition]) => {
				if (clientsPosition.marker) {
					clientsPosition.marker.setMap(google_map);
				}
			});			
		}

		//console.log("mapCircles", mapCircles)
		if (Array.isArray(circles) && !clients_positions_only) {
			circles.map(mapCircle =>{
                if (Function.isFunction(mapCircle.setMap)) {
					mapCircle.setMap(google_map);	
				}
            });
		}

		if (Array.isArray(polylines) && !clients_positions_only) {
			polylines.map(mapPolyline =>{
                if (Function.isFunction(mapPolyline.setMap)) {
					mapPolyline.setMap(google_map);	
				}
            });
		}

	};

	//Memoized Method
	const setMapOnAll = useCallback(() => {
		return applyMapOnAll(_map);
	}, [_map, _clientsPositions, regionBoundsClients]);



	

	

	const handleOnSocketDisconnect = useCallback(() => {
		applyMapOnAll(null, true);
		_clientsPositions = {}; 
		regionBoundsClients = {};
		if (Function.isFunction(onLoadClientsPositions)) {
			onLoadClientsPositions(_clientsPositions);
		}
	}, [_map, _clientsPositions, regionBoundsClients, onLoadClientsPositions]);

	

	const handleOnNewClientPosition = useCallback(async ({socketId, ...data}) => {
		const  {user, position} = data;		
		if (user) {

			_clientsPositions = Object.entries(_clientsPositions).reduce((accumulator, [socketId, clientData], index) => {
				if (!JSON.isEmpty(clientData.position) && !JSON.isEmpty(clientData.user)) {
					let appendClientToList = clientData.user !== user._id && (auth.user.isAdmin || (Array.isArray(contactactable_contacts_ids)? contactactable_contacts_ids.includes(user._id) : false));
					
					if (appendClientToList) {
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
			let appendClientToList = auth.user.isAdmin || (Array.isArray(contactactable_contacts_ids)? contactactable_contacts_ids.includes(user._id) : false);
			if (appendClientToList) {
				_clientsPositions[socketId] = data;
				if (Function.isFunction(onClientPositionAvailable)) {
					onClientPositionAvailable(socketId, data);
				}
			}
		}
				
	}, [_map, _clientsPositions, regionBoundsClients, onClientPositionAvailable, contactactable_contacts_ids]);

	
	const handleOnClientsPositions = useCallback(async (clients_positions) => {	
		let clients_positions_user_ids = []
		_clientsPositions = Object.entries(clients_positions).reduce((accumulator, [socketId, clientData], index) => {
			if (!JSON.isEmpty(clientData.position) && !JSON.isEmpty(clientData.user)) {
				if (!clients_positions_user_ids.includes(user._id)) {
					let appendClientToList = auth.user.isAdmin || (Array.isArray(contactactable_contacts_ids)? contactactable_contacts_ids.includes(user._id) : false);
					
					if (appendClientToList) {
						accumulator[socketId] = clientData;
					}

					
				}
			}
			return accumulator;						
		}, {});

		if (Function.isFunction(onLoadClientsPositions)) {
			onLoadClientsPositions(_clientsPositions);
		}


	}, [_clientsPositions, regionBoundsClients, onLoadClientsPositions, contactactable_contacts_ids]);
	

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
								marker.setMap(getActualGoogleMapInstance());
								google.maps.event.addListener(marker, 'click', function () {
									showClientInfoWindow({socketId: socketId, ...clientData}, getActualGoogleMapInstance(), marker, history, app);
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




	useEffect(() => {	
		setMapMarkers(prevMapMarkers => {
			if (Array.isArray(prevMapMarkers) && prevMapMarkers.length > 0) {
				prevMapMarkers.map(prevMapMarker => {
					if (prevMapMarker instanceof google.maps.Marker) {
						prevMapMarker.setMap(null);
					}
					
				});
			}
			let newMapMarkers = [];
			if (Array.isArray(markers)) {
				newMapMarkers = markers.map(marker => {
					const { infowindow, ...markerProps} = marker;
					let newMapMarker = new google.maps.Marker(markerProps);
					newMapMarker.setMap(getActualGoogleMapInstance());
					return newMapMarker;
				});
			}
			return newMapMarkers;
		});
	}, [markers]);

	useEffect(() => {	
		setMapPolylines(prevMapPolylines => {
			if (Array.isArray(prevMapPolylines) && prevMapPolylines.length > 0) {
				prevMapPolylines.map(prevMapPolyline => {
					if (prevMapPolyline instanceof google.maps.Polyline) {
						prevMapPolyline.setMap(null);
					}					
				});				
			}
			let newMapPolylines = [];
			if (Array.isArray(polylines)) {
				polylines.map((polyline, index) => {
					const { infoWindow, ...polylineProps} = polyline;
					//console.log("polylineProps", polylineProps)
					if (Array.isArray(polylineProps.path) && polylineProps.path.length > 0) {
						
						let polylineMapMarker = new google.maps.Marker({
							position: polylineProps.path[0], 
							title: polylineProps.title,
							fillColor: "#000000"
							//icon: polylineMarkerImage,
						});
						polylineMapMarker.setMap(getActualGoogleMapInstance());
					}
						let newMapPolyline = new google.maps.Polyline({
							options: {
									fillColor: selectedEntryType == "polyline" && selectedEntry === index? (polylineProps.fillColor ? polylineProps.fillColor : colors.hex.accent) : colors.hex.default,
									strokeColor: selectedEntryType == "polyline" && selectedEntry === index? (polylineProps.color ? polylineProps.color : colors.hex.accent) : colors.hex.default,
									strokeOpacity: 1,
									fillOpacity: 1,
									strokeWeight: selectedEntryType == "polyline" && selectedEntry === index?  1.5 : (selectedEntryType != "polyline" ? polylineProps.strokeWeight : 1.5),
									zIndex: selectedEntryType == "polyline" && selectedEntry === index?  999 : (selectedEntryType != "polyline" ? polylineProps.strokeWeight : 1),
							},
							...polylineProps
						});
						newMapPolyline.setMap(getActualGoogleMapInstance());
						google.maps.event.addListener(newMapPolyline, 'click', function (event) {				
									newMapPolyline.setOptions({
										fillColor: (polylineProps.fillColor ? polylineProps.fillColor : colors.hex.accent),
										strokeColor: (polylineProps.color ? polylineProps.color : colors.hex.accent),
										strokeOpacity: 1,
										fillOpacity: 0.8,
										strokeWeight: 4,
									});
									var infowindow = new google.maps.InfoWindow({
										content:
											(polyline.infoWindow? ReactDOMServer.renderToStaticMarkup(infoWindow): polylineProps.title ? polylineProps.title: "") +
											("<br/> Crow fleight distance from Start: " +
												crowFleightDistanceinKm(
													event.latLng.lat(),
													event.latLng.lng(),
													polylineProps.path[0].lat,
													polylineProps.path[0].lng
												).toFixed(2) +
												" Km"),
										position: event.latLng,
									});

									infowindow.open(getActualGoogleMapInstance());
						});
						newMapPolylines.push(newMapPolyline);
						
				});
			}
			return newMapPolylines;
		});
	}, [polylines, selectedEntryType, selectedEntry]);



	useEffect(() => {
		setMapCircles(prevMapCircles => {
			if (Array.isArray(prevMapCircles) && prevMapCircles.length > 0) {
				prevMapCircles.map(prevMapCircle => {
					if (prevMapCircle instanceof google.maps.Circle) {
						prevMapCircle.setMap(null);
					}					
				});
			}
			let newMapCircles = [];
			if (Array.isArray(circles)) {
				newMapCircles = circles.map((newCircle, index) => {
					const { infowindow, ...circleProps} = newCircle;
					let newMapCircle = new google.maps.Circle({
						...circleProps,
						options: {
								fillColor: selectedEntryType == "circle" && selectedEntry === index? colors.hex.accent : (circleProps.fillColor ? circleProps.fillColor : colors.hex.accent),
								strokeColor: circleProps.color ? circleProps.color : colors.hex.accent,
								strokeOpacity: selectedEntryType == "circle" && selectedEntry === index?  1 : (selectedEntryType != "circle" ? circleProps.opacity : 0.2),
								fillOpacity: selectedEntryType == "circle" && selectedEntry === index?  0.5 : (selectedEntryType != "circle"? circleProps.opacity : 0.2),
								strokeWeight: selectedEntryType == "circle" && selectedEntry === index?  4 : (selectedEntryType != "circle" ? circleProps.strokeWeight : 1),
						},
						
					});
					newMapCircle.setMap(getActualGoogleMapInstance());

					google.maps.event.addListener(newMapCircle, 'click', function (event) {
						new google.maps.InfoWindow({
									content: (infowindow? ReactDOMServer.renderToStaticMarkup(infowindow): circleProps.title ? circleProps.title: ""),
									position: event.latLng,
								}).open(getActualGoogleMapInstance());
					});
					return newMapCircle;
				});
			}
			return newMapCircles;
		});
	}, [circles, selectedEntryType, selectedEntry]);

	

	
	useEffect(() => {		
		//console.log({type: selectedEntryType, id: selectedEntry});
		if (selectedEntryType && (Number.isNumber(selectedEntry) || String.isString(selectedEntry))) {
			let googlemap = getActualGoogleMapInstance();
			
			if (selectedEntryType === "polyline" && polylines[selectedEntry]) {
				let selectedPolyline = polylines[selectedEntry];
				let LatLngList = selectedPolyline.path;
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

			if (selectedEntryType === "circle" && mapCircles[selectedEntry] instanceof google.maps.Circle) {				
				let selectedCircle = mapCircles[selectedEntry];
				let bounds = new google.maps.LatLngBounds();
					bounds.union(selectedCircle.getBounds());

				if (googlemap) {
					googlemap.fitBounds(bounds);
				}
			}
		}
		
	}, [selectedEntry, selectedEntryType, mapMarkers, mapCircles, mapPolylines]);
	


	useLayoutEffect(() => {
		if (_map) {
			setMapOnAll(getActualGoogleMapInstance());
			if (Function.isFunction(onMapLoad)) {
				onMapLoad(getActualGoogleMapInstance(), google);
			}
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
			//sockets.default.off("reconnect", handleOnSocketConnect);
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
		else if (selectedItem.type === "circle") {
			
		}
		
	}, [infoWindowOpen, selectedItem, infoWindowPosition]);





		return (
			<GoogleMap
				className="relative"
				defaultZoom={mapZoom}
				zoom={zoom}
				defaultCenter={mapCenter}
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
