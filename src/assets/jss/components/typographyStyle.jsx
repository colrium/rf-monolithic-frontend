import { colors, text_styles } from "assets/jss/app-theme.jsx";

const typographyStyle = {
	fullWidth:{
		width: "100%",
	},
	quote: {
		padding: "10px 20px",
		margin: "0 0 20px",
		fontSize: "17.5px",
		borderLeft: "5px solid #eee"
	},
	quoteText: {
		margin: "0 0 10px",
		fontStyle: "italic"
	},
	quoteAuthor: {
		display: "block",
		fontSize: "80%",
		lineHeight: "1.42857143",
		color: colors.hex.gray
	},
	mutedText: {
		color: colors.hex.gray
	},
	smallText: {
		fontSize: "65%",
		fontWeight: "400",
		lineHeight: "1",
		color: "inherit"
	},
	...text_styles,
};

export default typographyStyle;
