export default theme => ({
	root: {
		padding: "0",
	},
	data_actions_wrapper: {
		display: "inline-block",
		whiteSpace: "nowrap",
		"& > *": {
			display: "inline-block",
			whiteSpace: "nowrap",
		}
	},
	valueChip: {
		margin: theme.spacing(0.5)
	},
	emptyImage: {
		maxWidth: 200,
		width: "100%",
	},
	emptyText: {
		marginTop: theme.spacing(3)
	}
});