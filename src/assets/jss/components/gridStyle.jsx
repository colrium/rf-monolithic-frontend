export default theme => ({
	fullwidth: {
		width: "100%"
	},
	fullheight: {
		height: "100%"
	},
	grid: {
		position: "relative",
		marginRight: "-15px",
		marginLeft: "-15px",
		width: "auto"
	},
	griditem: {
		position: "relative",
		width: "100%",
		minHeight: "1px",		
		padding: theme.spacing(),
		flexBasis: "auto",
		[theme.breakpoints.down('md')]: {
			padding: theme.spacing(1.5) + "px " + theme.spacing(0.5)+"px",
		},
	},
});