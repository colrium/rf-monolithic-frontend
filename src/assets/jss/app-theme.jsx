/**
 * /* eslint-disable
 *
 * @format
 */

// ##############################
// App Theme and
// Styles that are used on more than one component
// #############################
import {
	appName,
	appDescription,
	appLogo,
	defaultColor,
	primaryColor,
	primaryLightColor,
	primaryDarkColor,
	secondaryColor,
	accentColor,
	inverseColor,
	iconsColor,
	textColor,
	warningColor,
	dangerColor,
	errorColor,
	successColor,
	infoColor,
	roseColor,
	grayColor,
	twitterColor,
	facebookColor,
	googleColor,
	githubColor,
	linkedinColor,
} from "config";

import Color from "color";

import { createMuiTheme } from "@material-ui/core/styles";
import AvenirWoff from 'assets/fonts/Avenir.woff';
import MuliRegular from 'assets/fonts/Muli-Regular.woff';
import MuliItalic from 'assets/fonts/Muli-Italic.woff';
import MuliBlack from 'assets/fonts/Muli-Black.woff';
import MuliBlackItalic from 'assets/fonts/Muli-BlackItalic.woff';
import MuliBold from 'assets/fonts/Muli-Bold.woff';
import MuliBoldItalic from 'assets/fonts/Muli-BoldItalic.woff';
import MuliExtraBold from 'assets/fonts/Muli-ExtraBold.woff';
import MuliExtraBoldItalic from 'assets/fonts/Muli-ExtraBoldItalic.woff';
import MuliExtraLight from 'assets/fonts/Muli-ExtraLight.woff';
import MuliExtraLightItalic from 'assets/fonts/Muli-ExtraLightItalic.woff';
import MuliLight from 'assets/fonts/Muli-Light.woff';
import MuliLightItalic from 'assets/fonts/Muli-LightItalic.woff';
import MuliSemiBold from 'assets/fonts/Muli-SemiBold.woff';
import MuliSemiBoldItalic from 'assets/fonts/Muli-SemiBoldItalic.woff';
import MaterialIconsWoff2 from 'assets/fonts/MaterialIcons-Regular.woff2';



const materialIconsFont = {
	fontFamily: 'Material Icons',
	fontWeight: 400,
	fontStyle: "normal",
	src: `url(${MaterialIconsWoff2}) format("woff2");`,
};

const avenirFont = {
	fontFamily: 'Avenir',
	fontWeight: 400,
	fontStyle: "normal",
	src: `url(${AvenirWoff}) format("woff");`,
};

const muliRegularFont = {
	fontFamily: 'Muli',
	fontWeight: 400,
	fontDisplay: 'swap',
	src: `
		local('Muli'),
		local('Muli Regular'),
		url(${MuliRegular}) format('woff')
	`,
};

const muliItalicFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 400,
	src: `
		local('Muli'),
		local('Muli Italic'),
		url(${MuliItalic}) format('woff')
	`,
};


const muliBlackFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 900,
	src: `
		local('Muli'),
		local('Muli Black'),
		url(${MuliBlack}) format('woff')
	`,
};

const muliBlackItalicFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 900,
	src: `
		local('Muli'),
		local('Muli Black Italic'),
		url(${MuliBlackItalic}) format('woff')
	`,
};

const muliBoldFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 700,
	src: `
		local('Muli'),
		local('Muli Bold'),
		url(${MuliBold}) format('woff')
	`,
};

const muliBoldItalicFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 700,
	src: `
		local('Muli'),
		local('Muli Bold Italic'),
		url(${MuliBoldItalic}) format('woff')
	`,
};

const muliExtraBoldFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 800,
	src: `
		local('Muli'),
		local('Muli Extra Bold'),
		url(${MuliExtraBold}) format('woff')
	`,
};

const muliExtraBoldItalicFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 800,
	src: `
		local('Muli'),
		local('Muli Extra Bold Italic'),
		url(${MuliExtraBoldItalic}) format('woff')
	`,
};


const muliExtraLightFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 200,
	src: `
		local('Muli'),
		local('Muli Extra Light'),
		url(${MuliExtraLight}) format('woff')
	`,
};

const muliExtraLightItalicFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 200,
	src: `
		local('Muli'),
		local('Muli Extra Light Italic'),
		url(${MuliExtraLightItalic}) format('woff')
	`,
};

const muliLightFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 300,
	src: `
		local('Muli'),
		local('Muli Light'),
		url(${MuliLight}) format('woff')
	`,
};

const muliLightItalicFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 300,
	src: `
		local('Muli'),
		local('Muli Light Italic'),
		url(${MuliLightItalic}) format('woff')
	`,
};

const muliSemiBoldFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 600,
	src: `
		local('Muli'),
		local('Muli Semi Bold'),
		url(${MuliSemiBold}) format('woff')
	`,
};

const muliSemiBoldItalicFont = {
	fontFamily: 'Muli',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 600,
	src: `
		local('Muli'),
		local('Muli Semi Bold Italic'),
		url(${MuliSemiBoldItalic}) format('woff')
	`,
};




const app = {
	name: appName,
	description: appDescription,
	logo: appLogo,
	drawer: {
		width: 280,
	},
	title: (...subtitles) => {
		let titleStr = "";
		for (var i = 0; i < subtitles.length; i++) {
			titleStr += "-" + subtitles[i];
		}
		return appName + titleStr;
	},
};

const defaultColorRgb = Color(defaultColor)
	.rgb()
	.array()
	.join(",");
const primaryColorRgb = Color(primaryColor)
	.rgb()
	.array()
	.join(",");
const primaryDarkColorRgb = Color(primaryDarkColor)
	.rgb()
	.array()
	.join(",");
const secondaryColorRgb = Color(secondaryColor)
	.rgb()
	.array()
	.join(",");
const accentColorRgb = Color(accentColor)
	.rgb()
	.array()
	.join(",");
const inverseColorRgb = Color(inverseColor)
	.rgb()
	.array()
	.join(",");
const textColorRgb = Color(textColor)
	.rgb()
	.array()
	.join(",");
const warningColorRgb = Color(warningColor)
	.rgb()
	.array()
	.join(",");
const dangerColorRgb = Color(dangerColor)
	.rgb()
	.array()
	.join(",");
const errorColorRgb = Color(errorColor)
	.rgb()
	.array()
	.join(",");
const successColorRgb = Color(successColor)
	.rgb()
	.array()
	.join(",");
const infoColorRgb = Color(infoColor)
	.rgb()
	.array()
	.join(",");
const roseColorRgb = Color(roseColor)
	.rgb()
	.array()
	.join(",");
const grayColorRgb = Color(grayColor)
	.rgb()
	.array()
	.join(",");
const twitterColorRgb = Color(twitterColor)
	.rgb()
	.array()
	.join(",");
const facebookColorRgb = Color(facebookColor)
	.rgb()
	.array()
	.join(",");
const googleColorRgb = Color(googleColor)
	.rgb()
	.array()
	.join(",");
const githubColorRgb = Color(githubColor)
	.rgb()
	.array()
	.join(",");
const linkedinColorRgb = Color(linkedinColor)
	.rgb()
	.array()
	.join(",");

const colors = {
	names: [
		"default",
		"primary",
		"primarydark",
		"secondary",
		"accent",
		"inverse",
		"error",
		"info",
		"success",
		"warning",
		"danger",
		"rose",
		"grey",
		"facebook",
		"twitter",
		"google",
		"github",
		"linkedin",
		"inherit",
	],
	hex: {
		default: defaultColor,
		primary: primaryColor,
		primarydark: primaryDarkColor,
		secondary: secondaryColor,
		accent: accentColor,
		inverse: inverseColor,
		warning: warningColor,
		danger: dangerColor,
		error: errorColor,
		success: successColor,
		info: infoColor,
		rose: roseColor,
		grey: grayColor,
		twitter: twitterColor,
		facebook: facebookColor,
		google: googleColor,
		github: githubColor,
		linkedin: linkedinColor,
	},
	rgb: {
		default: defaultColorRgb,
		primary: primaryColorRgb,
		primarydark: primaryDarkColorRgb,
		secondary: secondaryColorRgb,
		accent: accentColorRgb,
		inverse: inverseColorRgb,
		warning: warningColorRgb,
		danger: dangerColorRgb,
		error: errorColorRgb,
		success: successColorRgb,
		info: infoColorRgb,
		rose: roseColorRgb,
		grey: grayColorRgb,
		twitter: twitterColorRgb,
		facebook: facebookColorRgb,
		google: googleColorRgb,
		github: githubColorRgb,
		linkedin: linkedinColorRgb,
	},
};


