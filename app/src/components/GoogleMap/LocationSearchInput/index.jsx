import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@mui/material/IconButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { connect } from "react-redux";
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
	}
});

function LocationSearchInput(props) {
	const [open, setOpen] = useState(false);
	const loaded = React.useRef(false);
	const { classes, className, device, placeholder, placeholderType, label, value, type, variant, isMulti, required, touched, disabled, error, invalid, margin, size, max, excludeValidation, min, validate, validator, onValidityChange, helperText, onOpen, onClose, onChange, isClearable, onClickMyLocationBtn, result_type, short_name, ...rest } = props;
	const [autocompleteValue, setAutocompleteValue] = React.useState(value ? value : null);
	const [typeValue, setTypeValue] = React.useState(value ? value : null);
	const [textFieldValue, setTextFieldValue] = React.useState('');
	const [inputValue, setInputValue] = React.useState(value ? value : undefined);
	const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);
	const [inputDisabled, setInputDisabled] = useState(disabled);

	/*if (typeof window !== 'undefined' && !loaded.current) {
		if (!document.querySelector('#google-maps')) {
			loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyB1Kfvlg6orolTJR4QIvC4hgiQJeQqNhlQ&libraries=geometry,drawing,places', document.querySelector('head'), 'google-maps' );
		}

		loaded.current = true;


	}*/

	const inputValueValid = async input_value => {
		let excludedValidators = Array.isArray(excludeValidation) ? excludeValidation : (String.isString(excludeValidation) ? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
		let valid = true;
		let validationError = "";
		if (validate) {
			if (valid && required && !excludedValidators.includes("required")) {
				if (!input_value) {
					valid = false;
					validationError = label + " is required";
				}
				else if ((Array.isArray(input_value) && input_value.length > 0) || (JSON.isJSON(input_value) && Object.keys(input_value).length > 0)) {
					valid = true;
					validationError = label + " is required";

				} else {
					valid = false;
					validationError = label + " required";
				}
			}

			if (valid && Function.isFunction(validator) && !excludedValidators.includes("validator")) {
				try {
					validationError = await validator(input_value);
				} catch (err) {
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

		if (Function.isFunction(onChange)) {
			let changed = onChange(new_value);
			Promise.all([changed]).then(() => {
				setInputDisabled(false);
			}).catch(e => {
				setInputDisabled(false);
			});

		}
		else {
			setInputDisabled(false);
		}

	}

	const parseValueToType = (targetValue, targetType = "address", resultType = false, options) => {

		return new Promise(function (resolve, reject) {
			if (!resultType) {
				reject(Error("Geocode was not successful. Result type is missing"));
			}

			if (!autocompleteGeocoder.current && window.google) {
				autocompleteGeocoder.current = new window.google.maps.Geocoder();
			}
			if (!autocompleteGeocoder.current) {
				reject(Error("Geocode was not successful. Geocoder is Missing"));
			}
			autocompleteGeocoder.current.geocode({ ...options, [targetType]: targetValue }, function (results, status) {
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
								else if (resultType === "place_id") {
									resultValue.push(result.place_id);
								}
								else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_2", "administrative_area_level_1", "country", "postal_code"].includes(resultType)) {
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
						else if (resultType === "viewport") {
							resultValue = results[0].geometry.viewport;
						}
						else if (resultType === "place_id") {
							resultValue = results[0].place_id;
						}
						else if (["street_number", "route", "neighborhood", "political", "locality", "administrative_area_level_2", "administrative_area_level_1", "country", "postal_code"].includes(resultType)) {
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
					reject(Error("Geocode was not successful." + status));
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

		if (!autocompleteService.current && window.google) {
			autocompleteService.current = new window.google.maps.places.AutocompleteService();
		}
		if (!autocompleteService.current) {
			return undefined;
		}
		if (!autocompleteGeocoder.current && window.google) {
			autocompleteGeocoder.current = new window.google.maps.Geocoder();
		}
		if (!autocompleteGeocoder.current) {
			return undefined;
		}

		if (textFieldValue === '') {
			setAutocompleteOptions(autocompleteValue ? [autocompleteValue] : []);
			return undefined;
		}

		fetch({ input: textFieldValue }, (results) => {

			if (active) {
				let newAutocompleteOptions = [];

				if (autocompleteValue) {
					newAutocompleteOptions = [autocompleteValue];
				}

				if (results) {
					newAutocompleteOptions = [...newAutocompleteOptions, ...results];
				}

				setAutocompleteOptions(newAutocompleteOptions);
			}
		});

		return () => {
			active = false;
		};
	}, [autocompleteValue, textFieldValue, fetch]);

	useEffect(() => {
		if (inputTouched) {
			let valueValid = inputValueValid(inputValue);
			Promise.all([valueValid]).then(validity => {
				if (validity[0]) {
					triggerOnChange(inputValue);
				}
			}).catch(e => { });
		}
		else {

		}
	}, [inputValue, inputTouched, type]);

	useEffect(() => {
		let targetTypes = {
			coordinates: "location",
			address: "address",
			place_id: "placeId",
		};
		if (targetTypes[type] && value) {
			if (type !== "address") {
				let targetValue = null; //ToDo:-
				if (type === "coordinates" && JSON.isJSON(value)) {
					if (("lat" in value || "latitude" in value) && ("lng" in value || "longitude" in value)) {
						targetValue = {
							lat: (value.lat ? value.lat : value.latitude),
							lng: (value.lng ? value.lng : value.longitude),
						};
					}
				}
				if (targetValue) {
					parseValueToType(targetValue, targetTypes[type], "address").then(parsedTypeValue => {
						setTextFieldValue(parsedTypeValue ? parsedTypeValue : "");
					}).catch(parseErr => {
						setTextFieldValue("");
					});
				}

			}
			else if (String.isString(value)) {
				setTextFieldValue(value);
			}

		}
	}, [value, type]);

	const handleOnChange = async (event, newValue) => {
		let newAutocompleteOptions = newValue ? [newValue, ...autocompleteOptions] : autocompleteOptions;
		setAutocompleteOptions(newAutocompleteOptions);
		setAutocompleteValue(newValue);
		if (!inputTouched) {
			setInputTouched(true);
		}
		if (newValue) {
			parseValueToType(newValue.description, "address", type).then(parsedTypeValue => {
				setInputValue(parsedTypeValue);
				setInputError(false);
			}).catch(parseErr => {
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
		const { device } = props;
		if (device.location) {
			parseValueToType({ lat: device.location.lat, lng: device.location.lng }, "location", placeholderType).then(parsedTypeValue => {
				setTextFieldValue(parsedTypeValue);
				setInputError(false);
			}).catch(parseErr => {
				setInputError(parseErr);
			});
			if (Function.isFunction(onClickMyLocationBtn)) {
				onClickMyLocationBtn(device.location);
			}
		}
	};

	return (

		<Autocomplete
			className={"flex-1"}
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
			renderInput={(params) => (
				<TextField
					{...params}
					InputProps={{
						...params.InputProps,
						startAdornment: Function.isFunction(onClickMyLocationBtn) ? (
							<InputAdornment position="start">
								<IconButton
									size={size}
									className={classes?.myLocationBtn}
									aria-label="my-location"
									onClick={handleOnClickMyLocationBtn}
								>
									<MyLocationIcon fontSize="inherit" />
								</IconButton>
							</InputAdornment>
						) : undefined,
						endAdornment: Function.isFunction(onClickMyLocationBtn) ? (
							<InputAdornment position="end">
								<IconButton
									size={size}
									className={classes?.searchLocationBtn}
									aria-label="search-location"
								>
									<SearchIcon fontSize="inherit" />
								</IconButton>
							</InputAdornment>
						) : undefined,
					}}
					label={label}
					variant={variant}
					margin={margin}
					size={size}
					required={required}
					disabled={inputDisabled}
					error={inputError ? true : isInvalid}
					helperText={inputError ? inputError : (isInvalid ? "Invalid" : helperText)}
					fullWidth
				/>
			)}
			forcePopupIcon={false}
			popupIcon={open ? <ArrowDropDownIcon fontSize="inherit" /> : <LocationOnIcon fontSize="inherit" />}
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
					const parts = parse(option.structured_formatting.main_text, matches.map((match) => [match.offset, match.offset + match.length]),);
					//
					return (
						<Grid container alignItems="center">
							<Grid item>
								<LocationOnIcon className={classes?.icon} />
							</Grid>
							<Grid item xs>
								{parts.map((part, index) => (
									<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
										{part.text}
									</span>
								))}

								<Typography variant="body2" color="textSecondary">
									{option.structured_formatting.secondary_text}
								</Typography>
							</Grid>
						</Grid>
					);
				}
				return;
			}}
			multiple={isMulti}
			disableClearable
		/>
	);
}

LocationSearchInput.defaultProps = {
	options: [],
	margin: "dense",
	size: "small",
	variant: "outlined",
	label: "Search for a location",
	type: "coordinates",
	value: { lat: 41.850033, lng: -87.6500523 },
	placeholderType: "formatted_address",
	short_name: false,
	onClickMyLocationBtn: () => {

	}
}

const mapStateToProps = state => ({
	//app: state.app,
	device: state.device,
});

export default compose(
	connect(mapStateToProps, {}),

)(React.memo(LocationSearchInput));