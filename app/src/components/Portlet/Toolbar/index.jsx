/** @format */

// Material helpers

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const styles = theme => ({
	root: {
		position: "absolute",
		top: theme.spacing(),
		right: theme.spacing(),
		justifyContent: "flex-end",
		alignItems: "center",
		display: "flex",
	},
});

const PortletToolbar = props => {
	const { classes, className, children } = props;

	const rootClassName = classNames(classes?.root, className);

	return <div className={rootClassName}>{children}</div>;
};

PortletToolbar.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,

};

export default (PortletToolbar);
