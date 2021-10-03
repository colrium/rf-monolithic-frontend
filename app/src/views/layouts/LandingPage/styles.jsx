/** @format */

export default theme => ({
	mainContent: {
		paddingTop: theme.spacing(10),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: 100,
		}),
		minHeight: "100vh",
	},
	mainContentShift: {
		marginTop: "64px",
	},
});
