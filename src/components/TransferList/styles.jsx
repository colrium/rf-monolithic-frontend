/** @format */

export default theme => ({
	root: {
		margin: "auto",
		display: "flex !important",
	},
	options_wrapper: {
		minWidth: "30%",
		minWidth: "40%",
		flexGrow: "6",
	},
	actions_wrapper: {
		flexGrow: "2",
	},
	paper: {
		maxWidth: "100%",
		maxHeight: "30vh",
		height: "100%",
		overflow: "auto",
	},
	button: {
		margin: theme.spacing(0.5, 0),
	},
	input: {
		height: "0px",
		width: "0px",
		padding: "0px",
		border: "0px solid transparent",
	},
});
