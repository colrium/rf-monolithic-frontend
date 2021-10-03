import React, { useState, useEffect, useRef } from "react";
import AutoComplete from 'components/AutoComplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { connect } from "react-redux";
import { google_maps_url } from "config";
import { useScript, useWhyDidYouUpdate, useAsync, useGooglePlaces, useGeoLocation, useSetState, useEffectOnceWhen } from "hooks";
import { TextInput } from "components/FormInputs";
import { compose } from "recompose";
import parse from 'autosuggest-highlight/parse';
import { useSetState, useDidUpdate, usePlacesAutocomplete } from "hooks";

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

const autocompleteService = { current: null };
const autocompleteGeocoder = { current: null };



const styles = theme => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
    myLocationBtn: {
        color: theme.palette.secondary.main,
        height: "100%",
        transition: theme.transitions.create(["color"], {
            easing: theme.transitions.easing.easeInOut,
            duration: 100,
        }),
        "&:hover": {
            color: theme.palette.primary.main,
        }
    },
    searchLocationBtn: {
        color: theme.palette.text.secondary,
        transition: theme.transitions.create(["color"], {
            easing: theme.transitions.easing.easeInOut,
            duration: 100,
        }),
        "&:hover": {
            color: theme.palette.text.default,
        }
    },
    inputRoot: {

    },
});

const targetTypes = {
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
};

