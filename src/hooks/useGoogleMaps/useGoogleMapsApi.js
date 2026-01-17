import { useState, useEffect } from "react";
import { google_maps_api_key } from "config";
const initialized = [];
const useGoogleMapsApi = (apiKey = undefined) => {
	const [googleApi, setGoogleApi] = useState();

	useEffect(() => {
		if (window.google) {
			// if window.google object is already available just use it
			setGoogleApi(window.google);
			return;
		}
		const src = `https://maps.googleapis.com/maps/api/js?key=${(apiKey || google_maps_api_key)}&libraries=geometry,drawing,places`;

		const existingScript = initialized.find(el => el.src === src);

		const onLoad = () => {
			setGoogleApi(window.google);
		};
		if (existingScript) {
			// if script tag was added by other element just check when it is loaded
			existingScript.addEventListener("load", onLoad);
			return;
		}

		const script = document.createElement(`script`);
		script.src = src;
		script.async = true;
		script.defer = true;
		script.addEventListener(`load`, onLoad);
		document.head.appendChild(script);
		initialized.push(script);

		return () => {
			script.removeEventListener(`load`, onLoad);
			script.remove();
			initialized.splice(
				initialized.findIndex(el => el.src === src),
				1,
			);
		};
	}, [apiKey]);

	return googleApi;
}

export default useGoogleMapsApi;
