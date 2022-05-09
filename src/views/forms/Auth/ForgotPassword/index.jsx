/** @format */

import React, { useCallback } from "react"
import Snackbar from "@mui/material/Snackbar"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import LoadingButton from "@mui/lab/LoadingButton"

import { useNetworkServices } from "contexts/NetworkServices"
import { usePersistentForm, useDidMount, useSetState } from "hooks"

import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import { Link } from "react-router-dom"


const AuthForm = React.forwardRef((props, ref) => {
	const { email, onSubmit, onSubmitSuccess, onSubmitError, ...rest } =
		props || {}

	const { Api } = useNetworkServices()

	const [state, setState, getState] = useSetState({
		submitting: false,
		alert: false,
	})
	const {
		submit,
		TextField,
		values,
		setValue,
		resetValues,
		formState,
		...formRest
	} = usePersistentForm({
		name: `forgot-password-auth-form`,
		defaultValues: {
			email: email || "",
		},
		onSubmit: async (formData, e) => {
			let hostUrl = `${window.location.origin}/auth/reset-password`
			return await Api.forgotPassword({ ...formData, cb: hostUrl })
				.then(res => {
					setState({
						submitting: false,
						error: false,
						alert:
							res.message ||
							"An email has been sent to your email with password reset resources",
					})
					resetValues()
					if (Function.isFunction(onSubmitSuccess)) {
						onSubmitSuccess(res)
					}
					return res
				})
				.catch(err => {
					setState({
						submitting: false,
						error: err.msg,
						alert: false,
					})
					if (Function.isFunction(onSubmitError)) {
						onSubmitError(err)
					}
					throw err
				})
		},
	})

	const applyQueryParams = useCallback(() => {
		let queryParams = (
			window.location.search.match(
				new RegExp("([^?=&]+)(=([^&]*))?", "g")
			) || []
		).reduce(function (result, each, n, every) {
			let [key, value] = each.split("=")
			result[key] = value
			return result
		}, {})
		if ("e" in queryParams || "email" in queryParams) {
			let email = queryParams.e || queryParams.email
			if (email !== values.email) {
				setValue("email", email)
			}
		}
	}, [values])

	useDidMount(() => {
		applyQueryParams()
		resetValues()

	})

	return (
		<Grid container {...rest} component="form" onSubmit={submit} ref={ref}>
			<Grid item xs={12} className="p-4 md:pb-8 text-center">
				<Typography color="action.disabled" variant="subtitle1">
					Forgot Password
				</Typography>
			</Grid>
			<Grid item xs={12} className="mb-12">
				<TextField
					type="email"
					variant="filled"
					name={`email`}
					label="Email Address"
					placeholder="Enter your Email Address"
					rules={{
						required: "Email Address is required.",
						pattern: {
							value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							message: "Invalid Email Address",
						},
					}}
					fullWidth
					required
					validate
					disabled={state.submitting}
					helperText={"Enter your email address to initiate your account's password reset."}
				/>
			</Grid>
			<Grid item xs={12} className="flex flex-row justify-center items-center mb-4">
				<LoadingButton
					disabled={!formState.isValid || formState.isSubmitting}
					loading={formState.isSubmitting}
					type="submit"
					variant="contained"
				>
					Submit
				</LoadingButton>
			</Grid>

			<Grid
				item
				xs={12}
				className="flex flex-col justify-center items-center"
				sx={{
					color: theme => theme.palette.secondary.main,
				}}
			>
				<Link to="/auth/login">
					<Button variant="text" className="capitalize rounded-full px-8 my-4">
						Back to Login
					</Button>
				</Link>
			</Grid>

			<Grid item xs={12} className="flex flex-col justify-center items-center">
				<Typography color="action.disabled" variant="body2">
					already received password reset code?
				</Typography>
				<Link to="/auth/reset-password">
					<Button variant="text" className="capitalize rounded-full px-8 my-4">
						Reset password
					</Button>
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
});

export default React.memo(AuthForm)
