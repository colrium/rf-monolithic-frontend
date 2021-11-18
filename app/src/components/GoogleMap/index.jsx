import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import { compose } from "recompose";
import { default_location } from "config";
import { useGoogleMaps } from "hooks";
import { useGlobals } from "contexts/Globals";
import { useUpdateEffect, useWindowSize, useLatest, useGeolocation } from "react-use"

import { light, dark } from "./styles";

const GoogleMap = React.forwardRef((props, ref) => {
	const { app, className, onMapLoad, height, device, zoom, defaultZoom = 5, center = default_location, showCurrentPosition = false, ...rest
	} = props;
	const domElement = useLatest(ref || null);
	const geoLocation = useGeolocation();
	const windowSize = useWindowSize();
	const [googlemap, google, mapRef] = useGoogleMaps({
		center: center || { lat: 0, lng: 0 },
		zoom: zoom || defaultZoom,
		styles: light
	});

	const { sockets, services } = useGlobals();


	useUpdateEffect(() => {
		if (googlemap) {
			onMapLoad(googlemap)
			google.maps.event.trigger(googlemap, "center_changed");
		}
	}, [onMapLoad, googlemap]);



	return (
		<div
			ref={mapRef}
			className={classNames({
				"m-0 mb-4 p-0 relative": true,
				[className]: !!className,
			})}
			style={{
				height: height,
			}}
		>
		</div>
	);
});

const mapStateToProps = state => ({
	app: state.app,
	device: state.device,
});

export default compose(connect(mapStateToProps, {}),)(React.memo(GoogleMap));
