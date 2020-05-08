/*global google*/

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";
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
import { mdiTooltipAccount as clientPositionMarkerPath } from '@mdi/js';
import LocationSearchInput from "../LocationSearchInput";

import { compose } from "recompose";
import { withStyles } from "@material-ui/core";
import {useGlobals} from "contexts/Globals";
import { colors } from "assets/jss/app-theme";
//

//
const mapStyles = [
	{
		"featureType": "administrative",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#444444"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "all",
		"stylers": [
			{
				"color": "#f2f2f2"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.attraction",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.government",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "all",
		"stylers": [
			{
				"color": "#d9e8d9"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#707070"
			}
		]
	},
	{
		"featureType": "poi.place_of_worship",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.school",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.school",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.school",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			},
			{
				"saturation": "46"
			}
		]
	},
	{
		"featureType": "poi.sports_complex",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "all",
		"stylers": [
			{
				"saturation": -100
			},
			{
				"lightness": "27"
			},
			{
				"gamma": "1.20"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "all",
		"stylers": [
			{
				"color": "#5c9b60"
			},
			{
				"visibility": "on"
			}
		]
	}
];

const mapDarkStyles = [
	{
		"featureType": "all",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"saturation": 36
			},
			{
				"color": "#000000"
			},
			{
				"lightness": 40
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#000000"
			},
			{
				"lightness": 16
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 20
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 17
			},
			{
				"weight": 1.2
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative.country",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#6d6d6d"
			}
		]
	},
	{
		"featureType": "administrative.province",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#6e6e6e"
			}
		]
	},
	{
		"featureType": "administrative.locality",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "administrative.neighborhood",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 20
			}
		]
	},
	{
		"featureType": "landscape.man_made",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#383838"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 21
			},
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.attraction",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.government",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "all",
		"stylers": [
			{
				"color": "#363b38"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels",
		"stylers": [
			{
				"color": "#707070"
			}
		]
	},
	{
		"featureType": "poi.place_of_worship",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.school",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.school",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.school",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			},
			{
				"saturation": "46"
			}
		]
	},
	{
		"featureType": "poi.sports_complex",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#161616"
			},
			{
				"lightness": 17
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 29
			},
			{
				"weight": 0.2
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#141414"
			},
			{
				"lightness": 18
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#1a1a1a"
			},
			{
				"lightness": 16
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 19
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#101c11"
			},
			{
				"lightness": 17
			}
		]
	}
];


const current_position_marker_icon = {
	path: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
	fillColor: "#0076d6",
	fillOpacity: 1,
	strokeOpacity: 0.3,
	strokeWeight: 8,
	strokeColor: "#0076d6",
	scale: 0.1, //to reduce the size of icons
};

