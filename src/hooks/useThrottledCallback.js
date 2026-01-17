/** @format */

import { useEffect, useRef, useCallback } from "react"

const useThrottledCallback = (callback, deps, wait = 500) => {
	const throttledCallback = Function.throttle(callback, wait)

	return useCallback(throttledCallback, deps)
}
export default useThrottledCallback
