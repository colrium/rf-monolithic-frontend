/** @format */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
	deviceDetect,
	isMobile,
	isMobileOnly,
	isTablet,
	isBrowser,
	isSmartTV,
	isWearable,
	mobileVendor,
	mobileModel,
} from "react-device-detect";

import CacheBuster from 'hoc/CacheBuster';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { FirebaseAppProvider, FirestoreProvider } from 'reactfire';

import CssBaseline from "@mui/material/CssBaseline";
import ProgressDialog from "components/ProgressDialog";

import { create as createJss } from "jss";
import preset from "jss-preset-default";
import { SheetsRegistry } from "react-jss";
import { JssProvider } from "react-jss";
import VendorPrefixer from "jss-plugin-vendor-prefixer";
import NestedJSS from "jss-plugin-nested";
import useMediaQuery from '@mui/material/useMediaQuery';


import GlobalsProvider from "contexts/Globals";
import { NetworkServicesProvider, PersistentFormsProvider } from "contexts";
import CookiesConsentDialog from 'views/widgets/CookiesConsentDialog';
import {
	setIdentity,
	setOperatingSystem,
	setBrowser,
	setScreenSize,
	setWindowSize,
} from "state/actions";

import Auth from "hoc/Auth";

import appStyle from "assets/jss/appStyle";
import { theme } from "assets/jss/app-theme";
//
import Routes from "routes";
import { firebase as firebaseConfig } from "config";


import "assets/scss/style.scss?v=1.4.0";
import "assets/css/tui-calendar.min.css";
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-virtualized/styles.css';
//import 'react-awesome-query-builder/lib/css/compact_styles.css';

const jss = createJss();
jss.use(VendorPrefixer(), NestedJSS());
//const generateClassName = createGenerateClassName();

const setupJss = () => {
	jss.setup(preset());
	const sheetsRegistry = new SheetsRegistry();
	const globalStyleSheet = jss
		.createStyleSheet({ "@global": { ...appStyle } })
		.attach();
	sheetsRegistry.add(globalStyleSheet);
	return sheetsRegistry;
};

const sheets = setupJss();


const App = (props) => {
	const { app: { preferences, initialized } } = props;
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const appTheme = React.useMemo(() => {
		let computedTheme = theme;
		computedTheme.palette.mode = prefersDarkMode || preferences.theme === "dark" ? "dark" : "light";
		return createTheme(computedTheme);
	}, [prefersDarkMode, preferences.theme]);
	// return (
	// 	<CacheBuster>
	// 		{({ loading, isLatestVersion, refreshCacheAndReload }) => {
	// 			if (loading) return null;
	// 			if (!loading && !isLatestVersion) {
	// 				refreshCacheAndReload();
	// 			}

	// 			return (
	// 				<FirebaseAppProvider firebaseConfig={firebaseConfig}>
	// 					<GlobalsProvider >

	// 						<ThemeProvider theme={appTheme}>
	// 							{/* <CssBaseline /> */}
	// 							{/* <JssProvider jss={jss} generateClassName={generateClassName} registry={sheets} > */}
	// 							<JssProvider jss={jss} registry={sheets} >
	// 								<BrowserRouter forceRefresh={false}>
	// 									<Routes />
	// 								</BrowserRouter>
	// 							</JssProvider>
	// 							<CookiesConsentDialog />
	// 							<ProgressDialog open={!initialized} hideBackdrop={false} />
	// 						</ThemeProvider>

	// 					</GlobalsProvider>
	// 				</FirebaseAppProvider>
	// 			);
	// 		}}
	// 	</CacheBuster>
	// );

	return (


		<ThemeProvider theme={appTheme}>
			{/* <CssBaseline /> */}
			{/* <JssProvider jss={jss} generateClassName={generateClassName} registry={sheets} > */}
			<NetworkServicesProvider >
				<PersistentFormsProvider>
				<JssProvider jss={jss} registry={sheets} >
					<BrowserRouter forceRefresh={false}>
						<Routes />
					</BrowserRouter>
				</JssProvider>
				<CookiesConsentDialog />
				</PersistentFormsProvider>
				{/* <ProgressDialog open={!initialized} hideBackdrop={false} /> */}
			</NetworkServicesProvider>
		</ThemeProvider>



	);

}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(App);
