export default theme => ({
	root: {
		padding: theme.spacing(),
	},
	viewSelectBtn: {
		position: "absolute !important",
		right: theme.spacing(),
		bottom: theme.spacing(),
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: "rotate(180deg)"
	},
	relationsSectionTitle:  {
		height: "100%",
		lineHeight: "48px",
		verticalAlign: "middle",
	},
});