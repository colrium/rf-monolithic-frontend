/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";
import styles from "./styles";

const Status = props => {
	const {
		classes,
		className,
		size,
		color,
		text,
		text_color,
		...rest
	} = props;
	const rootClassName = classNames({
		[classes.root]: true,
		[className]: className,
	});

	const statusClassName = classNames(
		{
			[classes.status]: true,
			[classes[size]]: size,
		},
		className
	);

	return (
		<span {...rest} className={rootClassName}>
			<span
				className={statusClassName}
				style={{
					backgroundColor: color,
					boxShadow: "0 0 0 2px " + colors.hex.inverse,
				}}
			/>
			<span className={classes.text} style={{ color: text_color }}>
				{text}
			</span>
		</span>
	);
};

Status.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	color: PropTypes.string,
	text_color: PropTypes.string,
	text: PropTypes.string,
	size: PropTypes.oneOf(["sm", "md", "lg"]),
};

Status.defaultProps = {
	size: "md",
	text: "",
	color: colors.hex.primary,
	text_color: colors.hex.default,
};

export default withRoot(withStyles(styles)(Status));
