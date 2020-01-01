import { colors } from "assets/jss/app-theme.jsx";
export default theme => ({
	root: {
		//borderBottom: `1px solid ${theme.palette.border}`,
		backgroundColor: colors.hex.primarys,
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
		color: colors.hex.inverse
	},
	breadcrumbs: {
		color: colors.hex.inverse,
		paddingLeft: theme.spacing(3)
	},
	breadcrumb: {
		color: colors.hex.inverse,
		"&:hover": {
			color: colors.hex.inverse + " !important"
		}
	},
	title: {
		marginLeft: theme.spacing(),
		color: colors.hex.inverse
	},
	menuButton: {
		alignSelf: 'center',
		marginLeft: "-4px",
		color: colors.hex.inverse
	},
	notificationsButton: {
		alignSelf: 'center',
		marginLeft: "auto",
		color: colors.hex.inverse
	},
	signOutButton: {
		alignSelf: 'center',
		marginLeft: theme.spacing(),
		color: colors.hex.inverse
	},
	prominent: {
		height: theme.spacing(20),
		//alignItems: 'flex-start',
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(2),
		"& $title": {
			alignSelf: 'flex-end',
		},
		"& $breadcrumbs": {
			alignSelf: 'flex-end',
		},
		"& $menuButton": {
			alignSelf: 'flex-start',
		},
	}
});
