/* eslint-disable react-hooks/exhaustive-deps */

import { useRef, useCallback, useEffect } from "react";
import { getGeocode, getLatLng, getZipCode, getDetails } from "./utils";
import { useSetState, useDidUpdate, useDidMount, useWillUnmount } from "hooks";

const useLatest = (val) => {
    const ref = useRef(val);
    ref.current = val;
    return ref;
};

export const targetTypes = {
    coordinates: "location",
    bounds: "address",
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
    administrative_area_level_3: "address",
    administrative_area_level_4: "address",
    administrative_area_level_5: "address",
    country: "address",
    postal_code: "address",
};

export const loadApiErr = "💡 use-places-autocomplete: Google Maps Places API library must be loaded. See: https://github.com/wellyshen/use-places-autocomplete#load-the-library";



const usePlacesAutocomplete = ({
    requestOptions,
    debounce = 200,
    cache = 24 * 60 * 60,
    googleMaps,
    callbackName,
    defaultValue = "",
    initOnMount = true,
    type = "coordinates",
    label = "administrative_area_level_1",
    short_name = false,
    cacheName = "upa"
} = {}) => {
    const [state, setState] = useSetState({
        ready: false,
        keyword: "",
        value: defaultValue,
        label: (targetTypes[type] ? targetTypes[type] : "formatted_address"),
        suggestions: {
            loading: false,
            status: "",
            data: [],
        },
    });

    const asRef = useRef(null);
    const requestOptionsRef = useLatest(requestOptions);
    const googleMapsRef = useLatest(googleMaps);
    const gecoderRef = useRef();
    const cacheTimeoutRef = useRef(null);

    const init = useCallback(() => {
        if (asRef.current) return;
        const { google } = window;
        const { current: gMaps } = googleMapsRef;
        const placesLib = gMaps?.places || google?.maps?.places;

        if (!placesLib) {
            console.error(loadApiErr);
            return;
        }

        asRef.current = new placesLib.AutocompleteService();
        if (defaultValue) {
            setValue(defaultValue);
        }
        setState({ ready: true });
    }, []);

    const clearSuggestions = useCallback(() => {
        setState({ suggestions: { loading: false, status: "", data: [] } });
    }, []);

    const getCacheData = useCallback((keyword, cacheKey = "suggestions") => {
        let cachedData = {};

        try {
            cachedData = JSON.parse(sessionStorage.getItem(cacheName) || "{}");
        } catch (error) {
            // Skip exception
            return [];
        }
        let invalidateCache = false;
        cachedData = Object.keys(cachedData).reduce((acc, key) => {
            if (cachedData[key].maxAge - Date.now() >= 0) {
                acc[key] = cachedData[key];
            }
            else if (!invalidateCache) {
                invalidateCache = true;
            }

            return acc;
        }, {});
        if (invalidateCache) {
            try {
                sessionStorage.setItem(cacheName, JSON.stringify(cachedData));
            } catch (error) {
                // Skip exception
            }
        }
        if (cachedData[keyword]) {
            return cachedData[keyword][cacheKey] || [];
        }

        return [];
    }, [cache, cacheName]);

    const setCacheData = useCallback(async (keyword, data, key = "suggestions") => {
        let cachedData = {};

        try {
            cachedData = JSON.parse(sessionStorage.getItem(cacheName) || "{}");
        } catch (error) {
            // Skip exception
        }
        cachedData[keyword] = {
            ...cachedData[keyword],
            [key]: data || [],
            maxAge: Date.now() + cache * 1000,
        };

        try {
            sessionStorage.setItem(cacheName, JSON.stringify(cachedData));
        } catch (error) {
            // Skip exception
        }
    }, [cache, cacheName]);

    const fetchSuggestions = useCallback((keyword) => {
        return new Promise((resolve, reject) => {
            let suggestions = [];
            if (asRef.current) {
                asRef.current.getQueryPredictions({ ...requestOptionsRef.current, input: keyword }, (data, status) => {

                    if (status === "OK") {
                        suggestions = (data || []);
                        resolve(suggestions);

                    }
                    else {
                        console.error("Fetch Suggestions for keyword '" + keyword + "' failed with status:", status);
                        reject(status);
                    }


                });
            }
            else {
                resolve(suggestions);
            }

        })
    }, [asRef.current, requestOptionsRef.current, type]);

    const filterPredictions = useCallback((entries) => {
        let filteredData = [];

        if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "administrative_area_level_3", "administrative_area_level_4", "administrative_area_level_5", "country", "postal_code"].includes(type)) {
            entries = entries.filter(entry => entry?.types?.includes(type));
        }

        entries.map(entry => {
            filteredData.push({
                ...entry,
                label: entry.description,
                value: entry,
            })
        });
        return filteredData;

    }, [type]);

    const parseValueToType = useCallback((targetType, targetValue, resultType = false, options = {}) => {
        return new Promise(function (resolve, reject) {
            if (!targetValue || !targetType) {
                reject("Geocode was not successful. Param is missing");
            }
            if (!resultType) {
                reject("Geocode was not successful. Result type is missing");
            }


            if (!gecoderRef.current) {
                reject("Geocode was not successful. Geocoder is Missing");
            }
            gecoderRef.current.geocode({ ...options, [targetTypes[targetType]]: targetValue }, function (results, status) {
                if (status == 'OK') {
                    let resultValue = undefined;

                    if (Array.isArray(targetValue)) {
                        resultValue = [];
                        if (Array.isArray(results)) {
                            results.map(result => {
                                if (resultType === "address_components") {
                                    resultValue.push(result.address_components);
                                }
                                else if (resultType === "coordinates") {
                                    resultValue.push({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
                                }
                                else if (resultType === "viewport") {
                                    resultValue.push(result.geometry.viewport);
                                }
                                else if (resultType === "bounds") {
                                    resultValue.push(result.geometry.bounds);
                                }
                                else if (resultType === "place_id") {
                                    resultValue.push(result.place_id);
                                }
                                else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "administrative_area_level_3", "administrative_area_level_4", "administrative_area_level_5", "country", "postal_code"].includes(resultType)) {
                                    let resultStr = "";
                                    let address_components = result.address_components;
                                    let name_type = short_name ? "short_name" : "long_name";
                                    for (var i = 0; i < address_components.length; i++) {
                                        if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
                                            resultStr = resultStr + (resultStr.length > 0 ? " " : "") + address_components[i][name_type];
                                        }

                                    }
                                    resultValue.push(resultStr);
                                }
                                else {
                                    resultValue.push(result.formatted_address);
                                }
                            });
                        }

                    }
                    else if (Array.isArray(results) && results.length > 0) {
                        if (resultType === "address_components") {
                            resultValue = results[0].address_components;
                        }
                        else if (resultType === "coordinates") {
                            resultValue = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                        }
                        else if (resultType === "bounds") {
                            resultValue = results[0].geometry.bounds;
                        }
                        else if (resultType === "viewport") {
                            resultValue = results[0].geometry.viewport;
                        }
                        else if (resultType === "place_id") {
                            resultValue = results[0].place_id;
                        }
                        else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "administrative_area_level_3", "administrative_area_level_4", "administrative_area_level_5", "country", "postal_code"].includes(resultType)) {
                            let resultStr = "";
                            let address_components = results[0].address_components;
                            let name_type = short_name ? "short_name" : "long_name";
                            for (var i = 0; i < address_components.length; i++) {
                                if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
                                    resultStr = resultStr + (resultStr.length > 0 ? " " : "") + address_components[i][name_type];
                                }

                            }
                            resultValue = resultStr;
                        }
                        else {
                            resultValue = results[0].formatted_address;
                        }
                    }

                    resolve(resultValue);
                } else {
                    reject("Geocode was not successful." + status);
                }
            });

        });

    }, [gecoderRef.current])


    const getPredictions = useCallback(Function.debounce((keyword) => {
        if (!keyword) {
            clearSuggestions();
            return;
        }
        setState({
            suggestions: {
                data: [],
                status: "",
                loading: true
            }
        });

        let predictions = [];

        if (cache) {
            predictions = getCacheData(keyword, "suggestions")
            if (predictions.length > 0) {
                setState({
                    suggestions: {
                        loading: false,
                        status: "OK",
                        data: filterPredictions(predictions),
                    }
                });
                return;
            }
        }
        if (cacheTimeoutRef.current) {
            clearTimeout(cacheTimeoutRef.current)
        }

        fetchSuggestions(keyword).then(suggestions => {
            setState({
                suggestions: {
                    loading: false,
                    status: "OK",
                    data: filterPredictions(suggestions)
                }
            });
            cacheTimeoutRef.current = setTimeout(() => setCacheData(keyword, suggestions, "suggestions"), 5000)

        }).catch(err => setState({

            suggestions: {
                loading: false,
                status: "OK",
                data: []
            }
        }));
    }, debounce), [debounce, clearSuggestions]);


    const setKeyword = useCallback((keyword, shouldFetchData = true) => {
        setState({ keyword: keyword });
        if (shouldFetchData && keyword && keyword.length >= 3) {
            getPredictions(keyword);
        }
    }, [getPredictions]);

    const setValue = useCallback((value, applyKeyword = true) => {
        let targetValue = value;
        if (Array.isArray(value)) {
            //ToDo:-


        }
        else {
            if (type === "coordinates" && JSON.isJSON(value)) {
                if (("lat" in value || "latitude" in value) && ("lng" in value || "longitude" in value)) {
                    targetValue = {
                        lat: (value.lat ? value.lat : value.latitude),
                        lng: (value.lng ? value.lng : value.longitude),
                    };
                }
            }

            if (targetValue) {

                if (applyKeyword) {
                    setState({ value: targetValue, loading: true });
                    parseValueToType(type, targetValue, label ? label : "formatted_address").then(parsedTypeValue => {
                        if (String.isString(parsedTypeValue)) {

                            setState({ keyword: parsedTypeValue, loading: false });
                            setKeyword(parsedTypeValue)
                        }

                    }).catch(parseErr => {
                        setState({ value: targetValue, keyword: parseErr, loading: false });
                    });
                }
                else {
                    setState({ value: targetValue, loading: false });
                }
            }
            else {
                setState({ value: targetValue, loading: false });
            }

        }

    }, [type, label]);

    const selectSuggestion = useCallback((value) => {
        let targetValue = value;
        if (Array.isArray(value)) {
            //ToDo:-


        }
        else {
            if (targetValue) {
                if (targetTypes[type] !== "address") {
                    setState({ keyword: (value.description || value.label), loading: false });
                    parseValueToType("formatted_address", (value.description || value.label), type).then(parsedTypeValue => {
                        setState({ keyword: value.description || value.label, value: parsedTypeValue })

                    }).catch(parseErr => {
                        setState({ keyword: parseErr, loading: false });
                    });
                }
                else {
                    setState({ keyword: value.description || value.label, value: value.description || value.label, loading: false });
                }


            }
            else {
                setState({ value: null, keyword: "", loading: false });
            }

        }

    }, [debounce, type, label]);

    useDidMount(() => {
        if (!initOnMount) return () => null;

        const { google } = window;
        if (!gecoderRef.current && google?.maps) {
            gecoderRef.current = new window.google.maps.Geocoder();
        }
        if (!googleMapsRef.current && !google?.maps && callbackName) {
            (window)[callbackName] = init;
        } else {
            init();
        }

    });

    useWillUnmount(() => {
        if ((window)[callbackName]) delete (window)[callbackName];
    });





    return { ...state, setKeyword, clearSuggestions, setValue, selectSuggestion, parseValueToType, init, getGeocode, getLatLng, getZipCode, getDetails };
};

export default usePlacesAutocomplete;
//export { getGeocode, getLatLng, getZipCode, getDetails };