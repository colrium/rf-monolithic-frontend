/* eslint-disable */
// ##############################
// App Theme and
// Styles that are used on more than one component
// #############################
let Color = require('color');
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
	linkedinColor 
} from 'config';

import { createMuiTheme } from '@material-ui/core/styles';

const app = {
	name: appName,	
	description: appDescription,
	logo: appLogo,
	drawer: {
		width: 240,
	},
	title: (...subtitles) => {
		let titleStr = "";
		for (var i = 0; i < subtitles.length; i++) {
			titleStr += "-"+subtitles[i];
		}
		return appName+titleStr;
	}
}



const defaultColorRgb = Color(defaultColor).rgb().array().join(",");
const primaryColorRgb = Color(primaryColor).rgb().array().join(",");
const primaryDarkColorRgb = Color(primaryDarkColor).rgb().array().join(",");
const secondaryColorRgb = Color(secondaryColor).rgb().array().join(",");
const accentColorRgb = Color(accentColor).rgb().array().join(",");
const inverseColorRgb = Color(inverseColor).rgb().array().join(",");
const textColorRgb = Color(textColor).rgb().array().join(",");
const warningColorRgb = Color(warningColor).rgb().array().join(",");
const dangerColorRgb = Color(dangerColor).rgb().array().join(",");
const errorColorRgb = Color(errorColor).rgb().array().join(",");
const successColorRgb = Color(successColor).rgb().array().join(",");
const infoColorRgb = Color(infoColor).rgb().array().join(",");
const roseColorRgb = Color(roseColor).rgb().array().join(",");
const grayColorRgb = Color(grayColor).rgb().array().join(",");
const twitterColorRgb = Color(twitterColor).rgb().array().join(",");
const facebookColorRgb = Color(facebookColor).rgb().array().join(",");
const googleColorRgb = Color(googleColor).rgb().array().join(",");
const githubColorRgb = Color(githubColor).rgb().array().join(",");
const linkedinColorRgb = Color(linkedinColor).rgb().array().join(",");


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
	hex : {
		default: defaultColor,
		primary : primaryColor,
		primarydark : primaryDarkColor,
		secondary : secondaryColor,
		accent : accentColor,
		inverse : inverseColor,
		warning : warningColor,
		danger : dangerColor,
		error : errorColor,
		success : successColor,
		info : infoColor,
		rose : roseColor,
		grey : grayColor,
		twitter : twitterColor,
		facebook : facebookColor,
		google : googleColor,
		github : githubColor,
		linkedin : linkedinColor,
	},
	rgb : {
		default: defaultColorRgb,
		primary : primaryColorRgb,
		primarydark : primaryDarkColorRgb,
		secondary : secondaryColorRgb,
		accent : accentColorRgb,
		inverse : inverseColorRgb,
		warning : warningColorRgb,
		danger : dangerColorRgb,
		error : errorColorRgb,
		success : successColorRgb,
		info : infoColorRgb,
		rose : roseColorRgb,
		grey : grayColorRgb,
		twitter : twitterColorRgb,
		facebook : facebookColorRgb,
		google : googleColorRgb,
		github : githubColorRgb,
		linkedin : linkedinColorRgb,
	},
		
};


/*const nunito = {
  fontFamily: '"Nunito", sans-serif',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
};*/

