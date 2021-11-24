/** @format */

// Material helpers

import classNames from "classnames";
// Externals
import PropTypes from "prop-types";
import React from "react";

// Component styles
const styles = theme => ({
	root: {
		paddingBottom: theme.spacing(),
		paddingTop: theme.spacing(),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		borderTop: `1px solid ${theme.palette.border}`,
		borderBottomLeftRadius: "2px",
		borderBottomRightRadius: "2px",
		//background: "rgba("+colors.rgb.default+", 0.05)",
	},
	noDivider: {
		borderTop: "none",
	},
});

const PortletFooter = props => {
	const { classes, className, noDivider, children } = props;

	const rootClassName = classNames(
		{
			[classes?.root]: true,
			[classes?.noDivider]: noDivider,
		},
		className
	);

	return <div className={rootClassName}>{children}</div>;
};

PortletFooter.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,

	noDivider: PropTypes.bool,
};

export default (PortletFooter);
