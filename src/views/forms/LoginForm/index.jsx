/** @format */

import React from "react";
import Cookies from "universal-cookie";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Typography from "components/Typography";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from 'react-router'
import compose from "recompose/compose";
//
import { login } from "state/actions/auth";

import { authTokenLocation, authTokenName, baseUrls, environment } from "config";
import ApiService from "services/backend";
import {withErrorHandler} from "hoc/ErrorHandler";
import { TextInput, CheckboxInput } from "components/FormInputs";
import OAuth from "./components/OAuth";



const styles = theme => ({
	root: {
		position: "relative",
		display: "inline-block",
		margin: theme.spacing(),
		marginBottom: theme.spacing(5)
	},
	wrapper: {
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing()
	},
	loginContainer: {
		position: "relative",
		padding: "0"
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
	inputContainer: {
		position: "relative",
		marginTop: theme.spacing()
	},
	submitBtnWrapper: {
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing(),
		marginTop: theme.spacing(4),
		height: "auto"
	},
	loginSubmitBtn: {
		"&:disabled": {
			backgroundColor: colors.hex.accent,
		}
	},
	loginSubmitting: {
		cursor: "not-allowed",
		height: "56px",
	},
	loginSuccess: {
		cursor: "pointer",
		backgroundColor: colors.hex.success,
		boxShadow:
			"0 2px 2px 0 rgba(" +
			colors.rgb.success +
			", 0.14), 0 3px 1px -2px rgba(" +
			colors.rgb.success +
			", 0.2), 0 1px 5px 0 rgba(" +
			colors.rgb.success +
			", 0.12)",
		"&:hover,&:focus": {
			backgroundColor: colors.hex.success,
			boxShadow:
				"0 14px 26px -12px rgba(" +
				colors.rgb.success +
				", 0.42), 0 4px 23px 0px rgba(" +
				colors.rgb.default +
				", 0.12), 0 8px 10px -5px rgba(" +
				colors.rgb.success +
				", 0.2)"
		}
	},
	loginError: {
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
				colors.rgb.default +
				", 0.12), 0 8px 10px -5px rgba(" +
				colors.rgb.error +
				", 0.2)"
		}
	},
	buttonProgress: {
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: "-18px",
		marginLeft: "-18px",
		color: colors.hex.accent
	},
	oauthWrapper: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		padding: theme.spacing()
	},
	forgotPasswordBtn: {
		position: "relative",
		color: colors.hex.default
	},
	oauthBtnWrapper: {
		position: "relative"
	},
	oauthBtn: {
		"& img": {
			height: "1.3rem",
			width: "1.3rem",
			marginRight: "1rem"
		}
	}
});



class LoginForm extends React.Component {
	state = {
		email: environment==="development" ? "colrium@gmail.com" : "",
		password: environment==="development" ? "WI5HINd8" : "",
		reset_code: "",
		"repeat-password": "",
		forgotPassword: false,
		resettingPassword: false,
		resettingPasswordWithUrl: false,
		showPassword: false,
		rememberMe: false,
		showRepeatPassword: false,
		submitting: false,
		loginsuccess: false,
		loginerror: false,
		alert: false,
		user: null
	};
	constructor(props) {
		super(props);
		const { auth, history } = props;
		this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
		this.handleOnOAuthSuccess = this.handleOnOAuthSuccess.bind(this);
		this.onClickForgotPassword = this.onClickForgotPassword.bind(this);
		this.onClickResetPassword = this.onClickResetPassword.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
		this.handleClickShowRepeatPassword = this.handleClickShowRepeatPassword.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
		this.handleClickRememberMe = this.handleClickRememberMe.bind(this);
		this.handleOnUserLogin = this.handleOnUserLogin.bind(this);
	}

