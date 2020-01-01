const customDropdownStyle = theme => ({
	popperClose: {
		pointerEvents: "none"
	},
	dropdown: {
		borderRadius: "3px",
		border: "0",
		boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
		top: "100%",
		zIndex: "1000",
		minWidth: "160px",
		padding: "5px 0",
		margin: "2px 0 0",
		fontSize: "14px",
		textAlign: "left",
		listStyle: "none",
		backgroundColor: "#fff",
		backgroundClip: "padding-box"
	},
	menuList: {
		padding: "0"
	},
	dropdownItem: {
		fontSize: "13px",
		padding: "10px 20px",
		margin: "0 5px",
		borderRadius: "2px",
		position: "relative",
		transition: "all 150ms linear",
		display: "block",
		clear: "both",
		fontWeight: "400",
		height: "fit-content",
		color: "#333",
		whiteSpace: "nowrap"
	},
	dropdownItemRTL: {
		textAlign: "right"
	},
	dropdownDividerItem: {
		margin: "5px 0",
		backgroundColor: "rgba(0, 0, 0, 0.12)",
		height: "1px",
		overflow: "hidden"
	},
	buttonIcon: {
		width: "20px",
		height: "20px"
	},
	caret: {
		transition: "all 150ms ease-in",
		display: "inline-block",
		width: "0",
		height: "0",
		marginLeft: "4px",
		verticalAlign: "middle",
		borderTop: "4px solid",
		borderRight: "4px solid transparent",
		borderLeft: "4px solid transparent"
	},
	caretActive: {
		transform: "rotate(180deg)"
	},
	caretRTL: {
		marginRight: "4px"
	},
	dropdownHeader: {
		display: "block",
		padding: "0.1875rem 1.25rem",
		fontSize: "0.75rem",
		lineHeight: "1.428571",
		color: "#777",
		whiteSpace: "nowrap",
		fontWeight: "inherit",
		marginTop: "10px",
		"&:hover,&:focus": {
			backgroundColor: "transparent",
			cursor: "auto"
		}
	},
	noLiPadding: {
		padding: "0"
	}
});

export default customDropdownStyle;
