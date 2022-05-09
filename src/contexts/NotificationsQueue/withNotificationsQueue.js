/** @format */

import React from "react"
import useNotificationsQueue from "./useNotificationsQueue"

const withNotificationsQueue = BaseComponent => {
	const withContext = BaseComponent =>
		React.memo(props => {
			let context = useNotificationsQueue()
			return <BaseComponent {...props} notificationsQueue={context} />
		})
	return withContext(BaseComponent)
}

export default withNotificationsQueue
