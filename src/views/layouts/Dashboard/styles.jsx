/** @format */

import { width as drawerWidth } from "config/ui/drawer";

export default theme => ({
	topbar: {
		position: "fixed",
		width: "100%",
		top: 0,
		left: 0,
		right: "auto",		
		[theme.breakpoints.up("md")]: {
			zIndex: theme.zIndex.modal,
		},
		[theme.breakpoints.down("sm")]: {
			zIndex: theme.zIndex.appBar,
		},
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: 100,
		}),
	},
	topbarShift: {
		[theme.breakpoints.up("md")]: {
			marginLeft: drawerWidth + 1,
			width: "calc(-" + (drawerWidth + 1) + "px + 100vw)",
		},
	},
	drawerPaper: {
		[theme.breakpoints.up("md")]: {
			position: "fixed",
			top: 0,
			paddingTop: theme.spacing(8),
			borderRight: "0px solid transparent",
		},
		[theme.breakpoints.down("sm")]: {
			zIndex: theme.zIndex.drawer,
		},
		
		backgroundColor: "transparent",
		width: drawerWidth,

	},
	sidebar: {
		width: drawerWidth,
		overflowX: "hidden",
		
	},
	content: {
		marginTop: "64px",
		backgroundColor: theme.palette.background.default,
		minHeight: "calc(100vh - " + theme.spacing(6) + "px)",
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: 100,
		}),
	},
	contentShift: {
		[theme.breakpoints.up("md")]: {
			marginLeft: drawerWidth,
		},
	},
	pageTitle: {
		color: theme.palette.text.secondary,
	},
	drawerBtn: {
		color: theme.palette.text.primary,
		backgroundColor: "rgba(0,0,0,0.05)",
		transition: theme.transitions.create(["background", "color"], {
			easing: theme.transitions.easing.sharp,
			duration: 250,
		}),
		"&:hover": {
			backgroundColor: "rgba(0,0,0,0.1)",
			color: theme.palette.primary.dark,
		},
		[theme.breakpoints.down("sm")]: {
			display: "none",
		}

	},
	breadcrumbs: {
		color: theme.palette.text.primary,
	},

	breadcrumb: {
		color: theme.palette.text.primary,
		fontWeight: "bold !important",
		transition: theme.transitions.create("color", {
			easing: theme.transitions.easing.sharp,
			duration: 250,
		}),
		"&:hover": {
			color: theme.palette.primary.main + " !important",
		},
	},
	breadcrumbSeparator: {
		backgroundColor: theme.palette.primary.main,
		width: theme.spacing(0.5),
		height: theme.spacing(0.5),
		borderRadius: theme.spacing(0.25),
		alignSelf: "center",
	}
});
