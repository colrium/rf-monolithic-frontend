/** @format */

import React, { useMemo } from "react"
import { BrowserRouter } from "react-router-dom"
import { connect } from "react-redux"

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import { NotificationsQueueProvider } from "contexts/NotificationsQueue"
import { NetworkServicesProvider, CacheBusterProvider } from "contexts"
import ProgressDialog from "components/ProgressDialog"
import compose from "recompose/compose"
import { create as createJss } from "jss"
import preset from "jss-preset-default"
import { SheetsRegistry } from "react-jss"
import { JssProvider } from "react-jss"
import VendorPrefixer from "jss-plugin-vendor-prefixer"
import NestedJSS from "jss-plugin-nested"
import useMediaQuery from "@mui/material/useMediaQuery"

import appStyle from "assets/jss/appStyle"
import { theme } from "assets/jss/app-theme"
import { useDerivedState, useDidMount } from "hooks"
//
import Routes from "routes"
import * as serviceWorker from "./serviceWorker"
import "react-virtualized/styles.css"
import "./index.css"

const jss = createJss()
jss.use(VendorPrefixer(), NestedJSS())

const setupJss = () => {
	jss.setup(preset())
	const sheetsRegistry = new SheetsRegistry()
	// const globalStyleSheet = jss.createStyleSheet({ "@global": { ...appStyle } }).attach()
	// sheetsRegistry.add(globalStyleSheet)
	return sheetsRegistry
}

const sheets = setupJss()

const App = props => {
	const {
		app: { preferences, initialized },
	} = props
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
	const supportsFirebase = useMemo(() => {
		try {
			return (
				!["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
				// iPad on iOS 13 detection
				!(navigator.userAgent.includes("Mac") && "ontouchend" in document)
			)
		} catch (error) {
			return false
		}
	}, [])
	const [evaluatedTheme] = useDerivedState(
		() => {
			let themeMode = preferences.theme === "dark" ? "dark" : "light"
			let computedTheme = theme
			computedTheme.palette.mode = themeMode

			computedTheme.palette.background = {
				default: themeMode === "dark" ? "#2b2b2b" : "#f3f3f3",
				paper: themeMode === "dark" ? "#121212" : "#ffffff",
			}

			computedTheme.palette.text = {
				primary: themeMode === "dark" ? "#ffffff" : "#424242",
				contrast: themeMode === "dark" ? "#1a1a1a" : "#ffffff",
				contrastDark: themeMode === "dark" ? "#ffffff" : "#141414",
				secondary: themeMode === "dark" ? "#d4d4d4" : "#737373",
				disabled: "#999999",
			}
			const memoizedTheme = createTheme({
				...computedTheme,
				components: {
					MuiFormControl: {
						styleOverrides: {
							marginDense: {
								marginTop: `0px !important`,
							},
						},
					},
				},
			})

			return memoizedTheme
		},
		[preferences.theme],
		theme
	)

	useDidMount(() => {
		try {
			console.log("supportsFirebase", supportsFirebase)
			if (Function.isFunction(window?.navigator?.serviceWorker?.register)) {
				if (supportsFirebase) {
					// navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)
				}
				serviceWorker.register()
			}
		} catch (error) {
			console.error(error)
		}
	})

	return (
		<CacheBusterProvider>
			<ThemeProvider theme={evaluatedTheme}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<JssProvider jss={jss} registry={sheets}>
						<NetworkServicesProvider>
							<NotificationsQueueProvider>
								<BrowserRouter>
									<Routes />
								</BrowserRouter>
							</NotificationsQueueProvider>
						</NetworkServicesProvider>
					</JssProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</CacheBusterProvider>
	)
}

const mapStateToProps = state => ({
	app: state.app,
})

export default compose(connect(mapStateToProps, {}))(App)
