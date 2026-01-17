/** @format */

import React, { memo, useCallback, useRef } from "react"
import MuiAlert from "@mui/material/Alert"
import NotificationsQueueContext from "./NotificationsQueueContext"
import Notification from "./Notification"
import Snackbar from "@mui/material/Snackbar"
import Stack from "@mui/material/Stack"
import makeStyles from "@mui/styles/makeStyles"
import SnackbarContent from "@mui/material/SnackbarContent"
import { useQueue, useSetState, useDeepMemo, useDidMount } from "hooks"
import { useNetworkServices } from "contexts"
import { useSelector } from "react-redux"
import { EventRegister } from "utils"

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const useStyles = theme => ({
	root: {
		"& .MuiSnackbarContent-root": {
			backgroundColor: "transparent",
			"&.MuiSnackbarContent-message": {
				backgroundColor: "transparent",
			},
		},
	},
	snackbarContent: {
		"&.MuiSnackbarContent-message": {
			p: 0,
			flex: 1,
			paddingBottom: 0,
			paddingTop: 0,
			maxWidth: "40vw",
			backgroundColor: "transparent",
		},
	},
})
const NotificationsQueueProvider = props => {
	const { children, queue: initialQueue, displayMax = 2 } = props
	const classes = useStyles()
	const {
		SocketIO,
		network: { online },
	} = useNetworkServices()
	const auth = useSelector(state => state.auth)
	const [state, setState] = useSetState({
		websocketsConnection: true,
	})
	const { entries, add, remove, removeAll } = useQueue([])
	const notificationsQueue = useDeepMemo(() => {
		let spreadEntries = []
		if (Array.isArray(entries)) {
			spreadEntries = entries.reduce((acc, current) => acc.concat([current.data]), [])
		}
		return spreadEntries
	}, [entries], [])

	const appendNotification = useCallback(
		notification => {
			if (JSON.isJSON(notification)) {
				const notificationId = String.uuid()
				const { onClose, ...data } = notification
				let entry = {
					priority: 0,
					...data,
					id: notificationId,
					onClose: Function.isFunction(onClose)
						? () => {
							remove(notificationId)
							onClose()
						  }
						: () => {
								remove(notificationId)
						  },
				}
				add(notificationId, entry)
			}
		},
		[entries]
	)

	const queueNotification = useCallback(data => {
		if (Array.isArray(data)) {
			data.map(entry => appendNotification(entry))
		} else {
			appendNotification(data)
		}
	}, [])

	const dequeueNotification = useCallback(
		notification => {
			let notificationId = notification?.id || notification
			remove(notificationId)
		},
		[entries]
	)

	const displayedNotifications = useDeepMemo(
		() => notificationsQueue.sort((a, b) => b.priority - a.priority).slice(0, displayMax),
		[notificationsQueue, displayMax], []
	)

	const totalAutoHideDuration = useDeepMemo(
		() => notificationsQueue.reduce((acc, cur) => acc + (cur.timeout || cur.autoHideDuration || 3000) + 500, 0),
		[notificationsQueue], []
	)

	const onSocketIONewNotification = useCallback(
		notification => {
			if (auth.isAuthenticated && "_id" in auth?.user) {
				if (notification.notify === auth.user?._id && !notification.read) {
					queueNotification({ content: notification.body })
				}
			}
		},
		[auth]
	)

	const onSocketIOConnected = useCallback(() => {
		if (auth.isAuthenticated && "_id" in auth?.user) {
			setState({ websocketsConnection: true })
		}
	}, [auth])

	const onSocketIODisonnected = useCallback(() => {
		if (auth.isAuthenticated && "_id" in auth?.user) {
			setState({ websocketsConnection: false })
		}
	}, [auth])

	const handleOnNotification = event => {
		appendNotification({ ...event.detail })
	}

	useDidMount(() => {
		setState({ websocketsConnection: SocketIO.connected })
		SocketIO.on("connect", onSocketIOConnected)
		SocketIO.on("reconnect", onSocketIOConnected)
		SocketIO.on("disconnected", onSocketIODisonnected)
		SocketIO.on("new_notification", onSocketIONewNotification)
		const onNotificationListener = EventRegister.on("notification", handleOnNotification)


		return () => {
			SocketIO.off("connect", () => onSocketIOConnected)
			SocketIO.off("disconnect", onSocketIODisonnected)
			SocketIO.off("new_notification", onSocketIONewNotification)
			onNotificationListener.remove()
		}
	})

	return (
		<NotificationsQueueContext.Provider
			value={{
				notificationsQueue: notificationsQueue,
				queueNotification: queueNotification,
				dequeueNotification: dequeueNotification,
				clearNotificationsQueue: removeAll,
			}}
		>
			{children}
			{displayedNotifications?.length > 0 &&
				displayedNotifications.map(({ anchorOrigin, onClose, ...notification }, index) => (
					<Snackbar
						className={`${classes.root} p-0 m-0 flex-1`}
						open
						onClose={onClose}
						anchorOrigin={{
							...anchorOrigin,
							vertical: "bottom",
							horizontal: "center",
						}}
						key={notification.id}
					>
						<SnackbarContent
							className={`${classes.snackbarContent} bg-transparent p-0 m-0 flex-1 `}
							elevation={0}
							message={<Notification {...notification} onClose={onClose} key={notification.id} />}
						/>
					</Snackbar>
				))}
		</NotificationsQueueContext.Provider>
	)
}

export default memo(NotificationsQueueProvider)
