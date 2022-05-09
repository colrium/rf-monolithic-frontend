/** @format */

import React, { createRef, useEffect, useRef, useCallback } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useTheme } from '@mui/material/styles';
import {
	Box,
	useMediaQuery
} from "@mui/material";

const handlerNameByEvent = {
	"ps-scroll-y": "onScrollY",
	"ps-scroll-x": "onScrollX",
	"ps-scroll-up": "onScrollUp",
	"ps-scroll-down": "onScrollDown",
	"ps-scroll-left": "onScrollLeft",
	"ps-scroll-right": "onScrollRight",
	"ps-y-reach-start": "onYReachStart",
	"ps-y-reach-end": "onYReachEnd",
	"ps-x-reach-start": "onXReachStart",
	"ps-x-reach-end": "onXReachEnd",
};
Object.freeze(handlerNameByEvent);

const Scrollbars = React.forwardRef((props, ref) => {
	ref = ref || createRef();
	const ps = useRef(null);
	const handlerByEvent = useRef(new Map());
	const { 
		option,
		enable, 
		sx, 
		children,
		customScrollbars,
		onScrollUp,
		onScrollDown,
		onScrollLeft,
		onScrollRight,
		onYReachStart,
		onYReachEnd,
		onXReachStart,
		onXReachEnd,
		scrollToTopOnChildChange,
		scrollToBottomOnChildChange,
		color,
		...rest 
	} = props;
	const theme = useTheme();
  	const isMobile = useMediaQuery(theme.breakpoints.up('sm'));

	const hookUpEvents = useCallback(() => {
		Object.keys(handlerNameByEvent).forEach(key => {
			const callback = props[handlerNameByEvent[key]];
			if (callback) {
				const handler = () => callback(ref.current);
				handlerByEvent.current.set(key, handler);
				ref.current.addEventListener(key, handler, false);
			}
		});
	}, [ref]);

	const unHookUpEvents = useCallback(() => {
		Object.keys(handlerByEvent.current).forEach((value, key) => {
			if (ref.current) {
				ref.current.removeEventListener(key, value, false);
			}
		});
		handlerByEvent.current.clear();
	}, [ref]);

	const destroyPs = useCallback(() => {
		// console.info("destroy::ps");

		unHookUpEvents();

		if (!ps.current) {
			return;
		}
		ps.current.destroy();
		ps.current = null;
	}, [unHookUpEvents]);

	const createPs = useCallback(() => {
		// console.info("create::ps");

		if (isMobile || !ref || ps.current) {
			return;
		}

		ps.current = new PerfectScrollbar(ref.current, props.option);

		hookUpEvents();
	}, [hookUpEvents, props.option, ref]);

	useEffect(() => {
		function updatePs() {
			if (!ps.current) {
				return;
			}
			ps.current.update();
		}

		updatePs();
	});

	useEffect(() => {
		customScrollbars ? createPs() : destroyPs();
	}, [createPs, customScrollbars, destroyPs]);

	useEffect(() => {
		function scrollToTop() {
			ref.current.scrollTop = 0;
		}

		function scrollToBottom() {
			ref.current.scrollTop = ref.current.scrollHeight - ref.current.getBoundingClientRect().height;
		}

		if (props.scrollToTopOnChildChange) {
			scrollToTop();
		}
		if (props.scrollToBottomOnChildChange) {
			scrollToBottom();
		}
	}, [props.children, props.scrollToTopOnChildChange, props.scrollToBottomOnChildChange, ref]);

	useEffect(() => {
		return () => {
			destroyPs();
		};
	}, [destroyPs]);

	// console.info('render::ps');
	return (
		<div
			id={props.id}
			className={clsx(props.className)}
			style={
				props.customScrollbars && (props.enable || true) && !isMobile
					? {
						position: "relative",
						overflowY: "hidden",
						overflowX: "hidden",
					}
					: {}
			}
			ref={ref}
		>
			{props.children}
		</div>
	);
});


Scrollbars.propTypes = {
	customScrollbars: PropTypes.bool,
	onScrollUp: PropTypes.func,
	onScrollDown: PropTypes.func,
	onScrollLeft: PropTypes.func,
	onScrollRight: PropTypes.func,
	onYReachStart: PropTypes.func,
	onYReachEnd: PropTypes.func,
	onXReachStart: PropTypes.func,
	onXReachEnd: PropTypes.func,
	scrollToTopOnChildChange: PropTypes.bool,
	scrollToBottomOnChildChange: PropTypes.bool,
};

Scrollbars.defaultProps = {
	customScrollbars: true,
	className: "",
	enable: true,
	scrollToTopOnChildChange: false,
	scrollToBottomOnChildChange: false,
	option: { wheelPropagation: true },
	color: "secondary"
};

export default React.memo(Scrollbars);
