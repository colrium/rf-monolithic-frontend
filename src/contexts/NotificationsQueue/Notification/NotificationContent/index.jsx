/** @format */

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"

import IconButton from "@mui/material/IconButton"
import React, { useEffect, useCallback } from "react"
import Typography from "@mui/material/Typography"
import CheckIcon from "@mui/icons-material/Check"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CloseIcon from "@mui/icons-material/Close"
import CircularProgress from "@mui/material/CircularProgress"
import { useRaf } from "react-use"
import { useTheme } from "@mui/material/styles"
import { useDidUpdate, useSetState } from "hooks"
import { motion, AnimatePresence } from "framer-motion"

const NotificationContent = React.forwardRef((props, ref) => {
	const {
		content,
		className,
		onShow,
		title,
		subtitle,
		timingOut,
		timeout = 6000,
		icon,
		id,
		avatar,
		actions,
		avatarProps,
		mediaProps,
		elevation,
		action,
		onClose,
		onClick,
		...rest
	} = props
	const theme = useTheme()
	const [state, setState] = useSetState({
		paused: false,
		pauseElapsed: 0,
	})
	const pauseTimeout = state.paused && state.pauseElapsed > 0 ? timeout * state.pauseElapsed : timeout
	const elapsed = useRaf(state.paused ? 0 : pauseTimeout, 500)
	const timeoutPercentage = (1 - (state.paused ? state.pauseElapsed : elapsed)) * 100

	const handleOnClose = useCallback(
		event => {
			setState(prevState => ({
				paused: true,
				pauseElapsed: 1,
			}))
			if (Function.isFunction(onClose)) {
				onClose(event)
			}
		},
		[onClose]
	)
	const handleOnClick = useCallback(
		elapsed => event => {
			setState(prevState => ({
				paused: !prevState.paused,
				pauseElapsed: !prevState.paused ? elapsed : prevState.pauseElapsed,
			}))
			if (Function.isFunction(onClick)) {
				onClick(event)
			}
		},
		[onClick]
	)
	useDidUpdate(() => {
		if (timeoutPercentage === 0) {
			handleOnClose()
		}
	}, [timeoutPercentage])


	return (
		<Card onClick={handleOnClick(elapsed)} className={`cursor ${className ? className : ""}`} raised {...rest} ref={ref}>
			{(!!avatar || !!action || !!icon || !!title || !!subtitle) && (
				<CardHeader
					avatar={
						avatar ? (
							<Avatar alt={`${title}`} src={`${avatar}`} {...avatarProps} />
						) : icon ? (
							<Avatar {...avatarProps}>{icon}</Avatar>
						) : undefined
					}
					action={
						action ||
						(!!onClose && (
							<Box className={`relative flex flex-row items-center justify-center`}>
								<CircularProgress
									variant="determinate"
									className=""
									sx={{
										left: theme.spacing(1),
										top: theme.spacing(1),
									}}
									color={`inherit`}
									disableShrink
									size={theme.spacing(2.5)}
									thickness={4}
									value={timeoutPercentage}
								/>
								<IconButton
									size="small"
									color="inherit"
									className="absolute center"
									sx={{ fontSize: theme => theme.spacing(1.5) }}
									aria-label={`notification-${id || String.uuid()}`}
									onClick={onClose}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							</Box>
						))
					}
					title={title}
					subheader={subtitle}
				/>
			)}
			{!!mediaProps && <CardMedia {...mediaProps} />}
			<CardContent className={`relative ${!title && !subtitle? "p-5" : ""}`}>
				<Typography variant="body2" color="inherit">
					{content}
				</Typography>
				{/* <motion.div className="absolute bottom-0 h-1 bg-indigo-500 timeout-bar" animate={timeoutBarControls} /> */}
			</CardContent>
			{Array.isArray(actions) && actions.length > 0 && (
				<CardActions disableSpacing>
					{actions.map(({ icon, Icon, className, ...other }) => (
						<IconButton size="small" className={`${className ? className : ""} mx-1`} {...other}>
							{icon ? icon : Icon ? <Icon fontSize="inherit" /> : <CheckIcon fontSize="inherit" />}
						</IconButton>
					))}
				</CardActions>
			)}
		</Card>
	)
})

export default NotificationContent
