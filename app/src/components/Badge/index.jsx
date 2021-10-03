/** @format */

import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "@material-ui/core/Badge";

import { colors } from "assets/jss/app-theme";
import withRoot from "hoc/withRoot";

import styles from "./styles";

function CustomBadge(props) {
	const { classes, color, textColor, position, children, ...rest } = props;
	const positionClasses = {
		"top-left": classes.topLeft,
		"top-center": classes.topCenter,
		"top-right": classes.topRight,
		"bottom-left": classes.bottomLeft,
		"bottom-center": classes.bottomCenter,
		"bottom-right": classes.bottomRight,
		"center-left": classes.centerLeft,
		center: classes.center,
		"center-right": classes.centerRight,
	};
	let badgeClasses = classes.badge;
	if (position in positionClasses) {
		badgeClasses = classNames(classes.badge, positionClasses[position]);
	}
	return (
		<Badge
			{...rest}
			className={classes.root}
			classes={{ badge: badgeClasses }}
		>
			{children}
		</Badge>
	);
}

/* CustomBadge.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  textColor: PropTypes.string,
  position: PropTypes.oneOf([
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
    "center-left",
    "center",
    "center-right"
  ])
}; */

CustomBadge.defaultProps = {
	color: colors.hex.primary,
	textColor: colors.hex.inverse,
	position: "top-right",
};

export default withRoot(withStyles(styles)(CustomBadge));
