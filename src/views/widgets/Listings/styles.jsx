/** @format */

import { colors } from "assets/jss/app-theme";

export default theme => ({
	root: {
		padding: "0",
	},
	calendar: {
		borderRight: "1px solid rgba(" + colors.rgb.grey + ", 0.5) !important",
		borderLeft: "1px solid rgba(" + colors.rgb.grey + ", 0.5) !important",
	},
	activeVieBtn: {
		background: colors.hex.primary,
		color: colors.hex.inverse,
		border: "1px solid" + colors.hex.primary,
	},
	viewBtnGroup: {
		position: "absolute !important",
		right: theme.spacing(),
	},
});
