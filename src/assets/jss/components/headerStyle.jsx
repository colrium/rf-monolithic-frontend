import { colors } from "assets/jss/app-theme.jsx";

const headerStyle = {
	appBar: {
		display: "flex",
		border: "0",
		borderRadius: "3px",
		padding: "0.625rem 0",
		marginBottom: "20px",
		color: colors.hex.default,
		width: "100%",
		backgroundColor: colors.hex.inverse,
		boxShadow: "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
		transition: "all 150ms ease 0s",
		alignItems: "center",
		flexFlow: "row nowrap",
		justifyContent: "flex-start",
		position: "relative",
		zIndex: "unset"
	},
	absolute: {
		position: "absolute",
		zIndex: "1100"
	},
	fixed: {
		position: "fixed",
		zIndex: "1100"
	},
	container: {
		minHeight: "50px",
		flex: "1",
		alignItems: "center",
		justifyContent: "space-between",
		display: "flex",
		flexWrap: "nowrap"
	},
	flex: {
		flex: 1
	},
	title: {
		lineHeight: "30px",
		fontSize: "18px",
		borderRadius: "3px",
		textTransform: "none",
		color: "inherit",
		padding: "8px 16px",
		"&:hover,&:focus": {
			color: "inherit",
			background: "transparent"
		}
	},
	
	appResponsive: {
		margin: "20px 10px"
	},
	primary: {
		backgroundColor: colors.hex.primary,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(156, 39, 176, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	primarydark: {
		backgroundColor: colors.hex.primarydark,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(156, 39, 176, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	secondary: {
		backgroundColor: colors.hex.secondary,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(156, 39, 176, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	accent: {
		backgroundColor: colors.hex.accent,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(156, 39, 176, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	info: {
		backgroundColor: colors.hex.info,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(0, 188, 212, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	success: {
		backgroundColor: colors.hex.success,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(76, 175, 80, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	warning: {
		backgroundColor: colors.hex.warning,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(255, 152, 0, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	danger: {
		backgroundColor: colors.hex.danger,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(244, 67, 54, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	rose: {
		backgroundColor: colors.hex.rose,
		color: colors.hex.inverse,
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(233, 30, 99, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	transparent: {
		backgroundColor: "transparent !important",
		boxShadow: "none",
		paddingTop: "25px",
		color: colors.hex.default,
		"& a": {
			color: colors.hex.default,
		}
	},
	dark: {
		color: colors.hex.inverse,
		backgroundColor: "#212121 !important",
		boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(33, 33, 33, 0.46)",
		"& a": {
			color: colors.hex.inverse,
		}
	},
	white: {
		border: "0",
		padding: "0.625rem 0",
		marginBottom: "20px",
		color: "#555",
		backgroundColor: colors.hex.inverse,
		boxShadow: "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
		"& a": {
			color: colors.hex.default,
		}
	},
	drawerPaper: {
		border: "none",
		bottom: "0",
		transitionProperty: "top, bottom, width",
		transitionDuration: ".2s, .2s, .35s",
		transitionTimingFunction: "linear, linear, ease",
		position: "fixed",
		display: "block",
		top: "0",
		height: "100vh",
		right: "0",
		left: "auto",
		visibility: "visible",
		overflowY: "visible",
		borderTop: "none",
		textAlign: "left",
		paddingRight: "0px",
		paddingLeft: "0",
	}
};

export default headerStyle;
