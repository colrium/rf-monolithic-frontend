/** @format */

import { width as drawerWidth } from "config/ui/drawer";

export default theme => ({
	topbar: {
		position: "fixed",
		width: "100%",
		top: 0,
		left: 0,
		right: "auto",
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
		zIndex: 1200,
		width: drawerWidth + 1,
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
});
