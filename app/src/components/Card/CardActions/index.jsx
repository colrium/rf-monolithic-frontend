/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";
import styles from "./styles";

function CustomCardActions({ ...props }) {
	const { classes, className, children, ...rest } = props;
	const cardFooterClasses = classNames({
		[classes.cardFooter]: true,
		[className]: className !== undefined,
	});
	return (
		<div className={cardFooterClasses} {...rest}>
			{children}
		</div>
	);
}

CustomCardActions.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
};

export default withRoot(withStyles(styles)(CustomCardActions));
