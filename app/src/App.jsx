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



import {
	NetworkServicesProvider,
} from "contexts"
import CookiesConsentDialog from "views/widgets/CookiesConsentDialog"

import Auth from "utils/Auth"

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
	const globalStyleSheet = jss
		.createStyleSheet({ "@global": { ...appStyle } })
		.attach()
	sheetsRegistry.add(globalStyleSheet)
	return sheetsRegistry
}

const sheets = setupJss()

const App = props => {
	const {
		app: { preferences, initialized },
	} = props
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
	const appTheme = React.useMemo(() => {
		let computedTheme = theme
		computedTheme.palette.mode =
			prefersDarkMode || preferences.theme === "dark" ? "dark" : "light"
		return createTheme(computedTheme)
	}, [prefersDarkMode, preferences.theme])
	// return (
	// 	<CacheBuster>
	// 		{({ loading, isLatestVersion, refreshCacheAndReload }) => {
	// 			if (loading) return null;
	// 			if (!loading && !isLatestVersion) {
	// 				refreshCacheAndReload();
	// 			}

	// 			return (
	// 				<ThemeProvider theme={appTheme}>
	// 	<NetworkServicesProvider >
	// 			<ApiDataProvider>
	// 				<JssProvider jss={jss} registry={sheets} >
	// 					<BrowserRouter forceRefresh={false}>
	// 						<Routes />
	// 					</BrowserRouter>
	// 				</JssProvider>
	// 				<CookiesConsentDialog />
	// 			</ApiDataProvider>
	// 	</NetworkServicesProvider>
	// </ThemeProvider>
	// 			);
	// 		}}
	// 	</CacheBuster>
	// );

	return (
		<ThemeProvider theme={appTheme}>
			<NetworkServicesProvider>
					<JssProvider jss={jss} registry={sheets}>
						<BrowserRouter forceRefresh={false}>
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
