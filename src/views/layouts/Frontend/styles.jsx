export default theme => ({
	mainContent: {
		marginTop: "64px",
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: 100
		}),
		minHeight: "70vh"

	},
	mainContentShift: {
		marginTop: "64px",
	}
});
