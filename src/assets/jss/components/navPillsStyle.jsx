const navPillsStyle = theme => ({
	root: {
		marginTop: "20px",
		paddingLeft: "0",
		marginBottom: "0",
		overflow: "visible !important"
	},
	displayNone: {
		display: "none !important"
	},
	fixed: {
		overflowX: "visible"
	},
	horizontalDisplay: {
		display: "block"
	},
	pills: {
		float: "left",
		position: "relative",
		display: "block",
		borderRadius: "30px",
		minWidth: "100px",
		textAlign: "center",
		transition: "all .3s",
		padding: "10px 15px",
		color: "#555555",
		height: "auto",
		opacity: "1",
		maxWidth: "100%",
		margin: "0 5px"
	},
	pillsWithIcons: {
		borderRadius: "4px"
	},
	tabIcon: {
		width: "30px",
		height: "30px",
		display: "block",
		margin: "15px 0"
	},
	horizontalPills: {
		width: "100%",
		float: "none !important",
		"& + button": {
			margin: "10px 0"
		}
	},
	labelContainer: {
		padding: "0!important",
		color: "inherit"
	},
	label: {
		lineHeight: "24px",
		textTransform: "uppercase",
		fontSize: "12px",
		fontWeight: "500",
		position: "relative",
		display: "block",
		color: "inherit"
	},
	contentWrapper: {
		marginTop: "20px"
	},
	alignCenter: {
		alignItems: "center",
		justifyContent: "center"
	}
});

export default navPillsStyle;