const GooglePlacesAutocomplete = (props) => {
    const [open, setOpen] = useState(false);
    const loaded = useRef(false);
    const { className, device, placeholder, placeholderType, label, value, type, variant, isMulti, required, touched, disabled, error, invalid, margin, size, max, excludeValidation, min, validate, validator, onValidityChange, helperText, loading, query, onOpen, onClose, onChange, isClearable, onClickMyLocationBtn, result_type, short_name, showMyLocationBtn, controlPosition, ...rest } = props;
    const [autocompleteValue, setAutocompleteValue] = useState(value ? value : null);
    const [typeValue, setTypeValue] = useState(value ? value : null);
    const [textFieldValue, setTextFieldValue] = useState('');
    const [inputValue, setInputValue] = useState(value ? value : null);
    const [inputType, setInputType] = useState(type ? (targetTypes[type] ? targetTypes[type] : "formatted_address") : "formatted_address");
    const [autocompleteOptions, setAutocompleteOptions] = useState({});
    const [inputError, setInputError] = useState(error);
    const [isInvalid, setIsInvalid] = useState(invalid);
    const [inputTouched, setInputTouched] = useState(touched);
    const [inputDisabled, setInputDisabled] = useState(disabled);
    const [inputLoading, setInputLoading] = useState(loading);

    const geolocation = useGeoLocation();
    const googlePlaces = useGooglePlaces();

    /*useEffectOnceWhen(() => {
        if ((query || geolocation) && googlePlaces.scriptLoaded) {
            googlePlaces.geocode(query? query : {location: geolocation}, type, {nameType: "short_name", evaluation: "valuesOnly"}).then(results => {
                let resultsNewAutoCompleteOptions = [];
                results.map(result => {
                    resultsNewAutoCompleteOptions.push({value : result.replaceAll("County", "").replaceAll("Province", "").replaceAll("State", "").replaceAll(" ", ""), label : result});
                })
                setAutocompleteOptions(resultsNewAutoCompleteOptions);
                setAutocompleteValue(results.mode().replaceAll("County", "").replaceAll("Province", "").replaceAll("State", "").replaceAll(" ", ""));
                //setTextFieldValue(results.mode());
            });
        }
    	
    }, geolocation && googlePlaces.scriptLoaded && googlePlaces.geocode && googlePlaces.regions.includes(type));*/

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: option => option.description,
    });

    const throttledEventHandler = useRef(Function.createThrottle(1)).current;

    const parseValueToType = (targetValue, targetType = "address", resultType = false, options = {}, appendData = false) => {
        setInputLoading(true);
        return new Promise(function (resolve, reject) {
            if (!resultType) {
                reject("Geocode was not successful. Result type is missing");
            }

            if (!autocompleteGeocoder.current && window.google) {
                autocompleteGeocoder.current = new window.google.maps.Geocoder();
            }
            if (!autocompleteGeocoder.current) {
                reject("Geocode was not successful. Geocoder is Missing");
            }
            autocompleteGeocoder.current.geocode({ ...options, [targetType]: targetValue }, function (results, status) {
                //console.log("results", results);	
                if (status == 'OK') {
                    let resultValue = undefined;
                    let resultsNewAutoCompleteOptions = [];
                    let resultsNewAutoCompleteValue = autocompleteValue;

                    if (Array.isArray(targetValue)) {
                        resultValue = [];
                        resultsNewAutoCompleteOptions = [];
                        resultsNewAutoCompleteValue = undefined;
                        if (Array.isArray(results)) {
                            resultsNewAutoCompleteOptions = [];
                            resultsNewAutoCompleteValue = [];
                            results.map(result => {
                                if (resultType === "address_components") {
                                    resultsNewAutoCompleteOptions.push(result);
                                    resultsNewAutoCompleteValue.push(result);
                                    resultValue.push(result.address_components);
                                }
                                else if (resultType === "coordinates") {
                                    resultsNewAutoCompleteOptions.push(result);
                                    resultsNewAutoCompleteValue.push(result);
                                    resultValue.push({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
                                }
                                else if (resultType === "viewport") {
                                    resultsNewAutoCompleteOptions.push(result);
                                    resultsNewAutoCompleteValue.push(result);
                                    resultValue.push(result.geometry.viewport);
                                }
                                else if (resultType === "place_id") {
                                    resultsNewAutoCompleteOptions.push(result);
                                    resultsNewAutoCompleteValue.push(result);
                                    resultValue.push(result.place_id);
                                }
                                else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_2", "administrative_area_level_1", "country", "postal_code"].includes(resultType)) {
                                    let resultStr = "";
                                    let address_components = result.address_components;
                                    let name_type = short_name ? "short_name" : "long_name";
                                    for (var i = 0; i < address_components.length; i++) {
                                        if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
                                            resultsNewAutoCompleteOptions.push(result);
                                            resultsNewAutoCompleteValue.push(result);
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
                        resultsNewAutoCompleteOptions = [];
                        resultsNewAutoCompleteValue = undefined;
                        if (resultType === "address_components") {
                            resultsNewAutoCompleteOptions.push(results[0]);
                            resultsNewAutoCompleteValue = results[0];
                            resultValue = results[0].address_components;
                        }
                        else if (resultType === "coordinates") {
                            resultsNewAutoCompleteOptions.push(results[0]);
                            resultsNewAutoCompleteValue = results[0];
                            resultValue = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                        }
                        else if (resultType === "viewport") {
                            resultsNewAutoCompleteOptions.push(results[0]);
                            resultValue = results[0].geometry.viewport;
                        }
                        else if (resultType === "place_id") {
                            resultsNewAutoCompleteOptions.push(results[0]);
                            resultsNewAutoCompleteValue = results[0];
                            resultValue = results[0].place_id;
                        }
                        else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "country", "postal_code"].includes(resultType)) {
                            let resultStr = "";
                            let address_components = results[0].address_components;
                            let name_type = short_name ? "short_name" : "long_name";
                            for (var i = 0; i < address_components.length; i++) {
                                if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
                                    resultsNewAutoCompleteOptions.push(results[0]);
                                    resultsNewAutoCompleteValue = results[0];
                                    resultStr = resultStr + (resultStr.length > 0 ? " " : "") + address_components[i][name_type];
                                }

                            }
                            resultValue = resultStr;
                        }
                        else {
                            resultsNewAutoCompleteOptions.push(results[0]);
                            resultsNewAutoCompleteValue = results[0];
                            resultValue = results[0].formatted_address;
                        }
                    }

                    resolve({ value: resultValue, option: resultsNewAutoCompleteOptions[0] });
                } else {
                    reject("Geocode was not successful." + status);
                }
            });

        });

    }

    const fetch = React.useMemo(() => Function.throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
    }, 200), []);

    const placesPrediction = useAsync(Function.throttle((keyword, query = {}) => {
        return new Promise((resolve, reject) => {
            if (!autocompleteService.current && window.google) {
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
            }
            if (!autocompleteService.current) {
                reject("Places Autocomplete service is unavailable");
            }
            if (!autocompleteGeocoder.current && window.google) {
                autocompleteGeocoder.current = new window.google.maps.Geocoder();
            }
            if (!autocompleteGeocoder.current) {
                reject("Places Geocode service is unavailable")
            }
            fetch({ input: keyword, ...(["locality", "sublocality", "administrative_area_level_1", "administrative_area_level_2", "country", "postal_code"].includes(type) ? { regions: [type] } : {}), ...query }, (results) => {
                let parsedOptions = [];

                if (Array.isArray(results)) {
                    results.map(result => {
                        parsedOptions.push(googlePlaces.geocode({ [targetTypes.place_id]: result.place_id }, type));
                    });
                }
                Promise.all(parsedOptions).then((responses) => {
                    let appended_values = [];
                    let new_options = [];
                    responses.map(response => {
                        if (!appended_values.includes(response.value)) {
                            new_options.push({ value: response.value, ...response.option });
                            appended_values.push(response.value);
                        }
                    });
                    resolve(new_options);
                }).catch((error) => {
                    reject(error);
                });

            });
        });
    }, 1000), false);



    const throttledOnChange = useRef(Function.throttle(async (event) => { }, 250)).current;

    const throttledOnTextChange = useRef(Function.throttle((keyword) => { }, 1500)).current;

    const throttledOnClickMyLocationBtn = useRef(Function.throttle(async (event) => { }, 250)).current;



    const handleOnChange = (value) => {
        if (String.isString(value)) {
            setTextFieldValue(value);
        }
        setAutocompleteValue(value);
    }



    const handleOnClickMyLocationBtn = (event) => {
        event.persist();
        throttledOnClickMyLocationBtn(event);
    }
    useEffect(() => {

        setAutocompleteOptions(Array.isArray(placesPrediction.value) ? placesPrediction.value : [])

    }, [placesPrediction.value, type]);


    //console.log("placesPrediction", placesPrediction);
    //console.log("autocompleteOptions", autocompleteOptions);

    return (
        <AutoComplete
            className={"flex-1" + (className ? (" " + className) : "")}
            getOptionLabel={(option) => (typeof option === 'string' ? option : (placeholderType in option ? JSON.stringify(option[placeholderType]) : option.label))}
            filterOptions={(options, state) => {
                return options;
            }}
            options={autocompleteOptions}
            autoComplete={googlePlaces.regions.includes(type)}
            value={autocompleteValue}
            onChange={handleOnChange}
            onInputChange={(event, newTextFieldValue) => {
                //
                setTextFieldValue(newTextFieldValue);
                //placesPrediction.execute(newTextFieldValue);			
            }}
            inputValue={textFieldValue}
            renderInput={({ inputProps: { className, value, onChange: inputOnChange, ...inputPropsParams }, ...params }) => {
                //console.log("inputPropsParams", inputPropsParams);
                return (
                    <TextInput
                        {...params}
                        {...inputPropsParams}
                        InputLabelProps={{
                            ...params.InputLabelProps,
                            shrink: (isMulti && (Array.isArray(autocompleteValue) && autocompleteValue.length > 0)) || (JSON.isJSON(params.InputLabelProps) ? params.InputLabelProps.shrink : open),
                        }}
                        inputProps={{
                            className: className,
                            value: textFieldValue,
                            autoComplete: String.uid(11),

                        }}
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: String.uid(11),

                        }}
                        onChange={inputOnChange}
                        label={label}
                        variant={variant}
                        margin={margin}
                        size={size}
                        value={value}
                        required={required}
                        disabled={inputDisabled}
                        error={inputError ? true : isInvalid}
                        helperText={inputError ? inputError : (isInvalid ? "Invalid" : helperText)}
                        onChangeYield={"event"}
                        fullWidth
                    />

                );
            }}
            forcePopupIcon={true}
            loading={placesPrediction.status === "pending"}

            open={open}
            onOpen={() => {
                setOpen(true);
                if (Function.isFunction(onOpen)) {
                    onOpen();
                }
            }}
            onClose={() => {
                setOpen(false);
                if (Function.isFunction(onClose)) {
                    onClose();
                }
            }}


            renderOption={(option) => {
                if (option.formatted_address) {
                    //if (Array.isArray(option.types) && option.types.includes(type)) {
                    return (
                        <Grid container alignItems="center">
                            <Grid item>
                                <LocationOnIcon className={"mr-2 text-current"} />
                            </Grid>
                            <Grid item xs>
                                <span className="mx-1">
                                    {option.formatted_address}
                                </span>
                            </Grid>
                        </Grid>
                    );
                    //}

                }
                else if (option && Array.isArray(option.address_components)) {
                    let address_components = option.address_components;
                    let address_component = false;
                    let name_type = short_name ? "short_name" : "long_name";
                    for (var i = 0; i < address_components.length; i++) {
                        if (Array.isArray(address_components[i].types) && address_components[i].types.includes(type)) {
                            address_component = address_components[i];
                            break;
                        }

                    }

                    if (address_component) {
                        return (
                            <Grid container alignItems="center">
                                <Grid item>
                                    <LocationOnIcon className={"mr-2 text-current"} />
                                </Grid>
                                <Grid item xs>
                                    <span className="mx-1">
                                        {address_component[name_type]}
                                    </span>
                                </Grid>
                            </Grid>
                        );
                    }

                }
                else if (String.isString(option.label)) {
                    return (
                        <Grid container alignItems="center">
                            <Grid item>
                                <LocationOnIcon className={"mr-2 text-current"} />
                            </Grid>
                            <Grid item xs>
                                <span className="mx-1">
                                    {option.label}
                                </span>
                            </Grid>
                        </Grid>
                    );
                }
                return;
            }}
            multiple={isMulti}
            disableClearable
            fullWidth
            autoSelect
            {...rest}
        />
    );
}

GooglePlacesAutocomplete.defaultProps = {
    margin: "dense",
    size: "small",
    variant: "outlined",
    label: "Search for a location",
    type: "administrative_area_level_1",
    placeholderType: "formatted_address",
    short_name: false,
    showMyLocationBtn: true,
}

const mapStateToProps = state => ({
    //app: state.app,
    device: state.device,
});

export default compose(connect(mapStateToProps, {}))(React.memo(GooglePlacesAutocomplete));