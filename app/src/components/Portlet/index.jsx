/** @format */

// Material helpers

import classNames from "classnames";
// Externals
import PropTypes from "prop-types";
import React from "react";
// Shared components
import Paper from "../Paper";

// Component styles
const styles = () => ({
	root: {
		display: "flex",
		flexDirection: "column",
		minWidth: "100%",
		minHeight: "100% !important",
	},
	fullHeight: {
		minHeight: "100% !important",
	},
});

const Portlet = props => {
	const {
		classes,
		className,
		outlined,
		squared,
		fullHeight,
		children,
	} = props;

	//const rootClassName = classNames(classes?.root, {[className]: true, [classes?.fullHeight]: fullHeight });
	const rootClassName = classNames(classes?.root, {
		[classes?.fullHeight]: fullHeight,
		[className]: className,
	});

	return (
		<Paper
			className={rootClassName}
			elevation={0}
			outlined={outlined}
			squared={squared}
		>
			{children}
		</Paper>
	);
};

Portlet.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,

	outlined: PropTypes.bool,
	squared: PropTypes.bool,
	fullHeight: PropTypes.bool,
};

export default (Portlet);
