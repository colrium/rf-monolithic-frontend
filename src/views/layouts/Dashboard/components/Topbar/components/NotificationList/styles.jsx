/** @format */

import { colors } from "assets/jss/app-theme";

export default theme => ({
	root: {
		width: "350px",
		maxWidth: "100%",
	},
	header: {
		backgroundColor: theme.palette.background.default,
		backgroundImage: 'url("/images/connected_world.svg")',
		backgroundPositionX: "right",
		backgroundPositionY: "center",
		backgroundRepeat: "no-repeat",
		backgroundSize: "contain",
		paddingBottom: "34px",
		paddingLeft: "20px",
		paddingRight: "20px",
		paddingTop: "34px",
	},
	subtitle: {
		color: theme.palette.text.secondary,
	},
	content: {},
	listItem: {
		cursor: "pointer",
		"&:hover": {
			backgroundColor: theme.palette.background.default,
		},
	},
	listItemIcon: {
		backgroundColor: "rgba(0, 0, 0, 0.03)",
		padding: "10px",
		borderRadius: "50%",
		minWidth: "auto",
		marginRight: theme.spacing(),
	},
	listItemTextPrimary: {
		color: colors.hex.default,
	},
	listItemTextSecondary: {
		marignTop: "4px",
		color: colors.hex.default,
	},
	arrowForward: {
		color: theme.palette.text.secondary,
		height: "16px",
		width: "16px",
	},
	footer: {
		paddingBottom: theme.spacing(),
		display: "flex",
		justifyContent: "center",
	},
	empty: {
		textAlign: "center",
		padding: theme.spacing(3),
	},
	emptyImageWrapper: {
		marginBottom: theme.spacing(3),
	},
	emptyIcon: {
		fontSize: "5rem",
		color: colors.hex.grey,
	},
});
