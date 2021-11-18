/** @format */


import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";



function CustomCardContent(props) {
	const { children, ...rest } = props;
	return (
		<div {...rest} >
			{children}
		</div>
	);
}

CustomCardContent.propTypes = {

	className: PropTypes.string,
	color: PropTypes.oneOf(colors.names),
};

export default (CustomCardContent);
