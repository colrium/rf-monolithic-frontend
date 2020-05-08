/** @format */

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
// Externals
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { UtilitiesHelper } from "hoc/Helpers";
import withRoot from "hoc/withRoot";
import styles from "./styles";

function setNativeValue(element, value) {
	const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
	const prototype = Object.getPrototypeOf(element);
	const prototypeValueSetter = Object.getOwnPropertyDescriptor(
		prototype,
		"value"
	).set;

	if (valueSetter && valueSetter !== prototypeValueSetter) {
		prototypeValueSetter.call(element, value);
	} else {
		valueSetter.call(element, value);
	}
}

class TransferList extends React.Component {
	state = {
		value_options: {},
		value: [],
		checked_options: [],
		checked_value_options: [],
	};
	constructor(props) {
		super(props);
		const { value_options, value } = props;
		this.state.value_options = value_options;
		if (Array.isArray(value)) {
			this.state.value = value;
		} else if (typeof value === "string") {
			if (value.trim().startsWith("[") && value.trim().endsWith("]")) {
				this.state.value = JSON.parse(value);
			}
		}
		this.handleToggle = this.handleToggle.bind(this);
		this.handleSelectAll = this.handleSelectAll.bind(this);
		this.handleSelectChecked = this.handleSelectChecked.bind(this);
		this.handleUnSelectAll = this.handleUnSelectAll.bind(this);
		this.handleUnSelectChecked = this.handleUnSelectChecked.bind(this);
	}

	handleToggle = option => event => {
		if (this.state.value.indexOf(option) !== -1) {
			if (this.state.checked_value_options.includes(option)) {
				let checked_value_options = this.state.checked_value_options;
				checked_value_options.remove(
					checked_value_options.indexOf(option)
				);
				this.setState(state => ({
					checked_value_options: checked_value_options,
				}));
			} else {
				this.setState(state => ({
					checked_value_options: state.checked_value_options.concat([
						option,
					]),
				}));
			}
		} else {
			if (this.state.checked_options.includes(option)) {
				let checked_options = this.state.checked_options;
				checked_options.remove(checked_options.indexOf(option));
				this.setState(state => ({ checked_options: checked_options }));
			} else {
				this.setState(state => ({
					checked_options: state.checked_options.concat([option]),
				}));
			}
		}
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevState.value !== this.state.value) {
			this.triggerOnChangeEvent(this.state.value);
		}
	}

	triggerOnChangeEvent(newValue) {
		const e = new Event("input", { bubbles: true });
		const blur_event = new Event("blur", { bubbles: true });
		setNativeValue(this.inputElement, JSON.stringify(newValue));
		this.inputElement.dispatchEvent(e);
		this.inputElement.dispatchEvent(blur_event);
	}

	handleSelectChecked() {
		this.setState(state => ({
			value: state.value.concat(state.checked_options),
			checked_value_options: state.checked_value_options.concat(
				state.checked_options
			),
			checked_options: [],
		}));
	}

	handleUnSelectChecked() {
		this.setState(state => ({
			value: UtilitiesHelper.arrayDifference(
				state.value,
				state.checked_value_options
			),
			checked_options: state.checked_options.concat(
				state.checked_value_options
			),
			checked_value_options: [],
		}));
	}

	handleSelectAll() {
		const { value_options } = this.props;
		this.setState(state => ({
			value: Object.keys(value_options),
			checked_value_options: state.checked_value_options.concat(
				state.checked_options
			),
			checked_options: [],
		}));
	}

	handleUnSelectAll() {
		this.setState(state => ({
			value: [],
			checked_options: state.checked_options.concat(
				state.checked_value_options
			),
			checked_value_options: [],
		}));
	}

	optionsList(values, list_type = "non-value-options") {
		const { classes, name, value_options } = this.props;
		let input_name = name ? name : "nameless";
		return (
			<Paper
				className={classNames(classes.paper, classes.options_wrapper)}
			>
				<List dense component="div" role="list">
					{values.map(value_entry => {
						const labelId = `${input_name}-${value_entry}-label`;

						return (
							<ListItem
								key={value_entry}
								role="listitem"
								button
								onClick={this.handleToggle(value_entry)}
							>
								<ListItemIcon>
									<Checkbox
										checked={
											(list_type ===
												"non-value-options" &&
												this.state.checked_options.includes(
													value_entry
												)) ||
											(list_type === "value-options" &&
												this.state.checked_value_options.includes(
													value_entry
												))
										}
										tabIndex={-1}
										inputProps={{
											"aria-labelledby": labelId,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									id={labelId}
									primary={value_options[value_entry]}
								/>
							</ListItem>
						);
					})}
					<ListItem />
				</List>
			</Paper>
		);
	}

	render() {
		const {
			classes,
			className,
			value_options,
			meta,
			value,
			...rest
		} = this.props;

		return (
			<Grid container className={classes.root}>
				<Grid item className={classes.options_wrapper}>
					{this.optionsList(
						UtilitiesHelper.arrayDifference(
							Object.keys(value_options),
							this.state.value
						),
						"non-value-options"
					)}
				</Grid>
				<Grid item className={classes.actions_wrapper}>
					<Grid container direction="column" alignItems="center">
						<Button
							variant="outlined"
							size="small"
							className={classes.button}
							onClick={this.handleSelectAll}
							disabled={
								Object.keys(value_options).length ===
								this.state.value.length
							}
							aria-label="move all right"
						>
							≫
						</Button>
						<Button
							variant="outlined"
							size="small"
							className={classes.button}
							onClick={this.handleSelectChecked}
							disabled={this.state.checked_options.length === 0}
							aria-label="move selected right"
						>
							&gt;
						</Button>
						<Button
							variant="outlined"
							size="small"
							className={classes.button}
							onClick={this.handleUnSelectChecked}
							disabled={
								this.state.checked_value_options.length === 0
							}
							aria-label="unselect selected values"
						>
							&lt;
						</Button>
						<Button
							variant="outlined"
							size="small"
							className={classes.button}
							onClick={this.handleUnSelectAll}
							disabled={this.state.value.length === 0}
							aria-label="move all left"
						>
							≪
						</Button>
						<input
							className={classes.input}
							type="text"
							value={JSON.stringify(this.state.value)}
							ref={input => (this.inputElement = input)}
							{...rest}
						/>
					</Grid>
				</Grid>
				<Grid item className={classes.options_wrapper}>
					{this.optionsList(this.state.value, "value-options")}
				</Grid>
			</Grid>
		);
	}
}

TransferList.defaultProps = {
	value_options: {},
};

TransferList.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	value_options: PropTypes.object,
};

export default withRoot(withStyles(styles)(TransferList));
