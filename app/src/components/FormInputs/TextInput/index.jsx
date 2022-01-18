/** @format */

import React, { useState, useEffect, useRef } from "react";
import {
	CircularProgress,
	IconButton,
	InputAdornment,
	// TextField,
	InputBase,
} from "@mui/material";
import TextField from '@mui/material/TextField';
//
import {
	VisibilityOffOutlined as HidePasswordIcon,
	VisibilityOutlined as ShowPasswordIcon,
} from "@mui/icons-material";




const Input = React.forwardRef((props, ref) => {
	const {
		label,
		touched,
		invalid,
		error,
		onChange,
		onFocus,
		onBlur,
		variant,
		validate,
		validator,
		excludeValidation,
		onValidityChange,
		value,
		defaultValue,
		helperText,
		disabled,
		type,
		loading,
		className,
		inputProps,
		InputProps,
		InputLabelProps,
		onChangeYield,
		...rest
	} = props;



	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	const [inputDisabled, setInputDisabled] = useState(disabled);
	const [inputLoading, setInputLoading] = useState(loading);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);
	const [inputFocused, setInputFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [inputType, setInputType] = useState((String.isString(type) ? type.toLowerCase() : "text"));


	const inputValueValid = async input_value => {
		const { required, max, maxlength, min, minlength } = rest;
		if ((inputError && !error) || isInvalid) {
			setInputError(undefined);
			setIsInvalid(false);
		}
		let excludedValidators = Array.isArray(excludeValidation) ? excludeValidation : (String.isString(excludeValidation) ? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
		let valid = true;
		let validationError = "";
		if (validate) {
			if (valid && required && !excludedValidators.includes("required")) {
				if (input_value && input_value !== "") {
					if (input_value.toString().length === 0) {
						valid = false;
						validationError = label + " is required";
					}
				} else {
					valid = false;
					validationError = label + " required";
				}
			}
			if (valid && type === "email" && !excludedValidators.includes("email")) {
				let validEmail = /^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$/.test(
					input_value
				);
				if (!validEmail) {
					valid = false;
					validationError = "Invalid email";
				}
			}
			if (valid && type === "number" && !excludedValidators.includes("number")) {
				let validNumber = Number.parseNumber(input_value, false);
				if (!validNumber) {
					valid = false;
					validationError = "Invalid Number";
				}
				else if (max && !excludedValidators.includes("max")) {
					if (validNumber > max) {
						valid = false;
						validationError = label + " value cannot exceed " + max;
					}
				}
				else if (min && !excludedValidators.includes("min")) {
					if (validNumber < min) {
						valid = false;
						validationError = label + " value should be atleast " + max;
					}
				}
			}

			if (valid && type === "password" && !excludedValidators.includes("password")) {
				var mediumStrengthPasswordRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
				if (!mediumStrengthPasswordRegex.test(input_value)) {
					valid = false;
					validationError = input_value + " is not strong enough to use as a password";
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



	useEffect(() => {
		if (!inputTouched) {
			setInputTouched(true);
		}
	}, [inputValue, inputTouched]);

	useEffect(() => {
		if (!inputTouched) {
			setInputTouched(true);
		}
		setInputValue(value);
	}, [value]);

	const throttledEventHandler = useRef(Function.createThrottle(5)).current;
	const debouncedOnChange = useRef(Function.debounce((event) => {
		if (!inputTouched) {
			setInputTouched(true);
			let valueValid = inputValueValid(inputValue);
		}

		if (event?.target) {

			let new_value = event.target.value;

			if (type == "number") {
				new_value = Number.parseNumber(new_value, undefined);
			}
			inputValueValid(new_value);
			if (Function.isFunction(onChange)) {
				let changed = onChange(onChangeYield === "value" ? new_value : event);
				//Promise.all([changed]).catch(e => console.error("Caught onChange error", e));					
			}
			setInputValue(new_value);
		}


	}, 250)).current;



	const handleOnChange = async (event) => {
		event.persist();
		debouncedOnChange(event);
	};

	const handleOnFocus = async (event) => {
		event.persist();
		if (Function.isFunction(onFocus)) {
			let focused = onFocus(event);
			Promise.all([focused]).catch(e => {
				console.error(e)
			});
		}
	}

	const handleOnBlur = async (event) => {
		event.persist();
		let new_value = event.target.value;
		if (type == "number") {
			new_value = Number.parseNumber(new_value, undefined);
		}


		if (Function.isFunction(onBlur)) {
			let blurred = onBlur(event);
			Promise.all([blurred]).catch(e => {
				console.error(e);
			});
		}
	}

	useEffect(() => {
		/*let startTime = new Date();
		let throttledCalls = 0;
		let debouncedCallsTotal = 0;
		let throttledCallsTotal = 0;
		const throttleExample = Function.throttle(() => {
			throttledCalls = throttledCalls + 1;
			
			

		}, 5000);
		let debouncedCalls = 0;
		const debounceExample = Function.debounce(() => {
			debouncedCalls = debouncedCalls + 1;
			
				
		}, 5000);
		
		let throttledCallInterval = setInterval(()=> {			
			throttledCallsTotal = throttledCallsTotal + 1;			
			throttleExample();
		}, 1000);
		
		let debouncedCallInterval = setInterval(()=> {			
			debouncedCallsTotal = debouncedCallsTotal + 1;
			debounceExample();
					
		}, 1000);
		

		return () => {
			clearInterval(debouncedCallInterval);
			clearInterval(throttledCallInterval);
		}*/

	}, []);



	if (variant === "base" || variant === "plain") {
		return (
			<InputBase
				className={"flex-1" + (className ? (" " + className) : "")}
				label={label}
				onChange={handleOnChange}
				onFocus={handleOnFocus}
				onBlur={handleOnBlur}
				defaultValue={inputValue}
				disabled={inputDisabled}
				error={inputError ? true : isInvalid}
				type={inputType}
				ref={ref}
				{...InputProps}
				{...inputProps}
				{...rest}
			/>
		);
	}
	else {
		return (
			<TextField
				className={"flex-1 " + (className ? (" " + className) : "")}
				label={label}
				onChange={handleOnChange}
				onFocus={handleOnFocus}
				onBlur={handleOnBlur}
				inputProps={inputProps}
				InputProps={{
					...InputProps,
					endAdornment: (type === "password" || loading || (InputProps && InputProps.endAdornment)) && (
						!(InputProps && InputProps.endAdornment) ? (<InputAdornment position="end">
							{loading && <CircularProgress size={"1rem"} color="inherit" />}
							{type === "password" && <IconButton
								aria-label="Toggle password visibility"
								color="inherit"
								onClick={e => {
									setShowPassword(inputType === "password");
									setInputType(inputType === "password" ? "text" : "password");

								}}
							>
								{showPassword ? (
									<HidePasswordIcon fontSize="small" />
								) : (
									<ShowPasswordIcon fontSize="small" />
								)}
							</IconButton>}
						</InputAdornment>
						) : (
							<div className="flex flex-row">
								<InputAdornment position="end">
									{loading && <CircularProgress size={"1rem"} color="inherit" />}
									{type === "password" && <IconButton
										aria-label="Toggle password visibility"
										color="inherit"
										onClick={e => {
											setShowPassword(inputType === "password");
											setInputType(inputType === "password" ? "text" : "password");
										}}
									>
										{showPassword ? (
											<HidePasswordIcon fontSize="small" />
										) : (
											<ShowPasswordIcon fontSize="small" />
										)}
									</IconButton>}
								</InputAdornment>
								{InputProps && InputProps.endAdornment}
							</div>
						)
					),
				}}
				InputLabelProps={InputLabelProps}
				variant={variant || "filled"}
				defaultValue={inputValue}
				disabled={inputDisabled}
				error={inputError ? true : isInvalid}
				helperText={inputError ? inputError : (isInvalid ? "Invalid" : helperText)}
				type={inputType}
				ref={ref}
				fullWidth
				{...rest}
			/>
		);
	}


});

Input.defaultProps = {
	margin: "dense",
	size: "small",
	type: "text",
	variant: "filled",
	validate: true,
	onChangeYield: "value"
}

export default React.memo(Input);