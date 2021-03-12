/** @format */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import {withErrorHandler} from "hoc/ErrorHandler";

import { demorequests as service } from "services";

import { colors } from "assets/jss/app-theme.jsx";

const styles = theme => ({
	root: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		backgroundColor: "transparent",
		width: "100%",
		padding: "0",
		margin: "0",
		marginTop: theme.spacing(),
		marginBottom: theme.spacing(),
	},
	paddless: {
		padding: "0",
	},
	default: {
		color: colors.hex.text,
		"&:after": {
			borderBottomColor: colors.hex.text,
		},
	},
	primary: {
		color: colors.hex.primary,
		"&:after": {
			borderBottomColor: colors.hex.primary,
		},
	},
	primarydark: {
		color: colors.hex.primarydark,
		"&:after": {
			borderBottomColor: colors.hex.primarydark,
		},
	},
	secondary: {
		color: colors.hex.secondary,
		"&:after": {
			borderBottomColor: colors.hex.secondary,
		},
	},
	accent: {
		color: colors.hex.accent,
		"&:after": {
			borderBottomColor: colors.hex.accent,
		},
	},
	inverse: {
		color: colors.hex.inverse,
		"&:after": {
			borderBottomColor: colors.hex.inverse,
		},
	},
	error: {
		color: colors.hex.error,
		"&:after": {
			borderBottomColor: colors.hex.error,
		},
	},
	info: {
		color: colors.hex.info,
		"&:after": {
			borderBottomColor: colors.hex.info,
		},
	},
	success: {
		color: colors.hex.success,
		"&:after": {
			borderBottomColor: colors.hex.success,
		},
	},
	warning: {
		color: colors.hex.warning,
		"&:after": {
			borderBottomColor: colors.hex.warning,
		},
	},
	emailInput: {
		backgroundColor: "transparent",
	},
	submitBtn: {
		position: "relative",
		backgroundColor: "transparent",
	},
	submitProgress: {
		position: "realtive",
	},
	submitting: {
		cursor: "not-allowed",
		backgroundColor: "transparent",
	},
	submitSuccess: {
		cursor: "pointer",
		color: colors.hex.success,
	},
	submitError: {
		cursor: "pointer",
		color: colors.hex.error,
	},
});

class RequestDemoForm extends React.Component {
	state = {
		email: "",
		submitting: false,
		submitsuccess: false,
		submiterror: false,
		alert: false,
	};
	constructor() {
		super();
		this.handleDemoRequestSubmit = this.handleDemoRequestSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
			submiterror: false,
			submitsuccess: false,
			submitting: false,
			alert: false,
		});
	};

	handleSnackbarClose() {
		this.setState(state => ({
			alert: false,
			submitting: false,
			submitsuccess: false,
			submiterror: false,
		}));
	}

	handleDemoRequestSubmit(event) {
		//
		event.preventDefault();
		//
		this.setState(state => ({
			submiterror: false,
			submitsuccess: false,
			submitting: true,
			alert: false,
		}));

		let formData = {
			requesting_email: this.state.email,
		};
		let that = this;
		service
			.create(formData)
			.then(response => {
				that.setState(state => ({
					submitting: false,
					submiterror: false,
					submitsuccess: true,
					alert:
						"Thankyou for your interest in working with us. We will get back to you as soon as possible.",
				}));
			})
			.catch(e => {
				that.setState(state => ({
					submitting: false,
					submiterror: true,
					submitsuccess: false,
					alert: e.msg,
				}));
			});
	}

	render() {
		const {
			classes,
			color,
			inputVariant,
			fullWidth,
			disabled,
			className,
			...rest
		} = this.props;

		const formClasses = classNames({
			[classes.root]: true,
			[className]: className,
		});

		const inputClasses = classNames({
			[classes.emailInput]: true,
			[classes[color]]: color,
		});

		const submitBtnClasses = classNames({
			[classes.submitBtn]: true,
			[classes[color]]: color,
		});

		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					open={this.state.alert ? true : false}
					autoHideDuration={this.state.submiterror ? null : 6000}
					onClose={this.handleSnackbarClose}
				>
					<SnackbarContent
						onClose={this.handleSnackbarClose}
						color={
							this.state.submiterror
								? "error"
								: this.state.submitsuccess
								? "success"
								: "inverse"
						}
						message={
							<span>
								<b>
									{this.state.submiterror
										? ""
										: this.state.submitsuccess
										? ""
										: ""}
								</b>{" "}
								{this.state.alert}
							</span>
						}
					/>
				</Snackbar>
				<form
					noValidate
					ref="demoRequestForm"
					className={formClasses}
					onSubmit={this.handleDemoRequestSubmit}
					{...rest}
				>
					<GridContainer className={classes.paddless}>
						<GridItem
							xs={12}
							sm={12}
							md={12}
							className={classes.paddless}
						>
							<TextField
								id="request-demo-email"
								type="email"
								value={this.state.email}
								onChange={this.handleChange("email")}
								className={inputClasses}
								variant={inputVariant}
								label="Your email"
								InputLabelProps={{
									classes: {
										root: classes[color],
										focused: classes[color],
									},
								}}
								InputProps={{
									classes: {
										root: classes[color],
										focused: classes[color],
									},
									endAdornment: (
										<InputAdornment position="end">
											{" "}
											{this.state.submitting ? (
												<CircularProgress
													size={32}
													className={
														classes.submitProgress
													}
													color="inherit"
												/>
											) : (
												<IconButton
													aria-label="Submit"
													color="inherit"
													type="submit"
													className={submitBtnClasses}
												>
													{" "}
													{this.state
														.submitsuccess ? (
														<Icon>error</Icon>
													) : this.state
															.submiterror ? (
														<Icon>error</Icon>
													) : (
														<Icon>
															arrow_forward
														</Icon>
													)}{" "}
												</IconButton>
											)}{" "}
										</InputAdornment>
									),
								}}
								fullWidth={fullWidth}
								error={this.state.submiterror}
								disabled={this.state.submitting || disabled}
								helperText={
									this.state.submiterror && this.state.alert
										? this.state.alert
										: ""
								}
								required
							/>
						</GridItem>
					</GridContainer>
				</form>
			</div>
		);
	}
}
RequestDemoForm.defaultProps = {
	color: "primary",
	inputVariant: "filled",
	fullWidth: true,
};
RequestDemoForm.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	color: PropTypes.oneOf([
		"default",
		"primary",
		"primarydark",
		"secondary",
		"accent",
		"inverse",
		"error",
		"info",
		"success",
		"warning",
	]),
	inputVariant: PropTypes.oneOf(["standard", "outlined", "filled"]),
	fullWidth: PropTypes.bool,
	disabled: PropTypes.bool,
};

export default withErrorHandler(withStyles(styles)(RequestDemoForm));
