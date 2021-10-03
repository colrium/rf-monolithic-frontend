/* eslint-disable */

export const geocodeErr = "💡 use-places-autocomplete: Please provide an address when using getGeocode() with the componentRestrictions.";


export const getGeocode = (args) => {
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode(args, (results, status) => {
            if (status !== "OK") reject(status);
            if (!args.address && args.componentRestrictions) {
                console.error(geocodeErr);
                resolve(results);
            }
            resolve(results);
        });
    });
};

export const getLatLng = (result) => new Promise((resolve, reject) => {
    try {
        const { lat, lng } = result.geometry.location;
        resolve({ lat: lat(), lng: lng() });
    } catch (error) {
        reject(error);
    }
});


export const getZipCode = (result, useShortName = false) => new Promise((resolve, reject) => {
    try {
        let zipCode = null;

        result.address_components.forEach(({ long_name, short_name, types }) => {
            if (types.includes("postal_code"))
                zipCode = useShortName ? short_name : long_name;
        });

        resolve(zipCode);
    } catch (error) {
        reject(error);
    }
});

export const getDetailsErr = "💡 use-places-autocomplete: Please provide a place Id when using getDetails() either as a string or as part of an Autocomplete Prediction.";

export const getDetails = (args) => {
    const PlacesService = new window.google.maps.places.PlacesService(document.createElement("div"));

    if (!args.placeId) {
        console.error(getDetailsErr);
        return Promise.reject(getDetailsErr);
    }

    return new Promise((resolve, reject) => {
        PlacesService.getDetails(args, (results, status) => {
            if (status !== "OK") reject(status);
            resolve(results);
        });
    });
};


// export const convert = (targetValue, targetType = "address", resultType = false, options = {}) => {
//     return new Promise(function (resolve, reject) {
//         if (!resultType) {
//             reject("💡 use-places-autocomplete: Please provide a. Result type is missing");
//         }

//         autocompleteGeocoder.current.geocode({ ...options, [targetType]: targetValue }, function (results, status) {
//             //console.log("results", results);	
//             if (status == 'OK') {
//                 let resultValue = undefined;
//                 let resultsNewAutoCompleteOptions = [];
//                 let resultsNewAutoCompleteValue = autocompleteValue;

//                 if (Array.isArray(targetValue)) {
//                     resultValue = [];
//                     resultsNewAutoCompleteOptions = [];
//                     resultsNewAutoCompleteValue = undefined;
//                     if (Array.isArray(results)) {
//                         resultsNewAutoCompleteOptions = [];
//                         resultsNewAutoCompleteValue = [];
//                         results.map(result => {
//                             if (resultType === "address_components") {
//                                 resultsNewAutoCompleteOptions.push(result);
//                                 resultsNewAutoCompleteValue.push(result);
//                                 resultValue.push(result.address_components);
//                             }
//                             else if (resultType === "coordinates") {
//                                 resultsNewAutoCompleteOptions.push(result);
//                                 resultsNewAutoCompleteValue.push(result);
//                                 resultValue.push({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
//                             }
//                             else if (resultType === "viewport") {
//                                 resultsNewAutoCompleteOptions.push(result);
//                                 resultsNewAutoCompleteValue.push(result);
//                                 resultValue.push(result.geometry.viewport);
//                             }
//                             else if (resultType === "place_id") {
//                                 resultsNewAutoCompleteOptions.push(result);
//                                 resultsNewAutoCompleteValue.push(result);
//                                 resultValue.push(result.place_id);
//                             }
//                             else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_2", "administrative_area_level_1", "country", "postal_code"].includes(resultType)) {
//                                 let resultStr = "";
//                                 let address_components = result.address_components;
//                                 let name_type = short_name ? "short_name" : "long_name";
//                                 for (var i = 0; i < address_components.length; i++) {
//                                     if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
//                                         resultsNewAutoCompleteOptions.push(result);
//                                         resultsNewAutoCompleteValue.push(result);
//                                         resultStr = resultStr + (resultStr.length > 0 ? " " : "") + address_components[i][name_type];
//                                     }

//                                 }
//                                 resultValue.push(resultStr);
//                             }
//                             else {
//                                 resultValue.push(result.formatted_address);
//                             }
//                         });
//                     }

//                 }
//                 else if (Array.isArray(results) && results.length > 0) {
//                     resultsNewAutoCompleteOptions = [];
//                     resultsNewAutoCompleteValue = undefined;
//                     if (resultType === "address_components") {
//                         resultsNewAutoCompleteOptions.push(results[0]);
//                         resultsNewAutoCompleteValue = results[0];
//                         resultValue = results[0].address_components;
//                     }
//                     else if (resultType === "coordinates") {
//                         resultsNewAutoCompleteOptions.push(results[0]);
//                         resultsNewAutoCompleteValue = results[0];
//                         resultValue = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
//                     }
//                     else if (resultType === "viewport") {
//                         resultsNewAutoCompleteOptions.push(results[0]);
//                         resultValue = results[0].geometry.viewport;
//                     }
//                     else if (resultType === "place_id") {
//                         resultsNewAutoCompleteOptions.push(results[0]);
//                         resultsNewAutoCompleteValue = results[0];
//                         resultValue = results[0].place_id;
//                     }
//                     else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "country", "postal_code"].includes(resultType)) {
//                         let resultStr = "";
//                         let address_components = results[0].address_components;
//                         let name_type = short_name ? "short_name" : "long_name";
//                         for (var i = 0; i < address_components.length; i++) {
//                             if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
//                                 resultsNewAutoCompleteOptions.push(results[0]);
//                                 resultsNewAutoCompleteValue = results[0];
//                                 resultStr = resultStr + (resultStr.length > 0 ? " " : "") + address_components[i][name_type];
//                             }

//                         }
//                         resultValue = resultStr;
//                     }
//                     else {
//                         resultsNewAutoCompleteOptions.push(results[0]);
//                         resultsNewAutoCompleteValue = results[0];
//                         resultValue = results[0].formatted_address;
//                     }
//                 }

//                 resolve({ value: resultValue, option: resultsNewAutoCompleteOptions[0] });
//             } else {
//                 reject("Geocode was not successful." + status);
//             }
//         });

//     });

// }