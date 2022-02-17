/** @format */
/*global google*/
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
	const googlemapRef = useRef(null);
	const infoWindowRef = useRef(null);
	const infoWindowTimeoutRef = useRef(null);
	const circlesRef = useRef([]);
	const polylinesRef = useRef([]);
	const geojsonsRef = useRef([]);
	const markersRef = useRef([]);
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







	const showInfoWindow = useCallback(
		(content, position, options = {}) => {
			if (!infoWindowRef.current && !!google) {
				infoWindowRef.current = new google.maps.InfoWindow({
					content: "",
				});
			}
			if (!!infoWindowRef.current) {
				infoWindowRef.current.setContent(content);
				infoWindowRef.current.setPosition(position);
				infoWindowRef.current.setOptions({ ...options });
				infoWindowRef.current.open(googlemapRef.current);
			}

		},
		[]
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
		[]
	);


	const applyEntrySelection = useCallback((type, index) => {

		if (!!googlemapRef.current) {
			let elementBounds = null;
			if (type === "polyline" && !!polylinesRef.current[index]) {
				// elementBounds = getPolylineBounds(polylinesRef.current[index] );
				if (!!google) {
					new google.maps.event.trigger(
						polylinesRef.current[index],
						"click"
					);
				}

				// console.log("applyEntrySelection elementBounds", elementBounds);
				//
			}
			else if (type === "circle" && !!circlesRef.current[index]) {
				if (!!google) {
					new google.maps.event.trigger(
						circlesRef.current[index],
						"click"
					);
				}
			}
			if (elementBounds) {
				googlemapRef.current.fitBounds(elementBounds);
			}
		}
	}, []);

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
			let entriesZindexes = circles.sort((a, b) => b.radius - a.radius).reduce((currentZindexes, current, index) => {
				currentZindexes[index] = index + 1;
				return currentZindexes;
			}, {});
			circlesRef.current = circles.map((newCircle, index) => {
					const { infoWindow, ...elementProps } = newCircle;
					let mapElement = new google.maps.Circle({
						...elementProps,
						options: {
							fillColor: elementProps.color || colors.hex.default,
							strokeColor:
								elementProps.color || colors.hex.default,
							strokeOpacity: elementProps.opacity || 0.2,
							fillOpacity: 0.1,
							strokeWeight: elementProps.strokeWeight || 1,
							zIndex: entriesZindexes[index],
						},
					});
					mapElement.setMap(googlemapRef.current);

					google.maps.event.addListener(
						mapElement,
						"click",
						function (event) {
							if (!!googlemapRef.current) {
								mapElement.setOptions({ fillOpacity: 0.5 });
								infoWindowTimeoutRef.current = setTimeout(
									() =>
										showInfoWindow(
											infoWindow
												? ReactDOMServer.renderToStaticMarkup(
														infoWindow
												  )
												: elementProps.title
												? elementProps.title
												: "",
											mapElement.center
										),
									100
								);
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
											: elementProps.title
											? elementProps.title
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
							mapElement.setOptions({
								fillOpacity: 0.01,
							});
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
	}, [circles]);

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
				// if (
				// 	Array.isArray(elementProps.path) &&
				// 	elementProps.path.length > 0
				// ) {
				// 	let polylineMapMarker = new google.maps.Marker({
				// 		position: elementProps.path[0],
				// 		title: elementProps.title,
				// 		fillColor: "#000000",
				// 		//icon: polylineMarkerImage,
				// 	});
				// 	polylineMapMarker.setMap(googlemapRef.current);
				// }
				let mapElement = new google.maps.Polyline({
					options: {
						fillColor:
							elementProps.fillColor ||
							elementProps.color ||
							colors.hex.default,
						strokeColor:
							elementProps.strokeColor ||
							elementProps.color ||
							colors.hex.default,
						strokeOpacity: 1,
						fillOpacity: 1,
						strokeWeight: 1.5,
						zIndex: 1,
					},
					...elementProps,
				});
				mapElement.setMap(googlemapRef.current);
				google.maps.event.addListener(
					mapElement,
					"click",
					function (event) {
						mapElement.setOptions({
							strokeOpacity: 1,
							fillOpacity: 1,
							strokeWeight: 5,
							fillColor: colors.hex.accent,
							strokeColor: colors.hex.accent,
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
								(event?.latLng
									? "<br/> Crow fleight distance from Start: " +
									  crowFleightDistanceinKm(
											event.latLng.lat(),
											event.latLng.lng(),
											elementProps.path[0].lat,
											elementProps.path[0].lng
									  ).toFixed(2) +
									  " Km"
									: ""),
							event?.latLng ||
								mapElement?.latLngs[
									mapElement?.latLngs?.length - 1
								]
						);
					}
				);

				google.maps.event.addListener(
					mapElement,
					"mouseout",
					function (event) {
						mapElement.setOptions({
							fillOpacity: 1,
							strokeWeight: 1.5,
							fillColor:
								elementProps.fillColor ||
								elementProps.color ||
								colors.hex.default,
							strokeColor:
								elementProps.strokeColor ||
								elementProps.color ||
								colors.hex.default,
						});
						closeInfoWindow();
					}
				);
				return mapElement;
			});
		}
	}, [polylines]);

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
											: elementProps.title
											? elementProps.title
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
	}, [markers]);

	const applyGeojsons = useCallback(() => {}, [
		geojsons,
		selectedEntryType,
		selectedEntry,
	]);

	const applyGoogleMap = useCallback(
		newGooglemap => {
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
			if (Array.isArray(markersRef.current)) {
				markersRef.current.forEach(element => {
					element.setMap(googlemapRef.current);
				});
			}
		},
		[selectedEntryType, selectedEntry]
	);

	// useDidUpdate(() => {
	// 	applyGoogleMap(googlemap);
	// }, [googlemap]);

	const handleOnMapLoad = useCallback(
		googlemap => {
			googlemapRef.current = googlemap;
			// google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
			// console.log("useDidMount JSON.stringify(geoLocation, null, 2)", JSON.stringify(geoLocation, null, 2))
			if (Function.isFunction(onMapLoad)) {
				onMapLoad(googlemap);
			}
			applyCircles();
			applyPolylines();
			applyMarkers();
			applyGeojsons();

		},
		[onMapLoad]
	);

	const mapRef = useGoogleMaps({
		center: centerCoords,
		zoom: zoom || defaultZoom,
		styles: styleMode === "dark" ? dark : light,
		onMapLoad: handleOnMapLoad,
	});

	useDidUpdate(() => {
		applyCircles();
	}, [circles]);

	useDidUpdate(() => {
		applyPolylines();
	}, [polylines]);

	useDidUpdate(() => {
		applyMarkers();
	}, [markers]);

	useDidUpdate(() => {
		applyGeojsons();
	}, [geojsons]);

	useDidUpdate(() => {
		applyEntrySelection(selectedEntryType, selectedEntry);
	}, [selectedEntryType, selectedEntry]);

	useDidMount(() => {

	});

	useWillUnmount(() => {
		clearTimeout(infoWindowTimeoutRef.current);
		infoWindowTimeoutRef.current = null;
	});



	return (
		<div
			ref={mapRef}
			className={classNames({
				"m-0 p-0 relative": true,
				[className]: !!className,
			})}
			style={{
				height: height || windowSize.height * 0.75,
			}}></div>
	);
});

GoogleMap.defaultProps = {
	height: 1200,
	styleMode: "light",
};

export default React.memo(GoogleMap);
