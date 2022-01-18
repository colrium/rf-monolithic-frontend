/** @format */
import { createStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

const useStyles = () => {
	const theme = useTheme();
	return createStyles({
		root: {},
		field: {
			margin: theme?.spacing(3),
		},
		textField: {
			width: "420px",
			maxWidth: "100%",
			marginRight: theme?.spacing(3),
		},
		portletFooter: {
			paddingLeft: theme?.spacing(3),
			paddingRight: theme?.spacing(3),
			paddingTop: theme?.spacing(2),
			paddingBottom: theme?.spacing(2),
		},
	});
};
export default useStyles;
