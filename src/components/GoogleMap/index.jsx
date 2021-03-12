/*global google*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";
import { connect } from "react-redux";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

//import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import Skeleton from "@material-ui/lab/Skeleton";
import ActualGoogleMap from "./ActualGoogleMap";

import { compose } from "recompose";
import { withStyles } from "@material-ui/core";

import {withGlobals} from "contexts/Globals";
import { colors } from "assets/jss/app-theme";
//
import { default_location, google_maps_url } from "config";

import withRoot from "hoc/withRoot";

//



const styles = theme => ({
	root: {
		margin: "0",
	},
	googleMap: {
		position: "relative",
		top: 0,
	},
	locationSearchInput: {
		position: "absolute",
		bottom: theme.spacing(4),
		zIndex: "2",
	},
});

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


let _map = null;
let _searchBox = null;

class CustomGoogleMap extends Component {
	state = {
		current_device_position: {
			coordinates: default_location,
			title: "You",
		},
		current_device_position_set: false,
		mapBounds: false,
		markers: [],
		circles: [],
		polylines: [],
		polylines: [],
		value: [],
		hasError: false,
		clientsPositions: {},
	};

	constructor(props) {
		super(props);
		this.state = { ...this.state, ...props };

		if (this.state.isMulti && !Array.isArray(this.state.value)) {
			if (this.state.value) {
				this.state.value = [this.state.value];
			} else {
				this.state.value = [];
			}
		}


		this.onMapBoundsChanged = this.onMapBoundsChanged.bind(this);
		this.onLocationSearchSelect = this.onLocationSearchSelect.bind(this);
		this.onLocationBtnClick = this.onLocationBtnClick.bind(this);
		this.onValueObjectDragEnd = this.onValueObjectDragEnd.bind(this);

		let { isInput, type, value, isMulti, markers, circles } = this.state;

		if (isInput) {
			if (type === "coordinates") {
				if (!Array.isArray(markers)) {
					markers = [];
				}
				if (isMulti) {
					markers = markers.concat(
						value.map((coordinates, index) => {
							return {
								position: coordinates,
								title: JSON.readable(coordinates),
								draggable: true,
								onDragEnd: this.onValueObjectDragEnd(index),
							};
						})
					);
				} else {
					markers = markers.concat([
						{
							position: value,
							title: JSON.readable(value),
							draggable: true,
							onDragEnd: this.onValueObjectDragEnd(null),
						},
					]);
				}
			}
			if (type === "marker") {
				if (!Array.isArray(markers)) {
					markers = [];
				}
				if (isMulti) {
					markers = markers.concat(
						value.map((marker, index) => {
							return {
								...marker,
								draggable: true,
								onDragEnd: this.onValueObjectDragEnd(index),
							};
						})
					);
				} else {
					markers = markers.concat([
						{
							...value,
							draggable: true,
							onDragEnd: this.onValueObjectDragEnd(null),
						},
					]);
				}
			} else if (type == "circle") {
				if (!Array.isArray(circles)) {
					circles = [];
				}
				if (isMulti) {
					circles = circles.concat(value);
				} else {
					circles = circles.concat([value]);
				}
			}
		}
		this.state.markers = markers;
		this.state.circles = circles;
		this.state.defaultCenter = this.getDefaultCenter();
	}

	componentDidCatch(error) {
		this.setState({ hasError: error }, () =>
			console.error("GoogleMap Error", error)
		);
	}

	componentDidMount() {
		if (this.props.showCurrentPosition) {
			this.currentPosition();
		}
		else{
			const defaultCenter = this.getDefaultCenter();
			this.setState({ defaultCenter: defaultCenter });
		}
		
		
	}

	componentDidUpdate(prevProps, prevState) {
		//this.setState(updatedPropsState);
		if (!Object.areEqual(prevProps, this.props)) {
			let updatedPropsState = JSON.updateJSON(this.state, this.props);
			//console.log("updatedPropsState", updatedPropsState);
			this.setState({
				...updatedPropsState,
			});
		}
		/*if (prevState.current_device_position.coordinates !== this.state.current_device_position.coordinates && this.props.showCurrentPosition) {
			const defaultCenter = this.getDefaultCenter();
			this.setState({ defaultCenter: defaultCenter });
		}*/
	}

	appendInputValue(append_value = false) {
		let valueState = this.state;
		let { isInput, type, isMulti } = this.state;
		let {
			markers,
			value,
			circles,
			polylines,
			marker,
			circle,
			polyline,
		} = this.state;

		if (isInput) {
			if (isMulti && !Array.isArray(value)) {
				if (value) {
					value = [value];
				} else {
					value = [];
				}
			}
			if (append_value) {
				if (isMulti) {
					value.concat([append_value]);
				} else {
					value = append_value;
				}
			}

			if (type === "coordinates") {
				if (!Array.isArray(markers)) {
					markers = [];
				}
				if (isMulti) {
					markers = markers.concat(
						value.map((coordinates, index) => {
							return {
								position: coordinates,
								title: JSON.readable(coordinates),
								draggable: true,
								onDragEnd: this.onValueObjectDragEnd(index),
							};
						})
					);
				} else {
					markers = markers.concat([
						{
							position: value,
							title: JSON.readable(value),
							draggable: true,
							onDragEnd: this.onValueObjectDragEnd(null),
						},
					]);
				}
			}
			if (type === "marker") {
				if (!Array.isArray(markers)) {
					markers = [];
				}
				if (isMulti) {
					markers = markers.concat(
						value.map((marker, index) => {
							return {
								...marker,
								draggable: true,
								onDragEnd: this.onValueObjectDragEnd(index),
							};
						})
					);
				} else {
					markers = markers.concat([
						{
							...value,
							draggable: true,
							onDragEnd: this.onValueObjectDragEnd(null),
						},
					]);
				}
			} else if (type == "circle") {
				if (!Array.isArray(circles)) {
					circles = [];
				}
				if (isMulti) {
					circles = circles.concat(value);
				} else {
					circles = circles.concat([value]);
				}
			}
		}

		let defaultCenter = this.state.current_device_position.coordinates;
		if (this.state.current_device_position.coordinates) {}
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
		} else if (JSON.isJSON(circle)) {
			defaultCenter = circle.center;
		} else if (JSON.isJSON(marker)) {
			defaultCenter = marker.position;
		} else if (JSON.isJSON(polyline)) {
			defaultCenter = polyline.path[0];
		}

		valueState.markers = markers;
		valueState.circles = circles;
		valueState.defaultCenter = defaultCenter;

		return valueState;
	}

	currentPosition() {
		const { user } = this.props;
		if (navigator.geolocation) {
			let that = this;
			function setCurrentPosition(position) {
				if (_map) {
					_map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
				}
				that.setState((state, props) => ({
					current_device_position: {
						...state.current_device_position,
						coordinates: {
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						},
					},
					current_device_position_set: true,
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
			mapBounds,
		} = this.state;
			let defaultCenter = {lat: 41.850033, lng: -87.6500523 };
			if (mapBounds) {
				if (Function.isFunction(mapBounds.getCenter)) {
					let mapBoundsCenter = mapBounds.getCenter();
					defaultCenter = {lat: mapBoundsCenter.lat(), lng: mapBoundsCenter.lng() };
				}				
			}
			else {
				if (Array.isArray(markers) && markers.length > 0) {
					if (JSON.isJSON(markers[0].position)) {
						defaultCenter = markers[0].position;
					}
				} else if (Array.isArray(polylines) && polylines.length > 0) {
					if (JSON.isJSON(polylines[0].path[0])) {
						defaultCenter = polylines[0].path[0];
					}
				} else if (Array.isArray(circles) && circles.length > 0) {
					defaultCenter = circles[0].center;
				} else if (JSON.isJSON(circle)) {
					defaultCenter = circle.center;
				} else if (JSON.isJSON(marker)) {
					defaultCenter = marker.position;
				} else if (JSON.isJSON(polyline)) {
					defaultCenter = polyline.path[0];
				}
				else{
					defaultCenter = this.state.current_device_position.coordinates;
				}
			}
			
				
			
		return defaultCenter;
	}

	onLocationSearchSelect(value) {
		const { onChange, isInput, type, isMulti } = this.state;
		if (_map) {
			_map.panTo(value.coordinates);
		}
		if (isInput) {
			let new_value = value.coordinates;
			if (type === "coordinates") {
				new_value = value.coordinates;
				if (isMulti) {
					new_value = this.state.value.concat([value.coordinates]);
				}
			} else if (type === "marker") {
				new_value = {
					position: value.coordinates,
					title: value.address,
				};
				if (isMulti) {
					new_value = this.state.value.concat([
						{ position: value.coordinates, title: value.address },
					]);
				}
			} else if (type === "address") {
				new_value = value.address;
				if (isMulti) {
					new_value = this.state.value.concat([
						{ position: value.coordinates, title: value.address },
					]);
				}
			}
			this.setState({ ...this.appendInputValue(new_value) });

			if (Function.isFunction(onChange)) {
				onChange(new_value);
			}
		}
	}

	onLocationBtnClick = event => {
		if (_map) {
			_map.panTo(this.state.current_device_position.coordinates);
		}
		this.setState(prevState => ({
			defaultCenter: this.state.current_device_position.coordinates,
			showCurrentPosition: true,
			zoom: prevState.defaultZoom,
		}));
	};

	onMapBoundsChanged = newMapBounds => {
		this.setState(prevState => ({
			mapBounds: newMapBounds,
			//zoom: prevState.defaultZoom,
		}));
	};

	onValueObjectDragEnd = index => event => {
		const { onChange, isInput, type, isMulti } = this.state;
		if (_map) {
			_map.panTo({ lat: event.latLng.lat(), lng: event.latLng.lng() });
		}
		if (isInput) {
			let new_value = {
				lat: event.latLng.lat(),
				lng: event.latLng.lng(),
			};
			if (type === "coordinates") {
				if (isMulti) {
					new_value = this.state.value;
					new_value[index] = {
						lat: event.latLng.lat(),
						lng: event.latLng.lng(),
					};
				}
			} else if (type === "marker") {
				if (isMulti) {
					new_value = this.state.value;
					new_value[index] = {
						position: {
							lat: event.latLng.lat(),
							lng: event.latLng.lng(),
						},
						title: JSON.readable({
							lat: event.latLng.lat(),
							lng: event.latLng.lng(),
						}),
					};
				} else {
					new_value = {
						position: {
							lat: event.latLng.lat(),
							lng: event.latLng.lng(),
						},
						title: JSON.readable({
							lat: event.latLng.lat(),
							lng: event.latLng.lng(),
						}),
					};
				}
			}

			this.setState(prevState => ({ value: new_value }));

			if (Function.isFunction(onChange)) {
				onChange(new_value);
			}
		}
	};



	render() {
		let {
			app:{preferences},
			classes,
			className,
			mapHeight,
			isInput,
			type,
			value,
			onChange,
			defaultCenter,
			current_device_position,
			isMulti,
			markers,
			circles,
			polylines,
			showSearchBar,
			onMapLoad,
			...rest
		} = this.state;

		/*if (this.state.hasError) {
			return (
				<Skeleton variant="rect" width={"100%"} height={mapHeight} />
			);
		} else {
			return (
				<ActualGoogleMap
						className={classes.googleMap}
						defaultCenter={this.getDefaultCenter()}
						currentDevicePosition={current_device_position}
						loadingElement={<div style={{ height: "100%", minHeight: "100%", }} />}
						containerElement={
							<div style={{ height: mapHeight + "px" }} />
						}
						mapElement={<div style={{ height: "100%", minHeight: "100%", }} />}
						markers={markers}
						circles={circles}
						polylines={polylines}
						showSearchBar={showSearchBar}
						theme={preferences.theme }
						searchBarProps={{
							label: "Search for a place",
							placeholder: "Search for a place...",
							onSelect: this.onLocationSearchSelect,
							onClickMyLocationBtn: this.onLocationBtnClick,
						}}
						onMapLoad={map=>{
							_map = map;
							if (Function.isFunction(onMapLoad)) {
								onMapLoad(map);
							}
						}}
						onBoundsChanged={this.onMapBoundsChanged}
						style={{ minHeight: mapHeight + "px" }}
						{...rest}
					/>
			);
		}*/
			return (
				<ActualGoogleMap
						className={classes.googleMap}
						defaultCenter={this.getDefaultCenter()}
						currentDevicePosition={current_device_position}
						loadingElement={<div style={{ height: "100%", minHeight: "100%", }} />}
						containerElement={
							<div style={{ height: mapHeight + "px" }} />
						}
						mapElement={<div style={{ height: "100%", minHeight: "100%", }} />}
						markers={markers}
						circles={circles}
						polylines={polylines}
						showSearchBar={showSearchBar}
						theme={preferences.theme }
						searchBarProps={{
							label: "Search for a place",
							placeholder: "Search for a place...",
							onSelect: this.onLocationSearchSelect,
							onClickMyLocationBtn: this.onLocationBtnClick,
						}}
						onMapLoad={map=>{
							_map = map;
							if (Function.isFunction(onMapLoad)) {
								onMapLoad(map);
							}
						}}
						onBoundsChanged={this.onMapBoundsChanged}
						style={{ minHeight: mapHeight + "px" }}
						{...rest}
					/>
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
	type: PropTypes.oneOf([
		"coordinates",
		"region",
		"circle",
		"polyline",
		"marker",
	]),
	value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	onChange: PropTypes.func,
	isMulti: PropTypes.bool,
	disabled: PropTypes.bool,
	readonly: PropTypes.bool,
	showSearchBar: PropTypes.bool,
	showClientsPositions: PropTypes.bool,
};

CustomGoogleMap.defaultProps = {
	googleMapURL: google_maps_url,
	mapHeight: 800,
	defaultZoom: 12,
	zoom: 12,
	showCurrentPosition: false,
	markers: [],
	polylines: [],
	circles: [],
	draw: false,
	isInput: false,
	isMulti: false,
	type: "coordinates",
	value: [],
	showSearchBar: true,
	disabled: false,
	readonly: false,
	showClientsPositions: true,
};


const mapStateToProps = state => ({
	app: state.app,
	device: state.device,
});

export default compose(
	connect(mapStateToProps, {}),
	withStyles(styles),
)(CustomGoogleMap);

//export default connect(mapStateToProps, {})(withStyles(styles)(withGlobals(CustomGoogleMap)));
