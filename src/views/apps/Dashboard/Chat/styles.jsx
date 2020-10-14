/** @format */

export default theme => ({
	root: {
		padding: "0",
		height: "100vh",
		maxHeight: "100vh",
		display: "flex",
		flexDirection: "column",
	},	
	text: {
		padding: theme.spacing(2, 2, 0),
	},
	paper: {
		/*position: "absolute",
		top: theme.spacing(4),
		bottom: 'auto',*/
		paddingBottom: theme.spacing(7),
		marginTop: theme.spacing(8),
		flexGrow: 1,
		height: "calc(100% - "+theme.spacing(8)+"px)",
		minHeight: "calc(100% - "+theme.spacing(8)+"px)",
	},
	bodyWrapper: {
		overflowY: "scroll",
		overflowX: "hidden",
		height: "calc(100% - "+theme.spacing(4)+"px)",
	},
	list: {
		marginBottom: theme.spacing(2),
	},
	subheader: {
		backgroundColor: theme.palette.background.paper,
	},
	chatsAppBar: {
		top: 'auto',
		bottom: 0,
		color: theme.palette.background.paper,
	},
	mainAppBar: {
		top: 0,
		bottom: 'auto',
		color: theme.palette.text.primary,
		boxShadow: "none",
	},
	grow: {
		flexGrow: 1,
	},
	fabButton: {
		position: 'absolute',
		zIndex: 1,
		top: -30,
		left: 0,
		right: 0,
		margin: '0 auto',
		background: theme.palette.accent.main,
		color: theme.palette.background.paper,
	},
});
