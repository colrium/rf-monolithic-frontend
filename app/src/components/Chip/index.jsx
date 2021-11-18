/** @format */

import Chip from "@mui/material/Chip";

import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";


function CustomChip({ ...props }) {
	const {
		color,
		color_text,
		text_case,
		raised,
		hover_shadow,
		className,
		children,
		...rest
	} = props;

	return (
		<Chip className={className} {...rest}>
			{children}
		</Chip>
	);
}

CustomChip.propTypes = {

	color: PropTypes.oneOf(colors.names),
	color_text: PropTypes.oneOf(colors.names),
	text_case: PropTypes.oneOf([
		"lowercase",
		"uppercase",
		"wordcase",
		"nocase",
		"inheritcase",
	]),
	raised: PropTypes.bool,
	hover_shadow: PropTypes.bool,
};

export default (CustomChip);
