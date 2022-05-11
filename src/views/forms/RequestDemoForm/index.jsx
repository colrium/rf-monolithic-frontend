/** @format */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";


import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress";
import compose from "recompose/compose"
import Grid from '@mui/material/Grid';
;
import SnackbarContent from "components/Snackbar/SnackbarContent";


import ApiService from "services/Api";

import { withNetworkServices, withNotificationsQueue } from "contexts";


class RequestDemoForm extends React.Component {
	state = {
		email: "",
		submitting: false,
		submitsuccess: false,
		submiterror: false,
		alert: false,
	}
	constructor(props) {
		super(props)
		this.handleDemoRequestSubmit = this.handleDemoRequestSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
			submiterror: false,
			submitsuccess: false,
			submitting: false,
			alert: false,
		})
	}

	handleSnackbarClose() {
		this.setState(state => ({
			alert: false,
			submitting: false,
			submitsuccess: false,
			submiterror: false,
		}))
	}

	handleDemoRequestSubmit(event) {
		//
		const {
			notificationsQueue: { queueNotification },
			networkServices: {Api},
		} = this.props
		event.preventDefault()
		//
		this.setState(state => ({
			submiterror: false,
			submitsuccess: false,
			submitting: true,
			alert: false,
		}))

		let formData = {
			requesting_email: this.state.email,
		}
		Api.post("/demo-requests", formData)
			.then(response => {
				this.setState(state => ({
					submitting: false,
					submiterror: false,
					submitsuccess: true,
				}))
				queueNotification({
					severity: "success",
					content:
						"Demo request placed. Thankyou for your interest in working with us. We will get back to you as soon as possible.",
				})
			})
			.catch(e => {
				this.setState(state => ({
					submitting: false,
					submiterror: true,
					submitsuccess: false,
				}))
				queueNotification({
					severity: "error",
					title: "",
					content: `Demo request placement failed. ${e?.msg || "Something went wrong"}`,
				})
			})
	}

	render() {
		const { inputVariant, fullWidth, disabled, className, ...rest } = this.props
		return (
			<Box component={"form"} noValidate ref="demoRequestForm" onSubmit={this.handleDemoRequestSubmit} {...rest}>
				<Grid container className={"p-0"}>
					<Grid item  xs={12} sm={12} md={12} className={"p-0"}>
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
											<CircularProgress size={32} color="inherit" />
										) : (
											<IconButton aria-label="Submit" color="inherit" type="submit">
												<Icon>arrow_forward</Icon>
											</IconButton>
										)}{" "}
									</InputAdornment>
								),
							}}
							fullWidth={fullWidth}
							error={this.state.submiterror}
							disabled={this.state.submitting || disabled}
							helperText={this.state.submiterror && this.state.alert ? this.state.alert : ""}
							required
						/>
					</Grid>
				</Grid>
			</Box>
		)
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

export default compose(withNotificationsQueue, withNetworkServices)(RequestDemoForm)
