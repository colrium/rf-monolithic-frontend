import React, { useState, useEffect, useRef } from "react";

import PropTypes from "prop-types";

function ViewPortSensor(props) {

	let {
		className,
		children,
		offset,
		onViewportVisibilityChange,
		placeholder,
		placeholderType
	} = props;
	// Ref for the element that we want to detect whether on screen
	const ref = useRef();
	// Call the hook passing in ref and root margin
	// In this case it would only be considered onScreen if more ...
	// ... than 300px of element is visible.
	let rootMargin = 0 - Number.parseNumber(offset, 0) + "px";
	const onScreen = useOnScreen(ref, rootMargin);
	// Hook
	function useOnScreen(
		ref,
		rootMargin = "0px",
		onEnterViewPort,
		onExitViewPort
	) {
		// State and setter for storing whether element is visible
		const [isIntersecting, setIntersecting] = useState(false);

		useEffect(() => {
			const observer = new IntersectionObserver(
				([entry]) => {
					// Update our state when observer callback fires
					setIntersecting(entry.isIntersecting);
					if (Function.isFunction(onViewportVisibilityChange)) {
						onViewportVisibilityChange(entry.isIntersecting);
					}
				},
				{ rootMargin }
			);
			if (ref.current) {
				observer.observe(ref.current);
			}
			return () => {
				observer.unobserve(ref.current);
			};
		}, []); // Empty array ensures that effect is only run on mount and unmount

		return isIntersecting;
	}

	return (
		<div className={className ? className : "w-full "} ref={ref}>
			{children}
		</div>
	);
}

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
