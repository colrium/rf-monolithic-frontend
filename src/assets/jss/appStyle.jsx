/* eslint-disable */
import Color from 'color';
import {theme, colors, shadows, gradients} from 'assets/jss/app-theme';

let color_based_styles = {
	".outlined" : {
		border: "1px solid "+("default" in colors.hex? colors.hex.default : "#000000")+" !important"
	},

	".raised" : {
		boxShadow: "0 2px 2px 0 rgba("+("default" in colors.rgb? colors.rgb.default : "0, 0, 0")+", 0.14), 0 3px 1px -2px rgba("+("default" in colors.rgb? colors.rgb.default : "0, 0, 0")+", 0.2), 0 1px 5px 0 rgba("+("default" in colors.rgb? colors.rgb.default : "0, 0, 0")+", 0.12)"+" !important",
	},

	".hoverraise" : {
		transition: "box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)"+" !important",
		"&:hover,&:focus": {
			boxShadow: "0 14px 26px -12px rgba("+("default" in colors.rgb? colors.rgb.default : "0, 0, 0")+", 0.42), 0 4px 23px 0px rgba("+("default" in colors.rgb? colors.rgb.default : "0, 0, 0")+", 0.12), 0 8px 10px -5px rgba("+("default" in colors.rgb? colors.rgb.default : "0, 0, 0")+", 0.2)"+" !important"
		}
	},
};
for (let i = 0; i < colors.names.length; i++) {
	let color_name = colors.names[i];
	
	if (color_name === "inherit" || colors.hex[color_name] === undefined || colors.rgb[color_name] === undefined) {
		continue;
	}
	
	let color_class = "."+color_name;
	let color_class_text = color_class+"_text";
	let color_class_gradient = color_class+"_gradient";
	let color_class_outlined = color_class+"_outlined";

	color_based_styles[color_class] = {
		backgroundColor: colors.hex[color_name]+" !important",
		color: color_name == "inverse" || color_name == "transparent"? colors.hex["default"] : (color_name == "white" ? Color("#000000").lighten(0.2).hex() : colors.hex["inverse"]),
		"&.raised": {
			boxShadow: (color_name in shadows? shadows.md[color_name] : ("0 2px 2px 0 rgba("+colors.rgb[color_name]+", 0.14), 0 3px 1px -2px rgba("+colors.rgb[color_name]+", 0.2), 0 1px 5px 0 rgba("+colors.rgb[color_name]+", 0.12)"))+" !important",
		},
		"&.hoverraise": {
			transition: "box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important",
			"&:hover,&:focus": {
				boxShadow: (color_name in shadows? shadows.md[color_name] : ("0 14px 26px -12px rgba("+colors.rgb[color_name]+", 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba("+colors.rgb[color_name]+", 0.2)"))+" !important"
			}
		},
		"&.outlined": {
			background: "transparent !important",
			borderColor: colors.hex[color_name]+" !important"
		}
	}
	color_based_styles[color_class_text] = {
		color: colors.hex[color_name]+" !important",
	}
	color_based_styles[color_class_gradient] = {
		background: (color_name in gradients?  gradients[color_name] : "linear-gradient(60deg, "+colors.hex[color_name]+", "+Color(colors.hex[color_name]).darken(0.5).hex()+")")+" !important",
		color: color_name == "inverse" || color_name == "transparent"? colors.hex["default"] : (color_name == "white" ? Color("#000000").lighten(0.2).hex() : colors.hex["inverse"]),
		"&.raised": {
			boxShadow: (color_name in shadows? shadows.md[color_name] : ("0 2px 2px 0 rgba("+colors.rgb[color_name]+", 0.14), 0 3px 1px -2px rgba("+colors.rgb[color_name]+", 0.2), 0 1px 5px 0 rgba("+colors.rgb[color_name]+", 0.12)"))+" !important",
		},
		"&.hoverraise": {
			transition: "box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important",
			"&:hover,&:focus": {
				boxShadow: (color_name in shadows? shadows.md[color_name] : ("0 14px 26px -12px rgba("+colors.rgb[color_name]+", 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba("+colors.rgb[color_name]+", 0.2)"))+" !important"
			}
		},
		"&.outlined": {
			background: "transparent !important",
			borderImage: (color_name in gradients?  gradients[color_name] : "linear-gradient(60deg, "+colors.hex[color_name]+", "+Color(colors.hex[color_name]).darken(0.5).hex()+")")+" !important",
			borderImageSlice: "1 !important",

		}
	}
	color_based_styles[color_class_outlined] = {
		borderColor: colors.hex[color_name]+" !important",
	}
}


const muiGlobalStyles = {
	'MuiPaper-elevation': {
		boxShadow: 'inherit',
	},
	'MuiAvatar': {
		colorDefault: {
			background: "rgba("+colors.rgb.default+", 0.5)",
		}		
	},
};

export default {
	body: {
		background: colors.hex.inverse,
		color: "inherit",
	},
	"input:-internal-autofill-selected": {
		background: "transparent",
	},
	"button": {
		"&:focus": {
			outline: "none !important",
		},
	},
	a: {
		color: "inherit",
		textDecoration: "none",
		'&:hover': {
			textDecoration: "none",
			color: "inherit",
		},
	},
		
	".right" : {
		right: 0,
	},
	".left" : {
		left: 0,
	},
	".left_align": {
		textAlign: "left !important"
	},
	".right_align": {
		textAlign: "right !important"
	},
	".center_align": {
		textAlign: "center !important"
	},

	".center":{
		position: "relative",
		top: "50%",
		left: "50%",
		WebkitTransform: "translate(-50%, -50%)",
		MsTransform: "translate(-50%, -50%)",
		transform: "translate(-50%, -50%)",
	},
	".center_vertically":{
		position: "relative",
		top: "50%",
		WebkitTransform: "translateY(-50%)",
		MsTransform: "translateY(-50%)",
		transform: "translateY(-50%)",
	},
	".center_horizontally":{
		position: "relative",
		left: "50%",
		WebkitTransform: "translateX(-50%)",
		MsTransform: "translateX(-50%)",
		transform: "translateX(-50%)",
	},
	".center_horizontally":{
		position: "relative",
		left: "50%",
		WebkitTransform: "translateX(-50%)",
		MsTransform: "translateX(-50%)",
		transform: "translateX(-50%)",
	},
	".ps__thumb-x": {
		backgroundColor: colors.hex.secondary+" !important",
	},
	".ps__thumb-y": {
		backgroundColor: colors.hex.secondary+" !important",
	},
	...muiGlobalStyles,
	...color_based_styles
};
