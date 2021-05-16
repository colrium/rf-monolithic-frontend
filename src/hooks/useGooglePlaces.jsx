import { useEffect, useState, useRef, useMemo } from 'react';
import { useScript, useGeolocation } from "hooks";
import { google_maps_url } from "config";
import parse from 'autosuggest-highlight/parse';
const defaultGeocodeOptions = {nameType: "short_name", evaluation: "valuesOnly"};

function loadScript(src, position, id) {
	if (!position) {
		return;
	}

	const script = document.createElement('script');
	script.setAttribute('async', '');
	script.setAttribute('id', id);
	script.src = src;
	position.appendChild(script);
}

const useGooglePlaces = () => {
	const autocompleteGeocoder = useRef();
	const autocompleteService = useRef();
	const [types, setTypes] = useState({
				coordinates: "location",
				address: "address",
				formatted_address: "address",
				place_id: "placeId",
				street_number: "address",
				route: "address",
				neighborhood: "address",
				political: "address",
				locality: "address",
				administrative_area_level_1: "address",
				administrative_area_level_2: "address",				
				country: "address",
				postal_code: "address",
			});
	const [regions, setRegions] = useState(["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "administrative_area_level_3", "administrative_area_level_4", "sublocality_level_1", "country", "postal_code"]);
	const scriptLoaded = useScript(google_maps_url);
	const geolocation = useGeolocation();
	const throttledAction =Function.createThrottle(1);

	const geocode = (query={location: geolocation}, type="address", options=defaultGeocodeOptions) => {		
		return new Promise(function(resolve, reject) {
			options = {...defaultGeocodeOptions, ...options};
			const {nameType, evaluation} = options;
			if (!type) {
				reject("Geocode was not successful. Target type is missing");
			}
			if (!autocompleteGeocoder.current && window.google) {
				autocompleteGeocoder.current = new window.google.maps.Geocoder();
			}
			if (!autocompleteGeocoder.current) {
				reject("Geocode was not successful. Geocoder is Missing");
			}
			autocompleteGeocoder.current.geocode( {...query}, function(results, status) {			
				let evaluated_results = [];
				if (status == 'OK') {
                    if (Array.isArray(results) && results.length > 0){
                    	console.log("results", results);
                    	results.map(result => {
							if (type==="address_components") {
								result.value = result.address_components;
							}
							else if (type==="coordinates") {
								result.value = {lat: result.geometry.location.lat(), lng: result.geometry.location.lng()};
							}
							else if (type==="viewport") {
								result.value = result.geometry.viewport;
							}
							else if (type==="place_id") {
								result.value = result.place_id;
							}
							else if (type==="geometry") {
								result.value = result.geometry;
							}
							else if (regions.includes(type)) {
	                            let resultStr = "";
	                            let address_components = result.address_components;
	                            for (var i = 0; i < address_components.length; i++) {
	                                if (Array.isArray(address_components[i].types) && address_components[i].types.includes(type)) {
	                                    resultStr = resultStr+(resultStr.length > 0? " ": "")+address_components[i][nameType]; 
	                                }
	                                
	                            }
	                            result.value = String.isEmpty(resultStr)? undefined : resultStr;
	                        }
							else {
								result.value = result.formatted_address;
							}
							if (result.value) {
								if (evaluation === "valuesOnly" || evaluation === "modeValueOnly") {
									evaluated_results.push(result.value);
								}
								else{
									evaluated_results.push(result);
								}
							}
								
                    	});
							
					}
					evaluated_results = evaluated_results.unique();
					if (evaluation === "modeValueOnly") {
						evaluated_results = evaluated_results.mode();
					}
                    
                    resolve(evaluated_results);
                } else {
					reject("Geocode was not successful." + status);
				}
			});

		});
			
	};

	const fetch = useMemo(() => Function.throttle((request, callback) => {
		autocompleteService.current.getPlacePredictions(request, callback);
	}, 200), []);

	const getPlacePredictions =  (keyword, type=undefined, query={}) => { 
        return new Promise((resolve, reject) => {
        	if (!autocompleteService.current && window.google) {
				autocompleteService.current = new window.google.maps.places.AutocompleteService();
			}
			if (!autocompleteService.current) {
				reject("Places Autocomplete service is unavailable");
			}
			
			fetch({ input: keyword, ...(regions.includes(type)? {regions:[type]} : {}), ...query }, (results) => {
				/*let parsedOptions = [];

				if (Array.isArray(results)) {
					results.map(result => {
						parsedOptions.push(parse(result.place_id, types.place_id, type));
					});
				}
				Promise.all(parsedOptions).then((responses) => {
					let appended_values = [];
					let new_options = [];
					responses.map(response => {
						if (!appended_values.includes(response.value)) {
							new_options.push({value: response.value, ...response.option});
							appended_values.push(response.value);
						}						
					});
					resolve(new_options);
				}).catch((error) => {
					reject(error);
				});*/
				resolve(results);
			});        	
        });
    };

	return {types, regions, getPlacePredictions, geocode, scriptLoaded};
}

export default useGooglePlaces;