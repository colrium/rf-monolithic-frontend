/** @format */


import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";



function CustomCardActions({ ...props }) {
	const { className, children, ...rest } = props;
	const cardFooterClasses = classNames({
		[`flex items-center bg-transparent p-4`]: true,
		[className]: !!className,
	});
	return (
		<div className={cardFooterClasses} {...rest}>
			{children}
		</div>
	);
}

CustomCardActions.propTypes = {

	className: PropTypes.string,
};

export default (CustomCardActions);
