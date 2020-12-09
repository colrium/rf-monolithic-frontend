/** @format */

import { colors } from "assets/jss/app-theme.jsx";
import { app } from "assets/jss/app-theme";
export default theme => ({
	root: {
		//borderBottom: `1px solid ${theme.palette.border}`,
		backgroundColor: theme.palette.background.paper,
		//display: "flex",
		//alignItems: "center",
		zIndex: theme.zIndex.appBar,
		flexGrow: 1,
	},
	toolbar: {
		height: theme.spacing(8),
		transition: "height 100ms",
		width: "100%",
		transitionTimingFunction: "cubic-bezier(0.1, 0.7, 1.0, 0.1)",
		zIndex: 1300,		
		color: theme.palette.text.primary,
	},
	logoWrapper: {
		display: "inline-block",
		textAlign: "left",
		flexShrink: 1,
		alignSelf: "center",
	},
	logoLink: {
		fontSize: 0,
		display: "inline-block",
		textAlign: "left",
		width: "auto",
		alignSelf: "center",

	},
	logoImage: {
		cursor: "pointer",
		width: theme.spacing(26),
		marginLeft: theme.spacing(),
		height: "auto",
	},
	breadcrumbs: {
		color: theme.palette.text.primary,
		paddingLeft: theme.spacing(3),
	},
	breadcrumb: {
		color: theme.palette.text.secondary,
		"&:hover": {
			color: theme.palette.text.primary + " !important",
		},
	},
	title: {
		marginLeft: theme.spacing(),
		color: theme.palette.text.primary,
	},
	menuButton: {
		alignSelf: "center",
		marginLeft: "-4px",
		color: theme.palette.text.primary,
		"&:hover": {
			color: theme.palette.primary.main + " !important",
		},
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	notificationsButton: {
		alignSelf: "center",
		marginLeft: "auto",
		color: theme.palette.text.secondary,
		"&:hover": {
			color: theme.palette.text.primary + " !important",
		},
	},
	userAvatar: {
		width: theme.spacing(3.5),
    	height: theme.spacing(3.5),
	},
	signOutButton: {
		alignSelf: "center",
		marginLeft: theme.spacing(),
		color: theme.palette.text.secondary,
		"&:hover": {
			color: theme.palette.text.primary + " !important",
		},
	},
	prominent: {
		height: theme.spacing(10),
		//alignItems: 'flex-start',
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
		"& $title": {
			alignSelf: "flex-end",
		},
		"& $breadcrumbs": {
			alignSelf: "flex-end",
		},
		"& $menuButton": {
			alignSelf: "flex-start",
		},
	},
});
