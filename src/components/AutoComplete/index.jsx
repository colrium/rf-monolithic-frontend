import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React, { useState, useEffect } from "react";
import debounce from 'lodash/debounce';


const AutocompleteTextField = (props) => {
		let [state, setState] = useState(props);
		useEffect(() => {
			setState(props);
		}, [props]);		
				return (
					<TextField					
						{...state}
					/>
				)
			}


function CustomAutocomplete({ className, disabled, isMulti, loading, onChange, label, required, variant, margin, size, max, excludeValidation, min, validate, validator, onValidityChange, helperText, onOpen, onClose, touched, invalid, isClearable, error, value, options, freeSolo, popupIcon, ...rest }) {

	const uniqueAutocompleteValue = String.uid(20);
	let formattedData = { options: [], value: [] }
	
	let debouncedFreeSoloOnChange;

	function formatData() {
		let dataProps = {};
		let formatedValue = [];
		let formatedOptions = [];
		if (String.isString(value)) {
			if (value.length > 0) {
				value = [value];
			}
		}
		if (Array.isArray(value)) {
			if (isMulti) {
				value.map((entry, cursor) => {
					if (entry) {
						if (JSON.isJSON(entry)) {
							if ("value" in entry && entry.value && "label" in entry && entry.label ) {
								formatedValue.push({ value: entry.value, label: entry.label });
							}
						}
						else{
							if (JSON.isJSON(options) && entry in options) {
								formatedValue.push({ value: entry, label: options[entry] });
							}
						}
					}

				});
			}
		}
		if (JSON.isJSON(options)) {
			formatedOptions = Object.entries(options).map(
				([entry_key, entry_value], cursor) => {
					if (Array.isArray(value)) {
						let position = value.indexOf(entry_key);
						if (isMulti) {
							if (
								position !== -1 &&
								!formatedValue.includes({
									value: entry_key,
									label: entry_value,
								})
							) {
								formatedValue.push({
									value: entry_key,
									label: entry_value,
								});
							}
						} else {
							if (position !== -1) {
								formatedValue = [
									{ value: entry_key, label: entry_value },
								];
							}
						}
					}
					return { value: entry_key, label: entry_value };
				}
			);
		} else if (Array.isArray(options)) {
			formatedOptions = options.map((option, cursor) => {
				if (JSON.isJSON(option)) {
					if (
						"value" in option &&
						option.value &&
						"label" in option &&
						option.label
					) {
						return { value: option.value, label: option.label };
					}
				}
			});
		}
		return { options: formatedOptions, value: formatedValue };
	}


	//console.log("formattedData.options", formattedData.options);

	const [open, setOpen] = useState(false);
	const [inputOptions, setInputOptions] = useState([]);
	const [inputValue, setInputValue] = useState(freeSolo? value : (isMulti? [] : ""));
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);
	const [inputDisabled, setInputDisabled] = useState(disabled);



	const inputValueValid = async input_value => {		
		let excludedValidators = Array.isArray(excludeValidation)? excludeValidation : (String.isString(excludeValidation)? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
		let valid = true;
		let validationError = "";
		//console.log(label, "input_value", input_value, "required", required, "validate", validate)
		if (validate) {
			if (valid && required && !excludedValidators.includes("required")) {
				if (!input_value) {
					valid = false;
					validationError = label + " is required";
				}
				else if ((Array.isArray(input_value) && input_value.length > 0) || (String.isString(input_value) && input_value.length > 0)) {					
						valid = true;
						validationError = "";
					
				} else {
					valid = true;
					validationError = "";
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
		let new_value = null;
		if (Array.isArray(newValue) || JSON.isJSON(newValue)) {
					if (isMulti) {
						new_value = [];
						newValue.map((entry, cursor) => {
							if (entry) {
								new_value.push(entry.value);
							}
							
						});
						

					} else {
						
						if (JSON.isJSON(newValue)) {
							new_value = newValue.value;
						}
						
					}
		}
		else if (freeSolo) {
			new_value = newValue;
		}
		if ( Function.isFunction(onChange)) {
							let changed = onChange(new_value);
							Promise.all([changed]).then(()=>{
								
							}).catch(e => {
								console.error(label+" onChange error", e);
							});
							
		}
		
		
	}


	function handleOnChange(event, newValue, reason) {	
				setInputValue(newValue);
				if (!inputTouched) {
					setInputTouched(true);
				}
	}

	useEffect(() => {
		if (loading) {
			setInputOptions([]);
			setInputTouched(false);
			setInputValue(null);
		}
		else{
			let formatedValue = null;
			let formatedOptions = [];
			let valueArr = [];
			if (value && !Array.isArray(value)) {
				valueArr = [value];
			}

			if (Array.isArray(value)) {
				if (isMulti) {
					formatedValue = [];
					value.map((entry, cursor) => {
						if (entry) {
							if (JSON.isJSON(entry)) {
								if ("value" in entry && entry.value && "label" in entry && entry.label ) {
									formatedValue.push({ value: entry.value, label: entry.label });
								}
							}
							else{
								if (JSON.isJSON(options) && entry in options) {
									formatedValue.push({ value: entry, label: options[entry] });
								}
							}
						}

					});
				}
			}
			else if (value && value in options) {
				formatedValue={ value: value, label: options[value] };
			}
			else if (freeSolo && !String.isEmpty(value)) {
				formatedValue = value;
			}
			if (JSON.isJSON(options)) {
				Object.entries(options).map(([entry_key, entry_value], cursor) => {
						/*if (Array.isArray(valueArr)) {
							let position = valueArr.indexOf(entry_key);
							if (isMulti) {
								if (position !== -1 && !formatedValue.includes({ value: entry_key, label: entry_value, })) {
									formatedValue.push({ value: entry_key, label: entry_value,});
								}
							} 
							else {
								if (position !== -1) {
									formatedValue = [{ value: entry_key, label: entry_value },];
								}
							}
						}*/

						formatedOptions.push({ value: entry_key, label: entry_value });
					}
				);
			} 
			else if (Array.isArray(options)) {
				options.map((option, cursor) => {
					if (JSON.isJSON(option)) {
						if ( "value" in option && option.value && "label" in option && option.label ) {
							formatedOptions.push({ value: option.value, label: option.label });
						}
					}
				});
			}	
			setInputOptions(formatedOptions);
			/*if (!formatedOptions.equals(inputOptions)) {
				setInputOptions(formatedOptions);
			}*/
			if ((Array.isArray(formatedValue) && Array.isArray(inputValue) && formatedValue.equals(inputValue)) || (JSON.isJSON(formatedValue) && JSON.isJSON(inputValue) && Object.areEqual(formatedValue, inputValue))) {
				//console.log(label, "formatedValue equal", formatedValue, "inputValue", inputValue)

			}
			else{
				//console.log(label, "formatedValue not equal", formatedValue)			
				setInputValue(formatedValue);
				//let valueValid = inputValueValid(newformattedData.value);
				
			}
			/*setInputOptions(formatedOptions);
			setInputValue(formatedValue);*/

			//console.log("Autocomplete formatedOptions", formatedOptions);
			//console.log("Autocomplete value", value);
		}
			
		
	}, [options, value, isMulti, loading]);

	useEffect(() => {
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
	}, [inputTouched, inputValue]);

	

	return (
		<Autocomplete
			className={"flex-1 my-0"+(className? (" "+className) : "")}
			multiple={isMulti}
			margin={margin}
			filterSelectedOptions={true}
			getOptionLabel={(option) => {				
				if (JSON.isJSON(option)) {
					return option.label? option.label : "";
				}
				else if (String.isString(option)) {
					let label = "";
					for (var i = 0; i < inputOptions.length; i++) {
						if (inputOptions[i].value === option) {
							label = inputOptions[i].label;
							break;
						}
					}
					return label;
				}
				else{
					return "";
				}
			}}
			
			getOptionSelected={(option, currentValue)=>{				
				if (option && currentValue) {
					return option.value == currentValue.value;
				}
				return false;
			}}
			renderInput={(params) => {							
				return (
					<TextField					
						label={label}
						variant={variant? variant : "filled"}
						margin={margin}
						size={size}
						{...params}
						InputLabelProps={{
							...params.InputLabelProps,
							shrink: isMulti && inputValue.length > 0? true : (JSON.isJSON(params.InputLabelProps)? params.InputLabelProps.shrink : open),
						}}
						inputProps={{
							...params.inputProps,
							autoComplete: uniqueAutocompleteValue,
							value: freeSolo && String.isString(inputValue)? inputValue: (params.inputProps.value),
							onBlur: (event)=>{
								event.persist();
								if (freeSolo) {									
									if (!debouncedFreeSoloOnChange) {
										debouncedFreeSoloOnChange =  debounce(() => {
											let new_value = event.target.value;
											try {
												let inputOptionsStr = JSON.stringify(inputOptions);	

												setInputValue(new_value);										
												let valueValid = inputValueValid(new_value);
												Promise.all([valueValid]).then(validity => {
													if (validity[0]) {
														
														triggerOnChange(new_value);
													}
												}).catch(e => {
													console.error(label+" validity check error", e);
												});
												
												/*if (!inputTouched) {
													setInputTouched(true);
												}*/
												params.inputProps.onBlur(event);
											} catch(err) {

											}
												
											
										}, 300);
									}
						
									debouncedFreeSoloOnChange();
								}
								else{
									params.inputProps.onBlur(event);
								}
								if (open) {
									setOpen(false);							
								}
							}
						}}
						InputProps={{
							...params.InputProps,
							autocomplete: 'none',
						}}
						error={inputError ? true : isInvalid}
						helperText={ inputError ? inputError : (isInvalid ? "Invalid" : helperText) }
						onFocus={() => {
							if (!open) {
								setOpen(true);							
							}
						}}
						
						required={required}
						disabled={inputDisabled}
					/>
				)
			}}
			forcePopupIcon={true}
			popupIcon={loading ? <CircularProgress size={"1.2rem"}  color="inherit" /> : (popupIcon? popupIcon : <ArrowDropDownIcon  fontSize="inherit" />)}
			{...rest}
			onChange={handleOnChange}
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
			value={freeSolo && String.isString(inputValue)? null: inputValue}
			options={inputOptions}
			loading={loading}
			freeSolo={freeSolo}
			fullWidth
		/>
	);
}


CustomAutocomplete.defaultProps = {
	isMulti: false,
	isClearable: true,
	variant: "filled",
	label: "Select",
	margin: "dense",
	size: "small",
	options: [],
	loading: false,
	disabled: false,
	value: undefined,
};
export default React.memo(CustomAutocomplete);
