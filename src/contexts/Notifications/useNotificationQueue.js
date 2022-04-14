/** @format */

import { useContext } from "react"
import NotificationQueueContext from "./NotificationQueueContext"

export default function useNotificationQueue() {
	const context = useContext(NotificationQueueContext)

	if (!context) {
		throw new Error(
			"useNotificationQueue should be used within NotificationQueueProvider. \n Make sure you are rendering a NotificationQueueProvider at the top of your component hierarchy"
		)
	}

	return context
}
