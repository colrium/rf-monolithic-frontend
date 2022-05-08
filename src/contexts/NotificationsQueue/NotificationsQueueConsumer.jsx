/** @format */

import React from "react"
import NotificationQueueContext from "./NotificationsQueueContext"

export default function NotificationsQueueConsumer({ children }) {
	return (
		<NotificationQueueContext.Consumer>
			{context => {
				if (!context) {
					throw new Error(
						"NotificationQueueConsumer components should be rendered within NotificationQueueProvider.Make sure you are rendering a NotificationQueueProvider at the top of your component hierarchy"
					)
				}
				return children(context)
			}}
		</NotificationQueueContext.Consumer>
	)
}
