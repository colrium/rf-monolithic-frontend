/** @format */

import React, { useRef, useCallback, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import { compose } from "recompose";
import { google_maps } from "config";
import {
	useGoogleMaps,
	useDidUpdate,
	useDidMount,
	useWillUnmount,
} from "hooks";
import { useWindowSize, useLatest, useGeolocation } from "react-use";
import { colors } from "assets/jss/app-theme";
import { light, dark } from "./styles";

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

const GoogleMap = React.forwardRef((props, ref) => {
	const {
		className,
		onMapLoad,
		height,
		zoom,
		defaultZoom = 5,
		center,
		showCurrentPosition = false,
		styleMode,
		circles,
		geojsons,
		polylines,
		markers,
		selectedEntryType,
		selectedEntry,
		...rest
	} = props;

	const geoLocation = useGeolocation();
	const windowSize = useWindowSize();
	const centerCoords = useMemo(() => {
		return {
			lat:
				Array.isArray(center) && center?.length === 2
					? center[0]
					: center?.lat ||
					  center?.latitude ||
					  geoLocation?.latitude ||
					  google_maps?.default_center?.lat,
			lng:
				Array.isArray(center) && center?.length === 2
					? center[1]
					: center?.lng ||
					  center?.longitude ||
					  geoLocation?.longitude ||
					  google_maps?.default_center?.lng,
		};
	}, [center]);

	const [googlemap, google, mapRef] = useGoogleMaps({
		center: centerCoords,
		zoom: zoom || defaultZoom,
		styles: styleMode === "dark" ? dark : light,
	});

	const googlemapRef = useRef(googlemap);
	const infoWindowRef = useRef(null);
	const infoWindowTimeoutRef = useRef(null);
	const circlesRef = useRef([]);
	const polylinesRef = useRef([]);
	const geojsonsRef = useRef([]);
	const markersRef = useRef([]);

	const showInfoWindow = useCallback(
		(content, position, options = {}) => {
			if (!infoWindowRef.current) {
				infoWindowRef.current = new google.maps.InfoWindow({
					content: "",
				});
			}
			infoWindowRef.current.setContent(content);
			infoWindowRef.current.setPosition(position);
			infoWindowRef.current.setOptions({ ...options });
			infoWindowRef.current.open(googlemapRef.current);
		},
		[google]
	);

	const closeInfoWindow = useCallback(() => {
		if (infoWindowRef.current) {
			infoWindowRef.current.close();
		}
		clearTimeout(infoWindowTimeoutRef.current);
		infoWindowTimeoutRef.current = null;
	}, []);

	const getPolylineBounds = useCallback(
		polyline => {
			let bounds = null;
			if (!!google?.maps && !!polyline?.getPath) {
				bounds = new google.maps.LatLngBounds();
				polyline.getPath().forEach(function (item, index) {
					bounds.extend(
						new google.maps.LatLng(item.lat(), item.lng())
					);
				});
			}
			return bounds;
		},
		[google]
	);

	const applyCircles = useCallback(() => {
		if (Array.isArray(circlesRef.current)) {
			circlesRef.current.forEach(element => {
				if (!!element) {
					if (google?.maps) {
						google.maps.event.clearListeners(element, "mouseover");
						google.maps.event.clearListeners(element, "mouseout");
						google.maps.event.clearListeners(element, "click");
					}
					if (!!element.setMap) {
						element.setMap(null);
					}
				}
			});
			circlesRef.current = [];
		}
		if (Array.isArray(circles) && !!google) {
			circlesRef.current = circles
				.sort((a, b) => b.radius - a.radius)
				.map((newCircle, index) => {
					const { infoWindow, ...circleProps } = newCircle;
					let mapElement = new google.maps.Circle({
						...circleProps,
						options: {
							fillColor:
								selectedEntryType == "circle" &&
								selectedEntry === index
									? colors.hex.accent
									: circleProps.fillColor
									? circleProps.fillColor
									: colors.hex.accent,
							strokeColor: circleProps.color
								? circleProps.color
								: colors.hex.accent,
							strokeOpacity:
								selectedEntryType == "circle" &&
								selectedEntry === index
									? 1
									: selectedEntryType != "circle"
									? circleProps.opacity
									: 0.2,
							fillOpacity:
								selectedEntryType == "circle" &&
								selectedEntry === index
									? 0.1
									: 0.01,
							strokeWeight:
								selectedEntryType == "circle" &&
								selectedEntry === index
									? 4
									: selectedEntryType != "circle"
									? circleProps.strokeWeight
									: 1,
						},
					});
					mapElement.setMap(googlemapRef.current);

					google.maps.event.addListener(
						mapElement,
						"click",
						function (event) {
							if (!!googlemapRef.current) {
								googlemapRef.current.fitBounds(
									mapElement.getBounds()
								);
							}
						}
					);
					google.maps.event.addListener(
						mapElement,
						"mouseover",
						function (event) {
							mapElement.setOptions({ fillOpacity: 0.5 });
							infoWindowTimeoutRef.current = setTimeout(
								() =>
									showInfoWindow(
										infoWindow
											? ReactDOMServer.renderToStaticMarkup(
													infoWindow
											  )
											: circleProps.title
											? circleProps.title
											: "",
										mapElement.center
									),
								1000
							);
						}
					);
					google.maps.event.addListener(
						mapElement,
						"mouseout",
						function (event) {
							mapElement.setOptions({ fillOpacity: 0.01 });
							closeInfoWindow();
						}
					);
					// console.log("infoWindow", infoWindow)
					// console.log("ReactDOMServer.renderToStaticMarkup(infoWindow)", ReactDOMServer.renderToStaticMarkup(infoWindow))
					return mapElement;
				});
			if (
				circlesRef.current.length > 0 &&
				!!circlesRef.current[0].getBounds &&
				!!googlemapRef.current
			) {
				googlemapRef.current.fitBounds(
					circlesRef.current[0].getBounds()
				);
			}
		}
	}, [circles, selectedEntryType, selectedEntry, google]);

	const applyPolylines = useCallback(() => {
		if (Array.isArray(polylinesRef.current)) {
			polylinesRef.current.forEach(element => {
				if (!!element) {
					if (google?.maps) {
						google.maps.event.clearListeners(element, "mouseover");
						google.maps.event.clearListeners(element, "mouseout");
						google.maps.event.clearListeners(element, "click");
					}
					if (!!element.setMap) {
						element.setMap(null);
					}
				}
			});
			polylinesRef.current = [];
		}
		if (Array.isArray(polylines) && !!google) {
			polylinesRef.current = polylines.map((element, index) => {
				const { infoWindow, ...elementProps } = element;
				if (
					Array.isArray(elementProps.path) &&
					elementProps.path.length > 0
				) {
					let polylineMapMarker = new google.maps.Marker({
						position: elementProps.path[0],
						title: elementProps.title,
						fillColor: "#000000",
						//icon: polylineMarkerImage,
					});
					polylineMapMarker.setMap(googlemapRef.current);
				}
				let mapElement = new google.maps.Polyline({
					options: {
						fillColor:
							selectedEntryType == "polyline" &&
							selectedEntry === index
								? elementProps.fillColor
									? elementProps.fillColor
									: colors.hex.accent
								: colors.hex.default,
						strokeColor:
							selectedEntryType == "polyline" &&
							selectedEntry === index
								? elementProps.color
									? elementProps.color
									: colors.hex.accent
								: colors.hex.default,
						strokeOpacity: 1,
						fillOpacity: 1,
						strokeWeight:
							selectedEntryType == "polyline" &&
							selectedEntry === index
								? 1.5
								: selectedEntryType != "polyline"
								? elementProps.strokeWeight
								: 1.5,
						zIndex:
							selectedEntryType == "polyline" &&
							selectedEntry === index
								? 999
								: selectedEntryType != "polyline"
								? elementProps.strokeWeight
								: 1,
					},
					...elementProps,
				});
				mapElement.setMap(googlemapRef.current);
				google.maps.event.addListener(
					mapElement,
					"click",
					function (event) {
						mapElement.setOptions({
							fillColor: elementProps.fillColor
								? elementProps.fillColor
								: colors.hex.accent,
							strokeColor: elementProps.color
								? elementProps.color
								: colors.hex.accent,
							strokeOpacity: 1,
							fillOpacity: 0.8,
							strokeWeight: 4,
						});

						if (!!googlemapRef.current) {
							let elementBounds = getPolylineBounds(mapElement);
							googlemapRef.current.fitBounds(elementBounds);
						}
						showInfoWindow(
							(infoWindow
								? ReactDOMServer.renderToStaticMarkup(
										infoWindow
								  )
								: elementProps.title
								? elementProps.title
								: "") +
								("<br/> Crow fleight distance from Start: " +
									crowFleightDistanceinKm(
										event.latLng.lat(),
										event.latLng.lng(),
										elementProps.path[0].lat,
										elementProps.path[0].lng
									).toFixed(2) +
									" Km"),
							event.latLng
						);
					}
				);

				google.maps.event.addListener(
					mapElement,
					"mouseout",
					function (event) {
						mapElement.setOptions({ fillOpacity: 1 });
						closeInfoWindow();
					}
				);
				return mapElement;
			});
		}
	}, [polylines, selectedEntryType, selectedEntry, google]);

	const applyMarkers = useCallback(() => {
		if (Array.isArray(markersRef.current)) {
			markersRef.current.forEach(element => {
				if (!!element) {
					if (google?.maps) {
						google.maps.event.clearListeners(element, "mouseover");
						google.maps.event.clearListeners(element, "mouseout");
						google.maps.event.clearListeners(element, "click");
					}
					if (!!element.setMap) {
						element.setMap(null);
					}
				}
			});
			markersRef.current = [];
		}
		if (Array.isArray(polylines) && !!google) {
			markersRef.current = markers.map((element, index) => {
				const { infoWindow, ...elementProps } = element;
				let mapElement = new google.maps.Marker(elementProps);
				mapElement.setMap(googlemapRef.current);
				google.maps.event.addListener(
					mapElement,
					"click",
					function (event) {
						if (!!googlemapRef.current) {
							googlemapRef.current.fitBounds(
								mapElement.getBounds()
							);
						}
					}
				);
				if (!!infoWindow) {
					google.maps.event.addListener(
						mapElement,
						"mouseover",
						function (event) {
							infoWindowTimeoutRef.current = setTimeout(
								() =>
									showInfoWindow(
										infoWindow
											? ReactDOMServer.renderToStaticMarkup(
													infoWindow
											  )
											: circleProps.title
											? circleProps.title
											: "",
										mapElement.center
									),
								1000
							);
						}
					);
					google.maps.event.addListener(
						mapElement,
						"mouseout",
						function (event) {
							closeInfoWindow();
						}
					);
				}
				return mapElement;
			});
		}
	}, [markers, selectedEntryType, selectedEntry, google]);

	const applyGeojsons = useCallback(() => {}, [
		geojsons,
		selectedEntryType,
		selectedEntry,
		google,
	]);

	const applyGoogleMap = useCallback(newGooglemap => {
		googlemapRef.current = newGooglemap;

		if (Array.isArray(circlesRef.current)) {
			circlesRef.current.forEach(element => {
				element.setMap(googlemapRef.current);
			});
		}
		if (Array.isArray(polylinesRef.current)) {
			polylinesRef.current.forEach(element => {
				element.setMap(googlemapRef.current);
			});
		}
	}, []);

	useDidUpdate(() => {
		applyGoogleMap(googlemap);
	}, [googlemap]);

	useDidUpdate(() => {
		applyCircles();
	}, [circles]);

	useDidUpdate(() => {
		applyPolylines();
	}, [polylines]);

	useDidUpdate(() => {
		applyMarkers();
	}, [markers]);

	useDidMount(() => {
		if (googlemap) {
			google.maps.event.trigger(googlemap, "center_changed");
			if (Function.isFunction(onMapLoad)) {
				onMapLoad(googlemap);
			}
		}

		// console.log("useDidMount JSON.stringify(geoLocation, null, 2)", JSON.stringify(geoLocation, null, 2))
		// console.log("useDidMount googlemap", googlemap)
		applyCircles();
		applyPolylines();
		applyMarkers();
	});

	useWillUnmount(() => {
		clearTimeout(infoWindowTimeoutRef.current);
		infoWindowTimeoutRef.current = null;
	});

	return (
		<div
			ref={mapRef}
			className={classNames({
				"m-0 mb-4 p-0 relative": true,
				[className]: !!className,
			})}
			style={{
				height: height || windowSize.height * 0.75,
			}}></div>
	);
});

GoogleMap.defaultProps = {
	height: 900,
	styleMode: "light",
};

export default React.memo(GoogleMap);
