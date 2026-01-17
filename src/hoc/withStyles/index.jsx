/** @format */

import React from "react";

const withStyles = styles => Component => {
	const getclasses = input => {
		let classesValue = input;
		if (Function.isFunction(input)) {
			classesValue = input();
		}
		if (!Object.isObject(classesValue)) {
			classesValue = {};
		}
		return classesValue;
	};

	const componentWithStyles = (Component, classes) =>
		React.forwardRef((props, ref) => (
			<Component {...props} classes={classes} ref={ref} />
		));
	return componentWithStyles(Component, getclasses());
};

export default withStyles;
