import React, { useState, useEffect } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { connect } from "react-redux";
import { google_maps_url } from "config";
import { TextInput } from "components/FormInputs";
import { compose } from "recompose";
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

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
	inputRoot:{

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

function LocationInput(props) {
	const [open, setOpen] = useState(false);
	const loaded = React.useRef(false);
	const { className, device, placeholder, placeholderType, label, value, type, variant, isMulti, required, touched, disabled, error, invalid, margin, size, max, excludeValidation, min, validate, validator, onValidityChange, helperText, loading, query, onOpen, onClose, onChange, isClearable, onClickMyLocationBtn, result_type, short_name, showMyLocationBtn, controlPosition, ...rest} = props;
	const [autocompleteValue, setAutocompleteValue] = useState(value? value : null);
	const [typeValue, setTypeValue] = useState(value? value : null);
	const [textFieldValue, setTextFieldValue] = useState('');
	const [inputValue, setInputValue] = useState(value? value : undefined);
	const [inputType, setInputType] = useState(type? (targetTypes[type]? targetTypes[type]  : "formatted_address") : "formatted_address");
	const [autocompleteOptions, setAutocompleteOptions] = useState([]);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);
	const [inputDisabled, setInputDisabled] = useState(disabled);
	const [inputLoading, setInputLoading] = useState(loading);

	if (typeof window !== 'undefined' && !loaded.current) {
		if (!document.querySelector('[src*="https://maps.googleapis.com/maps/api/js"]')) {
			loadScript(google_maps_url, document.querySelector('head'), 'google-maps-from-location-input' );
		}

		loaded.current = true;
	}

	const inputValueValid = async input_value => {		
		let excludedValidators = Array.isArray(excludeValidation)? excludeValidation : (String.isString(excludeValidation)? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
		let valid = true;
		let validationError = "";
		if (validate) {
			if (valid && required && !excludedValidators.includes("required")) {
				if (!input_value) {
					valid = false;
					validationError = label + " is required";
				}
				else if ((Array.isArray(input_value) && input_value.length > 0) || (JSON.isJSON(input_value) && Object.keys(input_value).length > 0) || (input_value && input_value.length > 0)) {					
						valid = true;
						validationError = "";
					
				} else {
					valid = false;
					validationError = label + " required";
				}
			}

			if (valid && Function.isFunction(validator) && !excludedValidators.includes("validator")) {
				try {
					validationError = await validator(input_value);
				} catch(err) {
					console.error(label+" validator error ", err);					
					validationError = " validity cannot be determined.";
				};
				valid = !String.isString(validationError);
			}
		}
		if (valid !== !isInvalid && Function.isFunction(onValidityChange)) {
			onValidityChange(valid);
		}
		setInputError(valid ? undefined : validationError);
		setIsInvalid(!valid);
		return valid;
	};

	const triggerOnChange = async (newValue) => {
		setInputDisabled(true);
		let new_value = null;
		if (Array.isArray(newValue) || JSON.isJSON(newValue)) {
					if (isMulti) {
						new_value = [];
						newValue.map((entry, cursor) => {
							if (entry) {
								new_value.push(entry.value);
							}
							
						});
						if (Function.isFunction(onChange)) {
							onChange(new_value);
						}
					} else {
						
						if (JSON.isJSON(newValue)) {
							new_value = newValue.value;
						}
						
					}
				}
				
		if ( Function.isFunction(onChange)) {
			let changed = onChange(new_value);
			Promise.all([changed]).then(()=>{
				setInputDisabled(false);
			}).catch(e => {
				console.error(label+" onChange error", e);
				setInputDisabled(false);
			});
			
		}
		else{
			setInputDisabled(false);
		}
		
	}

	const parseValueToType = (targetValue, targetType = "address", resultType=false, options={}, appendData=false) => {
		setInputLoading(true);
		return new Promise(function(resolve, reject) {
			if (!resultType) {
				setInputLoading(false);
				reject("Geocode was not successful. Result type is missing");
			}

			if (!autocompleteGeocoder.current && window.google) {
				autocompleteGeocoder.current = new window.google.maps.Geocoder();
			}
			if (!autocompleteGeocoder.current) {
				setInputLoading(false);
				reject("Geocode was not successful. Geocoder is Missing");
			}
			autocompleteGeocoder.current.geocode( {...options, [targetType]: targetValue}, function(results, status) {				
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
								if (resultType==="address_components") {
									resultsNewAutoCompleteOptions.push(result);
									resultsNewAutoCompleteValue.push(result);
									resultValue.push(result.address_components);
								}
								else if (resultType==="coordinates") {
									resultsNewAutoCompleteOptions.push(result);
									resultsNewAutoCompleteValue.push(result);
									resultValue.push({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
								}
								else if (resultType==="viewport") {
									resultsNewAutoCompleteOptions.push(result);
									resultsNewAutoCompleteValue.push(result);
									resultValue.push(result.geometry.viewport);
								}
								else if (resultType==="place_id") {
									resultsNewAutoCompleteOptions.push(result);
									resultsNewAutoCompleteValue.push(result);
									resultValue.push(result.place_id);
								}
								else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_2", "administrative_area_level_1", "country", "postal_code"].includes(resultType)) {
									let resultStr = "";
									let address_components = result.address_components;
									let name_type = short_name? "short_name" : "long_name";
									for (var i = 0; i < address_components.length; i++) {
										if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
											resultsNewAutoCompleteOptions.push(result);
											resultsNewAutoCompleteValue.push(result);
											resultStr = resultStr+(resultStr.length > 0? " ": "")+address_components[i][name_type]; 
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
					else if (Array.isArray(results) && results.length > 0){
						resultsNewAutoCompleteOptions = [];
						resultsNewAutoCompleteValue = undefined;
						if (resultType==="address_components") {
							resultsNewAutoCompleteOptions.push(results[0]);
							resultsNewAutoCompleteValue = results[0];
							resultValue = results[0].address_components;
						}
						else if (resultType==="coordinates") {
							resultsNewAutoCompleteOptions.push(results[0]);
							resultsNewAutoCompleteValue = results[0];
							resultValue = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
						}
						else if (resultType==="viewport") {
							resultsNewAutoCompleteOptions.push(results[0]);
							resultValue = results[0].geometry.viewport;
						}
						else if (resultType==="place_id") {
							resultsNewAutoCompleteOptions.push(results[0]);
							resultsNewAutoCompleteValue = results[0];
							resultValue = results[0].place_id;
						}
						else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "country", "postal_code"].includes(resultType)) {
								
									let resultStr = "";
									let address_components = results[0].address_components;
									let name_type = short_name? "short_name" : "long_name";
									for (var i = 0; i < address_components.length; i++) {
										if (Array.isArray(address_components[i].types) && address_components[i].types.includes(resultType)) {
											resultsNewAutoCompleteOptions.push(results[0]);
											resultsNewAutoCompleteValue = results[0];
											resultStr = resultStr+(resultStr.length > 0? " ": "")+address_components[i][name_type]; 
										}
										
									}
									console.log("resultType", resultType, "resultStr", resultStr)
									resultValue = resultStr;
						}
						else {
							resultsNewAutoCompleteOptions.push(results[0]);
							resultsNewAutoCompleteValue = results[0];
							resultValue = results[0].formatted_address;
						}
					}
					if (appendData) {
						setAutocompleteOptions(resultsNewAutoCompleteOptions);
						setAutocompleteValue(resultsNewAutoCompleteValue);
					}
					setInputLoading(false);
					console.log("parseValueToType resultValue", resultValue, "\n results", results);
					resolve(resultValue);
					
				} else {
					setInputLoading(false);
					reject("Geocode was not successful." + status);
				}
			});

		});
			
	}

	const fetch = React.useMemo(
		() =>
			throttle((request, callback) => {
				autocompleteService.current.getPlacePredictions(request, callback);
			}, 200),
		[],
	);

	React.useEffect(() => {
		let active = true;
		let executeFetch = true;
		/*if (autocompleteValue && !Array.isArray(autocompleteValue)) {
			if (textFieldValue === autocompleteValue.description) {
				executeFetch = false;
			}			
		}
		

		console.log("executeFetch", executeFetch)*/

		console.log("query", query)

		if (executeFetch) {
			if (!autocompleteService.current && window.google) {
				autocompleteService.current = new window.google.maps.places.AutocompleteService();
			}
			if (!autocompleteService.current) {
				if (inputTouched) {
					setInputError("Places Autocomplete service is unavailable")
				}
				setInputLoading(false);
				return undefined;
			}
			if (!autocompleteGeocoder.current && window.google) {
				autocompleteGeocoder.current = new window.google.maps.Geocoder();
			}
			if (!autocompleteGeocoder.current) {
				if (inputTouched) {
					setInputError("Places Geocode service is unavailable")
				}
				setInputLoading(false);
				return undefined;
			}

			if (textFieldValue === '') {
				setAutocompleteOptions(autocompleteValue ? [autocompleteValue] : []);
				return undefined;
			}

			
			fetch({ input: textFieldValue, ...(["locality", "sublocality", "administrative_area_level_1", "administrative_area_level_2", "country", "postal_code"].includes(type)? {regions:[type]} : {}), ...query }, (results) => {
					let newAutocompleteOptions = [];

					if (autocompleteValue) {
						newAutocompleteOptions = [autocompleteValue];
					}


					let newAutocompleteValue = undefined;
						if (Array.isArray(results)) {

							if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_1", "administrative_area_level_2", "country", "postal_code"].includes(type)) {
								results.map(result => {
									if (result.types.includes(type)) {
										newAutocompleteOptions.push(result);
									}
								});
							}
							else{
								newAutocompleteOptions = [...newAutocompleteOptions, ...results];
							}
						}

					//setAutocompleteValue(newAutocompleteValue);
					setAutocompleteOptions(newAutocompleteOptions);

			});
		}
			

		return () => {
			active = false;
		};
	}, [textFieldValue, fetch, query]);

	useEffect(() => {
		if (inputTouched) {
			console.log("inputValue", inputValue);
			let valueValid = inputValueValid(inputValue);
			Promise.all([valueValid]).then(validity => {
				if (validity[0]) {
					triggerOnChange(inputValue);
				}
			}).catch(e => {
				console.error(label+" validity check error", e);
			});			
		}
		else {
			/*if (inputValue) {
				if (type === "coordinates" && JSON.isJSON(value)) {					
					if (("lat" in value || "latitude" in value) && ("lng" in value || "longitude" in value)) {
						targetValue = {
							lat: (value.lat? value.lat : value.latitude),
							lng: (value.lng? value.lng : value.longitude),
						};
					}
				}
				
				parseValueToType(targetValue, targetTypes[type], placeholderType? placeholderType : (targetTypes[type]==="address"? targetTypes[type] : "formatted_address")).then(parsedTypeValue => {
					if (String.isString(parsedTypeValue)) {
						setTextFieldValue(parsedTypeValue);
						fetch({ input: parsedTypeValue }, (results) => {
								let newAutocompleteOptions = [];
								let newAutocompleteValue = undefined;

								if (Array.isArray(results)) {
									newAutocompleteValue = results[0];
									newAutocompleteOptions = [...newAutocompleteOptions, ...results];
								}

								setAutocompleteOptions(newAutocompleteOptions);
								setAutocompleteValue(newAutocompleteValue);
							
						});
						console.log("useEffect value, type parsedTypeValue \n", parsedTypeValue, "autocompleteValue", autocompleteValue);
					}
						
				}).catch(parseErr => {
					console.log("parseValueToType parseErr", parseErr);
					setTextFieldValue("");
				});
			}*/
			
		}
	}, [inputValue, inputTouched, type]);

	/*useEffect(() => {
		console.log("value", value);
		if (targetTypes[type] && value) {
			if (!autocompleteService.current && window.google) {
				autocompleteService.current = new window.google.maps.places.AutocompleteService();
			}
			if (!autocompleteService.current) {
				if (inputTouched) {
					setInputError("Places Autocomplete service is unavailable")
				}
				return undefined;
			}
			if (!autocompleteGeocoder.current && window.google) {
				autocompleteGeocoder.current = new window.google.maps.Geocoder();
			}
			if (!autocompleteGeocoder.current) {
				if (inputTouched) {
					setInputError("Places Geocode service is unavailable")
				}
				return undefined;
			}

			let targetValue = value;
			if (Array.isArray(value)) {
				 //ToDo:-
				
					
			}
			else {
				if (type === "coordinates" && JSON.isJSON(value)) {					
					if (("lat" in value || "latitude" in value) && ("lng" in value || "longitude" in value)) {
						targetValue = {
							lat: (value.lat? value.lat : value.latitude),
							lng: (value.lng? value.lng : value.longitude),
						};
					}
				}

				parseValueToType(targetValue, targetTypes[type], placeholderType? placeholderType : (targetTypes[type]? type : "formatted_address")).then(parsedTypeValue => {
					if (String.isString(parsedTypeValue)) {
						setTextFieldValue(parsedTypeValue);
						fetch({ input: parsedTypeValue }, (results) => {
								let newAutocompleteOptions = [];
								let newAutocompleteValue = undefined;

								if (Array.isArray(results)) {
									newAutocompleteValue = results[0];
									newAutocompleteOptions = [...newAutocompleteOptions, ...results];
								}

								setAutocompleteOptions(newAutocompleteOptions);
								setAutocompleteValue(newAutocompleteValue);
							
						});
						console.log("useEffect value, type parsedTypeValue \n", parsedTypeValue, "autocompleteValue", autocompleteValue);
					}
						
				}).catch(parseErr => {
					console.log("parseValueToType parseErr", parseErr);
					setTextFieldValue("");
				});
			}
						
		}
	}, [value, type, placeholderType]);*/

	const handleOnChange = async (event, newValue) => {		
		let newAutocompleteOptions = newValue ? [newValue, ...autocompleteOptions] : autocompleteOptions;
		setAutocompleteOptions(newAutocompleteOptions);
		setAutocompleteValue(newValue);
		console.log("handleOnChange newValue\n", newValue);
		if (!inputTouched) {
			setInputTouched(true);
		}
		if (newValue) {
			parseValueToType(newValue.description, "address", type, {}, true).then(parsedTypeValue => {
				setInputValue(parsedTypeValue);
				setInputError(false);
				console.log("handleOnChange newValue\n", newValue, "\n parsedTypeValue \n", parsedTypeValue, "autocompleteValue", autocompleteValue);
			}).catch(parseErr => {
				console.log("parseValueToType parseErr", parseErr);
				setInputError(parseErr);
			});
		}
		else {
			if (isMulti) {
				setInputValue([]);
			}
			else {
				setInputValue(undefined);
			}
			setInputError(false);
		}
			
	};

	const handleOnClickMyLocationBtn = event => {
		const {device} = props;
		console.log("device.location", device.location);
		if (device.location) {
			parseValueToType({lat: device.location.lat, lng: device.location.lng}, "location", (placeholderType? placeholderType : (targetTypes[type] === "address"? type : "formatted_address")), {}, true).then(parsedTypeValue => {
				setTextFieldValue(parsedTypeValue);
				setInputError(false);
				
				if (targetTypes[type] && targetTypes[type] !== "address") {
					parseValueToType({lat: device.location.lat, lng: device.location.lng}, "location", type).then(parsedTypeValue => {
						setInputValue(parsedTypeValue);
						if (!inputTouched) {
							setInputTouched(true);
						}
					});
				}
				else{
					setInputValue(parsedTypeValue);
						if (!inputTouched) {
							setInputTouched(true);
						}					
				}
				console.log("handleOnClickMyLocationBtn parsedTypeValue \n", parsedTypeValue, "\n placeholderType", placeholderType, "autocompleteValue", autocompleteValue);
				
			}).catch(parseErr => {
				console.log("parseValueToType parseErr", parseErr);
				setInputError(parseErr);
			});
			if (Function.isFunction(onClickMyLocationBtn)) {
				onClickMyLocationBtn(device.location);
			}
		}
			
	};

	return (

		<Autocomplete
			className={"flex-1"+(className? (" "+className) : "")}
			getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
			filterOptions={(x) => x}
			options={autocompleteOptions}
			autoComplete
			includeInputInList
			filterSelectedOptions
			value={autocompleteValue}
			onChange={handleOnChange}
			onInputChange={(event, newTextFieldValue) => {
				setTextFieldValue(newTextFieldValue);
			}}
			inputValue={textFieldValue}
			renderInput={(params) => {
				/*console.log("autocompleteOptions", autocompleteOptions);
		console.log("autocompleteValue", autocompleteValue);*/
				return (
					<TextInput 
							{...params} 
							InputLabelProps={{
								...params.InputLabelProps,
								shrink: (isMulti && (Array.isArray(autocompleteValue) && autocompleteValue.length > 0)) || (JSON.isJSON(params.InputLabelProps)? params.InputLabelProps.shrink : open),
							}}
							inputProps={{
								...params.inputProps,
								autoComplete: String.uid(11),

							}}
							InputProps={{
								...params.InputProps,
								autoComplete: String.uid(11),
				            	endAdornment: inputLoading ? (
				            		<InputAdornment position="end">
				            			<CircularProgress size={"1rem"}  color="inherit" />
				            		</InputAdornment>
								) : (showMyLocationBtn? (
										<IconButton
											aria-label="my-location"
											className={"text-base"}
											onClick={handleOnClickMyLocationBtn}
										>
											<MyLocationIcon fontSize="inherit"/>
										</IconButton>
							) : params.InputProps.endAdornment),
				        	}}					
							label={label} 
							variant={variant} 
							margin={margin}
							size={size}
							required={required}
							disabled={inputDisabled}
							error={inputError ? true : isInvalid}
							helperText={ inputError ? inputError : (isInvalid ? "Invalid" : helperText) }
							fullWidth 
						/>
					
				);
			}}
			forcePopupIcon={true}
			popupIcon={inputLoading ? <CircularProgress size={"1.2rem"}  color="inherit" /> : (showMyLocationBtn? <MyLocationIcon className="cursor-pointer" onClick={handleOnClickMyLocationBtn} fontSize="inherit"/> : <ArrowDropDownIcon  fontSize="inherit" />)}
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
				if (option.structured_formatting) {
					const matches = option.structured_formatting.main_text_matched_substrings;
					const parts = parse( option.structured_formatting.main_text, matches.map((match) => [match.offset, match.offset + match.length]), );
					//console.log("parts", parts);
					if (Array.isArray(option.types) && option.types.includes(type)) {
						return (
							<Grid container alignItems="center">
								<Grid item>
									<LocationOnIcon className={"mr-2 text-current"} />
								</Grid>
								<Grid item xs>
									{parts.map((part, index) => (
										<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
											{part.text}
										</span>
									))}

									<span className="mx-1">
										{option.structured_formatting.secondary_text}
									</span>
								</Grid>
							</Grid>
						);
					}
					
				}
				else if(option && Array.isArray(option.address_components)){
									let address_components = option.address_components;
									let address_component = false;
									let name_type = short_name? "short_name" : "long_name";
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

LocationInput.defaultProps = {	
	margin: "dense",
	size: "small",
	variant: "outlined",
	label: "Search for a location",
	type: "coordinates",
	placeholderType: "formatted_address",
	short_name: false,
	showMyLocationBtn: true,
}

const mapStateToProps = state => ({
	//app: state.app,
	device: state.device,
});

export default compose(
	connect(mapStateToProps, {}),
)(React.memo(LocationInput));