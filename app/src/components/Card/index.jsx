/** @format */

import Card from "@material-ui/core/Card";
import withStyles from "@material-ui/core/styles/withStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";
import styles from "./styles";

const CustomCard =  React.forwardRef((props, ref) => {
	const {
		classes,
		className,
		color,
		children,
		plain,
		carousel,
		enforceOutline,
		outlineColor,
		...rest
	} = props;

	const cardClasses = classNames({
		[classes.card]: true,
		[classes.cardPlain]: plain,
		[classes.cardCarousel]: carousel,
		[classes.coloredOutline]:
			useMediaQuery("(min-width:768px)") && enforceOutline
				? outlineColor
				: false,
		[className]: className,
	});
	let cardStyles = {};
	if (color) {
		cardStyles.backgroundColor = color;
	}
	if (outlineColor) {
		cardStyles.borderColor = outlineColor;
	}
	return (
		<Card className={cardClasses} ref={ref} {...rest}>
			{children}
		</Card>
	);
});

CustomCard.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	color: PropTypes.string,
	plain: PropTypes.bool,
	carousel: PropTypes.bool,
	outlineColor: PropTypes.string,
	enforceOutline: PropTypes.bool,
};

export default withRoot(withStyles(styles)(CustomCard));
