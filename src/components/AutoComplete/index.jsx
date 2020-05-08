/**
 * /* eslint-disable react/prop-types
 *
 * @format
 */

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClearIcon from "@material-ui/icons/Clear";
import classNames from "classnames";
import React, { useState } from "react";
import Select from "react-select";
import { colors } from "assets/jss/app-theme";
import withRoot from "hoc/withRoot";
import styles from "./styles";

const NoOptionsMessage = props => (
	<Typography
		color="textSecondary"
		className={props.selectProps.classes.noOptionsMessage}
		{...props.innerProps}
	>
		{props.children}
	</Typography>
);

const inputComponent = ({ inputRef, ...props }) => {
	const { onChange, ...rest } = props;
	return <div ref={inputRef} {...rest} />;
};

const Control = props => (
	<TextField
		fullWidth
		InputProps={{
			inputComponent,
			inputProps: {
				className: props.selectProps.classes.input,
				inputRef: props.innerRef,
				children: props.children,
				disabled: props.disabled,
				...props.innerProps,
			},
		}}
		disabled={props.disabled}
		{...props.selectProps.textFieldProps}
	/>
);

const Option = props => (
	<MenuItem
		buttonRef={props.innerRef}
		selected={props.isFocused}
		component="div"
		style={{
			fontWeight: props.isSelected ? 500 : 400,
			color: props.isSelected
				? colors.hex.primarydark
				: colors.hex.default,
		}}
		{...props.innerProps}
	>
		{props.children}
	</MenuItem>
);

const Placeholder = props => (
	<Typography
		color="textSecondary"
		className={props.selectProps.classes.placeholder}
		{...props.innerProps}
	>
		{props.children}
	</Typography>
);

const SingleValue = props => (
	<Typography
		className={props.selectProps.classes.singleValue}
		{...props.innerProps}
	>
		{props.children}
	</Typography>
);

const ValueContainer = props => (
	<div className={props.selectProps.classes.valueContainer}>
		{props.children}
	</div>
);

const Menu = props => (
	<Paper
		square
		elevation={3}
		className={props.selectProps.classes.paper}
		style={{ zIndex: "999999999" }}
		{...props.innerProps}
	>
		{props.children}
	</Paper>
);

const IndicatorSeparator = () => null;

const ClearIndicator = props => (
	<IconButton {...props.innerProps} className="w-10 h-10 p-2">
		<ClearIcon className="text-xl" />
	</IconButton>
);

const DropdownIndicator = props => (
	<IconButton {...props.innerProps} className="w-10 h-10 p-2">
		<ArrowDropDownIcon className="text-xl" />
	</IconButton>
);

const MultiValue = props => (
	<Chip
		tabIndex={-1}
		label={props.children}
		className={classNames(props.selectProps.classes.chip, {
			[props.selectProps.classes.chipFocused]: props.isFocused,
		})}
		onDelete={props.removeProps.onClick}
		deleteIcon={<ClearIcon {...props.removeProps} />}
	/>
);

function formatData(props) {
	let { isMulti, value, options } = props;
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
			formatedValue = value.map((entry, cursor) => {
				if (JSON.isJSON(entry)) {
					if (
						"value" in entry &&
						entry.value &&
						"label" in entry &&
						entry.label
					) {
						return { value: entry.value, label: entry.label };
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

function Autocomplete(props) {
	const formattedData = formatData(props);
	const { classes, isMulti } = props;
	const { value, options } = formattedData;
	let newProps = { ...props, ...formattedData };

	const { onChange, textFieldProps, isClearable, ...rest } = newProps;
	const [internalvalue, setInternalValue] = useState(value);
	function handleOnChange(value, actionMeta) {
		if (actionMeta) {
			if (
				actionMeta.action === "select-option" ||
				actionMeta.action === "remove-value" ||
				actionMeta.action === "clear"
			) {
				setInternalValue(value);
				if (Array.isArray(value) || JSON.isJSON(value)) {
					if (newProps.isMulti) {
						let new_value = value.map((entry, cursors) => {
							return entry.value;
						});
						if (Function.isFunction(onChange)) {
							onChange(new_value);
						}
					} else {
						let new_value = null;
						if (JSON.isJSON(value)) {
							new_value = value.value;
						}
						if (Function.isFunction(onChange)) {
							onChange(new_value);
						}
					}
				}
				if (value === null) {
					if (Function.isFunction(onChange)) {
						onChange(null);
					}
				}
			}
		}
	}

	return (
		<div className={classes.root}>
			<Select
				{...{ ...rest, classes }}
				value={internalvalue}
				isClearable={isClearable}
				textFieldProps={textFieldProps}
				onChange={handleOnChange}
				onBlur={handleOnChange}
				isDisabled={props.disabled}
			/>
		</div>
	);
}

/*Autocomplete.propTypes = {
	isMulti: false,
	isClearable: true,
	textFieldProps:{
					label: 'Select',
					InputLabelProps: {
						shrink: true
					}
	},
	components: {
		Control,
		Menu,
		NoOptionsMessage,
		Option,
		Placeholder,
		SingleValue,
		MultiValue,
		ValueContainer,
		IndicatorSeparator,
		ClearIndicator,
		DropdownIndicator
	},
	options: []
};*/

Autocomplete.defaultProps = {
	isMulti: false,
	isClearable: true,
	textFieldProps: {
		label: "Select",
		InputLabelProps: {
			shrink: true,
		},
	},
	components: {
		Control,
		Menu,
		NoOptionsMessage,
		Option,
		Placeholder,
		SingleValue,
		MultiValue,
		ValueContainer,
		IndicatorSeparator,
		ClearIndicator,
		DropdownIndicator,
	},
	options: [],
	disabled: false,
	setvalue: {},
};
export default withRoot(withStyles(styles)(Autocomplete));
