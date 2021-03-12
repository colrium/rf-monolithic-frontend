/** @format */

import React, { useState, useEffect } from "react";
import {
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
	InputBase,
} from "@material-ui/core";
import debounce from 'lodash/debounce';
//
import {
	VisibilityOffOutlined as HidePasswordIcon,
	VisibilityOutlined as ShowPasswordIcon,
} from "@material-ui/icons";



const Input = React.forwardRef((props, ref) => {
	let debouncedOnChange;
	/*let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);*/
	let {
		label,
		touched,
		invalid,
		error,
		onChange,
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
	const [inputType, setInputType] = useState((String.isString(type)? type.toLowerCase() : "text"));
	

	const inputValueValid = async input_value => {
		const { required, max, maxlength, min, minlength } = rest;
		if ((inputError && !error) || isInvalid) {
			setInputError(undefined);
			setIsInvalid(false);
		}
		let excludedValidators = Array.isArray(excludeValidation)? excludeValidation : (String.isString(excludeValidation)? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
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
				else if(max && !excludedValidators.includes("max")) {
					if (validNumber > max) {
						valid = false;
						validationError = label + " value cannot exceed "+max;
					}					
				}
				else if(min && !excludedValidators.includes("min")) {
					if (validNumber < min) {
						valid = false;
						validationError = label + " value should be atleast "+max;
					}					
				}
			}

			if (valid && type === "password" && !excludedValidators.includes("password")) {
				var mediumStrengthPasswordRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
				if (!mediumStrengthPasswordRegex.test(input_value)) {
					valid = false;
					validationError = input_value+" is not strong enough to use as a password";
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
		//setInputDisabled(true);
		if ( Function.isFunction(onChange)) {
			let changed = onChange(new_value);
			Promise.all([changed]).then(()=>{
				//setInputDisabled(false);
			}).catch(e => {
				console.error(label+" onChange error", e);
				
			});
			
		}
		else{
			//setInputDisabled(false);
		}
		
	}


	/*useEffect(() => {
		if (inputTouched) {
			let valueValid = inputValueValid(inputValue);
			Promise.all([valueValid]).then(validity => {
				if (validity[0]) {
					triggerOnChange(inputValue);
				}
			}).catch(e => {
				console.error(label+" validity check error", e);
			});
							
		}
	}, [inputTouched]);*/



	/*useEffect(() => {
		if (inputTouched) {
			let valueValid = inputValueValid(inputValue);
			Promise.all([valueValid]).then(validity => {
				if (validity[0]) {
					triggerOnChange(inputValue);
				}
			}).catch(e => {
				console.error(label+" validity check error", e);
			});
							
		}
	}, [inputValue, inputTouched]);*/

	useEffect(() => {
		if (!inputFocused) {
			setInputValue(value ? value : (defaultValue? defaultValue : undefined));
		}
	}, [value, defaultValue, inputFocused]);

	if (variant === "base" || variant === "plain") {
		return (
			<InputBase
				className={"flex-1"+(className? (" "+className) : "")}
				label={label}
				onChange={(event) => {
					event.persist();
					if (!debouncedOnChange) {
						debouncedOnChange =  debounce(() => {
							let new_value = event.target.value;				
							if (type == "number") {
								new_value = Number.parseNumber(new_value, undefined);
							}	
							
							let valueValid = inputValueValid(new_value);
							Promise.all([valueValid]).then(validity => {
								if (validity[0]) {
									triggerOnChange(new_value);
								}
							}).catch(e => {
								console.error(label+" validity check error", e);
							});
							
							if (!inputTouched) {
								setInputTouched(true);
							}
							
						}, 300);
					}
		
					debouncedOnChange();	
					
				}}
				onFocus={event => {
					setInputFocused(true);
				}}
				onBlur={event => {
					/*if (!inputTouched) {
						setInputTouched(true);
					}*/
					event.persist();
					let new_value = event.target.value;	
					console.log("onBlur event new_value", new_value);
					setInputFocused(false);
					let valueValid = inputValueValid(new_value);
					Promise.all([valueValid]).then(validity => {
						if (validity[0]) {
							if (Function.isFunction(onBlur)) {
								if (onBlur.length === 0) {
									onBlur();
								} else if (onBlur.length === 1) {
									onBlur(event);
								} else {
									onBlur(new_value, event);
								}
							}
						}
					}).catch(e => {
						console.error(label+" validity check error", e);
					});
					
				}}
				
				defaultValue={inputValue}
				disabled={inputDisabled}
				error={inputError ? true : isInvalid}
				type={inputType}
				ref={ref}

				{...inputProps}
				{...rest}
			/>
		);
	}
	else{
		return (
			<TextField
				className={"flex-1"+(className? (" "+className) : "")}
				label={label}
				onChange={(event) => {
					event.persist();
					if (!debouncedOnChange) {
						debouncedOnChange =  debounce(() => {
							let new_value = event.target.value;				
							if (type == "number") {
								new_value = Number.parseNumber(new_value, undefined);
							}	
							
							let valueValid = inputValueValid(new_value);
							Promise.all([valueValid]).then(validity => {
								if (validity[0]) {
									triggerOnChange(new_value);
								}
							}).catch(e => {
								console.error(label+" validity check error", e);
							});
							
							if (!inputTouched) {
								setInputTouched(true);
							}
							
						}, 300);
					}
		
					debouncedOnChange();	
					
				}}
				onFocus={event => {
					setInputFocused(true);
				}}
				onBlur={event => {
					/*if (!inputTouched) {
						setInputTouched(true);
					}*/
					event.persist();
					let new_value = event.target.value;	
					setInputFocused(false);
					let valueValid = inputValueValid(new_value);
					Promise.all([valueValid]).then(validity => {
						if (validity[0]) {
							if (Function.isFunction(onBlur)) {
								if (onBlur.length === 0) {
									onBlur();
								} else if (onBlur.length === 1) {
									onBlur(event);
								} else {
									onBlur(new_value, event);
								}
							}
						}
					}).catch(e => {
						console.error(label+" validity check error", e);
					});
					
				}}
				InputProps={{
					...inputProps,
					...InputProps,
					endAdornment: (type === "password" || loading) && (
						<InputAdornment position="end">
							{loading && <CircularProgress size={"1rem"} color="inherit" />}
							{type === "password" && <IconButton
								aria-label="Toggle password visibility"
								color="inherit"
								onClick={e => {
									setShowPassword(inputType === "password");
									setInputType(inputType === "password"? "text" : "password");
									
								}}
							>
								{showPassword ? (
									<HidePasswordIcon fontSize="small" />
								) : (
									<ShowPasswordIcon fontSize="small" />
								)}
							</IconButton>}
						</InputAdornment>
					),
				}}
				InputLabelProps={InputLabelProps}
				variant={variant ? variant : "outlined"}
				defaultValue={inputValue}
				disabled={inputDisabled}
				error={inputError ? true : isInvalid}
				helperText={ inputError ? inputError : (isInvalid ? "Invalid" : helperText) }
				type={inputType}
				ref={ref}
				{...rest}
			/>
		);
	}

		
});

Input.defaultProps = {
	margin: "dense",
	size: "small",
	type: "text",
	variant: "outlined",
	validate: true,
}

export default React.memo(Input);