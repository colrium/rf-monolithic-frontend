const paginationStyle = {
	pagination: {
		display: "inline-block",
		paddingLeft: "0",
		margin: "0 0 20px 0",
		borderRadius: "4px"
	},
	paginationItem: {
		display: "inline"
	},
	paginationLink: {
		":first-of-type": {
			marginleft: "0"
		},
		border: "0",
		borderRadius: "30px !important",
		transition: "all .3s",
		padding: "0px 11px",
		margin: "0 3px",
		minWidth: "30px",
		height: "30px",
		minHeight: "auto",
		lineHeight: "30px",
		fontWeight: "400",
		fontSize: "12px",
		textTransform: "uppercase",
		background: "transparent",
		position: "relative",
		float: "left",
		textDecoration: "none",
		boxSizing: "border-box",
		"&:hover,&:focus": {
			zIndex: "3",
			backgroundColor: "#eee",
			borderColor: "#ddd"
		},
		"&:hover": {
			cursor: "pointer"
		}
	},
	disabled: {
		"&,&:hover,&:focus": {
			color: "#777",
			cursor: "not-allowed",
			backgroundColor: "#fff",
			borderColor: "#ddd"
		}
	}
};

export default paginationStyle;
