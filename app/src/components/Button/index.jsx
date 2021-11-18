/** @format */

import Button from "@mui/material/Button";

import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";


const CustomButton = React.memo((props) => {
	const {
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
		[className]: className,
	});
	return (
		<Button {...rest} className={btnClasses}>
			{children}
		</Button>
	);
});

CustomButton.propTypes = {

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

export default (CustomButton);
