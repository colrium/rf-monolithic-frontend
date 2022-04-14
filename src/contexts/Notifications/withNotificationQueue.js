/** @format */

import React from "react"
import useNotificationQueue from "./useNotificationQueue"

const withNotificationQueue = BaseComponent => {
	const withContext = BaseComponent =>
		React.memo(props => {
			let context = useNotificationQueue()
			return <BaseComponent {...props} notificationQueue={context} />
		})
	return withContext(BaseComponent)
}

export default withNotificationQueue
