/** @format */

export default theme => ({
	root: {
		padding: "0",
		height: "100vh",
		maxHeight: "100vh",
		display: "flex",
		flexDirection: "column",
		overflowX: "hidden",
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
		overflowX: "hidden",
	},
	chatPaperWrapper: {
		position: "relative",
		marginTop: theme.spacing(8),
		flexGrow: 1,
		height: "calc(100% - "+theme.spacing(8)+"px)",
		minHeight: "calc(100% - "+theme.spacing(8)+"px)",
		overflow: "hidden",
		padding: 0,
		backgroundColor: theme.palette.background.default,
		background: theme.palette.background.default,
	},

	bodyWrapper: {
		overflowY: "scroll",
		overflowX: "hidden",
		height: "calc(100% - "+theme.spacing(4)+"px)",
	},

	scrollWrapper: {
		overflowY: "scroll",
		overflowX: "hidden",
	},

	list: {
		marginBottom: theme.spacing(2),
	},

	subheader: {
		backgroundColor: theme.palette.background.paper,
	},
	iconAvatar:{
		backgroundColor: theme.palette.background.default,
		color: theme.palette.accent.main,
	},
	contactAvatar:{
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.accent.main,
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
	drawer: {
		width: theme.appDrawer.width,
		flexShrink: 0,
	},
  	drawerPaper: {
		width: theme.appDrawer.width,
		position: "absolute",
		zIndex: theme.zIndex.appBar+2,
		backgroundColor: theme.palette.background.default,
  	},
  	temporaryDrawerPaper: {
		width: theme.appDrawer.width,
		background: theme.palette.background.default,
  	},
  	content: {
		flexGrow: 1,
		padding: 0,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},

	contentDrawerMargin: {
		marginRight: -theme.appDrawer.width,
	},

	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: 0,
	},

	chatInputsWrapper: {
		top: 'auto',
		bottom: 0,
		padding: theme.spacing(2),
		background: theme.palette.background.paper,
		color: theme.palette.text.primary,
	},
});