let theme = createMuiTheme({
	palette: {
		primary: {
			contrastText: inverseColor,
			main: primaryColor,
			light: Color(primaryColor).lighten(0.5).desaturate(0.5).hex(),
			dark: Color(primaryColor).darken(0.5).hex()
		},
		secondary: {
			main :secondaryColor
		},
		error: {
			main :errorColor
		},
	},
	typography: {
		useNextVariants: true,
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			'Product Sans',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'"Muli"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		htmlFontSize: 16,
		h1: {
			fontWeight: '400',
			fontSize: '35px',
			letterSpacing: '-0.24px',
			lineHeight: '40px'
		},
		h2: {
			fontWeight: '400',
			fontSize: '29px',
			letterSpacing: '-0.24px',
			lineHeight: '32px'
		},
		h3: {
			fontWeight: '400',
			fontSize: '24px',
			letterSpacing: '-0.06px',
			lineHeight: '28px'
		},
		h4: {
			fontWeight: '400',
			fontSize: '20px',
			letterSpacing: '-0.06px',
			lineHeight: '24px'
		},
		h5: {
			fontWeight: '400',
			fontSize: '16px',
			letterSpacing: '-0.05px',
			lineHeight: '20px'
		},
		h6: {
			fontWeight: '400',
			fontSize: '14px',
			letterSpacing: '-0.05px',
			lineHeight: '20px'
		},
		subtitle1: {
			fontSize: '16px',
			letterSpacing: '-0.05px',
			lineHeight: '25px'
		},
		subtitle2: {
			fontSize: '14px',
			letterSpacing: 0,
			lineHeight: '16px'
		},
		body1: {
			fontSize: '14px',
			letterSpacing: '-0.05px',
			lineHeight: '21px'
		},
		body2: {
			fontSize: '12px',
			letterSpacing: '-0.04px',
			lineHeight: '14px'
		},
		button: {
			fontSize: '14px'
		},
		caption: {
			fontSize: '12px',
			letterSpacing: '0.3px',
			lineHeight: '16px'
		}
	},
	appDrawer: {
		width: app.drawer.width,
	},
	overrides: {
		MuiButtonBase: {
			disableRipple: false, // No more ripple, on the whole application 💣!
		},	
		MuiInputBase: {
			legend: {
				display: 'inline-block',
			},
		},	
		MuiFormControl: {
			root: {
				width: '100%',
			},
		},
		MUIDataTable: {
			paper: {
				boxShadow: "none",
				border: "1px solid rgb(224, 224, 224)"
			}, 
			responsiveScroll: {
				maxHeight: '100%',
			},
		},
		MUIDataTableToolbar: {
			titleText: {
				color: primaryDarkColor
			},
				
		},
		MUIDataTableBodyCell: {
			root: {
				borderBottom: "1px solid rgb(224, 224, 224)"
			}
		},

	},
});

const alignments = {
	right : {
		float: "right"
	},
	left : {
		float: "left"
	},
	leftalign: {
		textAlign: "left"
	},
	rightalign: {
		textAlign: "right"
	},
	centeralign: {
		textAlign: "center"
	},
	center:{
		position: "relative",
		top: "50%",
		left: "50%",
		WebkitTransform: "translate(-50%, -50%)",
		MsTransform: "translate(-50%, -50%)",
		transform: "translate(-50%, -50%)",
	},
	center_vertically:{
		position: "relative",
		top: "50%",
		WebkitTransform: "translateY(-50%)",
		MsTransform: "translateY(-50%)",
		transform: "translateY(-50%)",
	},
	center_horizontally:{
		position: "relative",
		left: "50%",
		WebkitTransform: "translateX(-50%)",
		MsTransform: "translateX(-50%)",
		transform: "translateX(-50%)",
	},
};
const placements = {
	right : {
		float: "right"
	},
	left : {
		float: "left"
	},
	left_align: {
		textAlign: "left"
	},
	right_align: {
		textAlign: "right"
	},
	center_align: {
		textAlign: "center"
	},
	center:{
		position: "relative",
		top: "50%",
		left: "50%",
		WebkitTransform: "translate(-50%, -50%)",
		MsTransform: "translate(-50%, -50%)",
		transform: "translate(-50%, -50%)",
	},
	center_vertically:{
		position: "relative",
		top: "50%",
		WebkitTransform: "translateY(-50%)",
		MsTransform: "translateY(-50%)",
		transform: "translateY(-50%)",
	},
	center_horizontally:{
		position: "relative",
		left: "50%",
		WebkitTransform: "translateX(-50%)",
		MsTransform: "translateX(-50%)",
		transform: "translateX(-50%)",
	},
};


