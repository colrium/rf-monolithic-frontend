import React, { useState, useEffect, useRef } from "react";
import AutoComplete from 'components/AutoComplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@mui/material/IconButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { connect } from "react-redux";
import { google_maps_url } from "config";
import { useScript, useWhyDidYouUpdate, useAsync } from "hooks";
import { TextInput } from "components/FormInputs";
import { compose } from "recompose";
import parse from 'autosuggest-highlight/parse';

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
	const [textFieldValue, setTextFieldValue] = useState('wert');
	const [inputValue, setInputValue] = useState(value ? value : undefined);
	const [inputType, setInputType] = useState(type ? (targetTypes[type] ? targetTypes[type] : "formatted_address") : "formatted_address");
	const [autocompleteOptions, setAutocompleteOptions] = useState([]);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);
	const [inputDisabled, setInputDisabled] = useState(disabled);
	const [inputLoading, setInputLoading] = useState(loading);

	const googleScriptLoaded = useScript(google_maps_url);
	useWhyDidYouUpdate("GooglePlacesAutocomplete", props);

	if (typeof window !== 'undefined' && !loaded.current) {
		if (!document.querySelector('[src*="https://maps.googleapis.com/maps/api/js"]')) {
			loadScript(google_maps_url, document.querySelector('head'), 'google-maps-from-googleplacesautocomplete-input');
		}

		loaded.current = true;
	}


	const throttledEventHandler = useRef(Function.createThrottle(1)).current;

	const { execute: predictPlaces, status: PlacesPredictionStatus, value: placePredictions, error: placesPredictionError } = useAsync((keyword, query = {}) => {
		return new Promise((resolve, reject) => {
			Function.sleep(5000);
			resolve({ [keyword]: "Yaaaaaay" })
		});
	}, false);

	const getPlacePredictions = useRef(Function.throttle((keyword, query) => predictPlaces((keyword, query)), 1000)).current;

	const throttledOnChange = useRef(Function.throttle(async (event) => { }, 250)).current;

	const throttledOnTextChange = useRef(Function.throttle((keyword) => { }, 250)).current;

	const throttledOnClickMyLocationBtn = useRef(Function.throttle(async (event) => {
		getPlacePredictions("meru");
	}, 250)).current;



	const handleOnChange = (event) => { }



	const handleOnClickMyLocationBtn = (event) => {
		event.persist();
		throttledOnClickMyLocationBtn(event);
	}

	return (

		<AutoComplete
			className={"flex-1" + (className ? (" " + className) : "")}
			getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
			filterOptions={(x) => {

			}}
			options={{}}
			autoComplete
			value={autocompleteValue}
			onChange={handleOnChange}
			onInputChange={(event, newTextFieldValue) => {
				throttledOnTextChange(newTextFieldValue);
			}}
			inputValue={textFieldValue}
			renderInput={({ inputProps: inputPropsParams, ...params }) => {
				//
				return (
					<TextInput
						{...params}
						InputLabelProps={{
							...params.InputLabelProps,
							shrink: (isMulti && (Array.isArray(autocompleteValue) && autocompleteValue.length > 0)) || (JSON.isJSON(params.InputLabelProps) ? params.InputLabelProps.shrink : open),
						}}
						inputProps={{
							...inputPropsParams,
							autoComplete: String.uid(11),

						}}
						InputProps={{
							...params.InputProps,
							autoComplete: String.uid(11),
							endAdornment: inputLoading ? (
								<InputAdornment position="end">
									<CircularProgress size={"1rem"} color="inherit" />
								</InputAdornment>
							) : (showMyLocationBtn ? (
								<IconButton
									aria-label="my-location"
									className={"text-base"}
									onClick={handleOnClickMyLocationBtn}
								>
									<MyLocationIcon fontSize="inherit" />
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
						helperText={inputError ? inputError : (isInvalid ? "Invalid" : helperText)}
						onChangeYield={"event"}
						fullWidth
					/>

				);
			}}
			forcePopupIcon={true}
			popupIcon={inputLoading ? <CircularProgress size={"1.2rem"} color="inherit" /> : (showMyLocationBtn ? <MyLocationIcon className="cursor-pointer" onClick={handleOnClickMyLocationBtn} fontSize="inherit" /> : <ArrowDropDownIcon fontSize="inherit" />)}
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
	type: "coordinates",
	placeholderType: "formatted_address",
	short_name: false,
	showMyLocationBtn: true,
}

const mapStateToProps = state => ({
	//app: state.app,
	device: state.device,
});

export default compose(connect(mapStateToProps, {}))(React.memo(GooglePlacesAutocomplete));