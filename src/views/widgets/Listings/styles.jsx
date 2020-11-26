/** @format */

import { colors } from "assets/jss/app-theme";

export default theme => ({
	root: {
		padding: theme.spacing(),
		backgroundColor: theme.palette.background.paper,
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
	searchRoot: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: "100%",
	},
	searchInput: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	searchIconButton: {
		padding: 10,
	},
	searchDivider: {
		height: 28,
		margin: 4,
	},
});
