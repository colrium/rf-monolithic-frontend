/** @format */

import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import withRoot from "hoc/withRoot";
const styles = theme => ({
	root: {
		zIndex: 99999999,
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(),
	},
	message: {
		display: "flex",
		alignItems: "center",
	},
});
const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

function CustomSnackbarContent(props) {
	const { classes, className, message, onClose, color, ...other } = props;
	const Icon = variantIcon[color] ? variantIcon[color] : InfoIcon;
	const textColorClass = ["white", "inverse", "transparent"].includes(color)
		? "default_text"
		: "inverse_text";

	return (
		<SnackbarContent
			className={classNames(classes.root, {
				[color]: color,
				[textColorClass]: textColorClass,
				[className]: className,
			})}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
					<Icon
						className={classNames(
							classes.icon,
							classes.iconVariant
						)}
					/>
					{message}
				</span>
			}
			action={[
				<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					className={classes.close}
					onClick={onClose}
				>
					<CloseIcon className={classes.icon} />
				</IconButton>,
			]}
			{...other}
		/>
	);
}

CustomSnackbarContent.defaultProps = {
	color: "inverse",
};

CustomSnackbarContent.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	onClose: PropTypes.func,
	color: PropTypes.oneOf(colors.names).isRequired,
};

export default withRoot(withStyles(styles)(CustomSnackbarContent));
