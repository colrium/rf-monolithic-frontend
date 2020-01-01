import React from "react";
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


import WysiwygEditor from 'components/WysiwygEditor';

export const TextInput = ({ label, touched, invalid, error, ...rest }) => (
		<TextField
			label={label}
			{...rest}
		/>
	);

export const DateInput = ({ touched, invalid, error, ...rest }) => {
	return (
		<FormControl component="fieldset">
			<DatePicker {...rest} />
		</FormControl>
	);
};

export const DateTimeInput = ({ touched, invalid, error, ...rest}) => {
	return (
		<FormControl component="fieldset">
			<DateTimePicker {...rest} />
		</FormControl>
	);
};

export const RadioInput = ({ name, options, touched, invalid, error, ...rest }) => {
	let { label, ...props } = rest;
	return (
		<FormControl component="fieldset" {...props}>
			<FormLabel component="legend">{label}</FormLabel>
			<RadioGroup aria-label={name} name={name} {...props}>
				{Object.entries(options).map(([option_name, option_label], cursor) => (
					<FormControlLabel value={option_name} control={<Radio color="primary" />} label={option_label} key={name + "-option-" + cursor} />
				))}
			</RadioGroup>
		</FormControl>
	);
};

export const TimeInput = ({ label, touched, invalid, error, ...rest}) => {
	return (
		<TextField
			label={label}
			error={touched && invalid}
			helperText={touched && error}
			{...rest}
		/>
	);
};

export const WysiwygInput = ({ label, touched, invalid, error, ...rest}) => {
	return <WysiwygEditor label={label} {...rest}/>;
}

export const CheckboxInput = ({ defaultValue, label, touched, invalid, error, ...rest}) => (
		<div>
			<FormControlLabel
				control={
					<Checkbox
						checked={defaultValue ? true : false}
						color="primary"
						{...rest}
					/>
				}
				label={label}
			/>
		</div>
	);

export const RadioGroupInput = ({ label, touched, invalid, error, children, ...rest }) => (
	<FormControl fullWidth>
		<FormLabel component="legend">{label}</FormLabel>
		<RadioGroup  {...rest}>
			{children}
		</RadioGroup>
	</FormControl>
);

export const SliderInput = ({ name, value, onChange, label, touched, invalid, error, defaultValue, ...rest}) => {
	let evaluatedValue = value
		? Number.parseNumber(value)
		: Number.parseNumber(defaultValue);
	return (
		<GridContainer className="m-0 p-0">
			<Typography id={name + "-slider"} gutterBottom>
				{label}
			</Typography>
			<br />
			<br />
			<br />
			<Slider
				name={name}
				defaultValue={
					Number.isNumber(evaluatedValue) ? evaluatedValue : undefined
				}
				aria-labelledby={name + "-slider"}
				valueLabelDisplay="on"
				onChangeCommitted={onChange}
				{...rest}
			/>
		</GridContainer>
	);
};

export const TranferListInput = ({ label, ...rest }) => (
	<FormControl fullWidth>
		<Typography gutterBottom>{label}</Typography>
		<TransferList {...rest} />
	</FormControl>
);

export const InputFormHelper = ({ touched, error }) => {
	if (!(touched && error)) {
		return;
	} else {
		return <FormHelperText>{touched && error}</FormHelperText>;
	}
};


export const MultiSelectInput = ({ touched, invalid, error, ...rest }) => {
	return (
		<FormControl fullWidth>
			<AutoComplete {...rest} />
		</FormControl>
	);
};

export const SelectInput = ({ touched, invalid, error, ...rest }) => {
	return (
		<FormControl fullWidth>
			<AutoComplete {...rest} />
		</FormControl>
	);
};

export const FileInput = ({ label, input, touched, invalid, error, ...rest }) => {
	return (
		<FileDropZone
			label={label}
			error={touched && invalid}
			helperText={touched && error ? "Invalid" : null}
			{...rest}
		/>
	);
};

export const MapInput = ({ touched, invalid, error, label, value, ...rest }) => (
	<FormControl fullWidth>
		<FormLabel component="legend">{label}</FormLabel>
		<br />
		<GoogleMap isInput showSearchBar input="coordinates" value={value} {...rest} />
		{!value && <FormHelperText>Search and select to add new locatiion</FormHelperText>}
	</FormControl>	
);

export const DynamicInput = ({ touched, invalid, error, ...rest }) => (
	<DynamicField {...rest} />
);