let defaultPallete = {
	red: {
		main: "#f44336",
		lighten_5: "#ffebee",
		lighten_4: "#ffcdd2",
		lighten_3: "#ef9a9a",
		lighten_2: "#e57373",
		lighten_1: "#ef5350",
		darken_1: "#e53935",
		darken_2: "#d32f2f",
		darken_3: "#c62828",
		darken_4: "#b71c1c",
		accent_1: "#ff8a80",
		accent_2: "#ff5252",
		accent_3: "#ff1744",
		accent_4: "#d50000",
	},
	pink: {
		main: "#e91e63",
		lighten_5: "#fce4ec",
		lighten_4: "#f8bbd0",
		lighten_3: "#f48fb1",
		lighten_2: "#f06292",
		lighten_1: "#ec407a",
		darken_1: "#d81b60",
		darken_2: "#c2185b",
		darken_3: "#ad1457",
		darken_4: "#880e4f",
		accent_1: "#ff80ab",
		accent_2: "#ff4081",
		accent_3: "#f50057",
		accent_4: "#c51162",
	},
	purple: {
		main: "#9c27b0",
		lighten_5: "#f3e5f5",
		lighten_4: "#e1bee7",
		lighten_3: "#ce93d8",
		lighten_2: "#ba68c8",
		lighten_1: "#ab47bc",
		darken_1: "#8e24aa",
		darken_2: "#7b1fa2",
		darken_3: "#6a1b9a",
		darken_4: "#4a148c",
		accent_1: "#ea80fc",
		accent_2: "#e040fb",
		accent_3: "#d500f9",
		accent_4: "#aa00ff",
	},
	deep_purple: {
		main: "#673ab7",
		lighten_5: "#ede7f6",
		lighten_4: "#d1c4e9",
		lighten_3: "#b39ddb",
		lighten_2: "#9575cd",
		lighten_1: "#7e57c2",
		darken_1: "#5e35b1",
		darken_2: "#512da8",
		darken_3: "#4527a0",
		darken_4: "#311b92",
		accent_1: "#b388ff",
		accent_2: "#7c4dff",
		accent_3: "#651fff",
		accent_4: "#6200ea",
	},
	indigo: {
		main: "#3f51b5",
		lighten_5: "#e8eaf6",
		lighten_4: "#c5cae9",
		lighten_3: "#9fa8da",
		lighten_2: "#7986cb",
		lighten_1: "#5c6bc0",
		darken_1: "#3949ab",
		darken_2: "#303f9f",
		darken_3: "#283593",
		darken_4: "#1a237e",
		accent_1: "#8c9eff",
		accent_2: "#536dfe",
		accent_3: "#3d5afe",
		accent_4: "#304ffe",
	},
	blue: {
		main: "#2196f3",
		lighten_5: "#e3f2fd",
		lighten_4: "#bbdefb",
		lighten_3: "#90caf9",
		lighten_2: "#64b5f6",
		lighten_1: "#42a5f5",
		darken_1: "#1e88e5",
		darken_2: "#1976d2",
		darken_3: "#1565c0",
		darken_4: "#0d47a1",
		accent_1: "#82b1ff",
		accent_2: "#448aff",
		accent_3: "#2979ff",
		accent_4: "#2962ff",
	},
	light_blue: {
		main: "#03a9f4",
		lighten_5: "#e1f5fe",
		lighten_4: "#b3e5fc",
		lighten_3: "#81d4fa",
		lighten_2: "#4fc3f7",
		lighten_1: "#29b6f6",
		darken_1: "#039be5",
		darken_2: "#0288d1",
		darken_3: "#0277bd",
		darken_4: "#01579b",
		accent_1: "#80d8ff",
		accent_2: "#40c4ff",
		accent_3: "#00b0ff",
		accent_4: "#0091ea",
	},
	cyan: {
		main: "#00bcd4",
		lighten_5: "#e0f7fa",
		lighten_4: "#b2ebf2",
		lighten_3: "#80deea",
		lighten_2: "#4dd0e1",
		lighten_1: "#26c6da",
		darken_1: "#00acc1",
		darken_2: "#0097a7",
		darken_3: "#00838f",
		darken_4: "#006064",
		accent_1: "#84ffff",
		accent_2: "#18ffff",
		accent_3: "#00e5ff",
		accent_4: "#00b8d4",
	},
	teal: {
		main: "#009688",
		lighten_5: "#e0f2f1",
		lighten_4: "#b2dfdb",
		lighten_3: "#80cbc4",
		lighten_2: "#4db6ac",
		lighten_1: "#26a69a",
		darken_1: "#00897b",
		darken_2: "#00796b",
		darken_3: "#00695c",
		darken_4: "#004d40",
		accent_1: "#a7ffeb",
		accent_2: "#64ffda",
		accent_3: "#1de9b6",
		accent_4: "#00bfa5",
	},
	green: {
		main: "#4caf50",
		lighten_5: "#e8f5e9",
		lighten_4: "#c8e6c9",
		lighten_3: "#a5d6a7",
		lighten_2: "#81c784",
		lighten_1: "#66bb6a",
		darken_1: "#43a047",
		darken_2: "#388e3c",
		darken_3: "#2e7d32",
		darken_4: "#1b5e20",
		accent_1: "#b9f6ca",
		accent_2: "#69f0ae",
		accent_3: "#00e676",
		accent_4: "#00c853",
	},
	light_green: {
		main: "#8bc34a",
		lighten_5: "#f1f8e9",
		lighten_4: "#dcedc8",
		lighten_3: "#c5e1a5",
		lighten_2: "#aed581",
		lighten_1: "#9ccc65",
		darken_1: "#7cb342",
		darken_2: "#689f38",
		darken_3: "#558b2f",
		darken_4: "#33691e",
		accent_1: "#ccff90",
		accent_2: "#b2ff59",
		accent_3: "#76ff03",
		accent_4: "#64dd17",
	},
	lime: {
		main: "#cddc39",
		lighten_5: "#f9fbe7",
		lighten_4: "#f0f4c3",
		lighten_3: "#e6ee9c",
		lighten_2: "#dce775",
		lighten_1: "#d4e157",
		darken_1: "#c0ca33",
		darken_2: "#afb42b",
		darken_3: "#9e9d24",
		darken_4: "#827717",
		accent_1: "#f4ff81",
		accent_2: "#eeff41",
		accent_3: "#c6ff00",
		accent_4: "#aeea00",
	},
	yellow: {
		main: "#ffeb3b",
		lighten_5: "#fffde7",
		lighten_4: "#fff9c4",
		lighten_3: "#fff59d",
		lighten_2: "#fff176",
		lighten_1: "#ffee58",
		darken_1: "#fdd835",
		darken_2: "#fbc02d",
		darken_3: "#f9a825",
		darken_4: "#f57f17",
		accent_1: "#ffff8d",
		accent_2: "#ffff00",
		accent_3: "#ffea00",
		accent_4: "#ffd600",
	},
	amber: {
		main: "#ffc107",
		lighten_5: "#fff8e1",
		lighten_4: "#ffecb3",
		lighten_3: "#ffe082",
		lighten_2: "#ffd54f",
		lighten_1: "#ffca28",
		darken_1: "#ffb300",
		darken_2: "#ffa000",
		darken_3: "#ff8f00",
		darken_4: "#ff6f00",
		accent_1: "#ffe57f",
		accent_2: "#ffd740",
		accent_3: "#ffc400",
		accent_4: "#ffab00",
	},
};

