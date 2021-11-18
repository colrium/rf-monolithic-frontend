/** @format */


import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";

const sizeClasses = {
	sm: 'h-4 w-4',
	md: 'h-8 w-8',
	lg: 'h-16 w-16',
}

const Status = props => {
	const {
		className,
		size,
		color,
		text,
		text_color,
		...rest
	} = props;
	const rootClassName = classNames({
		[`flex mx-auto my-4 rounded-full`]: true,
		[className]: className,
	});

	const statusClassName = classNames(
		{
			[`mx-auto my-4 rounded-full h-4 w-4`]: true,
			[sizeClasses[size]]: !!size,
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
			<span style={{ color: text_color }}>
				{text}
			</span>
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
