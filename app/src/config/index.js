/** @format */

//App constants
export const appName = (process.env.NODE_ENV === "development" ? "DEV::" : "") + "Realfield";
export const appDescription = "Realfield Dashboard";
export const appLogo = "https://api.realfield.io/public/img/realfield/logo.svg";
//

//Colorscheme
export const defaultColor = "#000000";
export const primaryColor = "#00AF41";
export const primaryLightColor = "#006D28";
export const primaryDarkColor = "#006D28";
export const secondaryColor = "#76C4D5";
export const accentColor = "#8C189B";
export const inverseColor = "#FFFFFF";
export const iconsColor = "#495057";
export const textColor = defaultColor;
export const warningColor = "#F38B00";
export const dangerColor = "#f44336";
export const errorColor = "#EB0029";
export const successColor = "#00AF41";
export const infoColor = "#00acc1";
export const roseColor = "#e91e63";
export const grayColor = "#999999";
export const twitterColor = "#55ACEE";
export const facebookColor = "#3B5998";
export const googleColor = "#DD4B39";
export const githubColor = "#333333";
export const linkedinColor = "#0e76a8";

export const authTokenLocation = "cookie"; // "cookie" or "redux";

export const authTokenName = "rf_auth";

export const surpressed_logs = ['Warning:', 'Deprecation', 'Material-UI:', './src/', '[Deprecation]', 'There were more warnings in other files', 'WebSocket'];

export const environment = process.env.NODE_ENV;
export const client_id = process.env.REACT_APP_CLIENT_ID;
export const client_secret = process.env.REACT_APP_CLIENT_SECRET;

export const firebase = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const firebaseWebPushCertificate = "BCRs2cCvL59gp6AyJybuna4N7migtv4c6O6Twvgpg0-FE8yAhAmEpYNRc7YwV4T4QjhLQkds8U2NUS6ZVxVChXw";


export const baseUrls = {
	domain: environment == "development" ? "realfield.workspace" : process.env.REACT_APP_DOMAIN,
	host: environment == "development" ? "realfield.workspace" : process.env.REACT_APP_API_HOST, // This is for development and experimentation purposes only to cater for docker loadbalancer/proxy scenarios. Its considered unsecure to set or accept requests with a HOST header/parameter.
	api: environment == "development" ? "http://api.realfield.workspace" : process.env.REACT_APP_API_ENDPOINT,
};



export const google_maps_url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_MAPS_KEY + "&v=3.exp&libraries=geometry,drawing,places";

export const default_location = { lat: -1.2921, lng: 36.8219 };

export const auth_token = {
	location: process.env.REACT_APP_AUTH_TOKEN_LOCATION,
	name: process.env.REACT_APP_AUTH_TOKEN_NAME,
};

export const apiClient = {
	client_id: process.env.REACT_APP_CLIENT_ID,
	client_secret: process.env.REACT_APP_CLIENT_SECRET,
};

export const google_maps = {
	url:
		"https://maps.googleapis.com/maps/api/js?key=" +
		process.env.REACT_APP_GOOGLE_MAPS_KEY +
		"&v=3.exp&libraries=geometry,drawing,places",
	default_center: { lat: -1.2921, lng: 36.8219 },
};

export const google_maps_api_key = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export const builderIO = {
	public_api_key: process.env.REACT_APP_BUILDER_IO_PUBLIC_API_KEY,
};

export const intercom = {
	app: {
		id: process.env.REACT_APP_INTERCOM_APP_ID,
	},
	user: {
		user_id: process.env.REACT_APP_INTERCOM_USER_ID,
		email: process.env.REACT_APP_INTERCOM_USER_EMAIL,
		name: process.env.REACT_APP_INTERCOM_USER_NAME,
	},
};

export const dashboardBaseUri = "/dashboard";
export const landingPageBaseUri = "/page";
export const orderFormBaseUri = "/order";

export const logRedux = false;

export const locales = {
	"en": "English(UK)",
	"en-us": "English(US)",
};
