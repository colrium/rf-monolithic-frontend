/** @format */

import React, { useCallback } from "react"
import Snackbar from "@mui/material/Snackbar"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import { useSearchParams, useNavigate } from "react-router-dom"
import { usePersistentForm, useDidMount, useSetState } from "hooks"

import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { login } from "state/actions/auth"

const AuthForm = React.forwardRef((props, ref) => {
	const {
		username,
		password,
		onSubmit,
		onLogin,
		onSubmitSuccess,
		onSubmitError,
		...rest
	} = props || {}

	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth);
	const navigateTo = searchParams.get("navigateTo") || "/home".toUriWithDashboardPrefix()

	const [state, setState] = useSetState({
		submitting: false,
		alert: false,
		showEmail: true,
		showCode: true,
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
					console.log("err", err)
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

	useDidMount(() => {
		if (auth?.isAuthenticated && !JSON.isEmpty(auth?.user)) {
			if (Function.isFunction(onLogin)) {
				onLogin(auth?.user)
			}
			resetValues()
			navigate(navigateTo)
		}
	})



	// console.log("formState.errors", formState.errors)

	return (
		<Grid container {...rest} component="form" onSubmit={submit} ref={ref}>
			<Grid item xs={12} className="p-4 md:pb-8 text-center">
				<Typography color="action.disabled" variant="subtitle1">
					LOGIN
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
			<Grid
				item
				xs={12}
				className="flex flex-row justify-center items-center mb-4"
			>
				<LoadingButton
					disabled={!formState.isValid || formState.isSubmitting}
					loading={formState.isSubmitting}
					type="submit"
					variant="contained"
				>
					Login
				</LoadingButton>
			</Grid>

			<Grid
				item
				xs={12}
				md={6}
				className="flex flex-col justify-center items-center"
				sx={{
					color: theme => theme.palette.text.disabled,
				}}
			>
				<Link
					className="no-underline text-current p-2 px-4 my-2 rounded transition-all duration-200 hover:bg-gray-800 hover:bg-opacity-5 focus:bg-gray-800 focus:bg-opacity-20 ease-in-out"
					to="/auth/forgot-password"
				>
					Forgot password
				</Link>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
				className="flex flex-col justify-center items-center"
				sx={{
					color: theme => theme.palette.text.disabled,
				}}
			>
				<Link
					className="no-underline text-current p-2 px-4 my-2 rounded transition-all duration-200 hover:bg-gray-800 hover:bg-opacity-5 focus:bg-gray-800 focus:bg-opacity-20 ease-in-out"
					to={"/jobs".toUriWithLandingPagePrefix()}
				>
					Join Us
				</Link>
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
