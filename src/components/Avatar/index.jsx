import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import PropTypes from "prop-types";
import withRoot from "utils/withRoot";

function CustomAvatar({ classes, className, color, textColor, children, ...rest }) {
	const avatarClasses = classNames({
		[className]: className
	});
	return (
		<Avatar
			className={avatarClasses}
			style={{
				backgroundColor: color + " !important",
				color: textColor + " !important"
			}}
			{...rest}
		>
			{children}
		</Avatar>
	);
}


CustomAvatar.defaultProps = {
	color: colors.hex.primary,
	textColor: colors.hex.inverse
};

export default withRoot(CustomAvatar);
