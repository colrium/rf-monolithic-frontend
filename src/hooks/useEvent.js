/** @format */

import useEventListener from "./useEventListener"
import useEventDispatcher from "./useEventDispatcher"

const useEvent = (eventName, element = global, options = {}, EventType = CustomEvent) => {
	const dispatchEvent = useEventDispatcher(eventName, element, EventType)
	const [addEventListener, removeEventListener] = useEventListener(eventName, element, options)
	return [dispatchEvent, addEventListener, removeEventListener]
}
export default useEvent
