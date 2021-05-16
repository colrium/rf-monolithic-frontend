import { useEffect, useState } from 'react';


function getGeoLocation(options) {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(res) => {
					const { coords, ...others } = res;
					const { latitude, longitude, ...rest } = coords;
					resolve({
						lat: latitude,
						lng: longitude,
						...rest,
						...others
					});
				},
				(error) => {
					reject(error.message);
				},
				options
			);
		} else {
			reject('Geolocation is not supported for this Browser/OS.');
		}
	});
}


const defaultGeoLocationOptions = {
	enableHighAccuracy: false,
	maximumAge: 0,
	timeout: Number.POSITIVE_INFINITY,
	when: true,
};

const useGeolocation = (geoLocationOptions = defaultGeoLocationOptions) => {
	const [geoObject, setGeoObject] = useState(null);
	const { when, enableHighAccuracy, timeout, maximumAge } = geoLocationOptions;

	useEffect(() => {
		async function getGeoCode() {
			try {
				const value = await getGeoLocation({
					enableHighAccuracy,
					maximumAge,
					timeout,
					when,
				});
				setGeoObject(value);
			} catch (error) {
				console.error(error)
				setGeoObject(null);
			}
		}
		if (when) {
			getGeoCode();
		}
	}, [when, enableHighAccuracy, timeout, maximumAge]);

	return geoObject;
}

export default useGeolocation;