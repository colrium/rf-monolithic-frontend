/** @format */


export default theme => ({
	root: {
		padding: "0",
	},
	inputWrapper: {
		height: "auto",
		display: "flex",
		borderRadius: "3px",
		"&:hover $actionContainer": {
			display: "inline",
		},
	},
	transparent: {
		background: "transparent !important",
	},
	inputContainer: {
		flexGrow: 1,
		//cursor: "pointer",
	},
	actionContainer: {
		display: "none",
		flexGrow: 1,
		textAlign: "right",
		padding: theme.spacing(0.5),
		minWidth: theme.spacing(7),
	},
	inputAction: {
		margin: "auto",
		opacity: 0.8,
		transition: theme.transitions.create("opacity", {
			duration: theme.transitions.duration.shortest,
		}),
		"&:hover": {
			opacity: 1,
		},
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(180deg)",
	},
});
