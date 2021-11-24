/** @format */

// Material helpers

import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import GridContainer from "components/Grid/GridContainer";
// Externals
import PropTypes from "prop-types";
import React from "react";

// Component styles
const styles = theme => ({
	root: {
		alignItems: "center",
		borderBottom: `1px solid ${theme.palette.border}`,
		borderTopLeftRadius: "2px",
		borderTopRightRadius: "2px",
		display: "flex",
		height: "64px",
		justifyContent: "space-between",
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
		background: "rgba(" + colors.rgb.default + ", 0.05)",
		position: "relative",
	},
	noDivider: {
		borderBottom: "none",
	},
	noPadding: {
		padding: 0,
	},
});

const PortletHeader = props => {
	const { classes, className, noDivider, noPadding, children } = props;

	const rootClassName = classNames(
		{
			[classes?.root]: true,
			[classes?.noDivider]: noDivider,
			[classes?.noPadding]: noPadding,
		},
		className
	);

	return <GridContainer className={rootClassName}>{children}</GridContainer>;
};

PortletHeader.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,

	noDivider: PropTypes.bool,
	noPadding: PropTypes.bool,
};

export default (PortletHeader);