let theme = createMuiTheme({
	props: {
		MuiTypography: {
			variantMapping: {
				h1: 'h1',
				h2: 'h2',
				h3: 'h3',
				h4: 'h4',
				h5: 'h5',
				h6: 'h6',
				subtitle1: 'h5',
				subtitle2: 'h5',
				body1: 'span',
				body2: 'span',
			},
		},
	},
	palette: {
		type: "light",
		primary: {
			contrastText: inverseColor,
			main: primaryColor,
			light: Color(primaryColor)
				.lighten(0.3)
				.desaturate(0.5)
				.hex(),
			dark: Color(primaryColor)
				.darken(0.2)
				.hex(),
		},
		secondary: {
			main: secondaryColor,
			light: Color(secondaryColor)
				.lighten(0.2)
				.desaturate(0.5)
				.hex(),
			dark: Color(secondaryColor)
				.darken(0.5)
				.hex(),
		},
		accent: {
			main: accentColor,
			light: Color(accentColor)
				.lighten(0.3)
				.desaturate(0.5)
				.hex(),
			dark: Color(accentColor)
				.darken(0.2)
				.hex(),
		},
		error: {
			main: errorColor,
		},
		background: {
			default: "#EBEBEB",
			paper: "#FFFFFF",
		},
		text: {
			primary: "#575757",
			secondary: "#737373",
			disabled: "#999999",
		},
		...defaultPallete,

	},
	typography: {
		useNextVariants: true,
		// Use the system font instead of the default Roboto font.
		/*fontFamily: [
			"Muli SemiBold",			
			"-apple-system",
			"BlinkMacSystemFont",
			"Segoe UI",
			"Roboto",
			"Helvetica Neue",
			"Arial",
			"sans-serif",
			"Apple Color Emoji",
			"Segoe UI Emoji",
			"Segoe UI Symbol",
		].join(","),*/
		fontFamily: 'Muli',
		htmlFontSize: 16,
		h1: {
			fontWeight: 700,
			fontSize: "60px",
			lineHeight: "68px",
			marginBlockStart: 0,
			marginBlockEnd: 0,
		},
		h2: {
			fontWeight: 700,
			fontSize: "48px",
			lineHeight: "54px",
			marginBlockStart: 0,
			marginBlockEnd: 0,
		},
		h3: {
			fontWeight: 700,
			fontSize: "32px",
			lineHeight: "38px",
		},
		h4: {
			fontWeight: 700,
			fontSize: "24px",
			lineHeight: "28px",
		},
		h5: {
			fontWeight: 700,
			fontSize: "20px",
			lineHeight: "24px",
		},
		h6: {
			fontWeight: 700,
			fontSize: "18px",
			lineHeight: "20px",
		},
		subtitle1: {
			fontWeight: 800,
			fontSize: "18px",
			lineHeight: "25px",
		},
		subtitle2: {
			fontSize: "18px",
			letterSpacing: 0,
			lineHeight: "20px",
		},
		body1: {
			fontSize: 14,
			lineHeight: "21px",
		},
		body2: {
			fontWeight: 600,
			fontSize: "12px",
		},
		button: {
			fontWeight: 400,
			fontSize: "14px",
		},
		caption: {
			fontWeight: 400,
			fontSize: "12px",
			lineHeight: "16px",
		},
	},
	appDrawer: {
		width: app.drawer.width,
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				'@font-face': [
					avenirFont,
					materialIconsFont,					
					muliRegularFont,
					//muliItalicFont,
					muliBlackFont,
					//muliBlackItalicFont,
					muliBoldFont,
					//muliBoldItalicFont,
					muliExtraBoldFont,
					//muliExtraBoldItalicFont,
					muliExtraLightFont,
					//muliExtraLightItalicFont,
					muliLightFont,
					//muliLightItalicFont,
				],
			},
		},
		MuiButtonBase: {
			disableRipple: true, // No more ripple, on the whole application 💣!
		},
		MuiInputBase: {
			legend: {
				display: "inline-block",
			},
		},
		MuiFormControl: {
			root: {
				width: "100%",
			},
		},
		MUIDataTable: {
			paper: {
				boxShadow: "none",
				border: "1px solid #c7c7c7",
			},
			responsiveScroll: {
				maxHeight: "100%",
			},
		},
		MUIDataTableToolbar: {
			titleText: {
				color: primaryDarkColor,
			},
		},
		MUIDataTableBodyCell: {
			root: {
				borderBottom: "1px solid #c9c9c9",
			},
		},
	},
});

