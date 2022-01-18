import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useCallback, useRef, useMemo } from "react";
import debounce from 'lodash/debounce';
import {useSetState, useDidMount, useDidUpdate, useMark} from "hooks";
import {useUpdate} from 'react-use';

const AutocompleteTextField = (props) => {
	return (
		<TextField
			{...props}
		/>
	)
}


function CustomAutocomplete(props) {
	const { className, disabled, isMulti, loading, onChange, label, required, variant, margin, size, max, excludeValidation, min, validate, validator, onValidityChange, helperText, onOpen, onClose, touched, invalid, isClearable, error, value, options, freeSolo, ...rest } = props
	let formattedData = { options: [], value: [] }

	const [state, setState, getState] = useSetState({
		open: false,
		error: false,
		invalid: false,
		disabled: false,
		loading: false,
	});
	const update = useUpdate();
	const optionsRef = useRef([]);
	const valueRef = useRef([]);


	const parseInputOptions = async (targetOptions)=>{
		let parsedOptions = Array.isArray(targetOptions)? targetOptions : [];
		if (Function.isFunction(targetOptions)) {
			parsedOptions = await Promise.all([targetOptions()]).then(res => {
				return res[0]
			}).catch(error => {
				setState({loading: false, error: error?.toString? error.toString() : JSON.stringify(error)});
				return []
			})
		}

		if (String.isString(targetOptions) && !String.isEmpty(targetOptions)) {
			try {
				parsedOptions=JSON.parse(targetOptions);
			} catch (error) {
				console.log(" error", error)
				setState({error: error?.toString? error.toString() : JSON.stringify(error)});
			}
		}
		
		if (JSON.isJSON(targetOptions)) {
			parsedOptions = Object.entries(targetOptions).reduce((currentValue, [value, label])=> currentValue.concat([{value, label}]), [])
		}
		return parsedOptions;

	}

	const parseInputValue = useCallback( (target)=>{
		return new Promise((resolve, reject) => {
			let parsedValue = [];
			let targetValues = [];
			if (Array.isArray(target)) {
				targetValues = [...target]
			}
			else if (!!target && !Array.isArray(target)) {
				targetValues = [target]
			}

			parsedValue = optionsRef.current.reduce((currentParsedValue, entry) => {
					// console.log("parseInputValue entry", entry)
						if (JSON.isJSON(entry)) {						
							let entryValues = Object.values(entry);
							targetValues.map(targetValueEntry => {
								// if (!JSON.isJSON(targetValueEntry)) {								
								// 	let valueOptionIndex = entryValues.indexOf(targetValueEntry)
								// 	// console.log("parseInputValue targetValueEntry", targetValueEntry, "entryValues", entryValues)
								// 	if (valueOptionIndex !== -1) {
								// 		currentParsedValue.push(entry)
								// 	}
								// }
								// else if (Object.areEqual(entry, targetValueEntry) || entryValues.indexOf(targetValueEntry) !== -1) {
								if (Object.areEqual(entry, targetValueEntry) || entryValues.indexOf(targetValueEntry) !== -1) {
									currentParsedValue.push(entry)
								}														
							});
						}
						else {
							targetValues.map(targetValueEntry => {
								if (Object.areEqual(entry, targetValueEntry)) {
									currentParsedValue.push(entry)
								}
							});
						}
						return currentParsedValue
			}, []);
			
			if (!isMulti) {
				if (parsedValue.length > 0) {
					parsedValue = parsedValue[0]
				}
				else{
					parsedValue = optionsRef.current[0] || null
				}
			}
			
			resolve(parsedValue);

		})
			

	}, [isMulti]);

	const inputValueValid = useCallback(input_value => {
		return new Promise(async (resolve, reject) => {
			let excludedValidators = Array.isArray(excludeValidation) ? excludeValidation : (String.isString(excludeValidation) ? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
			let valid = true;
			let validationError = "";
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
					} catch (err) {
						validationError = " validity cannot be determined.";
					};
					valid = !String.isString(validationError);
				}
			}
			if (valid !== !isInvalid && Function.isFunction(onValidityChange)) {
				onValidityChange(valid);
			}
			if (valid) {
				resolve(valid);
			}
			else{
				reject(validationError)
			}
		})

			
	}, [label, onValidityChange, excludeValidation, validator]);

	const handleOnOpen = useCallback(() => {
		if (Function.isFunction(onOpen)) {
			onOpen();
		}
	}, [onOpen]);

	const handleOnChange = useCallback((event, newValue, reason) => {				
		if (Function.isFunction(onChange)) {
			if (onChange.length > 1) {				
				onChange(event, newValue, reason)
			}
			else{
				let onChangeValue = isMulti? []: (newValue?.value || newValue);
				if (isMulti) {
					
				}
				onChange(onChangeValue)
			}
		}
	}, [onChange, isMulti]);

	const handleOnClose = useCallback(() => {
		const {open} = getState()
		if (open) {
			setState({open: false})
		}
		if (Function.isFunction(onClose)) {
			onClose();
		}
	}, [onClose]);

	

	useDidUpdate(() => {
		parseInputOptions(options).then(parsedOptions => {
			optionsRef.current = parsedOptions;
			update();
			setState({error: false})
			parseInputValue(value).then(parsedValue => {
				valueRef.current = parsedValue;	
				update()
			}).catch(error=> {
				setState({error: error?.toString? error.toString() : JSON.stringify(error)})
			})
		}).finally(()=> update())
	}, [options]);

	useDidUpdate(() => {
		parseInputValue(value).then(parsedValue => {
			valueRef.current = parsedValue;	
			update()
		});
	}, [value]);

	useDidMount(() => {
		parseInputOptions(options).then(parsedOptions => {
			optionsRef.current = parsedOptions;	
			update()
			parseInputValue(value).then(parsedValue => {
				valueRef.current = parsedValue;	
				update()
			}).catch(error=> {
				setState({error: error?.toString? error.toString() : JSON.stringify(error)})
			})
			
		}).catch(error=> {
			setState({error: error?.toString? error.toString() : JSON.stringify(error)})
		})
			
	});

	const inputRequired = useMemo(() => {
		if (required) {
			return ((freeSolo && String.isEmpty(valueRef.current)) || ((!isMulti && !valueRef.current) || (isMulti && Array.isArray(valueRef.current) && valueRef.current.length === 0)))
		}
		return false;
		
	}, [required, freeSolo, isMulti])

	let debouncedFreeSoloOnChange;




	return (
		<Autocomplete
			className={"flex-1 my-0" + (className ? (" " + className) : "")}
			multiple={isMulti}
			margin={margin}
			size={size}
			filterSelectedOptions={true}
			getOptionLabel={(option) => {
				if (JSON.isJSON(option)) {
					return option.label ? option.label : "";
				}
				else {
					let label = "";
					for (var i = 0; i < optionsRef.current.length; i++) {
						if (optionsRef.current[i].value === option || optionsRef.current[i].value === option?.value) {
							label = optionsRef.current[i].label;
							break;
						}
					}
					return label;
				}
			}}
			getOptionSelected={(option, currentValue) => {
				if (option && currentValue) {
					return option.value == currentValue.value;
				}
				return false;
			}}

			renderInput={(params) => {
				return (
					<TextField
						label={label}
						variant={variant || "filled"}
						margin={margin}
						size={size}
						{...params}
						InputLabelProps={{
							...params.InputLabelProps,
							shrink: isMulti && valueRef.current.length > 0 ? true : (JSON.isJSON(params.InputLabelProps) ? params.InputLabelProps.shrink : state.open),
						}}
						inputProps={{
							...params.inputProps,
							autoComplete: String.uid(11),
							required: inputRequired,
							value: freeSolo && String.isString(valueRef.current) ? valueRef.current : (params.inputProps.value),
							onBlur: (event) => {
								event.persist();
								if (freeSolo) {
									if (!debouncedFreeSoloOnChange) {
										debouncedFreeSoloOnChange = debounce(() => {
											let new_value = event.target.value;
											try {
												let inputOptionsStr = JSON.stringify(optionsRef.current);
												valueRef.current = new_value
												
												params.inputProps.onBlur(event);
											} catch (err) {

											}
										}, 300);
									}

									debouncedFreeSoloOnChange();
								}
								else {
									params.inputProps.onBlur(event);
								}

							}
						}}
						InputProps={{
							...params.InputProps,
							autocomplete: 'none',
							endAdornment: (
								<React.Fragment>
									{loading ? <CircularProgress color="inherit" size={"1.2rem"} /> : params.InputProps.endAdornment}
								</React.Fragment>
							),
						}}
						error={Boolean(error || state.error || state.invalid || invalid)}
						helperText={error || state.error || (invalid || state.invalid ? "Invalid" : helperText)}
						onFocus={() => setState({open: true})}
						onBlur={() => setState({open: false})}
						required={required}
						disabled={disabled || state.disabled}
					/>
				);
			}}
			fullWidth
			{...rest}
			onChange={handleOnChange}
			open={state.open}
			onOpen={handleOnOpen}
			onClose={handleOnClose}
			value={freeSolo && String.isString(valueRef.current) ? null : valueRef.current}
			options={optionsRef.current}
			loading={state.loading || loading}
			freeSolo={freeSolo}
			
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
