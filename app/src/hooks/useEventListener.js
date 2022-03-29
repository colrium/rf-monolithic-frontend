/**
 * /* eslint-disable max-params
 *
 * @format
 */

import { useRef, useCallback } from "react"

const useEventListener = (eventName, elem = null, options = {}) => {
	const element = elem || global
	const handlerRef = useRef()
	const { capture, passive, once } = { ...options }

	const addEventListener = useCallback(
		handler => {
			handlerRef.current = handler
			const isSupported = element && element.addEventListener
			if (!isSupported || !Function.isFunction(handlerRef.current)) {
				return
			}
			const opts = { capture, passive, once }
			element.addEventListener(eventName, handlerRef.current, opts)
		},
		[eventName, element, capture, passive, once]
	)

	const removeEventListener = useCallback(
		(handler = null) => {
			const isSupported = element && element.removeEventListener
			if (!isSupported || (!Function.isFunction(handlerRef.current) && !Function.isFunction(handler))) {
				return
			}
			const opts = { capture, passive, once }
			element.removeEventListener(eventName, handler || handlerRef.current, opts)
		},
		[eventName, element, capture, passive, once]
	)

	return [addEventListener, removeEventListener]
}

export default useEventListener