	componentDidMount() {
		const { auth } = this.props;
		
		if (ApiService.isUserAuthenticated(true)) {
			this.handleOnUserLogin({user: auth.user});
		}
		else {
			let uriQueries = (window.location.search.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []).reduce(function(result, each, n, every) {
				let [key, value] = each.split("=");
				result[key] = value;
				return result;
			}, {});
			if (("c" in uriQueries || "code" in uriQueries) && ("e" in uriQueries || "email" in uriQueries)) {
                let reset_code = "c" in uriQueries ? uriQueries.c : uriQueries.code;
                let email = "e" in uriQueries ? uriQueries.e : uriQueries.email;
                if (!String.isEmpty(reset_code) && !String.isEmpty(email)) {
					this.setState(prevState => ({
						forgotPassword: false,
						resettingPassword: true,
						resettingPasswordWithUrl: true,
						reset_code: reset_code,	
						email: email,				
					}));
				}
				else {
					this.setState(prevState => ({
						forgotPassword: false,
						resettingPassword: true,
						resettingPasswordWithUrl: false,
						reset_code: reset_code,	
						email: email,				
					}));
				}
            }
		}	
	}

	handleChange = name => value => {
		this.setState({ [name]: value });
	};

	

	

	handleOnUserLogin(data) {
		const { onLogin } = this.props;
		const {profile, access_token} = data;
					
		
		
		if (typeof onLogin === "function") {
			onLogin(profile);
		}
	}
	handleOnOAuthSuccess(data) {
		const { onLogin } = this.props;		
		const {profile, access_token} = data;
		//dispatch mapped action
				
		if (typeof onLogin === "function") {
			onLogin(profile);
		}		
	}

	onClickForgotPassword() {
		this.setState(state => ({ forgotPassword: !state.forgotPassword, resettingPassword: state.resettingPassword? false : false }));
	}

	onClickResetPassword() {
		this.setState(state => ({ resettingPassword: !state.resettingPassword }));
	}

	handleClickShowPassword() {
		this.setState(state => ({ showPassword: !state.showPassword }));
	}

	handleClickRememberMe(rememberMe) {
		this.setState(state => ({ rememberMe: rememberMe }));
	}

	handleClickShowRepeatPassword() {
		this.setState(state => ({ showRepeatPassword: !state.showRepeatPassword }));
	}

	handleSnackbarClose() {
		if (this.state.loginsuccess) {
			this.setState(state => ({
				alert: false,
				submitting: false,
				loginsuccess: false,
				loginerror: false
			}));
		} else {
			this.setState(state => ({
				alert: false,
				submitting: false,
				loginsuccess: false,
				loginerror: false
			}));
		}
	}

	async handleLoginSubmit(event) {
		const { login, onLogin, history } = this.props;
		//
		event.preventDefault();
		//
		this.setState(state => ({
			loginerror: false,
			loginsuccess: false,
			submitting: true,
			alert: false
		}));

		if (this.state.forgotPassword) {
			let formData = {
				email: this.state.email,
				cb: window.location.href,
			};
			await ApiService.forgotPassword(formData).then((res) => {
					this.setState(state => ({
						submitting: false,
						loginerror: false,
						loginsuccess: true,
						alert: "An email has been sent to your email with password reset resources",
						resettingPassword: true,
						forgotPassword: false,

					}));
			}).catch(err => {
					this.setState(state => ({
						submitting: false,
						loginerror: true,
						loginsuccess: false,
						alert: err.msg
					}));
			});
			
		} else if (this.state.resettingPassword) {
			let formData = {
				code: this.state.reset_code,
				email: this.state.email,
				"password": this.state.password,
				"repeat-password": this.state["repeat-password"]
			};
			ApiService.resetPassword(formData).then((res) => {
					this.setState(state => ({
						submitting: false,
						loginerror: false,
						loginsuccess: true,
						alert: "Your password has been reset successfully",
						resettingPassword: false,
						resettingPasswordWithUrl: false,
						forgotPassword: false,
					}));
					if (history) {
						history.push(history.location.pathname);
					}

			}).catch(err => {
                this.setState(state => ({
                    submitting: false,
                    loginerror: true,
                    loginsuccess: false,
                    alert: err.msg
                }));
            });
			
		} else {
			let formData = {
				username: this.state.email,
				password: this.state.password
			};
			login(formData).then(({access_token, user}) => {
				this.setState(state => ({
					submitting: false,
					loginerror: false,
					loginsuccess: true,
					alert: "Login successful. Redirecting"
				}));
				this.handleOnUserLogin({access_token: access_token, user: user});
			}).catch(err => {
                this.setState(state => ({
                    submitting: false,
                    loginerror: true,
                    loginsuccess: false,
                    alert: err.msg
                }));
            });
		}
	}

