/** @format */

import React from "react"
import Cookies from "universal-cookie"
import Snackbar from "@mui/material/Snackbar"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import { colors } from "assets/jss/app-theme.jsx"
import classNames from "classnames"
import Button from "@mui/material/Button"
import GridContainer from "components/Grid/GridContainer"
import GridItem from "components/Grid/GridItem"
import { makeStyles } from "@mui/styles"
import Typography from "components/Typography"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import compose from "recompose/compose"
//
import { login } from "state/actions/auth"
import { useDidUpdate, useVisibility, useDidMount, useSetState } from "hooks"
import { authTokenLocation, authTokenName, baseUrls, environment } from "config"
import ApiService from "services/Api"

import { TextInput } from "components/FormInputs"

import MuiAlert from "@mui/material/Alert"

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const useStyles = makeStyles(theme => ({
	root: {
		position: "relative",
		display: "inline-block",
		margin: theme.spacing(),
		marginBottom: theme.spacing(5),
	},
	wrapper: {
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing(),
	},
	loginContainer: {
		position: "relative",
		padding: "0",
	},
	margin: {
		margin: theme.spacing(),
	},
	textField: {
		flexBasis: 200,
	},
	inputAdornment: {
		color: colors.hex.gray,
	},
	inputContainer: {
		position: "relative",
		marginTop: theme.spacing(),
	},
	submitBtnWrapper: {
		position: "relative",
		margin: theme.spacing(),
		padding: theme.spacing(),
		marginTop: theme.spacing(4),
		height: "auto",
	},
	loginSubmitBtn: {
		"&:disabled": {
			backgroundColor: colors.hex.accent,
		},
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
				", 0.2)",
		},
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
				", 0.2)",
		},
	},
	buttonProgress: {
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: "-18px",
		marginLeft: "-18px",
		color: colors.hex.accent,
	},
	oauthWrapper: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(),
	},
	forgotPasswordBtn: {
		position: "relative",
		color: colors.hex.default,
	},
	oauthBtnWrapper: {
		position: "relative",
	},
	oauthBtn: {
		"& img": {
			height: "1.3rem",
			width: "1.3rem",
			marginRight: "1rem",
		},
	},
}))

