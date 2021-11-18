/** @format */

import Card from "@mui/material/Card";

import useMediaQuery from "@mui/material/useMediaQuery";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";



const CustomCard = React.forwardRef((props, ref) => {
	const {
		children,
		...rest
	} = props;

	return (
		<Card ref={ref} {...rest}>
			{children}
		</Card>
	);
});

CustomCard.propTypes = {

	className: PropTypes.string,
	color: PropTypes.string,
	plain: PropTypes.bool,
	carousel: PropTypes.bool,
	outlineColor: PropTypes.string,
	enforceOutline: PropTypes.bool,
};

export default (CustomCard);
