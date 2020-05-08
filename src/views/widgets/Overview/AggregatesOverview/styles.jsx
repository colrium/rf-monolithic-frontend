/** @format */

import { colors } from "assets/jss/app-theme";

export default theme => ({
	root: {
		padding: "0",
	},
	content: {
		alignItems: "center",
		display: "flex",
		padding: theme.spacing(),
	},
	title: {
		color: theme.palette.text.secondary,
		fontWeight: 700,
		padding: theme.spacing(2),
	},
	value: {
		marginTop: theme.spacing(),
		padding: theme.spacing(2),
	},
	iconWrapper: {
		alignItems: "center",
		borderRadius: "50%",
		display: "inline-flex",
		height: "4rem",
		justifyContent: "center",
		marginLeft: "auto",
		width: "4rem",
		"&:hover": {
			background: "rgba(" + colors.rgb.default + ", 0.3)",
		},
	},
	icon: {
		color: colors.hex.inverse,
		fontSize: "2rem",
		height: "2rem",
		width: "2rem",
	},
	footer: {
		marginTop: theme.spacing(),
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(),
	},
	difference: {
		alignItems: "center",
		color: colors.hex.error,
		display: "inline-flex",
		fontWeight: 700,
	},
	caption: {
		marginLeft: theme.spacing(),
	},
});