let theme_dark = createMuiTheme({
	props: {
		MuiTypography: {
			variantMapping: {
				h1: 'h1',
				h2: 'h2',
				h3: 'h3',
				h4: 'h4',
				h5: 'h5',
				h6: 'h6',
				subtitle1: 'h5',
				subtitle2: 'h5',
				body1: 'span',
				body2: 'span',
			},
		},
		// Name of the component ⚛️
		MuiButtonBase: {
			// The properties to apply
			disableRipple: true, // No more ripple, on the whole application 💣!
		},
	},
	palette: {
		type: "dark",
		primary: {
			contrastText: inverseColor,
			main: primaryColor,
			light: Color(primaryColor)
				.lighten(0.5)
				.desaturate(0.5)
				.hex(),
			dark: Color(primaryColor)
				.darken(0.5)
				.hex(),
		},
		secondary: {
			main: secondaryColor,
		},
		accent: {
			main: accentColor,
		},
		error: {
			main: errorColor,
		},		
		...defaultPallete,
	},
	typography: {
		useNextVariants: true,
		// Use the system font instead of the default Roboto font.
		fontFamily: 'Muli, Arial',
		htmlFontSize: 16,
		h1: {
			fontWeight: 700,
			fontSize: "60px",
			lineHeight: "68px",
		},
		h2: {
			fontWeight: 700,
			fontSize: "48px",
			lineHeight: "54px",
		},
		h3: {
			fontWeight: 700,
			fontSize: "32px",
			lineHeight: "38px",
		},
		h4: {
			fontWeight: 700,
			fontSize: "24px",
			lineHeight: "28px",
		},
		h5: {
			fontWeight: 700,
			fontSize: "20px",
			lineHeight: "24px",
		},
		h6: {
			fontWeight: 700,
			fontSize: "18px",
			lineHeight: "20px",
		},
		subtitle1: {
			fontWeight: 800,
			fontSize: "18px",
			lineHeight: "25px",
		},
		subtitle2: {
			fontSize: "18px",
			letterSpacing: 0,
			lineHeight: "20px",
		},
		body1: {
			fontSize: 14,
			lineHeight: "21px",
		},
		body2: {
			fontWeight: 600,
			fontSize: "12px",
		},
		button: {
			fontWeight: 600,
			fontSize: "14px",
		},
		caption: {
			fontWeight: 400,
			fontSize: "12px",
			lineHeight: "16px",
		},
	},
	appDrawer: {
		width: app.drawer.width,
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				'@font-face': [
					avenirFont,
					materialIconsFont,
					muliRegularFont,
					//muliItalicFont,
					muliBlackFont,
					//muliBlackItalicFont,
					muliBoldFont,
					//muliBoldItalicFont,
					muliExtraBoldFont,
					//muliExtraBoldItalicFont,
					muliExtraLightFont,
					//muliExtraLightItalicFont,
					muliLightFont,
					//muliLightItalicFont,
				],
			},
		},
		MuiButtonBase: {
			//disableRipple: false, // No more ripple, on the whole application 💣!
		},
		MuiInputBase: {
			legend: {
				display: "inline-block",
			},
		},
		MuiFormControl: {
			root: {
				width: "100%",
			},
		},
		MUIDataTable: {
			paper: {
				boxShadow: "none",
				border: "1px solid #7A7A7A",
			},
			responsiveScroll: {
				maxHeight: "100%",
			},
		},
		MUIDataTableToolbar: {
			titleText: {
				color: "#FFFFFF",
			},
		},
		MUIDataTableBodyCell: {
			root: {
				borderBottom: "1px solid #7A7A7A",
			},
		},
	},
});

