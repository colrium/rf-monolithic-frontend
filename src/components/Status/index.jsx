/** @format */


import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";

const sizeClasses = {
	sm: "h-2 w-2",
	md: "h-2 w-2",
	lg: "h-4 w-4",
};

const Status = props => {
	const { className, size, color, text, text_color, ...rest } = props;
	const rootClassName = classNames({
		[`flex my-4 rounded-full items-center`]: true,
		[className]: className,
	});

	const statusClassName = classNames({
		[`my-4 mx-1 rounded-full h-2 w-2`]: true,
		[sizeClasses[size]]: !!size,
	});

	return (
		<span {...rest} className={rootClassName}>
			<span
				className={statusClassName}
				style={{
					backgroundColor: color,
					boxShadow: "0 0 0 2px " + colors.hex.inverse,
				}}
			/>
			<span style={{ color: text_color }}>{text}</span>
		</span>
	);
};

Status.propTypes = {

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

export default (Status);
