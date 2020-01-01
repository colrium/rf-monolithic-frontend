import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";


import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/MoreVert";
import MoveDownIcon from "@material-ui/icons/ArrowDownward";
import MoveUpIcon from "@material-ui/icons/ArrowUpward";

import AutoComplete from "components/AutoComplete";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";


import withRoot from "utils/withRoot";
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
		file: "File"
	};

	constructor(props) {
		super(props);
		const { value, blueprint, name, readOnly, required, disabled, validate, helperText, errors, error } = this.props;
		this.state = { ...this.state, blueprint: JSON.isJSON(blueprint) ? blueprint : {}, value: value, name: name, readOnly: readOnly, required: required, disabled: disabled, validate: validate, helperText: helperText, errors: errors, error: error };
	}
	
	getSnapshotBeforeUpdate(prevProps) {
		return { refreshRequired: !Object.areEqual(prevProps, this.props) };
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { value, blueprint, name, readOnly, required, disabled, validate, helperText, errors, error } = this.props;
		if (snapshot.refreshRequired) {
			this.setState({ blueprint: JSON.isJSON(blueprint) ? blueprint : {}, value: value, name: name, readOnly: readOnly, required: required, disabled: disabled, validate: validate, helperText: helperText, errors: errors, error: error });
		}
	}


	triggerOnChange() {
		const { onChange } = this.props;
		if (onChange) {
			onChange(this.state.value);
		}
	}
	
	renderTextField(name, properties) {
		return (
			<FormControl fullWidth>
				<TextField
					name={name}
					disabled={properties.input.disabled}
					type={properties.input.type}
					label={properties.label}
					variant={this.state.textfields_variant}
					onBlur={e => {}}
					required={properties.input.required}
					fullWidth
				/>
			</FormControl>
		);
	}

	renderRadioField(name, properties){
		return (
			<FormControl component="fieldset">
				<FormLabel component="legend">{properties.label}</FormLabel>
				<RadioGroup aria-label={properties.name} name={properties.name} value={undefined} onChange={e=>{}}>
					{Object.entries(properties.possibilities).map(([option_name, option_label], cursor) => (
						<FormControlLabel value={option_name} control={<Radio color="primary" />} label={option_label} key={name + "-option-" + cursor} />
					))}
				</RadioGroup>
			</FormControl>
		);
	};
	
	renderAutoCompleteField(name, properties) {
		return (
			<FormControl fullWidth>
				<AutoComplete
					name={properties.name}
					disabled={properties.input.disabled}
					textFieldProps={{
						label: properties.label,
						InputLabelProps: {
							shrink: true
						},
						variant: "outlined",
						disabled: properties.input.disabled,
						required: properties.input.required,
					}}
					options={properties.possibilities}
					placeholder={"Select " + properties.label.singularize()}
					isMulti={properties.input.type === "multiselect"} />
			</FormControl>
		);
	}
	
	renderInputField(name, properties){
		if (JSON.isJSON(properties.input)) {            
			if ((properties.input.type === "select" || properties.input.type === "multiselect") && JSON.isJSON(properties.possibilities)) {
				return (
					<GridItem xs={12} md={Number.isNumber(properties.input.size) ? properties.input.size : 12} key={String.isString(properties.group) ? (properties.group + "-field-" + name) : ("field-" + name)}>
						{this.renderAutoCompleteField(name, properties)}
					</GridItem> );
			}
			else if (["email", "number", "phone", "text"].includes(properties.input.type)) {
				return (
					<GridItem xs={12} md={Number.isNumber(properties.input.size) ? properties.input.size : 12} key={String.isString(properties.group) ? (properties.group + "-field-" + name) : ("field-" + name)}>
						{this.renderTextField(name, properties)}
					</GridItem>);
			}
			else if (properties.input.type === "radio") {
				return (
					<GridItem xs={12} md={Number.isNumber(properties.input.size) ? properties.input.size : 12} key={String.isString(properties.group) ? (properties.group + "-field-" + name) : ("field-" + name)}>
						{this.renderRadioField(name, properties)}
					</GridItem>);
			}
			else if (properties.input.type === "radio") {
				return (
					<GridItem xs={12} md={Number.isNumber(properties.input.size) ? properties.input.size : 12} key={String.isString(properties.group) ? (properties.group + "-field-" + name) : ("field-" + name)}>
						{this.renderRadioField(name, properties)}
					</GridItem>);
			}
		}
		else{
			return (
				<div></div>
			);
		}
		
	}


	
	renderInputGroup(name, properties) {
		const group_inputs = Array.isArray(properties.value) ? properties.value : [];
		return (
			<GridItem xs={12} md={Number.isNumber(properties.size) ? properties.size : 12} className="p-0" key={"group-" + name}>
				<GridContainer className="m-0"> { properties.label + (properties.required ? "*" : "") } </GridContainer>
				<GridContainer className="p-0 m-0"> 
					{group_inputs.length > 0 && group_inputs.map((field_obj, field_index) => this.renderInputField(field_obj.name, field_obj))}
				</GridContainer>
			</GridItem>
		);
	}
	
	renderInput(name, properties){
		if (properties.type === "group") {
			return this.renderInputGroup(name, properties);
		}
		else if (properties.type === "field") {
			return this.renderInputField(name, properties);
		}
	}

	render() {
		const { classes, className } = this.props;
		const rootClassName = classNames({
			[className]: className
		})
		return (
			<GridContainer className={ rootClassName }>
				{ Object.entries(this.state.blueprint).map(([name, properties], cursor) => this.renderInput(name, properties))}
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
