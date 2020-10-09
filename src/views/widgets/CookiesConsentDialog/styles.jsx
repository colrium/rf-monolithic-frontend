/** @format */

export default theme => ({
	backdrop: {
		zIndex: 9999999999999,
		color: '#fff',
  	},
	root: {
		maxWidth: "70vw",
		position: "fixed",
		bottom: 0,
		left: "15vw",
		right: "auto",		
		'& > * + *': {
			padding: theme.spacing(4),
			marginTop: theme.spacing(2),
		},
	},
});