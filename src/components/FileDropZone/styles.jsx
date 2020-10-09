/** @format */

export default theme => ({
	"@keyframes progress": {
		"0%": {
			backgroundPosition: "0 0",
		},
		"100%": {
			backgroundPosition: "-70px 0",
		},
	},
	dropZoneContainer: {
		padding: 0,
		margin: 0,
	},

	dropZone: {
		position: "relative",
		width: "100%",
		background: "transparent",
		border: "1px dashed #C8C8C8",
		borderRadius: "5px",
		padding: 0,
		cursor: "pointer",
		boxSizing: "border-box",
	},

	dropZoneFilled: {
		position: "relative",
		width: "100%",
		background: "rgba(0,0,0,0.1)",
		border: "0px solid transparent",
		borderBottom: "1px solid "+theme.palette.text.secondary,
		borderRadius: "5px",
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		padding: 0,
		cursor: "pointer",
		boxSizing: "border-box",
	},

	dropZoneInner: {
		height: "100%",
		padding: 0,
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