const alignments = {
	right: {
		float: "right",
	},
	left: {
		float: "left",
	},
	leftalign: {
		textAlign: "left",
	},
	rightalign: {
		textAlign: "right",
	},
	centeralign: {
		textAlign: "center",
	},
	center: {
		position: "relative",
		top: "50%",
		left: "50%",
		WebkitTransform: "translate(-50%, -50%)",
		MsTransform: "translate(-50%, -50%)",
		transform: "translate(-50%, -50%)",
	},
	center_vertically: {
		position: "relative",
		top: "50%",
		WebkitTransform: "translateY(-50%)",
		MsTransform: "translateY(-50%)",
		transform: "translateY(-50%)",
	},
	center_horizontally: {
		position: "relative",
		left: "50%",
		WebkitTransform: "translateX(-50%)",
		MsTransform: "translateX(-50%)",
		transform: "translateX(-50%)",
	},
};
const placements = {
	right: {
		float: "right",
	},
	left: {
		float: "left",
	},
	left_align: {
		textAlign: "left",
	},
	right_align: {
		textAlign: "right",
	},
	center_align: {
		textAlign: "center",
	},
	center: {
		position: "relative",
		top: "50%",
		left: "50%",
		WebkitTransform: "translate(-50%, -50%)",
		MsTransform: "translate(-50%, -50%)",
		transform: "translate(-50%, -50%)",
	},
	center_vertically: {
		position: "relative",
		top: "50%",
		WebkitTransform: "translateY(-50%)",
		MsTransform: "translateY(-50%)",
		transform: "translateY(-50%)",
	},
	center_horizontally: {
		position: "relative",
		left: "50%",
		WebkitTransform: "translateX(-50%)",
		MsTransform: "translateX(-50%)",
		transform: "translateX(-50%)",
	},
};

const textcases = {
	lowercase: {
		textTransform: [["lowercase"], "!important"],
	},
	uppercase: {
		textTransform: [["uppercase"], "!important"],
	},
	wordcase: {
		textTransform: [["capitalize"], "!important"],
	},
	nocase: {
		textTransform: [["none"], "!important"],
	},
	inheritcase: {
		textTransform: [["inherit"], "!important"],
	},
};

