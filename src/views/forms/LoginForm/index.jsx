import React from "react";
import Cookies from 'universal-cookie';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { alignments, colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Typography from "components/Typography";
import PropTypes from "prop-types";

//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
//
import AuthService from "services/auth";
import { login, setAuthenticated, setCurrentUser, setAccessToken } from "state/actions/auth";
import { authTokenLocation, authTokenName, baseUrls, environment } from 'config';
import { AppHelper } from "utils/Helpers";
import Auth from "utils/Auth";
import withRoot from "utils/withRoot";
import OAuth from "./components/OAuth";


const AuthHelper = Auth.getInstance();

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
		minHeight: "60px",
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
		email: AppHelper.inDevelopment() ? "colrium@gmail.com" : "",
		password: AppHelper.inDevelopment() ? "WI5HINd8" : "",
		reset_code: "",
		repeat_password: "",
		forgotPassword: false,
		resettingPassword: false,
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
		const { setCurrentUser, setAuthenticated, auth } = props;
		
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
		const { setCurrentUser, setAuthenticated, auth } = this.props;
		if (Auth.getInstance().authTokenSet() && auth.isAuthenticated && "_id" in auth.user) {
			this.handleOnUserLogin({user: auth.user});
		}		
	}

	handleChange = name => event => {
		let eventTargetValue = event.target.value;
		this.setState({ [name]: eventTargetValue });
	};

	getCookiesAccessToken(){
		let cookies = new Cookies();
		let access_token = cookies.get(authTokenName);
		let token_type = cookies.get(authTokenName+"_type");
		let refresh_token = cookies.get(authTokenName+"_refresh_token");
		if (access_token && token_type) {
			return {
				access_token: access_token,
				token_type: token_type,
				refresh_token: refresh_token
			}
		}
		return null;		
	}

	setAuthCookies(access_token){
		const cookies = new Cookies();
				let expires_date = new Date().addDays(365);
				let maxAge = 60 * 60 * 24 * 365;

				let options = {
						path: '/',
						expires: expires_date.addMilliSeconds(maxAge).toUTCString(),
						domain: baseUrls[environment].domain,
						secure: AppHelper.inProduction(),
						httpOnly: false
				};

				const payload = Auth.getInstance().decode_auth_token(access_token.access_token);
				options.expires = expires_date;
				cookies.set(authTokenName, access_token.access_token, options);
				cookies.set(authTokenName+"_type", access_token.token_type, options);
				cookies.set(authTokenName+"_refresh_token", access_token.refresh_token, options);
	}

	setAccessToken(access_token){
		const { setAccessToken } = this.props;
		if (authTokenLocation === "redux") {
			setAccessToken(access_token);
		}
		else if (authTokenLocation === "cookie") {
			this.setAuthCookies(access_token);
		}
		Auth.getInstance().setAccessToken(access_token);
	}

	handleOnUserLogin(data) {
		const { setCurrentUser, setAuthenticated, setAccessToken, onLogin } = this.props;
		const {user, access_token} = data;
		if (user) {
			if (typeof setCurrentUser === "function") {
				setCurrentUser(user);
			}
			if (typeof setAuthenticated === "function") {
				setAuthenticated(true);
			}
		}
			
		if (access_token) {
			this.setAccessToken(access_token);			
		}
		
		if (typeof onLogin === "function") {
			onLogin(user);
		}
	}
	handleOnOAuthSuccess(data) {
		const { setCurrentUser, setAuthenticated, setAccessToken, onLogin } = this.props;		
		const {user, access_token} = data;
		//dispatch mapped action
		if (user) {
			if (typeof setCurrentUser === "function") {
				setCurrentUser(user);
			}
			if (typeof setAuthenticated === "function") {
				setAuthenticated(true);
			}
		}
			
		if (access_token) {
			this.setAccessToken(access_token);			
		}

		if (typeof onLogin === "function") {
			onLogin(user);
		}		
	}

	onClickForgotPassword() {
		this.setState(state => ({ forgotPassword: !state.forgotPassword }));
	}

	onClickResetPassword() {
		this.setState(state => ({ resettingPassword: !state.resettingPassword }));
	}

	handleClickShowPassword() {
		this.setState(state => ({ showPassword: !state.showPassword }));
	}

	handleClickRememberMe() {
		this.setState(state => ({ rememberMe: !state.rememberMe }));
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
		const { login, onLogin } = this.props;
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
				email: this.state.email
			};
			let response = await AuthService.forgotPassword(formData);
			if (response.err) {
				this.setState(state => ({
					submitting: false,
					loginerror: true,
					loginsuccess: false,
					alert: response.err.msg
				}));
			} else {
				this.setState(state => ({
					submitting: false,
					loginerror: false,
					loginsuccess: true,
					alert: response.body.message
				}));
			}
		} else if (this.state.resettingPassword) {
			let formData = {
				code: this.state.reset_code,
				password: this.state.password,
				repeat_password: this.state.repeat_password
			};
			let response = await AuthService.resetPassword(formData);
			if (response.err) {
				this.setState(state => ({
					submitting: false,
					loginerror: true,
					loginsuccess: false,
					alert: response.err.msg
				}));
			} else {
				this.setState(state => ({
					submitting: false,
					loginerror: false,
					loginsuccess: true,
					alert: response.body.message
				}));
			}
		} else {
			let formData = {
				username: this.state.email,
				password: this.state.password
			};
			login(formData)
				.then(({access_token, user}) => {
					this.setState(state => ({
						submitting: false,
						loginerror: false,
						loginsuccess: true,
						alert: "Login successful. Redirecting"
					}));
					this.handleOnUserLogin({access_token: access_token, user: user});
				})
				.catch(err => {
					console.log("err", err);
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
		const { classes } = this.props;
		const loginBtnClassname = classNames({
			[classes.loginSubmitBtn]: true,
			[classes.loginSubmitting]: this.state.loginSubmitting,
			[classes.loginSuccess]: this.state.loginsuccess,
			[classes.loginError]: this.state.loginerror
		});
		return (
			<div className={classes.root}>
				<GridContainer className="p-0">
					<form
						className={classes.loginContainer}
						onSubmit={this.handleLoginSubmit}
					>
						<GridContainer className={classes.loginContainer}>
							{this.state.resettingPassword ? (
								<GridItem
									xs={12}
									sm={12}
									md={12}
									className={classes.inputContainer}
								>
									<TextField
										id="reset-code"
										type="text"
										value={this.state.reset_code}
										onChange={this.handleChange("reset_code")}
										className={classNames(classes.textField)}
										variant="outlined"
										label="Password Reset Code"
										fullWidth
										disabled={this.state.submitting}
									/>
								</GridItem>
							) : (
									<GridItem
										xs={12}
										sm={12}
										md={12}
										className={classes.inputContainer}
									>
										<TextField
											id="login-email"
											type="email"
											value={this.state.email}
											onChange={this.handleChange("email")}
											className={classNames(classes.textField)}
											variant="outlined"
											label="Email"
											fullWidth
											disabled={this.state.submitting}
										/>
									</GridItem>
								)}

							{(!this.state.forgotPassword && !this.state.resettingPassword) ||
								this.state.resettingPassword ? (
									<GridItem
										xs={12}
										sm={12}
										md={12}
										className={classes.inputContainer}
									>
										<TextField
											id="login-password"
											type={this.state.showPassword ? "text" : "password"}
											value={this.state.password}
											onChange={this.handleChange("password")}
											className={classNames(classes.textField)}
											variant="outlined"
											label="Password"
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
																<Icon>visibility_off</Icon>
															) : (
																	<Icon>visibility</Icon>
																)}{" "}
														</IconButton>{" "}
													</InputAdornment>
												)
											}}
											fullWidth
											disabled={this.state.submitting}
										/>
									</GridItem>
								) : (
									""
								)}

							{this.state.resettingPassword ? (
								<GridItem
									xs={12}
									sm={12}
									md={12}
									className={classes.inputContainer}
								>
									<TextField
										id="repeat-password"
										type={this.state.showRepeatPassword ? "text" : "password"}
										value={this.state.password}
										onChange={this.handleChange("repeat-password")}
										className={classNames(classes.textField)}
										variant="outlined"
										label="Repeat Password"
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
										disabled={this.state.submitting}
									/>
								</GridItem>
							) : (
									""
								)}

							<GridContainer>
								<GridItem xs={12} md={6}>
									{!this.state.forgotPassword && (
										<FormControlLabel
											control={
												<Checkbox
													checked={this.state.rememberMe}
													onChange={this.handleClickRememberMe}
													value="remember"
													color="primary"
												/>
											}
											label="Remember me"
										/>
									)}
								</GridItem>
								<GridItem xs={12} md={6} className="m-0 p-0">
									<Button
										color="accent"
										size="lg"
										className={classes.loginSubmitBtn}
										right
										simple={this.state.submitting}
										disabled={this.state.submitting}
										type="submit"
									>
										{this.state.submitting
											? ". . ."
											: this.state.forgotPassword
												? " Send password reset code"
												: this.state.resettingPassword
													? "Reset Password"
													: "Login"}
									</Button>
								</GridItem>
							</GridContainer>

							<GridContainer>
								<GridItem md={6} className="p-0">
									<Button
										variant="text"
										color="accent"
										size="md"
										simple
										className={classNames({
											[classes.forgotPasswordBtn]: true,
											[classes.center_horizontally]: true
										})}
										onClick={this.onClickForgotPassword}
									>
										{this.state.forgotPassword
											? "Back to login"
											: "Forgot password?"}
									</Button>
								</GridItem>
								<GridItem md={6} className="p-0">
									<Button
										variant="text"
										color="accent"
										right
										size="md"
										simple
										href="https://realfield.io/home"
									>
										Create account
                  </Button>
								</GridItem>
							</GridContainer>

							<GridContainer className="p-0">
								<Typography
									className="p-0"
									color="grey"
									center
									variant="body1"
									fullWidth
								>
									or
                </Typography>
							</GridContainer>

							<GridContainer alignItems="center" justify="center">
								<OAuth onOAuthSuccess={this.handleOnOAuthSuccess} />
							</GridContainer>
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
	nav: state.nav,
	device: state.device
});

export default compose(withStyles(styles), connect( mapStateToProps, { login, setCurrentUser, setAuthenticated, setAccessToken }))(withRoot(LoginForm));
