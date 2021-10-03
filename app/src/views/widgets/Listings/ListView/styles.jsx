/** @format */

export default theme => ({
	root: {
		padding: "0",
	},
	listItem: {
		background: "transparent",
		transition: theme.transitions.create("background", {
			easing: theme.transitions.easing.sharp,
			duration: 50,
		}),
		"&:hover": {
			background: theme.palette.action.hover,
		},
	},
});
