import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box"
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from "@mui/material/IconButton"
import React, { useCallback, useRef, useMemo } from "react";
import debounce from 'lodash/debounce';
import InputAdornment from "@mui/material/InputAdornment"
import Checkbox from "@mui/material/Checkbox"
import {useSetState, useDidMount, useDidUpdate, useMark, useDeepMemo} from "hooks";
import CheckIcon from "@mui/icons-material/Check"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"

const icon = <CheckBoxOutlineBlankIcon color="transparent" fontSize="inherit" />
const checkedIcon = <CheckIcon fontSize="inherit" />



function CustomAutocomplete(props) {
	const {
		className,
		multiple,
		name,
		onChange,
		value,
		options,
		label,
		freeSolo,
		required,
		variant,
		margin,
		size,
		loading,
		disabled,
		helperText,
		error,
		isOptionEqualToValue,
		getOptionSelected,
		getOptionLabel,
		endAdornment,
		...rest
	} = props

	const [state, setState, getState] = useSetState({
		open: false,
		error: false,
		invalid: false,
		disabled: false,
		loading: false,
	});

	const defaultInputValue = multiple ? [] : null

	const isOptionInValue = useCallback(
		(option, val) => {
			if (Function.isFunction(isOptionEqualToValue)) {
				return isOptionEqualToValue(option, val)
			}
			else {
				let valEntries = []
				if (Array.isArray(val)) {
					valEntries = val.reduce((acc, curr) => {
						if (curr.value) {
							acc.push(curr.value)
						} else {
							acc.push(curr)
						}
						return acc
					}, [])
				} else if (JSON.isJSON(val) && "value" in val) {
					valEntries.push(val.value)
				}
				// console.log(name, "isOptionInValue valEntries", valEntries)
				// console.log("isOptionInValue option", option)
				// // // console.log("isOptionInValue val", val)
				// console.log("isOptionInValue valEntries.indexOf(option?.value) !== -1", valEntries.indexOf(option?.value) !== -1)
				return valEntries.indexOf(option?.value) !== -1 || (valEntries.indexOf(option) === -1 && freeSolo)
			}

		},
		[isOptionEqualToValue, freeSolo]
	)

	const inputOptions = useDeepMemo(
		async () => {
			let parsedOptions = Array.isArray(options) ? options : []
			if (Function.isFunction(options)) {
				parsedOptions = await Promise.all([options()])
					.then(res => {
						return res[0]
					})
					.catch(error => {
						return []
					})
			}

			if (String.isString(options) && !String.isEmpty(options)) {
				try {
					parsedOptions = JSON.parse(options)
				} catch (error) {
					// setState({ error: error?.toString ? error.toString() : JSON.stringify(error) })
				}
			}

			if (JSON.isJSON(options)) {
				parsedOptions = Object.entries(options).reduce(
					(currentValue, [value, label]) => currentValue.concat([{ value, label }]),
					[]
				)
			}
			return parsedOptions
		},
		[options],
		[]
	)



	const inputValue = useDeepMemo(
		() => {
			let parsedValue = []
			let targetValues = []
			if (Array.isArray(value)) {
				targetValues = [...value]
			} else if (!!value && !Array.isArray(value)) {
				targetValues = [value]
			}

			if (Array.isArray(targetValues)) {
				parsedValue = inputOptions.reduce((currentParsedValue, entry) => {
					if (isOptionInValue(entry, targetValues)) {
						currentParsedValue.push(entry)
					}
					return currentParsedValue
				}, [])
			}

			if (!multiple) {
				if (parsedValue.length > 0) {
					parsedValue = parsedValue[0]
				} else {
					// parsedValue = inputOptions || null
					parsedValue = []
				}
			} else if (!Array.isArray(parsedValue)) {
				parsedValue = []
			}

			return parsedValue
		},
		[multiple, value, inputOptions],
		defaultInputValue
	)

	const isOptionSelected = useCallback(
		(option, val) => {
			if (Function.isFunction(getOptionSelected)) {
				return getOptionSelected(option, val)
			} else {
				let valEntries = []
				if (Array.isArray(val)) {
					valEntries = val.reduce((acc, curr) => {
						if (curr.value) {
							acc.push(curr.value)
						} else {
							acc.push(curr)
						}
						return acc
					}, [])
				} else if (JSON.isJSON(val) && "value" in val) {
					valEntries.push(val.value)
				}
				return valEntries.indexOf(option?.value) !== -1 || (valEntries.indexOf(option) === -1 && freeSolo)
			}
		},
		[getOptionSelected, freeSolo]
	)

	const getLabelOfOption = useCallback(
		option => {
			if (Function.isFunction(getOptionLabel)) {
				return getOptionLabel(option)
			} else {
				if (JSON.isJSON(option)) {
					return option.label || option.value || ""
				} else {
					let label = ""
					for (var i = 0; i < inputOptions.length; i++) {
						if (inputOptions[i].value === option || inputOptions[i].value === option?.value) {
							label = inputOptions[i].label || inputOptions[i].value || ""
							break
						}
					}
					return label
				}
			}
		},
		[getOptionLabel, inputOptions]
	)







	const handleOnChange = useCallback((event, newValue, reason) => {
		if (Function.isFunction(onChange)) {
			let onChangeValue = newValue?.value || newValue || null

			if (multiple) {
				if (Array.isArray(newValue)) {
					onChangeValue = newValue.map(entry => entry.value || entry)
				}
			}
			if (onChange.length === 3) {
				onChange(event, onChangeValue, reason)
			}
			else if (onChange.length === 2) {
				onChange(event, onChangeValue)
			} else {
				onChange(onChangeValue)
			}
		}
	}, [onChange, multiple, value]);



	const inputRequired = useMemo(() => {
		if (required) {
			return (
				(freeSolo && String.isEmpty(inputValue)) ||
				(!multiple && !inputValue) ||
				(multiple && Array.isArray(inputValue) && inputValue.length === 0)
			)
		}
		return false
	}, [required, freeSolo, multiple, inputValue])



	let debouncedFreeSoloOnChange;



	return (
		<Autocomplete
			className={"flex-1 my-0" + (className ? " " + className : "")}
			multiple={multiple}
			filterSelectedOptions={false}
			isOptionEqualToValue={isOptionInValue}
			getOptionLabel={getLabelOfOption}
			getOptionSelected={isOptionSelected}
			renderOption={({ className: optionClassName, ...optionProps }, option, { selected }) => (
				<li className={`${optionClassName} p-1 py-1 h-auto `} {...optionProps}>
					<Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
					{option.label || option.value || "Option"}
				</li>
			)}
			renderInput={params => (
				<TextField
					{...params}
					label={label}
					variant={variant || "filled"}
					margin={margin}
					size={size}
					InputLabelProps={{
						...params.InputLabelProps,
						shrink:
							multiple && inputValue.length > 0
								? true
								: JSON.isJSON(params.InputLabelProps)
								? params.InputLabelProps.shrink
								: state.open,
					}}
					inputProps={{
						...params.inputProps,
						autoComplete: String.uid(11),
						required: inputRequired,
						// value: freeSolo && String.isString(inputValue) ? inputValue : params.inputProps.value,
						// onBlur: event => {
						// 	event.persist()
						// 	if (freeSolo) {
						// 		if (!debouncedFreeSoloOnChange) {
						// 			debouncedFreeSoloOnChange = debounce(() => {
						// 				let new_value = event.target.value
						// 				try {
						// 					inputValue = new_value

						// 					params.inputProps.onBlur(event)
						// 				} catch (err) {}
						// 			}, 300)
						// 		}

						// 		debouncedFreeSoloOnChange()
						// 	} else {
						// 		params.inputProps.onBlur(event)
						// 	}
						// },
					}}
					InputProps={{
						...params.InputProps,
						autocomplete: "none",
						endAdornment: (
							<Box className="flex flex-row items-center">
								{loading && (
									<IconButton aria-label="loading-indicator" edge="start" color="secondary" className="-mt-4">
										<CircularProgress color="inherit" size={16} />
									</IconButton>
								)}
								{params.InputProps.endAdornment}
							</Box>
						),
					}}
					error={Boolean(error)}
					helperText={helperText}
					disabled={disabled}
				/>
			)}
			fullWidth
			loading={loading}
			{...rest}
			onChange={handleOnChange}
			value={freeSolo && String.isString(inputValue) ? null : inputValue}
			options={inputOptions}
		/>
	)
}


CustomAutocomplete.defaultProps = {
	multiple: false,
	isClearable: false,
	variant: "filled",
	label: "Select",
	margin: "dense",
	size: "small",
	options: [],
	loading: false,
	disabled: false,
	value: null,
	forcePopupIcon: true,
	openOnFocus: true,
	noOptionsText: "No options available",
	disableClearable: true,
}
export default CustomAutocomplete;
