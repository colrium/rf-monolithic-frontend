const headerLinksStyle = theme => ({
	list: {
		fontSize: "1rem",
		margin: 0,
		paddingLeft: "0",
		listStyle: "none",
		paddingTop: "0",
		paddingBottom: "0",
		color: "inherit",
	},
	listItem: {
		float: "left",
		color: "inherit",
		position: "relative",
		display: "block",
		width: "auto",
		margin: "0",
		padding: "0",
	},
	listItemText: {
		padding: "0 !important",
	},
	navLink: {
		color: "inherit",
		position: "relative",
		padding: "0.9375rem",
		borderRadius: "3px",
		textDecoration: "none",
		fontSize: "1rem",
		fontWeight: "600",
		margin: "0px 5px",
		display: "inline-flex",
		"&:hover,&:focus": {
			color: "inherit",
			background: "rgba(200, 200, 200, 0.2)",
		},
	},
	notificationNavLink: {
		color: "inherit",
		padding: "0.9375rem",
		fontWeight: "400",
		fontSize: "12px",
		textTransform: "uppercase",
		lineHeight: "20px",
		textDecoration: "none",
		margin: "0px",
		display: "inline-flex",
		top: "4px",
	},
	registerNavLink: {
		top: "3px",
		position: "relative",
		fontWeight: "400",
		textTransform: "uppercase",
		lineHeight: "20px",
		textDecoration: "none",
		margin: "0px",
		display: "inline-flex",
	},
	navLinkActive: {
		color: "inherit",
		backgroundColor: "inherit",
	},
	icons: {
		width: "20px",
		height: "20px",
		marginRight: "3px",
	},
	socialIcons: {
		position: "relative",
		fontSize: "20px !important",
		marginRight: "4px",
	},
	dropdownLink: {
		"&,&:hover,&:focus": {
			color: "inherit",
			textDecoration: "none",
			display: "block",
			padding: "10px 20px",
		},
	},
	marginRight5: {
		marginRight: "5px",
	},
});

export default headerLinksStyle;
