/** @format */

import { colors } from "assets/jss/app-theme";
export default theme => ({
	root: {},
	details: {
		display: "flex",
	},
	info: {},
	locationText: {
		marginTop: theme.spacing(),
		color: theme.palette.text.secondary,
	},
	dateText: {
		color: theme.palette.text.secondary,
	},
	avatar: {
		marginLeft: "auto",
		height: "110px",
		width: "110px",
		flexShrink: 0,
		flexGrow: 0,
	},
	iconAvatar: {
		marginLeft: "auto",
		height: "110px",
		width: "110px",
		flexShrink: 0,
		flexGrow: 0,
		fontSize: "10rem",
		backgroundColor: "rgba(" + colors.rgb.default + ", 0.1)",
		color: colors.hex.accent,
	},
	progressWrapper: {
		marginTop: theme.spacing(2),
	},
	uploadButton: {
		marginRight: theme.spacing(2),
	},
});
