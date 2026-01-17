/** @format */

import { useContext } from "react"
import NotificationsQueueContext from "./NotificationsQueueContext"

export default function useNotificationsQueue() {
	const context = useContext(NotificationsQueueContext)

	if (!context) {
		throw new Error(
			"useNotificationsQueue should be used within NotificationsQueueProvider. \n Make sure you are rendering a NotificationsQueueProvider at the top of your component hierarchy"
		)
	}

	return context
}
