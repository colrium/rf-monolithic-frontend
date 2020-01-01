import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import authService from "services/auth";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import { baseUrls, environment } from "config";


import { CountriesHelper } from "utils/Helpers";
import withRoot from "utils/withRoot";

const styles = theme => ({
	root: {
		zIndex: "12",
		color: colors.hex.text,
		position: "relative",
		paddingTop: "80px",
		minHeight: "100vh"
	},
	wrapper: {
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing()
	},
	loginContainer: {
		padding: "0",
		position: "relative"
	},
	margin: {
		margin: theme.spacing()
	},
	textField: {
		flexBasis: 200
	},
	inputAdornment: {
		color: colors.hex.gray
	},
	submitBtnWrapper: {
		display: "flex",
		alignItems: "center",
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing()
	},
	submitBtn: {
		position: "relative",
		cursor: "pointer",
		height: "56px",
		margin: "auto",
		willChange: "box-shadow, transform",
		transition:
			"box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		"& .material-icons": {
			color: colors.hex.inverse
		}
	},
	btnSubmitting: {
		cursor: "not-allowed",
		height: "56px",
		backgroundColor: "transparent"
	},
	signupSuccess: {
		cursor: "pointer",
		backgroundColor: colors.hex.success,
		boxShadow:
			"0 2px 2px 0 rgba(" +
			colors.rgb.success +
			", 0.14), 0 3px 1px -2px rgba(" +
			colors.rgb.success +
			", 0.2), 0 1px 5px 0 rgba(" +
			colors.hex.success +
			", 0.12)",
		"&:hover,&:focus": {
			backgroundColor: colors.hex.success,
			boxShadow:
				"0 14px 26px -12px rgba(" +
				colors.rgb.success +
				", 0.42), 0 4px 23px 0px rgba(" +
				colors.rgb.text +
				", 0.12), 0 8px 10px -5px rgba(" +
				colors.hex.success +
				", 0.2)"
		}
	},
	signupError: {
		cursor: "pointer",
		backgroundColor: colors.hex.error,
		boxShadow:
			"0 2px 2px 0 rgba(" +
			colors.rgb.error +
			", 0.14), 0 3px 1px -2px rgba(" +
			colors.rgb.error +
			", 0.2), 0 1px 5px 0 rgba(" +
			colors.rgb.error +
			", 0.12)",
		"&:hover,&:focus": {
			backgroundColor: colors.hex.error,
			boxShadow:
				"0 14px 26px -12px rgba(" +
				colors.rgb.error +
				", 0.42), 0 4px 23px 0px rgba(" +
				colors.rgb.text +
				", 0.12), 0 8px 10px -5px rgba(" +
				colors.rgb.error +
				", 0.2)"
		}
	},
	submitProgress: {
		color: colors.hex.accent,
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -18,
		marginLeft: -18
	},
	oauthWrapper: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		padding: theme.spacing()
	}
});

class SignupForm extends React.Component {
	state = {
		first_name: environment === "development" ? "Mutugi" : "",
		last_name: environment === "development" ? "Riungu" : "",
		email_address: environment === "development" ? "colrium@gmail.com" : "",
		phone: environment === "development" ? "0724145857" : "",
		password: environment === "development" ? "WI5HINd8" : "",
		repeat_password: environment === "development" ? "WI5HINd8" : "",
		job_title: environment === "development" ? "Developer" : "",
		company: environment === "development" ? "Realfield" : "",
		country: "",
		region: "",
		acc_type: "customer",
		user_id: "",
		cb: baseUrls[environment].base_url + "signup",
		account_verifacation_code: "",
		showPassword: false,
		showRepeatPassword: false,
		submitting: false,
		signupsuccess: false,
		signuperror: false,
		verifingAccount: false,
		alert: false
	};
	constructor(props) {
		super(props);
		this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
		this.handleClickShowRepeatPassword = this.handleClickShowRepeatPassword.bind(
			this
		);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
	}

