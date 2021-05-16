/** @format */

export default theme => ({
	backdrop: {
		zIndex: 9999999999999,
		color: '#fff',
  	},
	root: {
		width: "100vw",
		position: "fixed",
		bottom: 0,
		left: 0,
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(4),
		right: "auto",		
		'& > * + *': {
			padding: theme.spacing(8),
			marginTop: theme.spacing(2),
		},
	},
	snackbarContent: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.primary,
		padding: theme.spacing(2),
		
	},
});