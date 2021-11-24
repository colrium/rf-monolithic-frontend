/** @format */

import IconButton from "@mui/material/IconButton";
import SnackbarContent from "@mui/material/SnackbarContent";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";


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
			className={classNames(classes?.root, {
				[color]: color,
				[textColorClass]: textColorClass,
				[className]: className,
			})}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes?.message}>
					<Icon
						className={classNames(
							classes?.icon,
							classes?.iconVariant
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
					className={classes?.close}
					onClick={onClose}
				>
					<CloseIcon className={classes?.icon} />
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

	className: PropTypes.string,
	message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	onClose: PropTypes.func,
	color: PropTypes.oneOf(colors.names).isRequired,
};

export default (CustomSnackbarContent);
