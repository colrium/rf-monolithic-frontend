/** @format */

import { colors } from "assets/jss/app-theme";

export const AutoComplete = theme => ({
	root: {
		flexGrow: 1,
		height: "auto",
	},
	input: {
		padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
		height: "auto",
		display: "flex",
	},
	valueContainer: {
		display: "flex",
		flexWrap: "wrap",
		flex: 1,
		alignItems: "center",
		overflow: "hidden",
	},
	noOptionsMessage: {
		padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
	},
	singleValue: {
		fontSize: 16,
	},

	paper: {
		position: "absolute",
		zIndex: 99999,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},
	chip: {
		margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
	},
	chipFocused: {
		backgroundColor: theme.palette.primary,
	},
});



export const Badge = theme => ({
	button: {
		minHeight: "auto",
		minWidth: "auto",
		border: "none",
		borderRadius: "0.3rem",
		position: "relative",
		padding: "0.4rem 1rem",
		margin: ".125rem 1px",
		fontSize: "0.8rem",
		fontWeight: "400",
		letterSpacing: "0",
		willChange: "box-shadow, transform",
		transition:
			"box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		lineHeight: "1.75",
		textAlign: "center",
		whiteSpace: "nowrap",
		verticalAlign: "middle",
		touchAction: "manipulation",
		cursor: "pointer",
		"&.outlined": {
			borderWidth: "1px !important",
			borderStyle: "solid !important",
		},
		"& .fab,& .fas,& .far,& .fal,& .material-icons": {
			position: "relative",
			display: "inline-block",
			top: "0",
			fontSize: "1.1rem",
			marginRight: "4px",
			verticalAlign: "middle",
		},
		"& svg": {
			position: "relative",
			display: "inline-block",
			top: "0",
			width: "18px",
			height: "18px",
			marginRight: "4px",
			verticalAlign: "middle",
		},
		"&:disabled": {
			color: "rgba(" + colors.rgb.default + ", 0.26) !important",
			boxShadow: "none !important",
			cursor: "not-allowed !important",
			backgroundColor:
				"rgba(" + colors.rgb.default + ", 0.12) !important",
			borderColor: "rgba(" + colors.rgb.default + ", 0.12) !important",
		},

		"&$round": {
			borderRadius: "1.175rem",
		},

		/*"&$justIcon": {
				"& .fab,& .fas,& .far,& .fal,& .material-icons": {
					marginRight: "0px",
					position: "absolute",
					width: "100%",
					transform: "none",
					left: "0px",
					top: "0px",
					height: "100%",
					lineHeight: "41px",
					fontSize: "20px"
				}
			}*/
	},
	round: {
		borderRadius: "0.8rem",
	},
	block: {
		width: "100% !important",
	},
	link: {
		"&,&:hover,&:focus": {
			backgroundColor: "transparent",
			boxShadow: "none",
		},
	},
	lg: {
		padding: "0.6rem 1.25rem",
		fontSize: "1rem",
		lineHeight: "2.2",
		borderRadius: "0.3rem",
		"&round": {
			borderRadius: "1.5rem",
		},
	},
	md: {
		padding: "0.4rem 1rem",
		margin: "0.125rem 0.3rem",
		fontSize: "0.8rem",
		lineHeight: "1.75",
		borderRadius: "0.2rem",
		"&$round": {
			borderRadius: "1.175rem",
		},
	},
	sm: {
		padding: "0.2rem 1.25rem",
		fontSize: "0.6rem",
		lineHeight: "1",
		borderRadius: "0.2rem",
		"&$round": {
			borderRadius: "0.5rem",
		},
	},

	justIcon: {
		padding: "12px",
		fontSize: "20px",
		height: "41px",
		minWidth: "41px",
		width: "41px",
		"& .fab,& .fas,& .far,& .fal,& .material-icons": {
			fontSize: "24px",
			lineHeight: "41px",
		},
		"& svg, & img": {
			width: "20px",
			height: "20px",
		},
		"&$lg": {
			height: "57px",
			minWidth: "57px",
			width: "57px",
			lineHeight: "56px",
			padding: "12.5px",
			"& .fab,& .fas,& .far,& .fal,& .material-icons": {
				fontSize: "32px",
				lineHeight: "56px",
			},
			"& svg, & img": {
				width: "32px",
				height: "32px",
			},
		},
		"&$sm": {
			height: "30px",
			minWidth: "30px",
			width: "30px",
			padding: "6.5px",
			"& .fab,& .fas,& .far,& .fal,& .material-icons": {
				fontSize: "17px",
				lineHeight: "29px",
			},
			"& svg, & img": {
				width: "17px",
				height: "17px",
			},
		},
	},
	fullWidth: {
		width: "100%",
	},
	right: {
		float: "right !important",
	},
	left: {
		float: "left !important",
	},
	...textcases,
});

export const Calendar = theme => ({
	root: {
		padding: "0",
	},
});

export const Card = theme => ({
	card: {
		borderRadius: "3px",
		color: colors.rgb.default,
		width: "100%",
		minHeight: "100% !important",
		position: "relative",
		display: "flex",
		flexDirection: "column",
		minWidth: "0",
		wordWrap: "break-word",
		fontSize: ".875rem",
		transition: "all 300ms linear",
	},

	coloredOutline: {
		borderWidth: "1px !important",
		borderStyle: "solid !important",
	},
	cardPlain: {
		background: "transparent",
		boxShadow: "none",
	},
	cardCarousel: {
		overflow: "hidden",
	},
});

