/** @format */

import Box from "@mui/material/Box"
import { motion, AnimatePresence } from "framer-motion"
import makeStyles from "@mui/styles/makeStyles"
import React, { useCallback, useEffect, useRef } from "react"
import DesktopNotification from "./Desktop"
import NotificationContent from "./NotificationContent"

import { useDidMount, useSetState } from "hooks"

const useStyles = makeStyles(theme => ({
	root: {
		// [theme.breakpoints.down("md")]: {
		// 	backgroundColor: theme.palette.text.primary,
		// 	color: theme.palette.background.paper,
		// },
		// [theme.breakpoints.up("md")]: {
		// 	backgroundColor: theme.palette.background.paper,
		// 	color: theme.palette.text.primary,
		// },
		"&.MuiCard-root": {
			backgroundColor: "transparent",
			color: theme.palette.background.paper,
			/* [theme.breakpoints.down("md")]: {
				backgroundColor: theme.palette.text.primary,
				color: theme.palette.background.paper,
			},
			[theme.breakpoints.up("md")]: {
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
			}, */
			"& .MuiCardHeader-root": {
				paddingBottom: theme.spacing(1),
				paddingTop: theme.spacing(1),
				"& .MuiCardHeader-avatar": {
					"& .MuiAvatar-root": {
						width: theme.spacing(3.5),
						height: theme.spacing(3.5),
						backgroundColor: theme.palette.action.selected,
						"& .MuiSvgIcon-root": {
							width: theme.spacing(2),
							height: theme.spacing(2),
						},
					},
				},
				"& .MuiCardHeader-title": {
					fontSize: theme.spacing(1.75),
				},
				"& .MuiCardHeader-subheader": {
					fontSize: theme.spacing(1.35),
				},
			},
			"& .MuiCardContent-root": {
				"&:last-child": {
					paddingBottom: theme.spacing(1),
				},
				paddingBottom: theme.spacing(1),
				paddingTop: theme.spacing(1),
			},
		},
	},
	default: {
		"&.MuiCard-root": {
			backgroundColor: "transparent",
			color: theme.palette.background.paper,
			/* [theme.breakpoints.down("md")]: {
				backgroundColor: theme.palette.text.primary,
				color: theme.palette.background.paper,
			},
			[theme.breakpoints.up("md")]: {
				backgroundColor: theme.palette.text.primary,
				color: theme.palette.background.paper,
			}, */
			"& .MuiCardHeader-root": {
				"& .MuiCardHeader-subheader": {
					color: theme.palette.background.paper,
				},
			},
		},
	},
	info: {
		"&.MuiCard-root": {
			backgroundColor: theme.palette.info.main,
			color: theme.palette.background.paper,
			/* [theme.breakpoints.down("md")]: {
				backgroundColor: theme.palette.info.main,
				color: theme.palette.background.paper,
			},
			[theme.breakpoints.up("md")]: {
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
			}, */
			"& .MuiCardHeader-root": {

				/* "& .MuiCardHeader-title": {
					color: theme.palette.info.main,
				}, */
			},
		},
	},
	success: {
		"&.MuiCard-root": {
			backgroundColor: theme.palette.success.main,
			color: theme.palette.background.paper,
			/* [theme.breakpoints.down("md")]: {
				backgroundColor: theme.palette.success.main,
				color: theme.palette.background.paper,
			},
			[theme.breakpoints.up("md")]: {
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
			}, */
			"& .MuiCardHeader-root": {
				/* "& .MuiCardHeader-title": {
					color: theme.palette.success.main,
				}, */
			},
		},
	},
	warning: {
		"&.MuiCard-root": {
			backgroundColor: theme.palette.warning.main,
			color: theme.palette.background.paper,
			/* [theme.breakpoints.down("md")]: {
				backgroundColor: theme.palette.warning.main,
				color: theme.palette.background.paper,
			},
			[theme.breakpoints.up("md")]: {
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
			}, */
			"& .MuiCardHeader-root": {
				"& .MuiCardHeader-title": {
					// color: theme.palette.warning.main,
				},
			},
		},
	},
	error: {
		"&.MuiCard-root": {
			backgroundColor: theme.palette.error.main,
			color: theme.palette.background.paper,
			/* [theme.breakpoints.down("md")]: {
				backgroundColor: theme.palette.error.main,
				color: theme.palette.background.paper,
			},
			[theme.breakpoints.up("md")]: {
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
			}, */
			"& .MuiCardHeader-root": {
				/* "& .MuiCardHeader-title": {
					color: theme.palette.error.main,
				}, */
			},
		},
	},
	prioritized: {
		"& .MuiCardHeader-title": {
			color: theme.palette.accent.main,
		},
	},
}))
const Notification = React.forwardRef((props, ref) => {
	const {
		type,
		title,
		content,
		image,
		icon,
		timeout,
		color,
		open,
		actions,
		audio,
		onClose,
		audible,
		onClick,
		desktopNotificationProps,
		inAppNotificationProps,
		severity = "default",
		...rest
	} = props
	const typeArr = Array.isArray(type) ? type : [type]
	const timeoutRef = useRef(null)

	const classes = useStyles()
	const [state, setState] = useSetState({
		timingOut: timeout > 0,
		timeout: timeout || 3000,
	})

	const playSound = useCallback(() => {
		if (Function.isFunction(audio?.play)) {
			audio.play()
		}
	}, [audio])

	const handleDesktopNotSupported = event => {}

	const handleDesktopPermissionGranted = event => {}

	const handleDesktopPermissionDenied = event => {}

	const handleDesktopNotificationOnShow = event => {}

	const handleDesktopNotificationOnClick = event => {}

	const handleDesktopNotificationOnClose = event => {}

	const handleDesktopNotificationOnError = event => {}

	useDidMount(() => {
		playSound()
	})

	return (
		<Box ref={ref}>
			{typeArr.includes("desktop") && (
				<DesktopNotification
					notSupported={handleDesktopNotSupported}
					onPermissionGranted={handleDesktopPermissionGranted}
					onPermissionDenied={handleDesktopPermissionDenied}
					onShow={handleDesktopNotificationOnShow}
					onClick={handleDesktopNotificationOnClick}
					onClose={handleDesktopNotificationOnClose}
					onError={handleDesktopNotificationOnError}
					timeout={timeout}
					title={title}
					{...desktopNotificationProps}
				/>
			)}
						<NotificationContent
							className={`${classes.root} ${classes[severity]} p-0 m-0 flex-1`}
							title={title}
							icon={icon}
							onClose={onClose}
							onClick={onClick}
							content={content}
							timout={timeout}
							{...rest}
						/>
		</Box>
	)
})

Notification.defaultProps = {
	onShow: () => {},
	onClick: () => {},
	onClose: () => {},
	onError: () => {},
	timeout: 5000,
	options: {},
	content: "",
	color: "primary",
	type: ["in-app"],
	audible: false,
	open: true,
}

export default Notification
