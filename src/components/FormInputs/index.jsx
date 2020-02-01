import React, { useState, useEffect } from "react"
import {
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	IconButton,
	InputAdornment,
	Radio,
	RadioGroup,
	Slider,
	TextField,
	Typography
} from "@material-ui/core";
//
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import AutoComplete from "components/AutoComplete";
import DynamicField from "components/DynamicInput";
import FileDropZone from "components/FileDropZone";
import GridContainer from "components/Grid/GridContainer";
import TransferList from "components/TransferList";
import GoogleMap from "components/GoogleMap";
import {
	VisibilityOffOutlined as HidePasswordIcon,
	VisibilityOutlined as ShowPasswordIcon
} from "@material-ui/icons";

import WysiwygEditor from 'components/WysiwygEditor';

import withRoot from "utils/withRoot";

export const TextInput = (props) => {
	let [state, setState] = useState(props);
	useEffect(() => {  setState(props); }, [props]);
	let { label, touched, invalid, error, onChange, variant, validate, value, defaultValue, helperText, ...rest } = state;
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);

	const inputValueValid = async (input_value) => {
		const { type, required, max, maxlength, min, minlength } = rest;
		let valid = true;
		let validationError = "";
		if (validate) {
			if (valid && required) {
				if (input_value) {
					if (input_value.toString().length === 0) {
						valid = false;
						validationError = label+" required";
					}
				}
				else{
					valid = false;
					validationError = label+" required";
				}
			}
			if (valid && type === "email") {
				let validEmail = /^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$/.test(input_value);
				if (!validEmail) {
					valid = false;
					validationError = "Invalid email";
				}
			}
			if (valid && type === "number") {
				let validNumber = Number.parseNumber(input_value, false);
				if (!validNumber) {
					valid = false;
					validationError = "Invalid";
				}
			}
		}

		setInputError(valid? undefined : validationError);
		setIsInvalid(!valid);

		return valid;
	}
	return (
			<TextField				
				label={label}
				onChange={event => {
					let value = event.target.value;
					inputValueValid(value);
				}}
				onBlur={async event => {
					const { type } = rest;
					let value = event.target.value;
					if (type == "number") {
						value = Number.parseNumber(value, undefined);
					}
					setInputValue(value);
					let callOnChange = inputValueValid(value);


					if(callOnChange && Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, event);
						}
					}
				}}
				variant={variant? variant : "outlined"}
				defaultValue={inputValue}
				error={inputError? true : isInvalid}
				helperText={inputError? inputError : (isInvalid ? "Invalid" : helperText)}
				{...rest}
			/>
	);
};


export const PasswordInput = ({ label, touched, invalid, error, onChange, variant, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	const [showPassword, setShowPassword] = React.useState(false);
		return (
			<TextField				
				label={label}
				onChange={e => {
					/* Do nothing */
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton aria-label="Toggle password visibility" onClick={e => setShowPassword(true)} >
								{showPassword ? ( <HidePasswordIcon /> ) : ( <ShowPasswordIcon /> )}
							</IconButton>
						</InputAdornment>
					)
				}}
				onBlur={async event => {
					let value = event.target.value;
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, event);
						}
					}
				}}
				type="password"
				defaultValue = {inputValue}
				variant={variant? variant : "outlined"}
				{...rest}
			/>
		);
};

export const DateInput = ({ touched, invalid, error, onChange, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FormControl component="fieldset">
			<DatePicker
				onChange = {async input_value => {
					let value = input_value._d;
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, input_value);
						}
					}
				}}
				value = {inputValue}
				{...rest} 
			/>
		</FormControl>
	);
};

export const DateTimeInput = ({ touched, invalid, error, onChange, value, defaultValue, ...rest}) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FormControl component="fieldset">
			<DateTimePicker
				onChange = {async input_value => {
					let value = input_value._i;
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
				}}
				{...rest} 
			/>
		</FormControl>
	);
};

export const RadioInput = ({ name, options, touched, invalid, error, onChange, value, defaultValue, ...rest }) => {
	let { label, ...props } = rest;
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FormControl component="fieldset" {...props}>
			<FormLabel component="legend">{label}</FormLabel>
			{JSON.isJSON(options) && <RadioGroup 
				aria-label={name} 
				name={name} 
				onChange = {async event => {
					let value = event.target.value;
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
				}}
				value={inputValue}
				{...props}
			>
				{Object.entries(options).map(([option_name, option_label], cursor) => (
					<FormControlLabel value={option_name} control={<Radio color="primary" />} label={option_label} key={name + "-option-" + cursor} />
				))}
			</RadioGroup>}
		</FormControl>
	);
};

