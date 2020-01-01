import { colors } from "assets/jss/app-theme";
export default theme => ({
	absoluteFooter: {
		background: "rgba("+colors.rgb.default+", 0.3)",
		minHeight: theme.spacing(4),
	},
});
