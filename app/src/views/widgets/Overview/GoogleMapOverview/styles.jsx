/** @format */


export default theme => ({
	root: {
		padding: "0",
	},
	wrapper: {
		display: 'flex',
		margin: 0,
		padding: 0,
	},
	drawer: {
		width: theme.appDrawer.width,
		flexShrink: 0,
	},
  	drawerPaper: {
		width: theme.appDrawer.width,
		position: "absolute",
		zIndex: theme.zIndex.appBar/2,
		backgroundColor: theme.palette.background.paper,
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
});