const textcases = {
	lowercase : {
		textTransform: [["lowercase"], "!important"],
	},
	uppercase : {
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
		lineHeight: "1"
	},
	onehalfspaced: {
		lineHeight: "1.5"
	},
	doublespaced: {
		lineHeight: "2"
	},
	underline: {
		textDecoration: "underline"
	},
	overline: {
		textDecoration: "overline"
	},
	overlineunderline: {
		textDecoration: "underline overline"
	},
	strikethrough: {
		textDecoration: "line-through"
	},
	bold: {
		fontWeight: "700"
	},
	italic: {
		fontStyle: "italic"
	},
	oblique: {
		fontStyle: "oblique"
	},
	...textcases,
};

const shadows = {
	sm: {
		default : "0 12px 20px -10px rgba("+textColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+textColorRgb+", 0.2)",
		primary : "0 12px 20px -10px rgba("+primaryColorRgb+", 0.28), 0 4px 20px 0px rgba("+inverseColorRgb+", 0.12), 0 7px 8px -5px rgba("+primaryColorRgb+", 0.2)",
		primarydark : "0 12px 20px -10px rgba("+primaryDarkColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+primaryDarkColorRgb+", 0.2)",
		secondary : "0 12px 20px -10px rgba("+secondaryColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+secondaryColorRgb+", 0.2)",
		accent : "0 12px 20px -10px rgba("+accentColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+accentColorRgb+", 0.2)",
		inverse : "0 12px 20px -10px rgba("+inverseColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+inverseColorRgb+", 0.2)",
		warning : "0 12px 20px -10px rgba("+warningColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+warningColorRgb+", 0.2)",
		danger : "0 12px 20px -10px rgba("+dangerColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+dangerColorRgb+", 0.2)",
		error : "0 12px 20px -10px rgba("+errorColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+errorColorRgb+", 0.2)",
		success : "0 12px 20px -10px rgba("+successColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+successColorRgb+", 0.2)",
		info : "0 12px 20px -10px rgba("+infoColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+infoColorRgb+", 0.2)",
		rose : "0 12px 20px -10px rgba("+roseColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+roseColorRgb+", 0.2)",
		gray : "0 12px 20px -10px rgba("+grayColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+grayColorRgb+", 0.2)",
		twitter : "0 12px 20px -10px rgba("+twitterColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+twitterColorRgb+", 0.2)",
		facebook : "0 12px 20px -10px rgba("+facebookColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+facebookColorRgb+", 0.2)",
		google : "0 12px 20px -10px rgba("+googleColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+googleColorRgb+", 0.2)",
		github : "0 12px 20px -10px rgba("+githubColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+githubColorRgb+", 0.2)",
		linkedin : "0 12px 20px -10px rgba("+linkedinColorRgb+", 0.28), 0 4px 20px 0px rgba("+textColorRgb+", 0.12), 0 7px 8px -5px rgba("+linkedinColorRgb+", 0.2)",
	},
	md: {
		default : "0 14px 26px -12px rgba("+textColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+textColorRgb+", 0.2)",
		primary : "0 14px 26px -12px rgba("+primaryColorRgb+", 0.42), 0 4px 23px 0px rgba("+inverseColorRgb+", 0.12), 0 8px 10px -5px rgba("+primaryColorRgb+", 0.2)",
		primarydark : "0 14px 26px -12px rgba("+primaryDarkColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+primaryDarkColorRgb+", 0.2)",
		secondary : "0 14px 26px -12px rgba("+secondaryColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+secondaryColorRgb+", 0.2)",
		accent : "0 14px 26px -12px rgba("+accentColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+accentColorRgb+", 0.2)",
		inverse : "0 14px 26px -12px rgba("+inverseColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+inverseColorRgb+", 0.2)",
		warning : "0 14px 26px -12px rgba("+warningColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+warningColorRgb+", 0.2)",
		danger : "0 14px 26px -12px rgba("+dangerColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+dangerColorRgb+", 0.2)",
		error : "0 14px 26px -12px rgba("+errorColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+errorColorRgb+", 0.2)",
		success : "0 14px 26px -12px rgba("+successColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+successColorRgb+", 0.2)",
		info : "0 14px 26px -12px rgba("+infoColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+infoColorRgb+", 0.2)",
		rose : "0 14px 26px -12px rgba("+roseColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+roseColorRgb+", 0.2)",
		gray : "0 14px 26px -12px rgba("+grayColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+grayColorRgb+", 0.2)",
		twitter : "0 14px 26px -12px rgba("+twitterColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+twitterColorRgb+", 0.2)",
		facebook : "0 14px 26px -12px rgba("+facebookColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+facebookColorRgb+", 0.2)",
		google : "0 14px 26px -12px rgba("+googleColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+googleColorRgb+", 0.2)",
		github : "0 14px 26px -12px rgba("+githubColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+githubColorRgb+", 0.2)",
		linkedin : "0 14px 26px -12px rgba("+linkedinColorRgb+", 0.42), 0 4px 23px 0px rgba("+textColorRgb+", 0.12), 0 8px 10px -5px rgba("+linkedinColorRgb+", 0.2)",
	},
				
};