	componentDidMount() {
		let uriQueries = (
			window.location.search.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) ||
			[]
		).reduce(function(result, each, n, every) {
			let [key, value] = each.split("=");
			result[key] = value;
			return result;
		}, {});
		if (
			("e" in uriQueries || "email" in uriQueries) &&
			("c" in uriQueries || "code" in uriQueries)
		) {
			let email = "e" in uriQueries ? uriQueries.e : uriQueries.email;
			let code = "c" in uriQueries ? uriQueries.c : uriQueries.code;
			this.setState({
				verifingAccount: true,
				email_address: email,
				account_verifacation_code: code
			});
		}
	}

	handleChange = name => event => {
		this.setState({ [name]: event.target.value });
	};

	handleClickShowPassword() {
		this.setState(state => ({ showPassword: !state.showPassword }));
	}

	handleClickShowRepeatPassword() {
		this.setState(state => ({ showRepeatPassword: !state.showRepeatPassword }));
	}

	handleVerifyAccount() {
		this.setState(state => ({ verifingAccount: !state.verifingAccount }));
	}

	handleSnackbarClose() {
		this.setState(state => ({
			alert: false,
			submitting: false,
			signupsuccess: false,
			signuperror: false
		}));
	}

	async handleSignupSubmit(event) {
		event.preventDefault();
		//
		let that = this;

		if (this.state.verifingAccount) {
			let formData = {
				code: this.state.account_verifacation_code,
				email: this.state.email_address
			};
			let response = await authService.verifyAccount(formData);
			if (response.err) {
				that.setState(state => ({
					submitting: false,
					signuperror: true,
					signupsuccess: false,
					alert: response.err.msg
				}));
			} else {
				that.setState(state => ({
					submitting: false,
					signuperror: false,
					signupsuccess: true,
					alert: response.body.message
				}));
			}
		} else {
			let formData = this.state;
			let response = await authService.signup(formData);
			if (response.err) {
				that.setState(state => ({
					submitting: false,
					signuperror: true,
					signupsuccess: false,
					alert: response.err.msg
				}));
			} else {
				that.setState(state => ({
					verifingAccount: true,
					submitting: false,
					signuperror: false,
					signupsuccess: true,
					alert: response.body.message
				}));
			}
		}
	}

	render() {
		const { classes } = this.props;
		const loginBtnClassname = classNames({
			[classes.submitBtn]: true,
			[classes.btnSubmitting]: this.state.btnSubmitting,
			[classes.signupSuccess]: this.state.signupsuccess,
			[classes.signupError]: this.state.signuperror
		});
		const countries = CountriesHelper.names();
		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					open={this.state.alert ? true : false}
					autoHideDuration={this.state.signuperror ? null : 6000}
					onClose={this.handleSnackbarClose}
				>
					<SnackbarContent
						onClose={this.handleSnackbarClose}
						color={
							this.state.signuperror
								? "error"
								: this.state.signupsuccess
								? "success"
								: "inverse"
						}
						message={
							<span>
								<b>
									{this.state.signuperror
										? ""
										: this.state.signupsuccess
										? ""
										: ""}
								</b>{" "}
								{this.state.alert}
							</span>
						}
					/>
				</Snackbar>
				<form
					style={{ width: "100%" }}
					noValidate={environment === "development"}
					onSubmit={this.handleSignupSubmit}
				>
					<GridContainer>
						{this.state.verifingAccount ? (
							<GridContainer>
								<GridItem xs={12} sm={12} md={12}>
									<TextField
										type="text"
										value={this.state.account_verifacation_code}
										onChange={this.handleChange("account_verifacation_code")}
										className={classNames(classes.textField)}
										variant="filled"
										label="Account verifacation code"
										margin="normal"
										fullWidth
										required
									/>
								</GridItem>
							</GridContainer>
						) : (
							<GridContainer spacing={40}>
								<GridContainer>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type="text"
											value={this.state.first_name}
											onChange={this.handleChange("first_name")}
											className={classNames(classes.textField)}
											variant="filled"
											label="First Name"
											margin="normal"
											fullWidth
											required
										/>
									</GridItem>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type="text"
											value={this.state.last_name}
											onChange={this.handleChange("last_name")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Last Name"
											margin="normal"
											fullWidth
											required
										/>
									</GridItem>
								</GridContainer>

								<GridContainer>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type="email"
											value={this.state.email_address}
											onChange={this.handleChange("email_address")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Email"
											margin="normal"
											fullWidth
											required
										/>
									</GridItem>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type="phone"
											value={this.state.phone}
											onChange={this.handleChange("phone")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Phone"
											margin="normal"
											fullWidth
											required
										/>
									</GridItem>
								</GridContainer>

								<GridContainer>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type={this.state.showPassword ? "text" : "password"}
											value={this.state.password}
											onChange={this.handleChange("password")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Password"
											margin="normal"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{" "}
														<IconButton
															aria-label="Toggle password visibility"
															onClick={this.handleClickShowPassword}
														>
															{" "}
															{this.state.showPassword ? (
																<Icon>visibility</Icon>
															) : (
																<Icon>visibility_off</Icon>
															)}{" "}
														</IconButton>{" "}
													</InputAdornment>
												)
											}}
											fullWidth
											required
										/>
									</GridItem>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type={this.state.showRepeatPassword ? "text" : "password"}
											value={this.state.repeat_password}
											onChange={this.handleChange("repeat_password")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Confirm Password"
											margin="normal"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{" "}
														<IconButton
															aria-label="Toggle password visibility"
															onClick={this.handleClickShowRepeatPassword}
														>
															{" "}
															{this.state.showRepeatPassword ? (
																<Icon>visibility</Icon>
															) : (
																<Icon>visibility_off</Icon>
															)}{" "}
														</IconButton>{" "}
													</InputAdornment>
												)
											}}
											fullWidth
											required
										/>
									</GridItem>
								</GridContainer>

								<GridContainer>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type="text"
											value={this.state.job_title}
											onChange={this.handleChange("job_title")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Job title"
											margin="normal"
											fullWidth
										/>
									</GridItem>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type="text"
											value={this.state.company}
											onChange={this.handleChange("company")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Company"
											margin="normal"
											fullWidth
										/>
									</GridItem>
								</GridContainer>

								<GridContainer>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											select
											label="Project country"
											className={classes.textField}
											value={this.state.country}
											onChange={this.handleChange("country")}
											SelectProps={{
												MenuProps: {
													className: classes.menu
												}
											}}
											margin="normal"
											variant="filled"
											fullWidth
											required
										>
											{Object.keys(countries).map((keyName, i) => (
												<MenuItem key={keyName} value={keyName}>
													{countries[keyName]}
												</MenuItem>
											))}
										</TextField>
									</GridItem>
									<GridItem xs={12} sm={12} md={6}>
										<TextField
											type="text"
											value={this.state.region}
											onChange={this.handleChange("region")}
											className={classNames(classes.textField)}
											variant="filled"
											label="Project region"
											margin="normal"
											fullWidth
											required
										/>
									</GridItem>
								</GridContainer>

								<GridContainer>
									<GridItem xs={12} sm={12} md={12}>
										<Typography bold variant="body1">
											How would you like to work with us?
										</Typography>
									</GridItem>
								</GridContainer>

								<GridContainer>
									<RadioGroup
										aria-label="Account type"
										name="acc_type"
										value={this.state.acc_type}
										onChange={this.handleChange("acc_type")}
										row
									>
										<FormControlLabel
											value="customer"
											control={<Radio color="primary" />}
											label="I AM A CUSTOMER"
											labelPlacement="end"
										/>

										<FormControlLabel
											value="collector"
											control={<Radio color="primary" />}
											label="I WANT TO BE A COLLECTOR"
											labelPlacement="end"
										/>
									</RadioGroup>
								</GridContainer>
							</GridContainer>
						)}

						<GridContainer spacing={40}>
							<GridItem
								xs={12}
								sm={12}
								md={12}
								className={classNames(classes.submitBtnWrapper)}
							>
								<Button
									variant="contained"
									color={this.state.submitting ? "inverse" : "accent"}
									className={loginBtnClassname}
									type="submit"
									outlined={this.state.submitting}
								>
									{this.state.signupsuccess ? (
										<Icon>done</Icon>
									) : this.state.signuperror ? (
										this.state.alert
									) : this.state.submitting ? (
										""
									) : this.state.verifingAccount ? (
										"Verify Account"
									) : (
										"ok! ready to finish up "
									)}
								</Button>
								{this.state.submitting && (
									<CircularProgress
										size={36}
										className={classes.submitProgress}
									/>
								)}
							</GridItem>
						</GridContainer>
					</GridContainer>
				</form>
			</div>
		);
	}
}

SignupForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(SignupForm));
