/** @format */

import React, { useCallback } from "react"
import Snackbar from "@mui/material/Snackbar"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import GoogleIcon from "@mui/icons-material/Google"
import MailIcon from "@mui/icons-material/Mail"
import { useSearchParams, useNavigate } from "react-router-dom"
import { usePersistentForm, useDidMount, useSetState, useDidUpdate } from "hooks"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNetworkServices } from "contexts/NetworkServices"
import { login } from "state/actions/auth"
import { googleClientId } from "config"
import { GoogleLoginButton } from "views/forms/Auth/OAuth"

const AuthForm = React.forwardRef((props, ref) => {
	const { username, password, onSubmit, onLogin, onSubmitSuccess, onSubmitError, ...rest } = props || {}

	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const authSettings = useSelector(state => ({ ...state?.app.settings?.auth }))
	const navigateTo = searchParams.get("navigateTo") || "/home".toUriWithDashboardPrefix()

	const [state, setState] = useSetState({
		submitting: false,
		alert: false,
		showEmail: true,
		strategy: null,
	})

	const { submit, TextField, values, setValue, resetValues, formState } = usePersistentForm({
		name: `login-auth-form`,
		mode: "onChange",
		reValidateMode: "onChange",
		// volatile: true,
		defaultValues: {
			username: username || "",
			password: password || "",
		},
		onSubmit: async (formData, e) => {
			return await dispatch(login(formData))
				.then(({ access_token, profile }) => {
					setState(state => ({
						submitting: false,
						error: false,
						alert: "Login successful.",
					}))
					if (Function.isFunction(onLogin)) {
						onLogin(profile)
					}

					if (Function.isFunction(onSubmitSuccess)) {
						onSubmitSuccess(res)
					}
					if (Function.isFunction(onLogin)) {
						onLogin(auth?.user)
					}
					resetValues()
					navigate(navigateTo)
				})
				.catch(err => {
					console.error("err", err)
					setState({
						submitting: false,
						error: err.msg,
						alert: false,
					})
					if (Function.isFunction(onSubmitError)) {
						onSubmitError(err)
					}
				})
		},
	})

	const handleOnGoogleSuccess = useCallback(
		data => {
			if (Function.isFunction(onLogin)) {
				onLogin(data?.profile)
			}
			resetValues()
			navigate(navigateTo)
		},
		[onLogin, navigateTo]
	)

	useDidMount(() => {
		if (auth?.isAuthenticated && !JSON.isEmpty(auth?.user)) {
			if (Function.isFunction(onLogin)) {
				onLogin(auth?.user)
			}
			resetValues()
			navigate(navigateTo)
		}
	})

	useDidUpdate(() => {
		if (auth?.isAuthenticated && !JSON.isEmpty(auth?.user)) {
			if (Function.isFunction(onLogin)) {
				onLogin(auth?.user)
			}
			resetValues()
			navigate(navigateTo)
		}
	}, [auth, navigateTo, onLogin])

	return (
		<Grid container {...rest} component="form" onSubmit={submit} ref={ref}>
			<Grid container>
				<Grid item xs={12} className="p-4 md:pb-8 text-center">
					<Typography color="action.disabled" variant="subtitle1">
						Proceed with your credentials
					</Typography>
				</Grid>
				<Grid item xs={12} className="mb-4 flex flex-col">
					<TextField
						type="email"
						variant="filled"
						name={`username`}
						label="Email address"
						placeholder="email@example.com"
						rules={{
							required: "Email address is required.",
							pattern: {
								value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: "Invalid Email Address",
							},
						}}
						className="mb-8"
						fullWidth
						required
						validate
					/>

					<TextField
						type="password"
						variant="filled"
						name={`password`}
						label="Password"
						placeholder="Password"
						rules={{
							required: "Password is required.",
						}}
						className="mb-4"
						fullWidth
						required
						validate
					/>
				</Grid>
				<Grid item xs={12} className="mb-4"></Grid>
				<Grid item xs={12} className="flex flex-row justify-center items-center mb-4">
					<LoadingButton
						disabled={!formState.isValid || formState.isSubmitting}
						loading={formState.isSubmitting}
						sx={
							{
								// color: theme => theme.palette.text.primary,
								// backgroundColor: theme => theme.palette.background.paper,
							}
						}
						type="submit"
						variant="text"
					>
						Login
					</LoadingButton>
				</Grid>

				<Grid
					item
					xs={12}
					className="flex flex-col justify-center items-center"
					sx={{
						color: theme => theme.palette.text.disabled,
					}}
				>
					<Link to="/auth/forgot-password">
						<Button
							variant="text"
							sx={{
								color: theme => theme.palette.text.primary,
							}}
							className="capitalize rounded-full px-8 my-4"
						>
							Forgot password
						</Button>
					</Link>
				</Grid>
			</Grid>

			<Grid container>
				<Grid item xs={12} className="flex flex-col justify-center my-4 items-center">
					{/*state.strategy !== "email-and-password" && (
						<Button
							variant="text"
							sx={{
								color: theme => theme.palette.text.primary,
								backgroundColor: theme => theme.palette.background.paper,
							}}
							className="capitalize rounded-full px-8 my-4"
							startIcon={<MailIcon color={`accent`} />}
							onClick={() => setState({ strategy: "email-and-password" })}
						>
							Proceed with Email/Password
						</Button>
					)*/}
					<GoogleLoginButton  />
				</Grid>
				<Grid
					item
					xs={12}
					className="flex flex-col justify-center items-center my-4"
					sx={{
						color: theme => theme.palette.text.disabled,
					}}
				>
					<Typography variant="body2"> No Account? </Typography>
					<Link to={"/jobs".toUriWithLandingPagePrefix()}>
						<Button
							variant="text"
							sx={
								{
									// color: theme => theme.palette.text.primary,
								}
							}
							className="capitalize rounded-full px-8 "
						>
							Apply here
						</Button>
					</Link>
				</Grid>
			</Grid>
			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				open={!!state.alert || !!state.error}
				autoHideDuration={3000}
				onClose={() => setState({ error: false, alert: false })}
			>
				<Alert
					onClose={() => setState({ error: false, alert: false })}
					severity={!!state.error ? "error" : "success"}
					sx={{ width: "100%" }}
					variant="filled"
				>
					{state.alert || state.error}
				</Alert>
			</Snackbar>
		</Grid>
	)
})

export default React.memo(AuthForm)