const client_position_marker_icon = {
	//path: "m 20.073331,0.06216702 c 3.79432,0.41734 7.45896,2.10713998 10.30993,4.75712998 3.00933,2.78519 5.11513,6.71834 5.87973,10.95353 0.31769,1.79439 0.31769,4.86121 -0.0102,6.71834 -0.27835,1.60664 -1.00311,3.95357 -1.68853,5.46632 -1.52968,3.41121 -3.60537,6.36324 -8.75013,12.42444 -3.54611,4.17295 -5.37357,6.5408 -6.85321,8.84641 -0.62567,0.96986 -0.7646,1.00156 -1.23143,0.22959 -1.1124,-1.85663 -3.4368,-4.87192 -7.12135,-9.23212 -3.4168895,-4.04743 -4.6385895,-5.60202 -6.0288595,-7.62599 -3.43681,-5.04896 -5.00584,-10.41119 -4.47975,-15.40811 0.89381,-8.6061 7.00234,-15.47036 15.0772595,-16.93106998 1.33051,-0.2398 3.66463,-0.33367 4.89654,-0.19847 z",
	path: clientPositionMarkerPath,
	fillColor: "#FF0000",
	fillOpacity: 1,
	strokeOpacity: 0,
	scale: 1,
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

let _map = null;
let _searchBox = null;

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
	let [state, setState] = useState(props);
	let [region, setRegion] = useState({});


	

	const { onMapLoad, device, auth, showDeviceLocation, showClientsPositions, selectedClient, onLoadClientsPositions, onClientPositionAvailable, onClientPositionChanged, onClientPositionUnavailable, onSelectClientPosition} = props;
	let globals = useGlobals();
	let sockets = globals? globals.sockets : {};
	let services = globals? globals.services : {};

	const [ mounted, setMounted ] = useState(false);
	const [ socketsInitialized, setSocketsInitialized ] = useState(false);
	const [ regionWidth, setRegionWidth ] = useState(0);
	const [ selectedClientSocketId, setSelectedClientSocketId ] = useState(selectedClient);
	const [ clientsPositions, setClientsPositions ] = useState({});
	const [ regionBoundsClients, setRegionBoundsClients ] = useState([]);
	

	/*useEffect(() => {
		setSelectedClientSocketId(selectedClient);
	}, [selectedClient]);*/
	
	let {user} = auth;

	if (!JSON.isJSON(user) || (JSON.isJSON(user) && !user._id)) {
		user = { _id: null };
	}

	


	const getRegionWidth = (target_region = null) => {
		target_region = target_region? target_region : false;
		if (target_region) {
			const lat1 = target_region.latitude - (region.latitudeDelta / 2);
			const lng1 = target_region.longitude;
			const lat2 = target_region.latitude + (region.latitudeDelta / 2);
			const lng2 = target_region.longitude;

			return crowFleightDistanceinKm(lat1, lng1, lat2, lng2);
		}			
	}

	const handleOnPressMarker = (socketId, data) => async event => {
		setSelectedClientSocketId((socketId === selectedClientSocketId? null : socketId));
		if (Function.isFunction(onSelectClientPosition)) {
			onSelectClientPosition(socketId, data)
		}
	};

	const handleOnClientPositionChange = (currentRegionBoundsClients) => ({socketId, ...position_change_data}) => {
		let socketIdIndex = currentRegionBoundsClients.findIndex((currentValue)=>{ return currentValue[0] === socketId; }, socketId);
		console.log("handleOnClientPositionChange socketId: ", socketId, "socketIdIndex", socketIdIndex);

		if (Function.isFunction(onClientPositionChanged)) {
			onClientPositionChanged(socketId, position_change_data);
		}	

		let newRegionBoundsClients = Object.entries(clientsPositions).reduce((accumulator, [socketId, clientData], index) => {		
			if (JSON.isJSON(clientData.position)) {
				accumulator.push([socketId, clientData]);
			}			
			return accumulator;						
		}, []);

		setRegionBoundsClients(newRegionBoundsClients);

		/*if (Number.parseNumber(socketIdIndex, -1) !== -1 ) {	
			let isMounted = currentRegionBoundsClients[socketIdIndex][1].markerRef? (currentRegionBoundsClients[socketIdIndex][1].markerRef.current? (currentRegionBoundsClients[socketIdIndex][1].markerRef.current._component? Function.isFunction(currentRegionBoundsClients[socketIdIndex][1].markerRef.current._component.animateMarkerToCoordinate) : false ) : false) : false;
			if ( position_change_data.position && isMounted) {
				//console.log("client-position-changed position_change_data");
				if (Platform.OS === 'android') {
					currentRegionBoundsClients[socketIdIndex][1].markerRef.current._component.animateMarkerToCoordinate({latitude: position_change_data.position.latitude, longitude: position_change_data.position.longitude, latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta}, 50);
				}
				else {
					currentRegionBoundsClients[socketIdIndex][1].markerCoordinate.timing({latitude: position_change_data.position.latitude, longitude: position_change_data.position.longitude, atitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta}).start();
				}
			}
		}*/
			
	};

	

	const handleOnSocketConnect = () => {
		sockets.default.emit("get-clients-positions", { user: user, type: 'all' });
	};

	const handleOnNewClientPosition = async ({socketId, ...data}) => {
		let newClientPositions = {...clientsPositions, [socketId]: data};	
		setClientsPositions(newClientPositions);
		if (Function.isFunction(onClientPositionAvailable)) {
			onClientPositionAvailable(socketId, data);
		}	
	};

	const handleOnClientsPositions = async (clients_positions) => {	
		let newClientPositions = clients_positions;
		setClientsPositions(newClientPositions);
		if (Function.isFunction(onLoadClientsPositions)) {
			onLoadClientsPositions(clients_positions);
		}		
	};

	const handleOnClientPositionUnavailable = async ({socketId, ...data}) => {
		let newClientPositions = JSON.fromJSON(clientsPositions);
		delete newClientPositions[socketId];
		setClientsPositions(newClientPositions);
		if (Function.isFunction(onClientPositionUnavailable)) {
			onClientPositionUnavailable(socketId, data);
		}
	};

	const initSockets = () => {
		if (sockets.default) {
			sockets.default.on("new-client-position", handleOnNewClientPosition);
			sockets.default.on("clients-positions", handleOnClientsPositions);
			sockets.default.on("client-position-unavailable", handleOnClientPositionUnavailable);
			//sockets.default.on("client-position-changed", handleOnClientPositionChange(regionBoundsClients));
			if (sockets.default.connected) {
				sockets.default.emit("get-clients-positions", { user: user, type: 'all' });
			}
			else{
				sockets.default.on("connect", handleOnSocketConnect);
			}
			setSocketsInitialized(true);				
		}
			
	}

	


	const prepareRegionMarkers = async () => {
		sockets.default.off("client-position-changed", handleOnClientPositionChange(regionBoundsClients));
		if (JSON.isJSON(clientsPositions)) {
				let newRegionBoundsClients = Object.entries(clientsPositions).reduce((accumulator, [socketId, clientData], index) => {		
					if (JSON.isJSON(clientData.position)) {
						accumulator.push([socketId, clientData]);
					}			
					return accumulator;						
				}, []);
					

				sockets.default.on("client-position-changed", handleOnClientPositionChange(newRegionBoundsClients));

				setRegionBoundsClients(newRegionBoundsClients);
		}			
	}


	

	
	useEffect(() => {	
		setMounted(true);
		return () => {
			setMounted(false);
		}
	}, []);

	useEffect(() => {	
		if (mounted && !socketsInitialized) {
			initSockets();
		}
		return () => {
			sockets.default.off("client-position-changed", handleOnClientPositionChange(regionBoundsClients));
			sockets.default.off("new-client-position", handleOnNewClientPosition);
			sockets.default.off("clients-positions", handleOnClientsPositions);
			sockets.default.off("client-position-unavailable", handleOnClientPositionUnavailable);
			sockets.default.off("connect", handleOnSocketConnect);
		}
	}, [sockets, mounted]);




	useEffect(() => {
		
		prepareRegionMarkers(region);
	}, [region, clientsPositions]);

		return (
			<GoogleMap
				className="relative"
				defaultZoom={state.defaultZoom}
				defaultCenter={state.defaultCenter}
				defaultOptions={{
					styles: state.mapStyles ? state.mapStyles : (state.theme === "dark"? mapDarkStyles : mapStyles),
				}}
				ref={map => {
					_map = map;
					if (Function.isFunction(onMapLoad)) {
						onMapLoad(map);
					}				
				}}
			>
				{state.draw && (
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
				{Array.isArray(state.polylines) &&
					state.polylines.map((polyline, index) => (
						<Polyline
							path={polyline.path}
							geodesic={true}
							options={{
								strokeColor: polyline.color
									? polyline.color
									: colors.hex.accent,
								strokeOpacity: polyline.opacity
									? polyline.opacity
									: 0.75,
								strokeWeight: polyline.weight ? polyline.weight : 4,
							}}
							onClick={event => {
								//let infowindow = showInfoWindow((polyline.title? polyline.title : "Uknown"), event.latLng);

								var infowindow = new google.maps.InfoWindow({
									content:
										(polyline.infoWindow
											? ReactDOMServer.renderToStaticMarkup(
													polyline.infoWindow
											  )
											: polyline.title
											? polyline.title
											: "") +
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
								);
							}}
							key={"polyline-" + index}
						/>
					))}

				{Array.isArray(state.circles) &&
					state.circles.map(({ infoWindow, ...rest }, index) => (
						<Circle
							{...rest}
							onClick={event => {
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

				{Array.isArray(state.markers) &&
					state.markers.map(
						({ position, title, infoWindow, ...rest }, index) =>
							typeof google !== undefined && (
								<Marker
									animation={google.maps.Animation.DROP}
									position={position}
									title={title}
									key={"marker-" + index}
									onClick={event => {
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

										infowindow.open(
											_map.context
												.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
										);
									}}
									{...rest}
								/>
							)
					)}

				{(Array.isArray(regionBoundsClients) && showClientsPositions) && regionBoundsClients.map(([socketId, { position, user, ...rest }], index) =>
						(typeof google !== undefined && JSON.isJSON(position) && JSON.isJSON(user)) && (
								<Marker
									animation={selectedClientSocketId === socketId? google.maps.Animation.BOUNCE : google.maps.Animation.DROP}
									position={{lat: position.latitude, lng: position.longitude }}
									title={user.first_name+" "+user.last_name}
									key={"client-marker-" + index}
									icon={ user.avatar && services.attachments ? ({url: services.attachments.getAttachmentFileUrl(user.avatar), scaledSize: { width: 24, height: 24 }, }) : client_position_marker_icon }
									onClick={handleOnPressMarker(socketId, { position: position, user: user, ...rest })}
									style={user.avatar && services.attachments ? {borderRadius: 12} : {}}
									{...rest}
								/>
						)
					)}

				{JSON.isJSON(state.currentDevicePosition) &&
					state.showCurrentPosition && (
						<Marker
							position={state.currentDevicePosition.coordinates}
							title={state.currentDevicePosition.title}
							icon={current_position_marker_icon}
						/>
					)}

				{JSON.isJSON(state.marker) && <Marker {...state.marker} />}
				{JSON.isJSON(state.circle) && <Marker {...state.circle} />}

				{state.showSearchBar && (
					<LocationSearchInput
						controlPosition={google.maps.ControlPosition.BOTTOM_CENTER}
						{...state.searchBarProps}
					/>
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
