/** @format */

import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import authService from "services/auth";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import { baseUrls, environment } from "config";
import {withErrorHandler} from "hoc/ErrorHandler";
import { CountriesHelper } from "hoc/Helpers";
import {withGlobals} from "contexts/Globals";
import { Link } from "react-router-dom";
import {LocationInput } from "components/FormInputs";


import {
	TextInput,
	RadioInput,
	CheckboxInput,
	SelectInput,
	FileInput,
} from "components/FormInputs";

const styles = theme => ({
	root: {
		color: colors.hex.text,
	},
	wrapper: {
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing(),
	},
	loginContainer: {
		padding: "0",
		position: "relative",
	},
	margin: {
		margin: theme.spacing(),
	},
	inputAdornment: {
		color: colors.hex.gray,
	},
	submitBtnWrapper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing(),
	},
	submitBtn: {
		position: "relative",
		cursor: "pointer",
		//height: "56px",
		margin: "auto",
		willChange: "box-shadow, transform",
		transition:
			"box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		"& .material-icons": {
			color: colors.hex.inverse,
		},
	},
	btnSubmitting: {
		cursor: "not-allowed",
		height: "56px",
		backgroundColor: "transparent",
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
				", 0.2)",
		},
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
				", 0.2)",
		},
	},
	submitProgress: {
		color: colors.hex.accent,
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
	oauthWrapper: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(),
	},
});

class SignupForm extends React.Component {
	state = {
		form_values: {
			first_name: environment === "development" ? "Mutugi" : "",
			last_name: environment === "development" ? "Riungu" : "",
			email_address: environment === "development" ? "colrium@gmail.com" : "",
			phone: environment === "development" ? "0724145857" : "",
			password: environment === "development" ? "WI5HINd8" : "",
			repeat_password: environment === "development" ? "WI5HINd8" : "",
			job_title: environment === "development" ? "Developer" : "",
			company: environment === "development" ? "Realfield" : "",
			country: "US",
			region: "",
			role: "customer",
			user_id: "",
			cb: baseUrls[environment].base_url + "signup",
			account_verifacation_code: "",
			interest: "quote",
		},
		submitting: false,
		signupsuccess: false,
		signuperror: false,
		verifingAccount: false,
		alert: false,
	};
	constructor(props) {
		super(props);
		const { role } = props;
		if (role) {
			this.state.form_values.role = role;
		}
		this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
	}

	componentDidMount() {
		let uriQueries = (
			window.location.search.match(
				new RegExp("([^?=&]+)(=([^&]*))?", "g")
			) || []
		).reduce(function(result, each, n, every) {
			let [key, value] = each.split("=");
			result[key] = value;
			return result;
		}, {});

		console.log("uriQueries", uriQueries);
		if (
			("e" in uriQueries || "email" in uriQueries) &&
			("c" in uriQueries || "code" in uriQueries)
		) {
			let email = "e" in uriQueries ? uriQueries.e : uriQueries.email;
			let code = "c" in uriQueries ? uriQueries.c : uriQueries.code;
			this.setState(prevState => ({
				verifingAccount: true,
				form_values: {
					...prevState.form_values,
					email_address: email,
					account_verifacation_code: code,
					cb:""

				},				
			}));
		}
		else if (window) {}{
			this.setState(prevState => ({
				form_values: {
					...prevState.form_values,
					cb: window.location.href
				},				
			}));
		}
	}

	handleChange = name => value => {
		this.setState(prevState => ({ form_values: {...prevState.form_values, [name]: value } }));
	};


	handleVerifyAccount() {
		this.setState(state => ({ verifingAccount: !state.verifingAccount }));
	}

	handleSnackbarClose() {
		this.setState(state => ({
			alert: false,
			submitting: false,
			signupsuccess: false,
			signuperror: false,
		}));
	}

	async handleSignupSubmit(event) {
		event.preventDefault();
		//
		let that = this;

		if (this.state.verifingAccount) {
			let formData = {
				code: this.state.form_values.account_verifacation_code,
				email: this.state.form_values.email_address,
			};
			let response = await authService.verifyAccount(formData);
			if (response.err) {
				that.setState(state => ({
					submitting: false,
					signuperror: true,
					signupsuccess: false,
					verifingAccount: true,
					alert: response.err.msg,
				}));
			} else {
				that.setState(prevState => ({
					submitting: false,
					signuperror: false,
					signupsuccess: true,
					verifingAccount: false,
					form_values: {
						...prevState.form_values,
						cb: window? window.location.href : ""
					},
					alert: response.body.message,
				}));
			}
		} else {
			let formData = this.state.form_values;
			authService.signup(formData).then(response => {
				that.setState(state => ({
					verifingAccount: true,
					submitting: false,
					signuperror: false,
					signupsuccess: true,
					alert: response.body.message,
				}));
			}).catch(err => {
				that.setState(state => ({
					submitting: false,
					signuperror: true,
					signupsuccess: false,
					alert: err.msg,
				}));
			})
			
		}
	}

