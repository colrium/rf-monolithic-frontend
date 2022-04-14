/** @format */

import React, { memo } from "react"
import NotificationQueueContext from "./NotificationQueueContext"
import { useQueue } from "hooks"
const NotificationQueueProvider = props => {
	const { children, queue: initialQueue } = props
	const queue = useQueue(initialQueue)
	return <NotificationQueueContext.Provider value={queue}>{children}</NotificationQueueContext.Provider>
}

export default memo(NotificationQueueProvider)
