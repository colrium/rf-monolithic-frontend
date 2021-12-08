/** @format */

import { colors } from "assets/jss/app-theme";

export default theme => ({
	root: {
		backgroundColor: theme.palette.primary.main,
		display: "flex",
		flexDirection: "column",
		height: "100%",
	},

	toolbar: {
		// backgroundColor: theme.palette.pink.main,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	headerWrapper: {
		backgroundColor: "rgba(" + colors.rgb.grey + ", 0.1)",
		paddingBottom: theme.spacing(2),
	},
	bodyWrapper: {
		overflowY: "scroll",
		overflowX: "hidden",
		/*paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(3),*/
		"& .activeListItemCSS": {
			'&::after': {
				transition: theme.transitions.create(["visibility", "opacity"], {
					easing: theme.transitions.easing.easeInOut,
					duration: 250,
				}),
			}
		},
		"&:hover": {
			"& .activeListItemCSS": {
				'&::after': {
					visibility: "hidden",
					opacity: 0,
					//display: "none",
				}
			}
		},
	},
	logoWrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "auto",
		maxWidth: "90%",
		height: "80%",
		flexShrink: 0,
		padding: theme.spacing(3),
	},
	logoLink: {
		fontSize: 0,
	},
	logoImage: {
		cursor: "pointer",
		width: "100%",
		height: "auto",
	},
	logoDivider: {
		marginBottom: theme.spacing(2),
	},
	profile: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		minHeight: "fit-content",
	},
	avatar: {
		width: "100px",
		height: "100px",
	},
	textAvatar: {
		width: "100px",
		height: "100px",
		backgroundColor: colors.hex.accent,
		color: theme.palette.text.primary,
	},
	iconAvatar: {
		height: "110px",
		width: "110px",
		flexShrink: 0,
		flexGrow: 1,
		fontSize: "10rem",
		backgroundColor: "rgba(" + colors.rgb.default + ", 0.1)",
		color: colors.hex.accent,
	},
	userMenuBtn: {
		marginTop: theme.spacing(1.5),
		fontSize: "1.1rem",
	},
	nameText: {
		marginTop: theme.spacing(0.5),
	},
	bioText: {},
	presenceStatus: {
		margin: " 1rem auto",
	},
	profileDivider: {
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
	},
	listSubheader: {
		color: theme.palette.background.default,
	},
	listItem: {
		cursor: "pointer",
		//borderLeft: "4px solid transparent",
		paddingTop: theme.spacing(1.5),
		paddingBottom: theme.spacing(1.5),
		'& $listItemText': {
			color: theme.palette.background.paper
		},
		'& $listItemIcon': {
			color: theme.palette.background.paper,
			//marginLeft: '-4px'
		},
		"&:hover": {
			backgroundColor: "rgba(0,0,0,0.1)",
			//borderLeft: "4px solid "+theme.palette.background.paper,
			//borderRadius: "4px",
			"& $listItemIcon": {
				color: theme.palette.background.paper,
				//marginLeft: "-4px",
			},
			'& $listItemText': {
				color: theme.palette.background.paper
			},
		},
		"& + &": {
			marginTop: theme.spacing(),
		},
	},
	activeListItem: {
		//borderLeft: `4px solid ${theme.palette.background.paper}`,
		//borderRadius: '4px',
		position: "relative",
		backgroundColor: "rgba(0,0,0,0.1)",
		'& $listItemText': {
			color: theme.palette.background.paper
		},

		'& $listItemIcon': {
			color: theme.palette.background.paper,
			//marginLeft: '-4px'
		},
		'&::after': {
			[theme.breakpoints.up("md")]: {
				content: "''",
				position: "absolute",
				right: -3,
				top: "50%",
				width: "0",
				height: "0",
				border: "1.219em solid transparent",
				borderRightColor: theme.palette.background.default,
				borderLeft: "0",
				marginTop: "-1.219em",
				marginLeft: "-1.219em",
				transition: theme.transitions.create("display", {
					easing: theme.transitions.easing.sharp,
					duration: 250,
				}),
			}
		},
	},
	listItemIcon: {
		marginRight: 0,
	},
	listItemText: {
		fontWeight: 500,
		color: theme.palette.background.paper,
	},
	listDivider: {
		marginBottom: "0.5rem",
		marginTop: "0.5rem",
	},
});
