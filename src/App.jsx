/** @format */

import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { createBrowserHistory } from "history";
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";
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

import Intercom from "react-intercom";

import { ThemeProvider } from "@material-ui/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import ProgressDialog from "components/ProgressDialog";

import { create as createJss } from "jss";
import preset from "jss-preset-default";
import { SheetsRegistry } from "react-jss";
import { JssProvider } from "react-jss";
import { createGenerateClassName } from "react-jss";
import VendorPrefixer from "jss-plugin-vendor-prefixer";
import NestedJSS from "jss-plugin-nested";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import debounce from 'lodash/debounce';
import GlobalsProvider from "contexts/Globals";
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
import { app, theme, theme_dark } from "assets/jss/app-theme";
//
import Routes from "routes";


import "assets/scss/style.scss?v=1.4.0";
import "assets/css/tui-calendar.min.css";

const jss = createJss();
jss.use(VendorPrefixer(), NestedJSS());
const generateClassName = createGenerateClassName();

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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.initializeAppState();		
	}

	initializeAppState(){
		const {
			setIdentity,
			setOperatingSystem,
			setBrowser,
			setScreenSize,
			setWindowSize,
			setNavLoading
		} = this.props;
		
		const deviceDetails = deviceDetect();		

		setIdentity({
			type: isMobileOnly
				? "mobile"
				: isTablet
				? "tablet"
				: isWearable
				? "wearable"
				: isSmartTV
				? "smarttv"
				: isBrowser
				? "browser"
				: "unknown",
			vendor: isMobile ? mobileVendor : "uknown",
			model: isMobile ? mobileModel : "Uknown",
		});
		setOperatingSystem({
			name:
				"osName" in deviceDetails
					? deviceDetails.osName.toLowerCase()
					: "uknown",
			version:
				"osVersion" in deviceDetails
					? deviceDetails.osVersion
					: "uknown",
		});

		

		if (deviceDetails.isBrowser) {
			const browser = {
				name: deviceDetails.browserName.toLowerCase(),
				version: Number.parseNumber(deviceDetails.browserMajorVersion),
			};

			setBrowser({
				name: deviceDetails.browserName,
				version: deviceDetails.browserFullVersion,
			});
			setScreenSize({
				width: window.screen.width,
				height: window.screen.height,
				orientation:
					window.screen.width > window.screen.height
						? "landscape"
						: "potrait",
			});
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
				name:
					window.innerWidth < 600
						? "xs"
						: window.innerWidth >= 600 && window.innerWidth < 960
						? "sm"
						: window.innerWidth >= 960 && window.innerWidth < 1280
						? "md"
						: window.innerWidth > 1280 && window.innerWidth < 1920
						? "lg"
						: "xl",
			});
			window.addEventListener("resize", debounce(function() {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
					name:
						window.innerWidth < 600
							? "xs"
							: window.innerWidth >= 600 &&
							  window.innerWidth < 960
							? "sm"
							: window.innerWidth >= 960 &&
							  window.innerWidth < 1280
							? "md"
							: window.innerWidth >= 1280 &&
							  window.innerWidth < 1920
							? "lg"
							: "xl",
				});
			}, 200));
		}
	}

	componentWillMount() {
		let date1 = new Date(2020, 11, 20, 10, 33);	
		let date2 = new Date(2019, 11, 24, 23, 33);	
		console.log("date1.difference(date2)", date1.difference(date2))
	}

	componentWillUnmount() {
		const { setWindowSize } = this.props;
		if (isBrowser) {
			window.removeEventListener("resize", function() {
				setWindowSize({ width: 1, height: 1 });
			});
		}
		Auth.destroyInstance();
	}

	async onWindowResize() {
		const { setWindowSize } = this.props;
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
			name:
				window.innerWidth < 600
					? "xs"
					: window.innerWidth >= 600 && window.innerWidth < 960
					? "sm"
					: window.innerWidth >= 960 && window.innerWidth < 1280
					? "md"
					: window.innerWidth >= 1280 && window.innerWidth < 1920
					? "lg"
					: "xl",
		});
	}

	render() {
		const {app: {preferences, initialized}} = this.props;

		return (
			<CacheBuster>
				{({ loading, isLatestVersion, refreshCacheAndReload }) => {
					if (loading) return null;
					if (!loading && !isLatestVersion) {
						refreshCacheAndReload();
					}

					return (
						<GlobalsProvider >
							<ThemeProvider theme={preferences.theme==="dark"? theme_dark :  theme}>
								<MuiThemeProvider theme={preferences.theme==="dark"? theme_dark :  theme}>
									<CssBaseline />
									<JssProvider jss={jss} generateClassName={generateClassName} registry={sheets} >
										<MuiPickersUtilsProvider utils={MomentUtils}>
											<BrowserRouter forceRefresh={false}>												
												<Routes />												
											</BrowserRouter>
										</MuiPickersUtilsProvider>
									</JssProvider>
									<CookiesConsentDialog/>
									<ProgressDialog open={!initialized} hideBackdrop={false}/>
								</MuiThemeProvider>
							</ThemeProvider>			
						</GlobalsProvider>
					);
				}}
			</CacheBuster>
		);
	}
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {
	setIdentity,
	setOperatingSystem,
	setBrowser,
	setScreenSize,
	setWindowSize,
})(App);