const gradients = {
	default : "linear-gradient(60deg, "+textColor+", "+Color(textColor).darken(0.5).hex()+")",
	primary : "linear-gradient(60deg, "+primaryColor+", "+Color(primaryColor).darken(0.5).hex()+")",
	primarydark : "linear-gradient(60deg, "+primaryDarkColor+", "+Color(primaryDarkColor).darken(0.5).hex()+")",
	secondary : "linear-gradient(60deg, "+secondaryColor+", "+Color(secondaryColor).darken(0.5).hex()+")",
	accent : "linear-gradient(60deg, "+accentColor+", "+Color(accentColor).darken(0.5).hex()+")",
	inverse : "linear-gradient(60deg, "+inverseColor+", "+Color(inverseColor).darken(0.5).hex()+")",
	warning : "linear-gradient(60deg, "+warningColor+", "+Color(warningColor).darken(0.5).hex()+")",
	danger : "linear-gradient(60deg, "+dangerColor+", "+Color(dangerColor).darken(0.5).hex()+")",
	error : "linear-gradient(60deg, "+errorColor+", "+Color(errorColor).darken(0.5).hex()+")",
	success : "linear-gradient(60deg, "+successColor+", "+Color(successColor).darken(0.5).hex()+")",
	info : "linear-gradient(60deg, "+infoColor+", "+Color(infoColor).darken(0.5).hex()+")",
	rose : "linear-gradient(60deg, "+roseColor+", "+Color(roseColor).darken(0.5).hex()+")",
	gray : "linear-gradient(60deg, "+grayColor+", "+Color(grayColor).darken(0.5).hex()+")",
	twitter : "linear-gradient(60deg, "+twitterColor+", "+Color(twitterColor).darken(0.5).hex()+")",
	facebook : "linear-gradient(60deg, "+facebookColor+", "+Color(facebookColor).darken(0.5).hex()+")",
	google : "linear-gradient(60deg, "+googleColor+", "+Color(googleColor).darken(0.5).hex()+")",
	github : "linear-gradient(60deg, "+githubColor+", "+Color(githubColor).darken(0.5).hex()+")",
	linkedin : "linear-gradient(60deg, "+linkedinColor+", "+Color(linkedinColor).darken(0.5).hex()+")",		
};

export {
	app,
	theme,
	colors,
	gradients,
	shadows,
	textcases,
	text_styles,
	alignments,
	placements,
}