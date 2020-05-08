/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import { CheckboxInput, DateInput, FileInput, MapInput, RadioInput, SelectInput, TextInput, WysiwygInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";
import styles from "./styles";






class GenerationView extends React.Component {
	state = {
		contextDialogOpen: false,
		expandedGroups: [],
		textfields_variant: "outlined",
		addContextMenuAnchor: null,
		inputMenuAnchor: null,
		context: {},
		active: false,
		value: {},
	};

	input_types = {
		text: "Text",
		date: "Date",
		datetime: "Date & Time",
		time: "Time",
		number: "Number",
		email: "Email",
		textarea: "Textarea",
		radio: "Radio",
		password: "Password",
		checkbox: "Checkbox",
		select: "Select",
		multiselect: "Multi Select",
		transferlist: "Transferlist",
		file: "File",
	};

	constructor(props) {
		super(props);
		const {
			value,
			blueprint,
			name,
			readOnly,
			required,
			disabled,
			validate,
			helperText,
			errors,
			error,
		} = this.props;
		this.state = {
			...this.state,
			blueprint: JSON.isJSON(blueprint) ? blueprint : {},
			value: JSON.isJSON(value) ? value : {},
			name: name,
			readOnly: readOnly,
			required: required,
			disabled: disabled,
			validate: validate,
			helperText: helperText,
			errors: errors,
			error: error,
		};
		this.handleChange = this.handleChange.bind(this);
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		if (!Object.areEqual(prevProps, this.props)) {
			const {
				value,
				blueprint,
				name,
				readOnly,
				required,
				disabled,
				validate,
				helperText,
				errors,
				error,
			} = this.props;
			this.state = {
				...this.state,
				blueprint: JSON.isJSON(blueprint) ? blueprint : {},
				value: JSON.isJSON(value) ? value : {},
				name: name,
				readOnly: readOnly,
				required: required,
				disabled: disabled,
				validate: validate,
				helperText: helperText,
				errors: errors,
				error: error,
			};
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		/*const { value, blueprint, name, readOnly, required, disabled, validate, helperText, errors, error } = this.props;
		if (snapshot.refreshRequired) {
			this.setState({ blueprint: JSON.isJSON(blueprint) ? blueprint : {}, value: JSON.isJSON(value) ? value : {}, name: name, readOnly: readOnly, required: required, disabled: disabled, validate: validate, helperText: helperText, errors: errors, error: error });
		}*/
	}

	async triggerOnChange(value = false) {
		const { onChange } = this.props;
		if (!JSON.isJSON(value)) {
			value = this.state.value;
		}
		if (onChange) {
			onChange(value);
		}
	}

	handleChange = name => value => {
		let newValue = JSON.isJSON(this.state.value)
			? JSON.parse(JSON.stringify(this.state.value))
			: {};
		newValue[name] = value;
		console.log("handleChange ", name, value);
		this.setState({ value: newValue });
		this.triggerOnChange(newValue);
	};

	renderInputField(properties) {
		const { textfield_variant, readOnly, disabled } = this.props;
		const { input, name, label, group, possibilities } = properties;
		const value = this.state.value[name];
		if (JSON.isJSON(input)) {
			let { type, size, props, ...rest } = input;
			const restricted =
				readOnly ||
				disabled ||
				rest.disabled ||
				rest.readOnly ||
				rest.readonly;
			size = Number.parseNumber(size, 12);
			if (
				(type === "select" || type === "multiselect") &&
				JSON.isJSON(possibilities)
			) {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<SelectInput
							textFieldProps={{
								label: label,
								InputLabelProps: {
									shrink: true,
								},
								variant: textfield_variant,
								disabled: restricted,
								required: rest.required,
							}}
							label={label}
							name={name}
							placeholder={"Select " + label}
							options={possibilities}
							isMulti={type === "multiselect"}
							value={value}
							onChange={value => this.handleChange(name, value)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (["email", "number", "phone", "text"].includes(type)) {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<TextInput
							type={type}
							label={label}
							name={name}
							variant={textfield_variant}
							value={value}
							onChange={value => this.handleChange(name, value)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (type === "textarea") {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<TextInput
							type={type}
							label={label}
							name={name}
							multiline
							rows={4}
							variant={textfield_variant}
							value={value}
							onChange={this.handleChange(name)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (type === "checkbox") {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<CheckboxInput
							label={label}
							name={name}
							value={value}
							onChange={this.handleChange(name)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (type === "radio") {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<RadioInput
							label={label}
							name={name}
							value={value}
							onChange={this.handleChange(name)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (type === "file") {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<FileInput
							label={label}
							name={name}
							value={value}
							onChange={this.handleChange(name)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (type === "date") {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<DateInput
							label={label}
							name={name}
							autoOk
							variant="inline"
							openTo="date"
							invalidDateMessage=""
							inputVariant={textfield_variant}
							value={value}
							onChange={this.handleChange(name)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (type === "map") {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<MapInput
							label={label}
							name={name}
							value={value}
							onChange={this.handleChange(name)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			} else if (type === "wysiwyg") {
				return (
					<GridItem
						xs={12}
						md={Number.parseNumber(size, 12)}
						key={
							String.isString(group)
								? group + "-field-" + name
								: "field-" + name
						}
					>
						<WysiwygInput
							label={label}
							name={name}
							variant={textfield_variant}
							value={value}
							onChange={this.handleChange(name)}
							{...rest}
							{...(JSON.isJSON(props) ? props : {})}
						/>
					</GridItem>
				);
			}
		} else {
			return <div></div>;
		}
	}

	renderInputGroup(name, properties) {
		const group_inputs = Array.isArray(properties.value)
			? properties.value
			: [];
		return (
			<GridItem
				xs={12}
				md={Number.isNumber(properties.size) ? properties.size : 12}
				className="p-0"
				key={"group-" + name}
			>
				<GridContainer className="m-0">
					{" "}
					{properties.label + (properties.required ? "*" : "")}{" "}
				</GridContainer>
				<GridContainer className="p-0 m-0">
					{group_inputs.length > 0 &&
						group_inputs.map((field_obj, field_index) =>
							this.renderInputField(field_obj)
						)}
				</GridContainer>
			</GridItem>
		);
	}

	renderInput(name, properties) {
		if (properties.type === "group") {
			return this.renderInputGroup(name, properties);
		} else if (properties.type === "field") {
			return this.renderInputField(properties);
		}
	}

	render() {
		const { classes, className } = this.props;
		const rootClassName = classNames({
			[className]: className,
		});
		return (
			<GridContainer className={rootClassName}>
				{Object.entries(
					this.state.blueprint
				).map(([name, properties], cursor) =>
					this.renderInput(name, properties)
				)}
			</GridContainer>
		);
	}
}

GenerationView.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	blueprint: PropTypes.object.isRequired,
	value: PropTypes.object,
	onChange: PropTypes.func,
	name: PropTypes.string,
	readOnly: PropTypes.bool,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	validate: PropTypes.bool,
	helperTexts: PropTypes.object,
	errors: PropTypes.object,
	error: PropTypes.string,
	textfield_variant: PropTypes.string,
};

GenerationView.defaultProps = {
	value: {},
	blueprint: {},
	textfield_variant: "outlined",
};

export default withRoot(withStyles(styles)(GenerationView));
