/** @format */

import { colors } from "assets/jss/app-theme";
import { createStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

const useStyles = () => {
	const theme = useTheme();
	return createStyles({
		root: {
			padding: "0",
			minHeight: "80vh",
		},
		full_height: {
			minHeight: "100% !important",
		},
		fullPageHeight: {
			minHeight: "80vh !important",
		},
		errorContainer: {
			textAlign: "center",
		},
		errorIcon: {
			fontSize: "10rem",
		},
	});
};

export default useStyles;