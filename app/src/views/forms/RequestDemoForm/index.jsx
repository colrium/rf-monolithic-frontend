/** @format */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";


import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import SnackbarContent from "components/Snackbar/SnackbarContent";


import ApiService from "services/Api";

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
		ApiService.post("/demo-requests", formData).then(response => {
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
			color,
			inputVariant,
			fullWidth,
			disabled,
			className,
			...rest
		} = this.props;

		return (
			<div>
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
					{...rest}
				>
					<GridContainer className={"p-0"}>
						<GridItem
							xs={12}
							sm={12}
							md={12}
							className={"p-0"}
						>
							<TextField
								id="request-demo-email"
								type="email"
								value={this.state.email}
								onChange={this.handleChange("email")}
								variant={inputVariant}
								label="Your email"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											{" "}
											{this.state.submitting ? (
												<CircularProgress
													size={32}
													color="inherit"
												/>
											) : (
												<IconButton
													aria-label="Submit"
													color="inherit"
													type="submit"
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

export default (RequestDemoForm);
