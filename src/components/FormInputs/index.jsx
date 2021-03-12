/** @format */

import React, { useState, useEffect } from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Slider,
    TextField,
    Typography,
    Switch,
} from "@material-ui/core";
//
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import AutoComplete from "components/AutoComplete";
import DynamicField from "components/DynamicInput";
import FileDropZone from "components/FileDropZone";
import GridContainer from "components/Grid/GridContainer";
import TransferList from "components/TransferList";
import GoogleMap from "components/GoogleMap";

import WysiwygEditor from "components/WysiwygEditor";


export { default as TextInput } from "./TextInput";
export { default as RadioInput } from "./RadioInput";
export { default as LocationInput } from "./LocationInput";



export const DateInput = ({
	touched,
	invalid,
	error,
	onChange,
	value,
	className,
	defaultValue,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<FormControl 
			className={"flex-1"+(className? (" "+className) : "")}
			component="fieldset"
		>
			<DatePicker
				onChange={async input_value => {
					let value = input_value._d;
					setInputValue(value);

					if (Function.isFunction(onChange)) {
						if (onChange.length === 0) {
							onChange();
						} else if (onChange.length === 1) {
							onChange(value);
						} else {
							onChange(value, input_value);
						}
					}
				}}
				value={inputValue}
				{...rest}
			/>
		</FormControl>
	);
};

export const DateTimeInput = ({
	touched,
	invalid,
	error,
	onChange,
	validate,
	validator,
	onValidityChange,
	value,
	defaultValue,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<FormControl component="fieldset">
			<DateTimePicker
				onChange={async input_value => {
					let value = input_value._i;
					setInputValue(value);

					if (Function.isFunction(onChange)) {
						if (onChange.length === 0) {
							onChange();
						} else if (onChange.length === 1) {
							onChange(value);
						} else {
							onChange(value, null);
						}
					}
				}}
				{...rest}
			/>
		</FormControl>
	);
};

/**/

export const TimeInput = ({
	label,
	touched,
	invalid,
	error,
	onChange,
	validate,
	validator,
	onValidityChange,
	value,
	defaultValue,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<TextField
			label={label}
			error={touched && invalid}
			helperText={touched && error}
			onChange={async event => {
				let value = event.target.value;
				setInputValue(value);

				if (Function.isFunction(onChange)) {
					if (onChange.length === 0) {
						onChange();
					} else if (onChange.length === 1) {
						onChange(value);
					} else {
						onChange(value, null);
					}
				}
			}}
			margin="dense"
			value={inputValue}
			{...rest}
		/>
	);
};

export const WysiwygInput = ({
	label,
	touched,
	invalid,
	error,
	variant,
	onChange,
	validate,
	validator,
	onValidityChange,
	value,
	defaultValue,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<WysiwygEditor
			label={label}
			onChange={async value => {
				setInputValue(value);

				if (Function.isFunction(onChange)) {
					if (onChange.length === 0) {
						onChange();
					} else if (onChange.length === 1) {
						onChange(value);
					} else {
						onChange(value, null);
					}
				}
			}}
			value={inputValue}
			variant={variant ? variant : "outlined"}
			{...rest}
		/>
	);
};

export const CheckboxInput = (props) => {

	let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);
	const {
		label,
		touched,
		invalid,
		required,
		error,
		onChange,
		validate,
		validator,
		onValidityChange,
		helperText,
		value,
		defaultValue,
		...rest
	} = state;
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	useEffect(() => {
		setInputValue(Boolean.isBoolean(value)? value : (Boolean.isBoolean(defaultValue)? defaultValue : false))
	}, [value, defaultValue]);

	return (
		<FormGroup required={required} error={error} component="fieldset">
			<FormControlLabel
				control={
					<Checkbox
						checked={inputValue ? true : false}
						color="primary"
						onChange={async event => {
							let newvalue = event.target.checked;
							setInputValue(newvalue);

							if (Function.isFunction(onChange)) {
								if (onChange.length === 0) {
									onChange();
								} else if (onChange.length === 1) {
									onChange(newvalue);
								} else {
									onChange(newvalue, event);
								}
							}
						}}
						required={required}
						{...rest}
					/>
				}
				label={label}
			/>
			{helperText && <FormHelperText>{helperText}</FormHelperText>}
		</FormGroup>
	);
};

export const SliderInput = ({
	name,
	label,
	touched,
	invalid,
	error,
	onChange,
	validate,
	validator,
	onValidityChange,
	value,
	defaultValue,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(
		value
			? Number.parseNumber(value, null)
			: Number.parseNumber(defaultValue, null)
	);
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
				onChangeCommitted={async (event, value) => {
					setInputValue(value);

					if (Function.isFunction(onChange)) {
						if (onChange.length === 0) {
							onChange();
						} else if (onChange.length === 1) {
							onChange(value);
						} else {
							onChange(value, event);
						}
					}
				}}
				{...rest}
			/>
		</GridContainer>
	);
};

