/** @format */

import React, { useCallback } from "react"
import LoadingButton from "@mui/lab/LoadingButton"
import SvgIcon from "@mui/material/SvgIcon"

import { useNetworkServices } from "contexts/NetworkServices"
import { googleClientId } from "config"
import GoogleLogin from "react-google-login"

const GoogleIcon = props => {
	return (
		<SvgIcon {...props} viewBox="0 0 150 150">
			<path
				fill="#4280EF"
				d="M120,76.1c0-3.1-0.3-6.3-0.8-9.3H75.9v17.7h24.8c-1,5.7-4.3,10.7-9.2,13.9l14.8,11.5   C115,101.8,120,90,120,76.1L120,76.1z"
			/>
			<path
				fill="#34A353"
				d="M75.9,120.9c12.4,0,22.8-4.1,30.4-11.1L91.5,98.4c-4.1,2.8-9.4,4.4-15.6,4.4c-12,0-22.1-8.1-25.8-18.9   L34.9,95.6C42.7,111.1,58.5,120.9,75.9,120.9z"
			/>
			<path class="st12" fill="#F6B704" d="M50.1,83.8c-1.9-5.7-1.9-11.9,0-17.6L34.9,54.4c-6.5,13-6.5,28.3,0,41.2L50.1,83.8z" />
			<path
				fill="#E54335"
				d="M75.9,47.3c6.5-0.1,12.9,2.4,17.6,6.9L106.6,41C98.3,33.2,87.3,29,75.9,29.1c-17.4,0-33.2,9.8-41,25.3   l15.2,11.8C53.8,55.3,63.9,47.3,75.9,47.3z"
			/>
		</SvgIcon>
	)
}
const GoogleLoginButton = React.forwardRef((props, ref) => {
	const { onSuccess, onFailure, callApi=true, sx, postData, render, className, buttonText, cookiePolicy="single_host_origin", ...rest } = props
	const { Api } = useNetworkServices()
	const onGoogleLoginSuccess = useCallback(
		data => {
			if (callApi) {
				Api.proceedWithGoogle({ ...data, ...postData })
					.then(res => {
						if (Function.isFunction(onSuccess)) {
							onSuccess({ ...data, ...res })
						}
					})
					.catch(error => {
						if (Function.isFunction(onFailure)) {
							onFailure(err)
						}
					})
			} else {
				if (Function.isFunction(onSuccess)) {
					onSuccess(data)
				}
			}
		},
		[onSuccess, onFailure, callApi, postData]
	)
	const onGoogleLoginError = useCallback(
		response => {
			console.error(response)
			if (Function.isFunction(onFailure)) {
				onFailure(response)
			}
		},
		[onFailure]
	)



	return (
		<GoogleLogin
			clientId={googleClientId}
			render={({ onClick, disabled, ...renderProps }) => (
				<LoadingButton
					variant="text"
					sx={{
						// color: theme => theme.palette.text.primary,
						backgroundColor: theme => theme.palette.background.paper,
						color: theme => theme.palette.text.primary,
						"&:hover": {
							// backgroundColor: theme => theme.palette.background.paper,
							// color: theme => theme.palette.google.main,
						},
						...sx,
					}}
					className={`capitalize rounded-full px-8 ${disabled? "hidden": ""} ${className? className: ""}`}
					startIcon={<GoogleIcon fontSize={`large`} />}
					onClick={onClick}
					{...rest}
					{...renderProps}
				>
					Proceed with Google
				</LoadingButton>
			)}
			buttonText={buttonText}
			cookiePolicy={cookiePolicy}
			onSuccess={onGoogleLoginSuccess}
			onFailure={onGoogleLoginError}
			ref={ref}
		/>
	)
})
export default React.memo(GoogleLoginButton)
