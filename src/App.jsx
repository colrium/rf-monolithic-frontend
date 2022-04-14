/** @format */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";

import CacheBuster from 'hoc/CacheBuster';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import ProgressDialog from "components/ProgressDialog";

import { create as createJss } from "jss";
import preset from "jss-preset-default";
import { SheetsRegistry } from "react-jss";
import { JssProvider } from "react-jss";
import VendorPrefixer from "jss-plugin-vendor-prefixer";
import NestedJSS from "jss-plugin-nested";
import useMediaQuery from '@mui/material/useMediaQuery';



import { NetworkServicesProvider } from "contexts"
import CookiesConsentDialog from "views/widgets/CookiesConsentDialog"

import appStyle from "assets/jss/appStyle"
import { theme } from "assets/jss/app-theme"
//
import Routes from "routes"
import "assets/css/tui-calendar.min.css"
import "react-awesome-query-builder/lib/css/styles.css"
import "react-virtualized/styles.css"

const jss = createJss()
jss.use(VendorPrefixer(), NestedJSS())

const setupJss = () => {
	jss.setup(preset())
	const sheetsRegistry = new SheetsRegistry()
	const globalStyleSheet = jss.createStyleSheet({ "@global": { ...appStyle } }).attach()
	sheetsRegistry.add(globalStyleSheet)
	return sheetsRegistry
}

const sheets = setupJss()

const App = props => {
	const {
		app: { preferences, initialized },
	} = props
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
	const getAppTheme = React.useCallback(() => {
		let themeMode = prefersDarkMode || preferences.theme === "dark" ? "dark" : "light"
		let computedTheme = theme
		computedTheme.palette.mode = themeMode
		computedTheme.palette.background = {
			default: themeMode === "dark" ? "#2b2b2b" : "#f5f5f5",
			paper: themeMode === "dark" ? "#121212" : "#ffffff",
		}

		computedTheme.palette.text = {
			primary: themeMode === "dark" ? "#ffffff" : "#1a1a1a",
			contrast: themeMode === "dark" ? "#1a1a1a" : "#ffffff",
			contrastDark: themeMode === "dark" ? "#ffffff" : "#141414",
			secondary: themeMode === "dark" ? "#d4d4d4" : "#737373",
			disabled: "#999999",
		}
		return createTheme(computedTheme)
	}, [prefersDarkMode, preferences.theme])

	return (
		<ThemeProvider theme={getAppTheme()}>
			<NetworkServicesProvider>
				<JssProvider jss={jss} registry={sheets}>
						<BrowserRouter>
							<Routes />
						</BrowserRouter>
				</JssProvider>
				<CookiesConsentDialog />
			</NetworkServicesProvider>
		</ThemeProvider>
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(App);
