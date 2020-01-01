import { colors } from "assets/jss/app-theme";

export default theme => ({
	root: {
		backgroundColor: theme.palette.common.white,
		display: "flex",
		flexDirection: "column",
		height: "100%"
	},

	headerWrapper: {
		backgroundColor: "rgba(" + colors.rgb.grey + ", 0.1)",
		paddingBottom: theme.spacing(2)
	},
	bodyWrapper: {
		overflowY: "scroll",
		overflowX: "hidden",
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(3)
	},
	logoWrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "50%",
		height: "auto",
		flexShrink: 0,
		padding: theme.spacing(3)
	},
	logoLink: {
		fontSize: 0
	},
	logoImage: {
		cursor: "pointer",
		width: "100%",
		height: "auto"
	},
	logoDivider: {
		marginBottom: theme.spacing(2)
	},
	profile: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		minHeight: "fit-content"
	},
	avatar: {
		width: "100px",
		height: "100px"
	},
	textAvatar: {
		width: "100px",
		height: "100px",
		backgroundColor: colors.hex.accent,
		color: colors.hex.inverse
	},
	iconAvatar: {
		height: "110px",
		width: "110px",
		flexShrink: 0,
		flexGrow: 1,
		fontSize: "10rem",
		backgroundColor: "rgba(" + colors.rgb.default + ", 0.1)",
		color: colors.hex.accent
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
		margin: " 1rem auto"
	},
	profileDivider: {
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2)
	},
	listSubheader: {
		color: theme.palette.text.secondary
	},
	listItem: {
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(" + colors.rgb.primary + ", 0.1)",
			borderLeft: "4px solid rgba(" + colors.rgb.primary + ", 0.1)",
			borderRadius: "4px",
			"& $listItemIcon": {
				color: theme.palette.text.main,
				marginLeft: "-4px"
			}
		},
		"& + &": {
			marginTop: theme.spacing()
		}
	},
	activeListItem: {
		/*borderLeft: `4px solid ${theme.palette.primary.main}`,
			borderRadius: '4px',
			backgroundColor: "rgba("+colors.rgb.primary+", 0.1)",
			'& $listItemText': {
				color: theme.palette.text.primary
			},
			'& $listItemIcon': {
				color: theme.palette.primary.main,
				marginLeft: '-4px'
			}*/
	},
	listItemIcon: {
		marginRight: 0
	},
	listItemText: {
		fontWeight: 500,
		color: theme.palette.text.secondary
	},
	listDivider: {
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2)
	}
});