export const TimeInput = ({ label, touched, invalid, error, onChange, value, defaultValue, ...rest}) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<TextField
			label={label}
			error={touched && invalid}
			helperText={touched && error}
			onChange = {async event => {
					let value = event.target.value;
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
			}}
			margin="dense"
			value = {inputValue}
			{...rest}
		/>
	);
};

export const WysiwygInput = ({ label, touched, invalid, error, variant, onChange, value, defaultValue, ...rest}) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return <WysiwygEditor 
				label={label}
				onChange = {async value => {
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
				}}
				value = {inputValue}
				variant={variant? variant : "outlined"}
				{...rest}
			/>;
}

export const CheckboxInput = ({ label, touched, invalid, error, onChange, value, defaultValue, ...rest}) => {
		const [inputValue, setInputValue] = useState(value? value : defaultValue);
		return <FormControlLabel
				control={
					<Checkbox
						checked={inputValue? true : false }
						color="primary"
						onChange = {async event => {
							let value = event.target.checked;
							setInputValue(value);

							if(Function.isFunction(onChange)){
								if (onChange.length === 0) {
									onChange();
								}
								else if (onChange.length === 1) {
									onChange(value)
								}
								else{
									onChange(value, null);
								}
							}
						}}
						{...rest}
					/>
				}
				label={label}
		/>
};


export const SliderInput = ({ name, label, touched, invalid, error, onChange, value, defaultValue, ...rest}) => {
	const [inputValue, setInputValue] = useState(value ? Number.parseNumber(value, null) : Number.parseNumber(defaultValue, null));
	return (
		<GridContainer className="m-0 p-0">
			<Typography id={name + "-slider"} gutterBottom>
				{label}
			</Typography>
			<br />
			<Slider
				name={name}
				defaultValue={inputValue}
				aria-labelledby={name + "-slider"}
				valueLabelDisplay="on"
				onChange={e => {
					/* Do nothing */
				}}
				onChangeCommitted={async (event, value)=>{
					setInputValue(value);

					if(Function.isFunction(onChange)){
								if (onChange.length === 0) {
									onChange();
								}
								else if (onChange.length === 1) {
									onChange(value)
								}
								else{
									onChange(value, event);
								}
					}
				}}
				{...rest}
			/>
		</GridContainer>
	);
};

export const TranferListInput = ({ label, onChange, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FormControl fullWidth>
			<Typography gutterBottom>{label}</Typography>
			<TransferList
				onChange = {async value => {
						setInputValue(value);

						if(Function.isFunction(onChange)){
							if (onChange.length === 0) {
								onChange();
							}
							else if (onChange.length === 1) {
								onChange(value)
							}
							else{
								onChange(value, null);
							}
						}
				}}
				value={inputValue}
				{...rest} 
			/>
		</FormControl>
	);
};

export const InputFormHelper = ({ touched, error }) => {
	if (!(touched && error)) {
		return;
	} else {
		return <FormHelperText>{touched && error}</FormHelperText>;
	}
};


export const MultiSelectInput = ({ touched, invalid, error, onChange, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FormControl fullWidth>
			<AutoComplete 
				isMulti
				onChange = {async value => {
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
				}}
				value={inputValue}
				{...rest} 
			/>
		</FormControl>
	);
};

export const SelectInput = ({ touched, invalid, error, onChange, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FormControl fullWidth>
			<AutoComplete 
				onChange = {async value => {
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
				}}
				value={inputValue}
				{...rest} 
			/>
		</FormControl>
	);
};

export const FileInput = ({ label, touched, invalid, error, onChange, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FileDropZone
			label={label}
			error={touched && invalid}
			helperText={touched && error ? "Invalid" : null}
			onChange = {async value => {
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
			}}
			value={inputValue}
			{...rest}
		/>
	);
};

export const MapInput = ({ touched, invalid, error, label, type, onChange, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<FormControl fullWidth>
			<FormLabel component="legend">{label}</FormLabel>
			<br />
			<GoogleMap 
				isInput 
				showSearchBar 
				type={type? type : "coordinates"} 
				onChange = {async value => {
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
				}}
				value={inputValue} 
				{...rest} 
			/>
			{!value && <FormHelperText>Search and select to add new location</FormHelperText>}
		</FormControl>
	);
};

export const DynamicInput = ({ touched, invalid, error, onChange, value, defaultValue, ...rest }) => {
	const [inputValue, setInputValue] = useState(value? value : defaultValue);
	return (
		<DynamicField
			onChange = {async value => {
					setInputValue(value);

					if(Function.isFunction(onChange)){
						if (onChange.length === 0) {
							onChange();
						}
						else if (onChange.length === 1) {
							onChange(value)
						}
						else{
							onChange(value, null);
						}
					}
			}}
			value={inputValue} 
			{...rest} 
		/>
	);
};