export const TranferListInput = ({
	label,
	onChange,
	value,
	defaultValue,
	validate,
	validator,
	onValidityChange,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<FormControl fullWidth>
			<Typography gutterBottom>{label}</Typography>
			<TransferList
				onChange={async value => {
					setInputValue(value);

					if (Function.isFunction(onChange)) {
						if (onChange.length === 0) {
							onChange();
						} else if (onChange.length === 1) {
							onChange(value);
						} else {
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

export const MultiSelectInput = (props) => {
	return (
		<FormControl fullWidth>
			<AutoComplete
				isMulti				
				{...props}
			/>
		</FormControl>
	);
};

export const SelectInput = (props) => {
	return (
		<FormControl fullWidth>
			<AutoComplete			
				{...props}
			/>
		</FormControl>
	);
};

export const FileInput = ({
	label,
	touched,
	invalid,
	error,
	onChange,
	validate,
	validator,
	onValidityChange,
	value,
	defaultValue,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<FileDropZone
			label={label}
			error={touched && invalid}
			helperText={touched && error ? "Invalid" : null}
			onChange={async value => {
				setInputValue(value);

				if (Function.isFunction(onChange)) {
					if (onChange.length === 0) {
						onChange();
					} else if (onChange.length === 1) {
						onChange(value);
					} else {
						onChange(value, null);
					}
				}
			}}
			value={inputValue}
			{...rest}
		/>
	);
};

export const MapInput = ({
	touched,
	invalid,
	error,
	label,
	type,
	onChange,
	validate,
	validator,
	onValidityChange,
	value,
	defaultValue,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<FormControl fullWidth>
			<FormLabel component="legend">{label}</FormLabel>
			<br />
			<GoogleMap
				isInput
				showSearchBar
				type={type ? type : "coordinates"}
				onChange={async value => {
					setInputValue(value);

					if (Function.isFunction(onChange)) {
						if (onChange.length === 0) {
							onChange();
						} else if (onChange.length === 1) {
							onChange(value);
						} else {
							onChange(value, null);
						}
					}
				}}
				value={inputValue}
				{...rest}
			/>
			{!value && (
				<FormHelperText>
					Search and select to add new location
				</FormHelperText>
			)}
		</FormControl>
	);
};

export const SwitchInput = ({
	touched,
	invalid,
	error,
	label,
	type,
	onChange,
	validate,
	validator,
	onValidityChange,
	value,
	defaultValue,
	fullWidth,
	disabled,

	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? true : (defaultValue? true : false));
	const [inputDisabled, setInputDisabled] = useState(disabled);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);

	const inputValueValid = async input_value => {
		const { required, excludeValidation } = rest;
		let excludedValidators = Array.isArray(excludeValidation)? excludeValidation : (String.isString(excludeValidation)? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
		let valid = true;
		let validationError = "";
		if (validate) {
			if (valid && required && !excludedValidators.includes("required")) {
				if (!input_value) {
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

	const triggerOnChange = async (new_value) => {
		setInputDisabled(true);
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

	useEffect(() => {
		if (inputTouched) {
			let valueValid = inputValueValid(inputValue);
			Promise.all([valueValid]).then(validity => {
				if (validity) {
					triggerOnChange(inputValue);
				}
			}).catch(e => {
				console.error(label+" validity check error", e);
			});
							
		}
	}, [inputValue, inputTouched]);

	return (
		<FormControl fullWidth={fullWidth}>
			<FormControlLabel
				control={<Switch 
					color={"primary"}
					disabled={inputDisabled} 
					checked={inputValue} 
					onChange={()=>{
						setInputValue(!inputValue);
						if (!inputTouched) {
							setInputTouched(true);
						}
					}} 
					{...rest}
				/>}
				label={label}
				disabled={inputDisabled}
			/>
		</FormControl>
	);
};

export const DynamicInput = ({
	touched,
	invalid,
	error,
	onChange,
	value,
	defaultValue,
	validate,
	validator,
	onValidityChange,
	...rest
}) => {
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	return (
		<DynamicField
			onChange={async value => {
				setInputValue(value);

				if (Function.isFunction(onChange)) {
					if (onChange.length === 0) {
						onChange();
					} else if (onChange.length === 1) {
						onChange(value);
					} else {
						onChange(value, null);
					}
				}
			}}
			value={inputValue}
			{...rest}
		/>
	);
};