export const CardActions = theme => ({
	cardFooter: {
		display: "flex",
		alignItems: "center",
		backgroundColor: "transparent",
		padding: "0.9375rem 1.875rem",
	},
});

export const CardContent = theme => ({
	cardBody: {
		padding: "0.9375rem 1.875rem",
		flex: "1 1 auto",
		zIndex: "999",
	},
	vinset: {
		padding: "0.9375rem 1.875rem",
		margin: "-1.875rem 0.9375rem -1.875rem 0.9375rem",
		flex: "1 1 auto",
	},
});

export const CardHeader = theme => ({
	cardHeader: {
		borderRadius: "3px",
		padding: "1rem",
		border: "0",
		marginBottom: "0",
	},
	cardHeaderPlain: {
		marginLeft: "0px",
		marginRight: "0px",
	},
});

export const DisplayMode = theme => ({
	root: {
		flexGrow: 0,
		flexShrink: 0,
		overflow: "hidden",
		borderRadius: "5px",
		display: "inline-flex",
		border: `1px solid ${theme.palette.border}`,
	},
	option: {
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(),
		backgroundColor: theme.palette.common.white,
	},
	optionSelected: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.primary.main,
	},
	divider: {
		width: "1px",
		backgroundColor: theme.palette.divider,
	},
});

export const DynamicInput = theme => ({
	root: {
		padding: "0",
	},
});

export const DefinationView = theme => ({
	root: {
		padding: "0",
	},
	inputWrapper: {
		height: "auto",
		display: "flex",
		borderRadius: "3px",
		transition: theme.transitions.create("background", {
			duration: theme.transitions.duration.shortest,
		}),
		"&:hover": {
			background: "rgba(" + colors.rgb.default + ", 0.05) !important",
		},
		"&:hover $actionContainer": {
			display: "inline",
		},
	},
	transparent: {
		background: "transparent !important",
	},
	inputContainer: {
		flexGrow: 1,
	},
	actionContainer: {
		display: "none",
		flexGrow: 1,
		textAlign: "right",
		padding: theme.spacing(0.5),
		minWidth: theme.spacing(7),
	},
	inputAction: {
		margin: "auto",
		opacity: 0.5,
		transition: theme.transitions.create("opacity", {
			duration: theme.transitions.duration.shortest,
		}),
		"&:hover": {
			opacity: 1,
		},
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(180deg)",
	},
});

export const GenerationView = theme => ({
	root: {
		padding: "0",
	},
	inputGroup: {
		border: "1px solid rgba(" + colors.rgb.default + ", 0.15) !important",
		"& :hover": {
			backgroundColor:
				"rgba(" + colors.rgb.default + ", 0.15) !important",
		},
	},
	inputField: {
		"& :hover": {
			backgroundColor: "rgba(" + colors.rgb.default + ", 0.2) !important",
		},
	},
});

export const FileDropZone = theme => ({
	"@keyframes progress": {
		"0%": {
			backgroundPosition: "0 0",
		},
		"100%": {
			backgroundPosition: "-70px 0",
		},
	},
	dropZoneContainer: {
		padding: "0 !important",
		margin: "0 !important",
	},

	dropZone: {
		position: "relative",
		width: "100%",
		minHeight: "250px",
		background: "transparent",
		border: "1px dashed #C8C8C8",
		borderRadius: "5px",
		padding: theme.spacing(),
		cursor: "pointer",
		boxSizing: "border-box",
	},

	dropZoneInner: {
		height: "100%",
	},

	stripes: {
		border: "solid",
		backgroundImage:
			"repeating-linear-gradient(-45deg, #F0F0F0, #F0F0F0 25px, #C8C8C8 25px, #C8C8C8 50px)",
		animation: "progress 2s linear infinite !important",
		backgroundSize: "150% 100%",
	},
	rejectStripes: {
		border: "solid",
		backgroundImage:
			"repeating-linear-gradient(-45deg, #fc8785, #fc8785 25px, #f4231f 25px, #f4231f 50px)",
		animation: "progress 2s linear infinite !important",
		backgroundSize: "150% 100%",
	},

	labelContainer: {
		padding: "0 !important",
		margin: "auto 0 " + theme.spacing(2) + "px auto !important",
	},

	dropzoneTextStyle: {
		textAlign: "center",
	},
	uploadIcon: {
		marginBottom: theme.spacing(2),
		"& *": {
			fontSize: "5rem !important",
			color: "inherit !important",
		},
	},
});

export const ProgressIndicator = theme => ({
	root: {
		padding: theme.spacing(),
	},
});

export const Status = theme => ({
	root: {
		display: "flex",
		fontSize: "inherit",
	},
	status: {
		borderRadius: "50%",
		flexGrow: 0,
		flexShrink: 0,
		margin: "auto 0.5rem",
	},
	text: {
		fontSize: "inherit",
	},
	sm: {
		height: "0.3rem",
		width: "0.3rem",
	},
	md: {
		height: "0.5rem",
		width: "0.5rem",
	},
	lg: {
		height: "1rem",
		width: "1rem",
	},
});

export const TransferList = theme => ({
	root: {
		margin: "auto",
		display: "flex !important",
	},
	options_wrapper: {
		minWidth: "30%",
		minWidth: "40%",
		flexGrow: "6",
	},
	actions_wrapper: {
		flexGrow: "2",
	},
	paper: {
		maxWidth: "100%",
		maxHeight: "30vh",
		height: "100%",
		overflow: "auto",
	},
	button: {
		margin: theme.spacing(0.5, 0),
	},
	input: {
		height: "0px",
		width: "0px",
		padding: "0px",
		border: "0px solid transparent",
	},
});
