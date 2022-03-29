/** @format */

import { useCallback } from "react"
// }

const useEventDispatcher = (eventName, element = global, EventType = CustomEvent) => {
	const dispatchEvent = useCallback(
		(data = null) => {
			const isSupported = element && element.dispatchEvent
			if (!isSupported) {
				return
			}
			let event = null
			if (EventType === CustomEvent) {
				event = new CustomEvent(eventName, { detail: data })
			} else if (EventType instanceof Event) {
				event = new EventType(eventName)
			}
			element.dispatchEvent(event)
		},
		[eventName, element]
	)
	return dispatchEvent
}

export default useEventDispatcher
