/** @format */

import CardHeader from "@mui/material/CardHeader";

import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";



function CustomCardHeader({ ...props }) {
	const { children, ...rest } = props;
	return (
		<CardHeader  {...rest}>
			{children}
		</CardHeader>
	);
}

CustomCardHeader.propTypes = {

	className: PropTypes.string,
	color: PropTypes.oneOf(colors.names),
	plain: PropTypes.bool,
};

export default (CustomCardHeader);
