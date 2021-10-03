/** @format */

import LinearProgress from "@material-ui/core/LinearProgress";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import customLinearProgressStyle from "assets/jss/components/customLinearProgressStyle.jsx";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";

function CustomLinearProgress({ ...props }) {
	const { classes, color, ...rest } = props;
	return (
		<LinearProgress
			{...rest}
			classes={{
				root: classes.root + " " + classes[color + "Background"],
				bar: classes.bar + " " + classes[color],
			}}
		/>
	);
}

CustomLinearProgress.defaultProps = {
	color: colors.names[0],
};

CustomLinearProgress.propTypes = {
	classes: PropTypes.object.isRequired,
	color: PropTypes.oneOf(colors.names),
};

export default withRoot(
	withStyles(customLinearProgressStyle)(CustomLinearProgress)
);
