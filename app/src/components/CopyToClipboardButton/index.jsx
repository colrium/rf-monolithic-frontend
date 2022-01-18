/** @format */
import React, { useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useDidUpdate } from "hooks";
import { useCopyToClipboard } from "react-use";

const CopyToClipboardButton = props => {
	const {
		value,
		onClick,
		disabled,
		fontSize = "inherit",
		className,
		...rest
	} = props;
	const [clipboard, copyToClipboard] = useCopyToClipboard();
	const duration = 0.4;
	const [isChecked, setIsChecked] = React.useState(false);
	const checkTimeout = useRef(null);

	React.useEffect(() => {
		if (isChecked) {
			checkTimeout.current = setTimeout(() => setIsChecked(false), 1000);
		}
		return () => {
			clearTimeout(checkTimeout.current);
			checkTimeout.current = null;
		};
	}, [isChecked]);

	useDidUpdate(() => {
		setIsChecked(false);
	}, [value]);

	return (
		<IconButton
			className={` ${className ? className : ""}`}
			aria-label="Copy to clipboard"
			title="Copy to clipboard"
			disabled={disabled || isChecked}
			onClick={event => {
				event.stopPropagation();
				copyToClipboard(value);
				setIsChecked(true);
				if (Function.isFunction(onClick)) {
					onClick(event);
				}
			}}
			sx={{
				position: "relative",
				fontSize: "1rem",
			}}
			{...rest}>
			<ContentCopyIcon fontSize={fontSize} />
			<motion.span
				variants={{
					hidden: { opacity: 0, top: 0 },
					visible: {
						opacity: 1,
						top: -36,
					},
				}}
				initial="hidden"
				animate={isChecked ? "visible" : "hidden"}
				transition={{ duration: isChecked ? duration : 0 }}
				className={`${isChecked? "visible left-2/4 -translate-x-2/4" : "invisible" } p-1 px-4 bg-gray-700 bg-opacity-10 z-50 rounded absolute transform text-sm font-semibold text-black`}>
				Copied!
			</motion.span>
		</IconButton>
	);
};
export default React.memo(CopyToClipboardButton);
