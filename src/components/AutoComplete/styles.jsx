/** @format */

export default theme => ({
	root: {
		flexGrow: 1,
		height: "auto",
	},
	input: {
		padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
		height: "auto",
		display: "flex",
	},
	valueContainer: {
		display: "flex",
		flexWrap: "wrap",
		flex: 1,
		alignItems: "center",
		overflow: "hidden",
	},
	noOptionsMessage: {
		padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
	},
	singleValue: {
		fontSize: 16,
	},

	paper: {
		position: "absolute",
		zIndex: 99999,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},
	chip: {
		margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
	},
	chipFocused: {
		backgroundColor: theme.palette.primary,
	},
});