const text_styles = {
	centerAlign: {
		textAlign: "center",
	},
	leftAlign: {
		textAlign: "left",
	},
	rightAlign: {
		textAlign: "center",
	},
	singlespaced: {
		lineHeight: "1",
	},
	onehalfspaced: {
		lineHeight: "1.5",
	},
	doublespaced: {
		lineHeight: "2",
	},
	underline: {
		textDecoration: "underline",
	},
	overline: {
		textDecoration: "overline",
	},
	overlineunderline: {
		textDecoration: "underline overline",
	},
	strikethrough: {
		textDecoration: "line-through",
	},
	bold: {
		fontWeight: "700",
	},
	italic: {
		fontStyle: "italic",
	},
	oblique: {
		fontStyle: "oblique",
	},
	...textcases,
};

const shadows = {
	sm: {
		default:
			"0 12px 20px -10px rgba(" +
			textColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			textColorRgb +
			", 0.2)",
		primary:
			"0 12px 20px -10px rgba(" +
			primaryColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			inverseColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			primaryColorRgb +
			", 0.2)",
		primarydark:
			"0 12px 20px -10px rgba(" +
			primaryDarkColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			primaryDarkColorRgb +
			", 0.2)",
		secondary:
			"0 12px 20px -10px rgba(" +
			secondaryColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			secondaryColorRgb +
			", 0.2)",
		accent:
			"0 12px 20px -10px rgba(" +
			accentColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			accentColorRgb +
			", 0.2)",
		inverse:
			"0 12px 20px -10px rgba(" +
			inverseColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			inverseColorRgb +
			", 0.2)",
		warning:
			"0 12px 20px -10px rgba(" +
			warningColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			warningColorRgb +
			", 0.2)",
		danger:
			"0 12px 20px -10px rgba(" +
			dangerColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			dangerColorRgb +
			", 0.2)",
		error:
			"0 12px 20px -10px rgba(" +
			errorColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			errorColorRgb +
			", 0.2)",
		success:
			"0 12px 20px -10px rgba(" +
			successColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			successColorRgb +
			", 0.2)",
		info:
			"0 12px 20px -10px rgba(" +
			infoColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			infoColorRgb +
			", 0.2)",
		rose:
			"0 12px 20px -10px rgba(" +
			roseColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			roseColorRgb +
			", 0.2)",
		gray:
			"0 12px 20px -10px rgba(" +
			grayColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			grayColorRgb +
			", 0.2)",
		twitter:
			"0 12px 20px -10px rgba(" +
			twitterColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			twitterColorRgb +
			", 0.2)",
		facebook:
			"0 12px 20px -10px rgba(" +
			facebookColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			facebookColorRgb +
			", 0.2)",
		google:
			"0 12px 20px -10px rgba(" +
			googleColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			googleColorRgb +
			", 0.2)",
		github:
			"0 12px 20px -10px rgba(" +
			githubColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			githubColorRgb +
			", 0.2)",
		linkedin:
			"0 12px 20px -10px rgba(" +
			linkedinColorRgb +
			", 0.28), 0 4px 20px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 7px 8px -5px rgba(" +
			linkedinColorRgb +
			", 0.2)",
	},
	md: {
		default:
			"0 14px 26px -12px rgba(" +
			textColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			textColorRgb +
			", 0.2)",
		primary:
			"0 14px 26px -12px rgba(" +
			primaryColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			inverseColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			primaryColorRgb +
			", 0.2)",
		primarydark:
			"0 14px 26px -12px rgba(" +
			primaryDarkColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			primaryDarkColorRgb +
			", 0.2)",
		secondary:
			"0 14px 26px -12px rgba(" +
			secondaryColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			secondaryColorRgb +
			", 0.2)",
		accent:
			"0 14px 26px -12px rgba(" +
			accentColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			accentColorRgb +
			", 0.2)",
		inverse:
			"0 14px 26px -12px rgba(" +
			inverseColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			inverseColorRgb +
			", 0.2)",
		warning:
			"0 14px 26px -12px rgba(" +
			warningColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			warningColorRgb +
			", 0.2)",
		danger:
			"0 14px 26px -12px rgba(" +
			dangerColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			dangerColorRgb +
			", 0.2)",
		error:
			"0 14px 26px -12px rgba(" +
			errorColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			errorColorRgb +
			", 0.2)",
		success:
			"0 14px 26px -12px rgba(" +
			successColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			successColorRgb +
			", 0.2)",
		info:
			"0 14px 26px -12px rgba(" +
			infoColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			infoColorRgb +
			", 0.2)",
		rose:
			"0 14px 26px -12px rgba(" +
			roseColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			roseColorRgb +
			", 0.2)",
		gray:
			"0 14px 26px -12px rgba(" +
			grayColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			grayColorRgb +
			", 0.2)",
		twitter:
			"0 14px 26px -12px rgba(" +
			twitterColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			twitterColorRgb +
			", 0.2)",
		facebook:
			"0 14px 26px -12px rgba(" +
			facebookColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			facebookColorRgb +
			", 0.2)",
		google:
			"0 14px 26px -12px rgba(" +
			googleColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			googleColorRgb +
			", 0.2)",
		github:
			"0 14px 26px -12px rgba(" +
			githubColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			githubColorRgb +
			", 0.2)",
		linkedin:
			"0 14px 26px -12px rgba(" +
			linkedinColorRgb +
			", 0.42), 0 4px 23px 0px rgba(" +
			textColorRgb +
			", 0.12), 0 8px 10px -5px rgba(" +
			linkedinColorRgb +
			", 0.2)",
	},
};

