import React, { useCallback } from "react";
import AutoComplete from 'components/AutoComplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@mui/material/IconButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { connect } from "react-redux";
import { useSetState, useDidUpdate, usePlacesAutocomplete } from "hooks";
import { TextInput } from "components/FormInputs";
import { compose } from "recompose";




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
	const { className, device, placeholder, placeholderType, label, defaultValue, type, variant, isMulti, touched, required, disabled, error, invalid, margin, size, query, onOpen, onClose, onChange, isClearable, onClickMyLocationBtn, result_type, short_name, showMyLocationBtn, controlPosition, ...rest } = props;
	const [state, setState] = useSetState({
		value: defaultValue
	});
	const {
		ready,
		value,
		keyword,
		suggestions,
		setKeyword,
		clearSuggestions,
		selectSuggestion,
		loading,
		setValue,
	} = usePlacesAutocomplete({
		requestOptions: {
			/* Define search scope here */
		},
		type: type,
		label: placeholderType,
		debounce: 300,
		defaultValue: defaultValue,
	});

	const handleInput = (e) => {
		// Update the keyword of the input element
		// let newValue = e?.target?.value ? e.target.value : "";
		//
		if (e) {
			setKeyword(e.target.value);
		}

	};

	const handleOnSelect = useCallback((option, event) => {

		selectSuggestion(option);
	}, []);



	return (
		<AutoComplete
			className={"flex-1" + (className ? (" " + className) : "")}
			options={suggestions.data}
			onInputChange={handleInput}
			forcePopupIcon={true}
			onChange={handleOnSelect}
			autoComplete
			loading={suggestions.loading || loading}
			onOpen={() => {
				if (Function.isFunction(onOpen)) {
					onOpen();
				}
			}}
			onClose={() => {
				if (Function.isFunction(onClose)) {
					onClose();
				}
			}}
			getOptionLabel={({ label, description }) => {
				return label || description
			}}
			renderInput={(params) => {
				/*
		*/
				return (
					<TextInput
						{...params}
						InputLabelProps={{
							...params.InputLabelProps,
							shrink: (isMulti && (Array.isArray(value) && value.length > 0)) || (JSON.isJSON(params.InputLabelProps) ? params.InputLabelProps.shrink : false),
						}}
						inputProps={{
							...params.inputProps,
							autoComplete: String.uid(11),

						}}
						InputProps={{
							...params.InputProps,
							autoComplete: String.uid(11),
							endAdornment: suggestions.loading || loading ? (
								<InputAdornment position="end">
									<CircularProgress size={"1rem"} color="inherit" />
								</InputAdornment>
							) : (showMyLocationBtn ? (
								<IconButton
									aria-label="my-location"
									className={"text-base"}
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
						fullWidth
					/>

				);
			}}
			renderOption={(option) => {
				let main_text = option.structured_formatting?.main_text || option.label || option.description || "";
				let secondary_text = option.structured_formatting?.secondary_text || "";;



				return (
					<Grid container alignItems="center">
						<Grid item>
							<LocationOnIcon className={"mr-2 text-current"} />
						</Grid>
						<Grid item xs>
							<span className="mx-1">
								<strong>{main_text}</strong> <small>{secondary_text}</small>
							</span>
						</Grid>
					</Grid>
				);
			}}
			multiple={isMulti}
			disableClearable
			fullWidth
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