	render() {
		const { classes, app:{settings: { auth: OAuth2_enabled }} } = this.props;
		const loginBtnClassname = classNames({
			[classes.loginSubmitBtn]: true,
			[classes.loginSubmitting]: this.state.loginSubmitting,
			[classes.loginSuccess]: this.state.loginsuccess,
			[classes.loginError]: this.state.loginerror
		});
		console.log("ApiService.isUserAuthenticated(true)", ApiService.isUserAuthenticated(true));
		return (
			<div className={classes.root}>
				<GridContainer className="p-0">
					<form
						className={classes.loginContainer}
						onSubmit={this.handleLoginSubmit}
						autoComplete={this.state.resettingPassword? "off" : "on"}
					>
						<GridContainer className={classes.loginContainer}>
							{(!this.state.resettingPassword && (this.state.resettingPassword || !this.state.resettingPasswordWithUrl)) && (
									<GridItem
										xs={12}
										sm={12}
										md={12}
										className={classes.inputContainer}
									>
										<TextInput
											id="login-email"
											type="email"
											value={this.state.email}
											onChange={this.handleChange("email")}
											label="Email"
											variant="filled"
											InputProps={{ 
												classes : {
													input: "inverse",
													adornedEnd: "inverse",
												}
											}}
											required 
											validate
											fullWidth
											disabled={this.state.submitting}
										/>
									</GridItem>
							)}
							{(this.state.resettingPassword && !this.state.resettingPasswordWithUrl) && <GridItem
									xs={12}
									sm={12}
									md={12}
									className={classes.inputContainer}
								>
									<TextInput
										id="reset-code"
										type="text"
										variant="filled"
										value={this.state.reset_code}
										onChange={this.handleChange("reset_code")}
										label="Password Reset Code"
										InputProps={{ 
												classes : {
													input: "inverse",
													adornedEnd: "inverse",
												}
										}}
										fullWidth
										required 
										validate
										disabled={this.state.submitting}
									/>
							</GridItem>}

							{(!this.state.forgotPassword || this.state.resettingPassword) && (
									<GridItem
										xs={12}
										sm={12}
										md={12}
										className={classes.inputContainer}
									>
										<TextInput
											id="login-password"
											type={"password"}
											value={this.state.password}
											onChange={this.handleChange("password")}
											label={this.state.resettingPassword? "Enter new password": "Password"}
											InputProps={{ 
												classes : {
													input: "inverse",
													adornedEnd: "inverse",
												}
											}}
											required
											fullWidth
											validate
											variant="filled"
											excludeValidation={this.state.resettingPassword? [] : ["password"]}
											disabled={this.state.submitting}
										/>
									</GridItem>
							)}

							{this.state.resettingPassword && (
								<GridItem
									xs={12}
									sm={12}
									md={12}
									className={classes.inputContainer}
								>
									<TextInput
										id="repeat-password"
										type={"password"}
										value={this.state["repeat-password"]}
										onChange={this.handleChange("repeat-password")}
										label={this.state.resettingPassword? "Repeat new password": "Repeat Password"}
										variant="filled"
										InputProps={{ 
												classes : {
													input: "inverse",
													adornedEnd: "inverse",
												}
										}}
										required
										validate
										validator={(value) => { return value === this.state.password? false : "Passwords dont match" }}
										fullWidth
										disabled={this.state.submitting}
									/>
								</GridItem>
							)}


							<GridContainer>
								<GridItem xs={12} md={6}>
									{(!this.state.forgotPassword && !this.state.resettingPassword) && (
										<CheckboxInput
											value={this.state.rememberMe}
											onChange={this.handleClickRememberMe}
											color="primary"
											label="Remember me"
										/>
									)}
								</GridItem>
								<GridItem xs={12} md={6} className="m-0 p-0">
									
									{!this.state.submitting && <GridContainer className={"p-0"}>
											<GridItem xs={12} className={"flex flex-col items-end justify-end"}>
												<Button
													color="primary"
													className={classes.loginSubmitBtn}
													type="submit"
												>
													{this.state.forgotPassword? " Send password reset code" : (this.state.resettingPassword ? "Reset Password" : "Login")}
												</Button>
											</GridItem>
												
										</GridContainer>}
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
													color="default"
													center
													variant="body2"
												>
													{"Submitting. Please Wait..."}
												</Typography>
											</GridItem>
												
										</GridContainer>
									)}
								</GridItem>
							</GridContainer>

