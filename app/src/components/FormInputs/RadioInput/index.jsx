import React, { useState, useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const Input = props => {
	let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);
	let {
		label,
		name,
		touched,
		invalid,
		error,
		onChange,
		variant,
		validate,
		required,
		validator,
		excludeValidation,
		onValidityChange,
		value,
		defaultValue,
		helperText,
		disabled,		
		options,
		color,
		formControlProps,
		className,
		...rest
	} = state;

	let options_keys = Object.keys(options);
	options_keys = Array.isArray(options_keys)? options_keys : [];
	const [inputValue, setInputValue] = useState(value ? value : (defaultValue? defaultValue : (options_keys.length > 0? options_keys[0] : undefined)));
	const [inputDisabled, setInputDisabled] = useState(disabled);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);
	

	const inputValueValid = async input_value => {
		let excludedValidators = Array.isArray(excludeValidation)? excludeValidation : (String.isString(excludeValidation)? excludeValidation.replaceAll(" ", "").toLowerCase().split(",") : [])
		let valid = true;
		let validationError = "";
		if (validate) {
			if (valid && required && !excludedValidators.includes("required")) {
				if (input_value) {
					if (input_value.toString().length === 0) {
						valid = false;
						validationError = label + " is required";
					}
				} else {
					valid = false;
					validationError = label + " required";
				}
			}
			

			if (valid && Function.isFunction(validator) && !excludedValidators.includes("validator")) {
				try {
					validationError = await validator(input_value);
				} catch(err) {
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
				if (validity[0]) {
					triggerOnChange(inputValue);
				}
			}).catch(e => {});
							
		}
	}, [inputTouched, inputValue]);

	useEffect(() => {
		setInputValue(value ? value : (defaultValue? defaultValue : (options_keys.length > 0? options_keys[0] : undefined)))
	}, [value, defaultValue]);

	return (
		<FormControl 
			className={"flex-1"+(className? (" "+className) : "")}
			component="div" 
			required={required} 
			error={inputError? true : false} 
		>
			<FormLabel component="legend">{label}</FormLabel>
			{JSON.isJSON(options) && (
				<RadioGroup
					aria-label={label.variablelize()}
					name={name? name : label.variablelize() }
					onChange={async event => {
						let new_value = event.target.value;

						/*if (inputError || isInvalid || inputTouched) {
							setInputError(undefined);
							setIsInvalid(false);
							setInputTouched(false);
						}*/
						if (!inputTouched) {
							setInputTouched(true);
						}
						setInputValue(new_value);
						
					}}
					value={inputValue}
					{...rest}
				>
					{Object.entries(options).map(
						([option_name, option_label], cursor) => (
							<FormControlLabel
								value={option_name}
								control={<Radio color={color? color : "primary"} />}
								label={option_label}
								key={name + "-option-" + cursor}
							/>
						)
					)}
				</RadioGroup>
			)}
			<FormHelperText>{inputError? inputError : helperText}</FormHelperText>
		</FormControl>
	);
};

Input.defaultProps = {	
	options: {},
	formControlProps: {
		margin: "dense",
		size: "small",
		variant: "outlined",
	},
}

export default React.memo(Input);