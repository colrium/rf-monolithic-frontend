/** @format */

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
		},
	},
	valueChip: {
		margin: theme.spacing(0.5),
	},
	emptyImage: {
		maxWidth: 100,
		width: "70%",
		margin: theme.spacing(2),
	},
	emptyText: {
		marginTop: theme.spacing(3),
	},
});