const LoginForm = props => {
	const {
		auth,
		onLogin,
		login,
		history,
		app: {
			settings: { auth: OAuth2_enabled },
		},
	} = props
	const classes = useStyles()
	const [state, setState, getState] = useSetState({
		email: environment === "development" ? "colrium@gmail.com" : "",
		password: environment === "development" ? "WI5HINd8" : "",
		reset_code: "",
		repeat_password: "",
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
		user: null,
	})

	useDidMount(() => {
		if (auth?.isAuthenticated) {
			handleOnUserLogin({ user: auth.user })
		} else {
			let uriQueries = (
				window.location.search.match(
					new RegExp("([^?=&]+)(=([^&]*))?", "g")
				) || []
			).reduce(function (result, each, n, every) {
				let [key, value] = each.split("=")
				result[key] = value
				return result
			}, {})
			if (
				("c" in uriQueries || "code" in uriQueries) &&
				("e" in uriQueries || "email" in uriQueries)
			) {
				let reset_code =
					"c" in uriQueries ? uriQueries.c : uriQueries.code
				let email = "e" in uriQueries ? uriQueries.e : uriQueries.email
				if (!String.isEmpty(reset_code) && !String.isEmpty(email)) {
					setState(prevState => ({
						forgotPassword: false,
						resettingPassword: true,
						resettingPasswordWithUrl: true,
						reset_code: reset_code,
						email: email,
					}))
				} else {
					setState(prevState => ({
						forgotPassword: false,
						resettingPassword: true,
						resettingPasswordWithUrl: false,
						reset_code: reset_code,
						email: email,
					}))
				}
			}
		}
	})

	const handleChange = name => value => {
		setState({ [name]: value })
	}

	const handleOnUserLogin = data => {
		const { profile, access_token } = data

		if (typeof onLogin === "function") {
			onLogin(profile)
		}
	}

	const handleOnOAuthSuccess = data => {
		const { profile, access_token } = data
		//dispatch mapped action

		if (typeof onLogin === "function") {
			onLogin(profile)
		}
	}

	const onClickForgotPassword = () => {
		setState(state => ({
			forgotPassword: !state.forgotPassword,
			resettingPassword: state.resettingPassword ? false : false,
		}))
	}

	const onClickResetPassword = () => {
		setState(state => ({ resettingPassword: !state.resettingPassword }))
	}

	const handleClickShowPassword = () => {
		setState(state => ({ showPassword: !state.showPassword }))
	}

	const handleClickRememberMe = rememberMe => {
		setState(state => ({ rememberMe: rememberMe }))
	}

	const handleClickShowRepeatPassword = () => {
		setState(state => ({ showRepeatPassword: !state.showRepeatPassword }))
	}

	const handleSnackbarClose = () => {
		const { loginsuccess } = getState()
		if (state.loginsuccess) {
			setState(state => ({
				alert: false,
				submitting: false,
				loginsuccess: false,
				loginerror: false,
			}))
		} else {
			setState(state => ({
				alert: false,
				submitting: false,
				loginsuccess: false,
				loginerror: false,
			}))
		}
	}

	const handleLoginSubmit = async event => {
		//
		event.preventDefault()
		//
		const {
			email,
			forgotPassword,
			resettingPassword,
			reset_code,
			password,
			repeat_password,
		} = getState()
		setState(state => ({
			loginerror: false,
			loginsuccess: false,
			submitting: true,
			alert: false,
		}))

		if (forgotPassword) {
			let formData = {
				email: email,
				cb: window.location.href,
			}
			await ApiService.forgotPassword(formData)
				.then(res => {
					setState(state => ({
						submitting: false,
						loginerror: false,
						loginsuccess: true,
						alert: "An email has been sent to your email with password reset resources",
						resettingPassword: true,
						forgotPassword: false,
					}))
				})
				.catch(err => {
					setState(state => ({
						submitting: false,
						loginerror: true,
						loginsuccess: false,
						alert: err.msg,
					}))
				})
		} else if (resettingPassword) {
			let formData = {
				code: reset_code,
				email: email,
				password: password,
				repeat_password: repeat_password,
			}
			ApiService.resetPassword(formData)
				.then(res => {
					setState(state => ({
						submitting: false,
						loginerror: false,
						loginsuccess: true,
						alert: "Your password has been reset successfully",
						resettingPassword: false,
						resettingPasswordWithUrl: false,
						forgotPassword: false,
					}))
					if (history) {
						history.push(history.location.pathname)
					}
				})
				.catch(err => {
					setState(state => ({
						submitting: false,
						loginerror: true,
						loginsuccess: false,
						alert: err.msg,
					}))
				})
		} else {
			let formData = {
				username: email,
				password: password,
			}
			login(formData)
				.then(({ access_token, profile }) => {
					setState(state => ({
						submitting: false,
						loginerror: false,
						loginsuccess: true,
						alert: "Login successful. Redirecting",
					}))
					handleOnUserLogin({
						access_token: access_token,
						profile: profile,
					})
				})
				.catch(err => {
					setState(state => ({
						submitting: false,
						loginerror: true,
						loginsuccess: false,
						alert: err.msg,
					}))
				})
		}
	}

	return (
		<div className={classes?.root}>
			<GridContainer className="p-0">
				<form
					className={classes?.loginContainer}
					onSubmit={handleLoginSubmit}
					autoComplete={state.resettingPassword ? "off" : "on"}
				>
					<GridContainer className={classes?.loginContainer}>
						{!state.resettingPassword &&
							(state.resettingPassword ||
								!state.resettingPasswordWithUrl) && (
								<GridItem
									xs={12}
									sm={12}
									md={12}
									className={classes?.inputContainer}
								>
									<TextInput
										id="login-email"
										type="email"
										value={state.email}
										onChange={handleChange("email")}
										label="Email"
										variant="filled"
										InputProps={{
											classes: {
												input: "inverse",
												adornedEnd: "inverse",
											},
										}}
										required
										validate
										fullWidth
										disabled={state.submitting}
									/>
								</GridItem>
							)}
						{state.resettingPassword &&
							!state.resettingPasswordWithUrl && (
								<GridItem
									xs={12}
									sm={12}
									md={12}
									className={classes?.inputContainer}
								>
									<TextInput
										id="reset-code"
										type="text"
										variant="filled"
										value={state.reset_code}
										onChange={handleChange("reset_code")}
										label="Password Reset Code"
										InputProps={{
											classes: {
												input: "inverse",
												adornedEnd: "inverse",
											},
										}}
										fullWidth
										required
										validate
										disabled={state.submitting}
									/>
								</GridItem>
							)}

						{(!state.forgotPassword || state.resettingPassword) && (
							<GridItem
								xs={12}
								sm={12}
								md={12}
								className={classes?.inputContainer}
							>
								<TextInput
									id="login-password"
									type={"password"}
									value={state.password}
									onChange={handleChange("password")}
									label={
										state.resettingPassword
											? "Enter new password"
											: "Password"
									}
									InputProps={{
										classes: {
											input: "inverse",
											adornedEnd: "inverse",
										},
									}}
									required
									fullWidth
									validate
									variant="filled"
									excludeValidation={
										state.resettingPassword
											? []
											: ["password"]
									}
									disabled={state.submitting}
								/>
							</GridItem>
						)}

						{state.resettingPassword && (
							<GridItem
								xs={12}
								sm={12}
								md={12}
								className={classes?.inputContainer}
							>
								<TextInput
									id="repeat_password"
									type={"password"}
									value={state["repeat_password"]}
									onChange={handleChange("repeat_password")}
									label={
										state.resettingPassword
											? "Repeat new password"
											: "Repeat Password"
									}
									variant="filled"
									InputProps={{
										classes: {
											input: "inverse",
											adornedEnd: "inverse",
										},
									}}
									required
									validate
									validator={value => {
										return value === state.password
											? false
											: "Passwords dont match"
									}}
									fullWidth
									disabled={state.submitting}
								/>
							</GridItem>
						)}

						<GridContainer>
							<GridItem xs={12} md={6}></GridItem>
							<GridItem xs={12} md={6} className="m-0 p-0">
								{!state.submitting && (
									<GridContainer className={"p-0"}>
										<GridItem
											xs={12}
											className={
												"flex flex-col items-end justify-end"
											}
										>
											<Button
												className={
													classes?.loginSubmitBtn
												}
												type="submit"
											>
												{state.forgotPassword
													? " Send password reset code"
													: state.resettingPassword
													? "Reset Password"
													: "Login"}
											</Button>
										</GridItem>
									</GridContainer>
								)}
								{state.submitting && (
									<GridContainer className={"p-0"}>
										<GridItem
											xs={12}
											className={
												"flex items-center justify-center"
											}
										>
											<CircularProgress
												size={24}
												className={"accent-text"}
											/>
										</GridItem>
										<GridItem xs={12} className={"p-0"}>
											<Typography
												className={"my-1"}
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
							<GridItem
								md={6}
								className="p-0 flex flex-col items-center md:justify-start sm:justify-center"
							>
								{/* <Button
									className={classNames({
										[classes?.forgotPasswordBtn]: true,
										[classes?.center_horizontally]: true
									})}
									onClick={onClickForgotPassword}
								>
									{state.forgotPassword || state.resettingPassword ? "Back to login" : "Forgot password?"}
								</Button> */}
								<Link
									to={"/auth/forgot-password"}
									className="transparent"
								>
									Forgot Password
								</Link>
							</GridItem>
							<GridItem
								md={6}
								className="p-0 flex flex-col items-center md:justify-end sm:justify-center"
							>
								{/*!state.forgotPassword && !state.resettingPassword  && <Link to={"/register"} className="transparent">

											Create account
                  					</Link>*/}
								{!state.forgotPassword &&
									!state.resettingPassword && (
										<Link
											to={"/jobs".toUriWithLandingPagePrefix()}
											className="transparent"
										>
											Join Us
										</Link>
									)}
								{/*state.forgotPassword && <Button
											onClick={()=>setState({resettingPassword:true, forgotPassword: false})}
										>
											Reset Password
	                  					</Button> */}
							</GridItem>
						</GridContainer>

						{OAuth2_enabled && (
							<GridContainer className="items-center justify-center p-0">
								<Typography
									className="p-0"
									variant="body1"
									fullWidth
								>
									OR
								</Typography>
							</GridContainer>
						)}
					</GridContainer>
				</form>
			</GridContainer>

			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				open={state.alert ? true : false}
				autoHideDuration={state.loginerror ? null : 6000}
				onClose={handleSnackbarClose}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity={
						state.loginerror
							? "error"
							: state.loginsuccess
							? "success"
							: "error"
					}
					sx={{ width: "100%" }}
				>
					{state.alert ? state.alert : ""}
				</Alert>
			</Snackbar>
		</div>
	)
}

LoginForm.propTypes = {
	onLogin: PropTypes.func,
}

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
	nav: state.nav,
	device: state.device,
})

export default compose(
	connect(mapStateToProps, { login }),
	withRouter
)(LoginForm)
