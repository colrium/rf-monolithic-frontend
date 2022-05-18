/** @format */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import CacheBuster from 'hoc/CacheBuster';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NetworkServicesProvider, NotificationsQueueProvider } from "contexts"
import ProgressDialog from "components/ProgressDialog"

import { create as createJss } from "jss"
import preset from "jss-preset-default"
import { SheetsRegistry } from "react-jss"
import { JssProvider } from "react-jss"
import VendorPrefixer from "jss-plugin-vendor-prefixer"
import NestedJSS from "jss-plugin-nested"
import useMediaQuery from "@mui/material/useMediaQuery"

import appStyle from "assets/jss/appStyle"
import { theme } from "assets/jss/app-theme"
import { useDeepMemo } from "hooks"
//
import Routes from "routes"
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
	const evaluatedTheme = useDeepMemo(
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

	return (
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
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(App);
