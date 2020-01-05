/*global google*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

import {
	GoogleMap,
	InfoWindow,
	Circle,
	Marker,
	Polyline,
	withGoogleMap,
	KmlLayer,
	withScriptjs
} from "react-google-maps";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import LocationSearchInput from './LocationSearchInput';

import { compose } from "recompose";
import { withStyles } from "@material-ui/core";

import { colors } from "assets/jss/app-theme";
//
import { google_maps_default_center, google_maps_url } from "config";


import withRoot from "utils/withRoot";

//
const mapStyles = [
	{
		featureType: "administrative",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#444444"
			}
		]
	},
	{
		featureType: "landscape",
		elementType: "all",
		stylers: [
			{
				color: "#ededed"
			}
		]
	},
	{
		featureType: "poi",
		elementType: "all",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "road",
		elementType: "all",
		stylers: [
			{
				saturation: -100
			},
			{
				lightness: 45
			}
		]
	},
	{
		featureType: "road.highway",
		elementType: "all",
		stylers: [
			{
				visibility: "simplified"
			}
		]
	},
	{
		featureType: "road.arterial",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off"
			},
			{
				saturation: "-9"
			}
		]
	},
	{
		featureType: "transit",
		elementType: "all",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "water",
		elementType: "all",
		stylers: [
			{
				color: "#87c49e"
			},
			{
				visibility: "on"
			}
		]
	}
];
//
const greyMapStyle = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
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
                "color": "#ffffff"
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
                "color": "#ffffff"
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
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
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
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
];
const styles = theme => ({
	root: {
		margin: "0"
	},
	googleMap: {
		position: "relative",
		top: 0,
	},
	locationSearchInput: {
		position: "absolute",
		bottom: theme.spacing(4),
		zIndex: "2",
	}
});

var iconPin = {
	path:"M449.8,194.3c0,36.8-12.2,75.5-30.3,112.7c-68.4,106.2-154.8,203.5-154.8,203.5s-99.4-94-163-205.5 c-15.9-34.8-26.3-71.6-26.3-108.5C75.3,93,159.1,3,262.5,3C366,3,449.8,90.7,449.8,194.3z M360.8,184.6 c0-53.4-43.2-96.6-96.5-96.6c-53.3,0-96.5,43.2-96.5,96.6c0,53.4,43.2,96.5,96.5,96.5C317.6,281.1,360.8,238,360.8,184.6z",
	fillColor: colors.hex.danger,
	fillOpacity: 1,
	
	strokeOpacity: 0,
	scale: 0.07 //to reduce the size of icons
};
const current_position_marker_icon = {
	path:"M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
	fillColor: "#0076d6",
	fillOpacity: 1,
	strokeOpacity: 0.3,
	strokeWeight: 8,
	strokeColor: "#0076d6",
	scale: 0.1//to reduce the size of icons
};
const labelSize = 200;
const labelPadding = 8;

let calcCrowFlyDistance = (lat1, lon1, lat2, lon2) => {
	var R = 6371; // km
	var dLat = toRad(lat2 - lat1);
	var dLon = toRad(lon2 - lon1);
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
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
const DefaultMapComponent = compose(
	withScriptjs,
	withGoogleMap
)(props => (
	<GoogleMap
		className="relative"
		defaultZoom={props.defaultZoom}
		defaultCenter={props.defaultCenter}
		defaultOptions={{ styles: props.disabled || props.readonly? greyMapStyle : mapStyles }}
		ref={map => (_map = map)}
	>
		

		
		
		{ props.draw && <DrawingManager
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
		/>}
		{Array.isArray(props.polylines) &&
			props.polylines.map((polyline, index) => (
				<Polyline
					path={polyline.path}
					geodesic={true}
					options={{
						strokeColor: polyline.color ? polyline.color : colors.hex.accent,
						strokeOpacity: polyline.opacity ? polyline.opacity : 0.75,
						strokeWeight: polyline.weight ? polyline.weight : 4
					}}
					onClick={event => {
						//let infowindow = showInfoWindow((polyline.title? polyline.title : "Uknown"), event.latLng);

						var infowindow = new google.maps.InfoWindow({
							content:
								(polyline.infoWindow
									? ReactDOMServer.renderToStaticMarkup(polyline.infoWindow)
									: polyline.title
										? polyline.title
										: "") +
								("<br/> Crow fleight distance from Start: " +
									calcCrowFlyDistance(
										event.latLng.lat(),
										event.latLng.lng(),
										polyline.path[0].lat,
										polyline.path[0].lng
									).toFixed(2) +
									" Km"),
							position: event.latLng
						});

						infowindow.open(
							_map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
						);
					}}
					key={"polyline-" + index}
				/>
			))}

		{Array.isArray(props.circles) && props.circles.map(({infoWindow, ...rest}, index) => (
				<Circle
					{...rest}
					onClick={event => {
						if (infoWindow) {
							new google.maps.InfoWindow({
								content: ReactDOMServer.renderToStaticMarkup(infoWindow),
								position: event.latLng
							}).open(
								_map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
							);
						}


					}}
					key={"circle-" + index}
				/>
			
		))}

		{Array.isArray(props.markers) && props.markers.map(
				({position, title, infoWindow, ...rest}, index) =>
					typeof google !== undefined && (
						<Marker
							animation={google.maps.Animation.DROP}
							position={position}
							title={title}
							key={"marker-" + index}
							onClick={event => {

								var infowindow = new google.maps.InfoWindow({
									content: infoWindow ? ReactDOMServer.renderToStaticMarkup(infoWindow) : title ? title : "",
									position: event.latLng
								});

								infowindow.open(
									_map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
								);
							}}
							{...rest}
						/>
					)
			)}

		{ JSON.isJSON(props.currentDevicePosition) && props.showCurrentPosition && <Marker position={props.currentDevicePosition.coordinates} title={props.currentDevicePosition.title} icon={current_position_marker_icon} /> }

		{JSON.isJSON(props.marker) && <Marker {...props.marker } /> }
		{JSON.isJSON(props.circle) && <Marker {...props.circle} /> }


		{ props.showSearchBar && <LocationSearchInput controlPosition={google.maps.ControlPosition.BOTTOM_CENTER} {...props.searchBarProps}/> }

	</GoogleMap>
));

class CustomGoogleMap extends Component {
	state = {
		current_device_position: {
			coordinates: google_maps_default_center,
			title: "You"
		},
		markers: [],
		circles: [],
		polylines:[],
		polylines:[],
		value: []
	};
	constructor( props ) {
		super( props );
		this.state={...this.state, ...props};
		
		if (this.state.isMulti && !Array.isArray(this.state.value)) {
			if (this.state.value) {
				this.state.value = [this.state.value];
			}
			else {
				this.state.value = [];
			}
		}

		this.onLocationSearchSelect = this.onLocationSearchSelect.bind(this);
		this.onLocationBtnClick = this.onLocationBtnClick.bind(this);
		this.onValueObjectDragEnd = this.onValueObjectDragEnd.bind(this);

		let { isInput, input, value, isMulti, markers, circles } = this.state;
		
		if (isInput) {
			if (input === "coordinates") {
				if (!Array.isArray(markers)) {
					markers = []; 
				}				
				if (isMulti) {
					markers = markers.concat(value.map((coordinates, index)=>{
						return {
							position: coordinates,
							title: JSON.readable(coordinates),
							draggable: true, 
							onDragEnd: this.onValueObjectDragEnd(index)
						}
					}));
				}
				else{
					markers = markers.concat([{
							position: value,
							title: JSON.readable(value),
							draggable: true, 
							onDragEnd: this.onValueObjectDragEnd(null)
					}]);
				}
			}
			if (input === "marker") {
				if (!Array.isArray(markers)) {
					markers = []; 
				}				
				if (isMulti) {
					markers = markers.concat(value.map((marker, index)=>{
						return {
							...marker,
							draggable: true, 
							onDragEnd: this.onValueObjectDragEnd(index)
						}
					}));
				}
				else{
					markers = markers.concat([{
						...value, 
						draggable: true, 
						onDragEnd: this.onValueObjectDragEnd(null)
					}]);
				}
			}
			else if (input == "circle") {
				if (!Array.isArray(circles)) {
					circles = []; 
				}
				if (isMulti) {
					circles = circles.concat(value);
				}
				else{
					circles = circles.concat([value]);
				}
				
			}
		}
		this.state.markers = markers;
		this.state.circles = circles;
		this.state.defaultCenter = this.getDefaultCenter();
	}

	componentDidMount() {
		const defaultCenter = this.getDefaultCenter();
		console.log("defaultCenter", defaultCenter);
		this.setState({defaultCenter: defaultCenter});

		/*const { showCurrentPosition, isInput, isMulti, value, input } = this.props;
		if (showCurrentPosition) {
			this.currentPosition();
		}
		if (isInput) {
			let panTo = this.getDefaultCenter();
			if (isMulti && Array.isArray(value)) {
				if (value.length > 0) {
					panTo = value[value.length-1];
					if (input === "marker") {
						panTo = value[value.length-1].position;
					}
				}
				
			}
			else {
				if (value) {
					panTo = value;
					if (input === "marker") {
						panTo = value.position;
					}
				}
			}
			if (_map) {
				_map.panTo(panTo);
			}
			
		}*/
	}

	currentPosition() {
		const { user } = this.props;
		if (navigator.geolocation) {
			let that = this;
			function setCurrentPosition(position) {
				that.setState((state, props) => ({
					current_device_position: {
						...state.current_device_position,
						coordinates: {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						}
					}
				}));
			}
			navigator.geolocation.getCurrentPosition(setCurrentPosition);
		}
	}

	getDefaultCenter() {
		const {
			showCurrentPosition,
			defaultZoom,
			markers,
			polylines,
			circles,
			circle,
			marker,
			polyline,
		} = this.state;
		let defaultCenter = this.state.current_device_position.coordinates;
		if (Array.isArray(markers) && markers.length > 0) {
			if (JSON.isJSON(markers[markers.length - 1].position)) {
				defaultCenter = markers[markers.length - 1].position;
			}			
		} else if (Array.isArray(polylines) && polylines.length > 0) {
			if (JSON.isJSON(polylines[polylines.length - 1].path[0])) {
				defaultCenter = polylines[polylines.length - 1].path[0];
			}	
			
		} else if (Array.isArray(circles) && circles.length > 0) {
			defaultCenter = circles[circles.length - 1].center;
		}
		else if (JSON.isJSON(circle)) {
			defaultCenter = circle.center;
		}
		else if (JSON.isJSON(marker)) {
			defaultCenter = marker.position;
		}
		else if (JSON.isJSON(polyline)) {
			defaultCenter = polyline.path[0];
		}
		return defaultCenter;
	}

	onLocationSearchSelect(value){
		const { onChange, isInput, input, isMulti } = this.state;
		if (_map) {
			_map.panTo(value.coordinates);
		}
		if (isInput) {
			let new_value = value.coordinates;
			if (input === "coordinates") {
				new_value = value.coordinates;
				if (isMulti) {
					new_value = this.state.value.concat([value.coordinates]);
				}
			}
			else if (input === "marker") {
				new_value = {position: value.coordinates, title: value.address};
				if (isMulti) {
					new_value = this.state.value.concat([{position: value.coordinates, title: value.address}]);
				}
			}
				
			this.setState(prevState => ({value: new_value}));
			
			if (Function.isFunction(onChange)) {
				onChange(new_value);
			}
		}
			
	}

	onLocationBtnClick  = event => {
		if (_map) {
			_map.panTo(this.state.current_device_position.coordinates);
		}
		this.setState(prevState => ({defaultCenter: this.state.current_device_position.coordinates, showCurrentPosition: true, zoom : prevState.defaultZoom/2}));
	}

	onValueObjectDragEnd  = index => event => {
		const { onChange, isInput, input, isMulti } = this.state;
		if (_map) {
			_map.panTo({lat: event.latLng.lat(), lng: event.latLng.lng()});
		}
		if (isInput) {
			let new_value = {lat: event.latLng.lat(), lng: event.latLng.lng()};
			if (input === "coordinates") {
				if (isMulti) {
					new_value = this.state.value;
					new_value[index] = { lat: event.latLng.lat(), lng: event.latLng.lng() };
				}
			}
			else if (input === "marker") {				
				if (isMulti) {
					new_value = this.state.value;
					new_value[index] = {position: { lat: event.latLng.lat(), lng: event.latLng.lng() }, title: JSON.readable({ lat: event.latLng.lat(), lng: event.latLng.lng() })};
				}
				else{
					new_value = {position: { lat: event.latLng.lat(), lng: event.latLng.lng() }, title: JSON.readable({ lat: event.latLng.lat(), lng: event.latLng.lng() })};
				}
			}
				
			this.setState(prevState => ({value: new_value}));
			
			if (Function.isFunction(onChange)) {
				onChange(new_value);
			}
		}
	}

	render() {
		let { classes, className, mapHeight, isInput, input, value, onChange, defaultCenter, current_device_position, isMulti, markers, circles, showSearchBar, ...rest } = this.state;
		console.log("markers", markers);
		/*if (isInput) {
			if (input === "coordinates") {
				if (!Array.isArray(markers)) {
					markers = []; 
				}				
				if (isMulti) {
					markers = markers.concat(value.map((coordinates, index)=>{
						return {
							position: coordinates,
							title: JSON.readable(coordinates),
							draggable: true, 
							onDragEnd: this.onValueObjectDragEnd(index)
						}
					}));
				}
				else{
					markers = markers.concat([{
							position: value,
							title: JSON.readable(value),
							draggable: true, 
							onDragEnd: this.onValueObjectDragEnd(null)
					}]);
				}
			}
			if (input === "marker") {
				if (!Array.isArray(markers)) {
					markers = []; 
				}				
				if (isMulti) {
					markers = markers.concat(value.map((marker, index)=>{
						return {
							...marker,
							draggable: true, 
							onDragEnd: this.onValueObjectDragEnd(index)
						}
					}));
				}
				else{
					markers = markers.concat([{
						...value, 
						draggable: true, 
						onDragEnd: this.onValueObjectDragEnd(null)
					}]);
				}
			}
			else if (input == "circle") {
				if (!Array.isArray(circles)) {
					circles = []; 
				}
				if (isMulti) {
					circles = circles.concat(value);
				}
				else{
					circles = circles.concat([value]);
				}
				
			}
		}*/
		
        

		return (
			<div className="relative p-0 m-0" style={{minHeight: mapHeight}}>				
				<DefaultMapComponent
					className={classes.googleMap}
					defaultCenter={defaultCenter}
					currentDevicePosition={current_device_position}
					loadingElement={<div style={{ height: "100%" }} />}
					containerElement={<div style={{ height: mapHeight + "px" }} />}
					mapElement={<div style={{ height: "100%" }} />}
					markers = {markers}
					circles = {circles}
					showSearchBar = {showSearchBar}
					searchBarProps = {{
						className: classes.locationSearchInput+" absolute mb-4",
						onSelect: this.onLocationSearchSelect,
						onLeftBtnClick:this.onLocationBtnClick,
					}}
					{ ...rest }
				/>
				
			</div>
		);
	}
}

CustomGoogleMap.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object,
	googleMapURL: PropTypes.string,
	mapHeight: PropTypes.number,
	defaultZoom: PropTypes.number,
	showCurrentPosition: PropTypes.bool,
	markers: PropTypes.array,
	polylines: PropTypes.array,
	circles: PropTypes.array,
	marker: PropTypes.object,
	polyline: PropTypes.object,
	circle: PropTypes.object,
	center: PropTypes.object,
	draw: PropTypes.bool,
	isInput: PropTypes.bool,
	input: PropTypes.oneOf(["coordinates", "region", "circle", "polyline", "marker"]),
	value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	onChange: PropTypes.func,
	isMulti: PropTypes.bool,
	disabled: PropTypes.bool,
	readonly: PropTypes.bool,
	showSearchBar: PropTypes.bool,
};

CustomGoogleMap.defaultProps = {
	googleMapURL: google_maps_url,
	mapHeight: 800,
	defaultZoom: 12,
	showCurrentPosition: false,
	markers: [],
	polylines: [],
	circles: [],	
	draw: false,
	isInput: false,
	input: "coordinates",
	value: [],
	showSearchBar: true,
	disabled: false,
	readonly: false,
};

export default withRoot(withStyles(styles)(CustomGoogleMap));
