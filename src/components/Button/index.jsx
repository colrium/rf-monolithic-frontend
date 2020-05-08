/** @format */

import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";
import styles from "./styles";

function CustomButton({ ...props }) {
	const {
		classes,
		color,
		round,
		children,
		fullWidth,
		simple,
		size,
		textCase,
		block,
		link,
		justIcon,
		className,
		outlined,
		left,
		right,
		gradient,
		...rest
	} = props;
	const btnClasses = classNames({
		[classes.button]: true,
		[classes[size]]: size,
		[classes[textCase]]: textCase,
		[color]: color && !gradient && !simple,
		[color + "_gradient"]: color && gradient && !simple && !outlined,
		hoverraise: !outlined && !simple,
		[color + "_text"]: color && (outlined || simple),
		["inverse_text"]:
			!["inverse", "transparent"].includes(color) && !outlined && !simple,
		[classes.round]: round,
		[classes.fullWidth]: fullWidth,
		[classes.simple]: simple,
		[classes.block]: block,
		[classes.link]: link,
		[classes.justIcon]: justIcon,
		outlined: outlined,
		[classes.left]: left,
		[classes.right]: right,
		[className]: className,
	});
	return (
		<Button {...rest} className={btnClasses}>
			{children}
		</Button>
	);
}

CustomButton.propTypes = {
	classes: PropTypes.object.isRequired,
	color: PropTypes.oneOf(colors.names),
	size: PropTypes.oneOf(["sm", "md", "lg"]),
	textCase: PropTypes.oneOf([
		"lowercase",
		"uppercase",
		"wordcase",
		"nocase",
		"inheritcase",
	]),
	simple: PropTypes.bool,
	round: PropTypes.bool,
	fullWidth: PropTypes.bool,
	block: PropTypes.bool,
	link: PropTypes.bool,
	justIcon: PropTypes.bool,
	outlined: PropTypes.bool,
	left: PropTypes.bool,
	right: PropTypes.bool,
	gradient: PropTypes.bool,
};

CustomButton.defaultProps = {
	gradient: false,
};

export default withRoot(withStyles(styles)(CustomButton));
