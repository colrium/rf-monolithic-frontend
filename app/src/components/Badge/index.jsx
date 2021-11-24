/** @format */

import React from "react";
import classNames from "classnames";

import Badge from "@mui/material/Badge";

import { colors } from "assets/jss/app-theme";





function CustomBadge(props) {
	const { children, ...rest } = props;

	return (
		<Badge
			{...rest}
		>
			{children}
		</Badge>
	);
}

/* CustomBadge.propTypes = {
  
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

export default (CustomBadge);
