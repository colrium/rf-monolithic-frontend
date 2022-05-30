/** @format */

import React, { useCallback } from "react"
import Snackbar from "@mui/material/Snackbar"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"

import { useNetworkServices } from "contexts/NetworkServices"
import { usePersistentForm, useDidMount, useSetState } from "hooks"

import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import { Link } from "react-router-dom"

const AuthForm = React.forwardRef((props, ref) => {
	const { email, code, onSubmit, onSubmitSuccess, onSubmitError, ...rest } = props || {}

	const { Api } = useNetworkServices()

	const [state, setState] = useSetState({
		submitting: false,
		alert: false,
		showEmail: true,
		showCode: true,
	})
	const { submit, TextField, getValues, setValue, resetValues, formState } = usePersistentForm({
		name: `reset-password-auth-form`,
		volatile: true,
		defaultValues: {
			email: email || "",
			code: code || "",
		},
		onSubmit: async (formData, e) => {
			return await Api.resetPassword(formData)
				.then(res => {
					setState({
						submitting: false,
						error: false,
						alert: res.message || "Your password has been reset successfully",
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

	const values = getValues()

	const applyQueryParams = useCallback(() => {
		let queryParams = (window.location.search.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []).reduce(function (
			result,
			each,
			n,
			every
		) {
			let [key, value] = each.split("=")
			result[key] = value
			return result
		},
		{})
		if ("e" in queryParams || "email" in queryParams) {
			let email = queryParams.e || queryParams.email
			if (email !== values.email) {
				setValue("email", email)
			}
			if (!String.isEmpty(email)) {
				setState({ showEmail: false })
			}
		}
		if ("c" in queryParams || "code" in queryParams) {
			let code = queryParams.c || queryParams.code
			if (code !== values.code) {
				setValue("code", code)
			}
			if (!String.isEmpty(code)) {
				setState({ showCode: false })
			}
		}
	}, [values])

	useDidMount(() => {
		applyQueryParams()
		// resetValues()
	})

	return (
		<Grid container {...rest} component="form" onSubmit={submit} ref={ref}>
			<Grid item xs={12} className="p-4 md:pb-8 text-center">
				<Typography color="action.disabled" variant="subtitle1">
					Reset Password
				</Typography>
			</Grid>
			<Grid item xs={12} className="mb-4 flex flex-col">
				{state.showEmail && (
					<TextField
						type="email"
						variant="filled"
						name={`email`}
						label="Email Address"
						placeholder="example@email.com"
						rules={{
							required: "Email Address is required.",
							pattern: {
								value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: "Invalid Email Address",
							},
						}}
						className="mb-4"
						fullWidth
						required
						validate
					/>
				)}

				{state.showCode && (
					<TextField
						type="text"
						variant="filled"
						name={`code`}
						label="Password Reset Code"
						placeholder="Abc123"
						rules={{
							required: "Password Reset Code is required.",
							minLength: 6,
						}}
						className="mb-4"
						fullWidth
						required
						validate
					/>
				)}

				<TextField
					type="password"
					variant="filled"
					name={`password`}
					label="Password"
					placeholder="New Password"
					rules={{
						validate: {
							isRequired: val => !String.isEmpty(val) || "Password is required.",
							isLongEnough: val => /^.{8,}$/.test(val) || "Password should be atleast 8 characters long.",
							hasUppercase: val =>
								new RegExp("^(?=.*[A-Z]).{8,}$").test(val) || "Password should include atleast 1 uppercase letter.",
							hasLowercase: val =>
								new RegExp("^(?=.*[a-z]).{8,}$").test(val) || "Password should include atleast 1 lowercase letter.",
							hasDigit: val =>
								new RegExp("^(?=.*[0-9]).{8,}$").test(val) || "Password should include atleast 1 lowercase letter.",
						},
					}}
					className="mb-4"
					fullWidth
					required
					validate
				/>

				<TextField
					type="password"
					variant="filled"
					name={`repeat_password`}
					label="Repeat Password"
					rules={{
						deps: ["password"],
						validate: {
							isRequired: val => !String.isEmpty(val) || "Repeat password is required.",
							isLongEnough: val =>
								(String.isString(val) && val.trim().length >= 8) || "Repeat password should be atleast 8 characters long.",
							matchesPassword: val => val === values.password || "Repeat password does not match password",
						},
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
					type="submit"
					variant="contained"
				>
					Reset Password
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
				<Link
					className="no-underline text-current p-2 px-4 my-2 rounded transition-all duration-200 hover:bg-gray-800 hover:bg-opacity-5 focus:bg-gray-800 focus:bg-opacity-20 ease-in-out"
					to="/auth/login"
				>
					Back to Login
				</Link>
			</Grid>

			<Grid
				item
				xs={12}
				className="flex flex-col justify-center items-center"
				sx={{
					color: theme => theme.palette.text.disabled,
				}}
			>
				<Link
					className="no-underline text-current p-2 px-4 my-2 rounded transition-all duration-200 hover:bg-gray-800 hover:bg-opacity-5 focus:bg-gray-800 focus:bg-opacity-20 ease-in-out"
					to="/auth/forgot-password"
				>
					Get password reset code
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
