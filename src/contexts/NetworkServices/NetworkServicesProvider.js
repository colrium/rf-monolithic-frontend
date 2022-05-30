/** @format */

import React, { useEffect, useCallback, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNetworkState } from "react-use"
import { baseUrls, client_id, client_secret, environment, authTokenLocation, authTokenName, googleClientId } from "config"
//
import WebSocketService from "./WebSocketService"
import NetworkServicesContext from "./NetworkServicesContext"
import { setAuthenticated, setCurrentUser, setToken, clearAppState, setPreferences, setSettings } from "state/actions"
import * as definations from "definations"
import Api from "services/Api"
import { EventRegister } from "utils"
import { useDidMount } from "hooks"

const NetworkServicesProvider = props => {
	const { children, notificationType, ...rest } = props

	const dispatch = useDispatch()
	const preferences = useSelector(state => ({ ...state.app?.preferences }))
	const settings = useSelector(state => ({ ...state.app?.settings }))
	const { user, isAuthenticated } = useSelector(state => state.auth)

	const networkState = useNetworkState()

	const handleOnAccessTokenSet = useCallback(token => {
		const { access_token, token_type, refresh_token } = token || {}
		if (authTokenLocation === "redux") {
			dispatch(setToken(token || {}))
		}
	}, [])

	const handleOnAccessTokenUnset = useCallback(event => {
		if (authTokenLocation === "redux") {
			dispatch(setToken({}))
		}
	}, [])

	const handleOnLogin = useCallback(event => {
		const { profile, token } = { ...event.detail }
		if (JSON.isJSON(profile)) {
			dispatch(setCurrentUser(profile))
		}
		dispatch(setAuthenticated(true))
		EventRegister.emit("notification", {
			severity: "success",
			title: `Login successful!`,
			content: `Welcome back ${profile.first_name || ""} ${profile.last_name || ""}!`,
		})
	}, [])

	const handleOnLogout = useCallback(() => {
		dispatch(setAuthenticated(false))
		dispatch(setCurrentUser(null))
		dispatch(clearAppState())
	}, [])

	const updatePreferences = useCallback(
		async (name, new_value) => {
			let updatedValue = false
			if (String.isString(name) && !String.isEmpty(name) && isAuthenticated) {
				let slug = name.toLowerCase().variablelize("-")
				if (new_value !== preferences[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
						user: user?._id,
					}
					return await Api.post(`/preferences`, postData, {
						params: { create: 1, placement: "slug" },
					})
				}
			} else {
				throw { msg: "missing name" }
			}
		},
		[preferences, isAuthenticated, user]
	)

	const updateSettings = useCallback(
		async (name, new_value) => {
			let updatedValue = false
			if (String.isString(name) && !String.isEmpty(name) && isAuthenticated) {
				let slug = name.toLowerCase().variablelize("-")
				if (new_value !== settings[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
					}
					return await Api.put(`/settings/${slug}`, postData, {
						params: { create: 1, placement: "slug" },
					})
				}
			} else {
				throw { msg: "missing name" }
			}
		},
		[settings, isAuthenticated]
	)

	const initializeAuthSubscriptions = useCallback(() => {
		const onAccessTokenSetListener = EventRegister.on("access-token-set", event => handleOnAccessTokenSet(event.detail))
		const onAccessTokenUnsetListener = EventRegister.on("access-token-unset", handleOnAccessTokenUnset)
		const onLoginListener = EventRegister.on("login", handleOnLogin)
		const onLogoutListener = EventRegister.on("logout", handleOnLogout)
		return () => {
			onAccessTokenSetListener.remove()
			onAccessTokenUnsetListener.remove()
			onLoginListener.remove()
			onLogoutListener.remove()
		}
	}, [isAuthenticated])

	const initializePreferencesSubscriptions = useCallback(() => {
		const onChangePreferencesSubscription = EventRegister.on("change-preferences", event => {
			if (JSON.isJSON(event.detail)) {
				let eventPreferences = Object.entries(event.detail).reduce((allPreferences, [key, value]) => {
					allPreferences[key] = value
					updatePreferences(key, value).catch(err => {
						console.error("updatePreferences err", err)
					})
					return allPreferences
				}, {})
				let newPreferences = JSON.deepMerge(preferences, eventPreferences)
				dispatch(setPreferences(newPreferences))
			}
		})

		return () => {
			onChangePreferencesSubscription.remove()
		}
	}, [])

	const initializeSettingsSubscriptions = useCallback(() => {
		const onChangeSettingSubscription = EventRegister.on("change-settings", event => {
			if (JSON.isJSON(event.detail)) {
				let eventSettings = Object.entries(event.detail).reduce((allSettings, [key, value]) => {
					allSettings[key] = value
					updateSettings(key, value).catch(err => {
						console.error("updatePreferences err", err)
					})
					return allSettings
				}, {})
				let newSettings = JSON.deepMerge(settings, eventSettings)
				dispatch(setSettings(newSettings))
			}
		})

		return () => {
			onChangeSettingSubscription.remove()
		}
	}, [settings])

	useDidMount(() => {
		const removeAuthSubscritions = initializeAuthSubscriptions()
		const removePreferencesSubscritions = initializePreferencesSubscriptions()
		const removeSettingsSubscritions = initializeSettingsSubscriptions()

		return () => {
			removeAuthSubscritions()
			removePreferencesSubscritions()
			removeSettingsSubscritions()
		}
	})
	return (
		<WebSocketService>
			{SocketIO => (
				<NetworkServicesContext.Provider value={{ SocketIO, Api, network: networkState, definations }} {...rest}>
					{children}
				</NetworkServicesContext.Provider>
			)}
		</WebSocketService>
	)
}

export default NetworkServicesProvider
