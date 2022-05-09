/** @format */

import { useEffect } from "react"
import useScript from "./useScript"

const scriptFlag = "__googleOneTapScript__"
const googleClientScriptURL = "https://accounts.google.com/gsi/client"
const oauthEndpointURL = "https://oauth2.googleapis.com/tokeninfo?id_token="

function callback({
	data,
	onError,
	onSuccess,
}) {
	if (data?.credential) {
		fetch(`${oauthEndpointURL}${data.credential}`)
			.then(resp => {
				if (resp?.status === 200 && resp?.json) {
					return resp.json()
				} else {
					if (onError) {
						onError()
					}
					throw new Error("Something went wrong")
				}
			})
			.then((resp) => {
				if (onSuccess) {
					onSuccess(resp)
				}
			})
			.catch(error => {
				if (onError) {
					onError(error)
				}
				throw error
			})
	}
}

export default function useGoogleOneTapLogin({
	onError,
	disabled,
	onSuccess,
	googleAccountConfigs,
	disableCancelOnUnmount = false,
}) {
	const script = useScript(googleClientScriptURL)
	// Use the user's custom callback if they specified one; otherwise use the default one defined above:
	const callbackToUse = googleAccountConfigs.callback
		? googleAccountConfigs.callback
		: (data) => callback({ data, onError, onSuccess })

	useEffect(() => {
		if (!window?.[scriptFlag] && window.google && script === "ready") {
			window.google.accounts.id.initialize({
				...googleAccountConfigs,
				callback: callbackToUse,
			})
			window[scriptFlag] = true
		}
		if (window?.[scriptFlag] && script === "ready" && !disabled) {
			window.google.accounts.id.prompt()

			return () => {
				if (!disableCancelOnUnmount) {
					window.google.accounts.id.cancel()
				}
			}
		}
	}, [script, window?.[scriptFlag], disabled])

	return null
}
