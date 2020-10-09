/** @format */

import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
import gridStyle from "assets/jss/components/gridStyle.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import withRoot from "hoc/withRoot";

function GridItem(props) {
	let {
		classes,
		children,
		color,
		fullwidth,
		fullheight,
		className,
		...rest
	} = props;
	let gridClasses = classNames({
		[color]: color,
		[classes.fullwidth]: fullwidth,
		[classes.fullheight]: fullheight,
		[classes.griditem]: true,
		[className]: className,
	});
	return (
		<Grid item className={gridClasses} {...rest}>
			{children}
		</Grid>
	);
}

GridItem.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
	color: PropTypes.oneOf(colors.names),
	fullwidth: PropTypes.bool,
	fullheight: PropTypes.bool,
};

export default withStyles(gridStyle)(React.memo(GridItem));
