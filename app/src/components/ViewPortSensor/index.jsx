import React, { useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import { useDidUpdate, useVisibility } from "hooks"
import PropTypes from "prop-types";
import Placeholder from "components/Placeholder";

const ViewPortSensor = React.forwardRef((props, ref) => {
	const {
		className,
		children,
		offset,
		onViewportVisibilityChange,
		placeholder,
		placeholderType,
		...rest
	} = props;
	// Ref for the element that we want to detect whether on screen
	const elemRef = ref || useRef(null);
	const isMounted = useRef(false);
	let rootMargin = 0 - Number.parseNumber(offset, 0) + "px";
	const visible = useVisibility(elemRef, { rootMargin });

	useEffect(() => {
		isMounted.current = true
		return () => {
			isMounted.current = false
		}
	}, [])
	useDidUpdate(() => {
		if (isMounted.current && Function.isFunction(onViewportVisibilityChange)) {
			onViewportVisibilityChange(visible);
		}
	}, [visible])

	return (
		<Box className={className ? className : "w-full "} {...rest} ref={elemRef}>
			{children}
		</Box>
	);
});

ViewPortSensor.propTypes = {
	placeholderType: PropTypes.string,
	placeholder: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.object,
		PropTypes.array,
		PropTypes.string
	]),
	onViewportVisibilityChange: PropTypes.func,
	offset: PropTypes.number
};
ViewPortSensor.defaultProps = {
	placeholderType: "skeleton",
	placeholder: {
		variant: "rect",
		width: "100%",
		height: 200,
		animation: "wave"
	},
	offset: 0
};

export default ViewPortSensor;