							<GridContainer>
								<GridItem md={6} className="p-0 flex flex-col items-center md:justify-start sm:justify-center">
									<Button
										variant="text"
										color="default"
										size="md"
										simple
										className={classNames({
											[classes.forgotPasswordBtn]: true,
											[classes.center_horizontally]: true
										})}
										onClick={this.onClickForgotPassword}
									>
										{this.state.forgotPassword || this.state.resettingPassword ? "Back to login" : "Forgot password?"}
									</Button>
								</GridItem>
								<GridItem md={6} className="p-0 flex flex-col items-center md:justify-end sm:justify-center">
									{/*!this.state.forgotPassword && !this.state.resettingPassword  && <Link to={"/register"} className="transparent">
										<Button
											variant="text"
											color="default"
											size="md"
											simple
											href="/register"
										>
											Create account
	                  					</Button>
                  					</Link>*/}
                  					{!this.state.forgotPassword && !this.state.resettingPassword  && <Link to={"/jobs".toUriWithLandingPagePrefix()} className="transparent">
										<Button
											variant="text"
											color="default"
											size="md"
											simple
											href={"/jobs".toUriWithLandingPagePrefix()}
										>
											Join Us
	                  					</Button>
                  					</Link>}
                  					{/*this.state.forgotPassword && <Button
											variant="text"
											color="default"
											size="md"
											simple
											onClick={()=>this.setState({resettingPassword:true, forgotPassword: false})}
										>
											Reset Password
	                  					</Button> */}
								</GridItem>
							</GridContainer>

							{OAuth2_enabled && <GridContainer className="p-0">
								<Typography
									className="p-0"
									color="default"
									center
									variant="h5"
									fullWidth
								>
									OR
                				</Typography>
							</GridContainer>}

							{OAuth2_enabled && <GridContainer alignItems="center" justify="center">
								<OAuth onOAuthSuccess={this.handleOnOAuthSuccess} />
							</GridContainer>}
						</GridContainer>
					</form>
				</GridContainer>

				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					open={this.state.alert ? true : false}
					autoHideDuration={this.state.loginerror ? null : 6000}
					onClose={this.handleSnackbarClose}
				>
					<SnackbarContent
						onClose={this.handleSnackbarClose}
						color={ this.state.loginerror ? "error" : this.state.loginsuccess ? "success" : "inverse" }
						message={this.state.alert ? this.state.alert : ""}
					/>
				</Snackbar>
			</div>
		);
	}
}

LoginForm.propTypes = {
	classes: PropTypes.object.isRequired,
	onLogin: PropTypes.func
};

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
	nav: state.nav,
	device: state.device
});

export default compose(withStyles(styles), connect( mapStateToProps, { login }), withRouter)(withErrorHandler(LoginForm));
