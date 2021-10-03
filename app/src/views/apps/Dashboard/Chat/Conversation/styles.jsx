/** @format */

export default theme => ({
	
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