	render() {
		const { classes, services:{ users: usersService }, role, title } = this.props;
		const loginBtnClassname = classNames({
			[classes.submitBtn]: true,
			[classes.btnSubmitting]: this.state.btnSubmitting,
			[classes.signupSuccess]: this.state.signupsuccess,
			[classes.signupError]: this.state.signuperror,
		});
		const countries = CountriesHelper.names();
		const allCountries = CountriesHelper.allNames();
		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
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
				{/*<Typography
					className={"my-4"}
					color="default"
					center
					variant="h5"
				>
					{title? title : (this.state.verifingAccount ?  "Confirm Email Address" : "Create account")}
				</Typography>*/}
				<form
					style={{ width: "100%" }}
					noValidate={environment === "development"}
					onSubmit={this.handleSignupSubmit}
					autocomplete="off"
				>
					<GridContainer>
						{this.state.verifingAccount ? (
							<GridContainer className="p-0">
								<GridItem xs={12} sm={12} md={12}>
									<TextInput
										type="text"
										value={ this.state.form_values.account_verifacation_code }
										onChange={this.handleChange("account_verifacation_code")}
										variant="filled"
										label="Account verifacation code"
										margin="dense"
										disabled={ this.state.submitting }
										InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
										fullWidth										
										required
										validate
									/>
								</GridItem>
							</GridContainer>
						) : (
							<GridContainer className="p-0">
								

								{!role && <GridContainer className="p-0">
									<RadioInput
										label={"How would you like to work with us?"}
										defaultValue={this.state.form_values.role}
										onChange={this.handleChange("role")}										
										options={{customer: "I am a Customer", collector: "I want to be a collector" }}
										disabled={ this.state.submitting }
										required
										validate
									/>
								</GridContainer>}
								<GridContainer className="p-0">
									<GridItem xs={12} sm={12} md={6}  className="px-1 py-1">
										<TextInput
											type="text"
											defaultValue={this.state.form_values.first_name}
											onChange={this.handleChange("first_name")}											
											variant="filled"
											label="First Name"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
										/>
									</GridItem>
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="text"
											defaultValue={this.state.form_values.last_name}
											onChange={this.handleChange("last_name")}											
											variant="filled"
											label="Last Name"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
										/>
									</GridItem>
								</GridContainer>

								{role==="collector" && <GridContainer className="p-0">
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="email"
											defaultValue={ this.state.form_values.email_address }
											onChange={this.handleChange("email_address")}
											variant="filled"
											label="Email Address"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
											validator={async (value) => { 
												let exists = await usersService.getRecordsCount({ "email_address" : value }).then(res => {
													return res.body.data.count > 0;
												}).catch( err => {
													return false;
												});
												return exists? "This email is already registered!" : false;
											}}
										/>
										
									</GridItem>
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="phone"
											defaultValue={ this.state.form_values.phone }
											onChange={this.handleChange("phone")}
											variant="filled"
											label="Phone"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
										/>
									</GridItem>
								</GridContainer>}

								{role!=="collector" &&<GridContainer className="p-0">
									
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="email"
											defaultValue={ this.state.form_values.email_address }
											onChange={this.handleChange("email_address")}
											variant="filled"
											label="Email Address"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
											validator={async (value) => { 
												let exists = await usersService.getRecordsCount({ "email_address" : value }).then(res => {
													return res.body.data.count > 0;
												}).catch( err => {
													return false;
												});
												return exists? "This email is already registered!" : false;
											}}
										/>
									</GridItem>

									<GridItem xs={12} sm={12} md={6} className="flex flex-col justify-center px-1 py-1">
										<SelectInput
											type={"country"}
											label="Country"
											classes={{
												inputRoot: "inverse",
											}}
											options={CountriesHelper.allNames()}
											variant="filled"
											value={this.state.form_values.country}
											onChange={this.handleChange("country")}
											placeholder={"Select your Country"}
											disabled={ this.state.submitting }
											required
											validate
										/>
									</GridItem>
								</GridContainer>}

								{role==="collector" &&<GridContainer className="p-0">
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="password"
											defaultValue={ this.state.form_values.password }
											onChange={this.handleChange("password")}
											variant="filled"
											label="Password"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
										/>
										
									</GridItem>
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="password"
											defaultValue={ this.state.form_values.repeat_password }
											onChange={this.handleChange("repeat_password")}
											variant="filled"
											label="Repeat Password"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
											validator={(value) => { return value === this.state.password? false : "Passwords dont match" }}
										/>
									</GridItem>
								</GridContainer>}

								<GridContainer className="p-0">
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="text"
											defaultValue={ this.state.form_values.job_title }
											onChange={this.handleChange("job_title")}
											variant="filled"
											label="Job Title"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											fullWidth
											required
											validate
										/>
									</GridItem>
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<TextInput
											type="text"
											defaultValue={ this.state.form_values.company }
											onChange={this.handleChange("company")}
											variant="filled"
											label="Company"
											margin="dense"
											disabled={ this.state.submitting }
											InputProps={{ 
												classes : {
													input: "inverse",
												}
											}}
											classes={{
												inputRoot: "inverse",
											}}
											fullWidth
											required
											validate
										/>
									</GridItem>
								</GridContainer>

								{role==="collector" &&<GridContainer className="p-0">
									
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<LocationInput
											type="administrative_area_level_1"
											defaultValue={ this.state.form_values.region }
											onChange={this.handleChange("region")}
											variant="filled"
											label="Region"
											margin="dense"
											classes={{
												inputRoot: "inverse",
											}}
											disabled={ this.state.submitting }
											
											query={{
												componentRestrictions: !String.isEmpty(this.state.form_values.country)? { country: this.state.form_values.country.toLowerCase() } : {}
											}}
											fullWidth
											required
											validate
										/>
									</GridItem>

									<GridItem xs={12} sm={12} md={6} className="flex flex-col justify-center px-1 py-1">
										<LocationInput
											type={"country"}
											label="Country"
											classes={{
												inputRoot: "inverse",
											}}
											variant="filled"
											value={this.state.form_values.country}
											onChange={this.handleChange("country")}
											short_name
											placeholder={"Select your Country"}
											disabled={ this.state.submitting }
											validate
										/>
									</GridItem>
								</GridContainer>}

								{this.state.form_values.role === "customer" && <GridContainer className="p-0">
									
									<GridItem xs={12} sm={12} md={6} className="px-1 py-1">
										<RadioInput
											options={{
												quote: "Quote",
												demo: "Demo",
											}}
											defaultValue={ this.state.form_values.interest }
											onChange={this.handleChange("interest")}
											label="Interest"
											margin="dense"
											disabled={ this.state.submitting }
											fullWidth
											required
											validate
										/>
									</GridItem>
								</GridContainer>}

								
							</GridContainer>
						)}

						<GridContainer className="p-0 py-6">
							<GridItem
								xs={12}
								sm={12}
								md={12}
								className={classNames(classes.submitBtnWrapper)}
							>
								
								{!this.state.submitting && <Button
									color={"primary"}
									className={loginBtnClassname}
									type="submit"
									disabled={ this.state.submitting }
									loading={ this.state.submitting }
								>
									{this.state.verifingAccount ? "Confirm Email Address"  : "All Done "}
								</Button>}
								{this.state.submitting && (
									<GridContainer className={"p-0"}>
										<GridItem xs={12} className={"flex items-center justify-center"}>
											<CircularProgress
												size={24}
												className={"accent-text"}
											/>
										</GridItem>
										<GridItem xs={12} className={"p-0"}>
											<Typography
												className={"my-1"}
												color="accent"
												center
												variant="body2"
											>
												{"Submiting. Please Wait..."}
											</Typography>
										</GridItem>
											
									</GridContainer>
								)}
							</GridItem>
						</GridContainer>
					</GridContainer>
				</form>
				{/*!this.state.submitting && <GridContainer>
					<GridItem xs={12} className={"flex items-center justify-center"}>
						<Link to={"/login"} className="transparent">
							<Button color="default" simple>
								{"Back to Login"}
							</Button>
						</Link>
					</GridItem>											
				</GridContainer>*/}
			</div>
		);
	}
}

SignupForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withGlobals(withErrorHandler(withStyles(styles)(SignupForm)));
