/** @format */

import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";

const CustomAvatar = (props) => {
	const {
	classes,
	className,
	color,
	textColor,
	children,
	...rest
} = props;
	const avatarClasses = classNames({
		[className]: className,
	});
	return (
		<Avatar
			className={avatarClasses}
			style={{
				backgroundColor: color + " !important",
				color: textColor + " !important",
			}}
			{...rest}
		>
			{children}
		</Avatar>
	);
}

CustomAvatar.defaultProps = {
	color: colors.hex.primary,
	textColor: colors.hex.inverse,
};

export default React.memo(CustomAvatar);
