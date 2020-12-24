/** @format */

export default theme => ({
	root: {
		padding: "0",
		height: "calc(100vh - "+theme.spacing(12)+"px)",
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

	chatScrollWrapper: {
		overflowY: "scroll",
		overflowX: "hidden",
		top: 0,
		bottom: 'auto',
		height: "80% !important",
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
	avatar:{
		backgroundColor: theme.palette.action.hover,
		color: theme.palette.text.primary,
		width: theme.spacing(5),
		height: theme.spacing(5),
		borderRadius: theme.spacing(2.5),
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
		/*position: "relative",
		top: 'auto',
		bottom: 0,*/
		minHeight: "20% !important",
		padding: 0,
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		background: theme.palette.background.paper,
		color: theme.palette.text.primary,
	},

	chatBubbleLocal: {
		maxWidth: "40%",
		background: theme.palette.primary.light,
		borderBottomRightRadius: "1.5rem",
		borderBottomLeftRadius: "1.5rem",
		borderTopRightRadius: 0,
		borderTopLeftRadius: "1.5rem",
	},

	chatBubbleExternal: {
		background: theme.palette.background.paper,
		borderBottomRightRadius: "1.5rem",
		borderBottomLeftRadius: "1.5rem",
		borderTopRightRadius: "1.5rem",
		borderTopLeftRadius: 0,
	},

	chatBubbleLocalSequential: {
		borderBottomRightRadius: "1.5rem",
		borderBottomLeftRadius: "1.5rem",
		borderTopRightRadius: "1.5rem",
		borderTopLeftRadius: "1.5rem",
	},
	'@keyframes typing_loader_line': {
			'0%': {
				backgroundColor: theme.palette.action.active,
				boxShadow: '12px 0px 0px 0px rgba(0,0,0,0.2),  24px 0px 0px 0px rgba(0,0,0,0.2)'
			},
			'25%': {
				backgroundColor: theme.palette.action.hover,
				boxShadow: '12px 0px 0px 0px rgba(0,0,0,2), 24px 0px 0px 0px rgba(0,0,0,0.2)'
			},
			'75%': {
				backgroundColor: theme.palette.text.disabled,
				boxShadow: '12px 0px 0px 0px rgba(0,0,0,0.2), 24px 0px 0px 0px rgba(0,0,0,2)'
			}
	},
	typing_loader: {
			margin: theme.spacing(),
			width: theme.spacing(),
			height: theme.spacing(),
			borderRadius: theme.spacing(0.5),
			backgroundColor: 'rgba(0,0,0, 1)',
			webkitAnimation: '$typing_loader_line 1s linear infinite alternate',
			mozAnimation: '$typing_loader_line 1s linear infinite alternate',
			animation: '$typing_loader_line 1s linear infinite alternate'
	},
	
	
});