const gradients = {
	default:
		"linear-gradient(60deg, " +
		textColor +
		", " +
		Color(textColor)
			.darken(0.5)
			.hex() +
		")",
	primary:
		"linear-gradient(60deg, " +
		primaryColor +
		", " +
		Color(primaryColor)
			.darken(0.5)
			.hex() +
		")",
	primarydark:
		"linear-gradient(60deg, " +
		primaryDarkColor +
		", " +
		Color(primaryDarkColor)
			.darken(0.5)
			.hex() +
		")",
	secondary:
		"linear-gradient(60deg, " +
		secondaryColor +
		", " +
		Color(secondaryColor)
			.darken(0.5)
			.hex() +
		")",
	accent:
		"linear-gradient(60deg, " +
		accentColor +
		", " +
		Color(accentColor)
			.darken(0.5)
			.hex() +
		")",
	inverse:
		"linear-gradient(60deg, " +
		inverseColor +
		", " +
		Color(inverseColor)
			.darken(0.5)
			.hex() +
		")",
	warning:
		"linear-gradient(60deg, " +
		warningColor +
		", " +
		Color(warningColor)
			.darken(0.5)
			.hex() +
		")",
	danger:
		"linear-gradient(60deg, " +
		dangerColor +
		", " +
		Color(dangerColor)
			.darken(0.5)
			.hex() +
		")",
	error:
		"linear-gradient(60deg, " +
		errorColor +
		", " +
		Color(errorColor)
			.darken(0.5)
			.hex() +
		")",
	success:
		"linear-gradient(60deg, " +
		successColor +
		", " +
		Color(successColor)
			.darken(0.5)
			.hex() +
		")",
	info:
		"linear-gradient(60deg, " +
		infoColor +
		", " +
		Color(infoColor)
			.darken(0.5)
			.hex() +
		")",
	rose:
		"linear-gradient(60deg, " +
		roseColor +
		", " +
		Color(roseColor)
			.darken(0.5)
			.hex() +
		")",
	gray:
		"linear-gradient(60deg, " +
		grayColor +
		", " +
		Color(grayColor)
			.darken(0.5)
			.hex() +
		")",
	twitter:
		"linear-gradient(60deg, " +
		twitterColor +
		", " +
		Color(twitterColor)
			.darken(0.5)
			.hex() +
		")",
	facebook:
		"linear-gradient(60deg, " +
		facebookColor +
		", " +
		Color(facebookColor)
			.darken(0.5)
			.hex() +
		")",
	google:
		"linear-gradient(60deg, " +
		googleColor +
		", " +
		Color(googleColor)
			.darken(0.5)
			.hex() +
		")",
	github:
		"linear-gradient(60deg, " +
		githubColor +
		", " +
		Color(githubColor)
			.darken(0.5)
			.hex() +
		")",
	linkedin:
		"linear-gradient(60deg, " +
		linkedinColor +
		", " +
		Color(linkedinColor)
			.darken(0.5)
			.hex() +
		")",
};

export {
	app,
	theme,
	theme_dark,
	colors,
	gradients,
	shadows,
	textcases,
	text_styles,
	alignments,
	placements,
};
