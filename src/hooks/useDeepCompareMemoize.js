/** @format */
import { useRef, useMemo } from "react"

const useDeepCompareMemoize = (value, count = false) => {
	const ref = useRef(value)
	const signalRef = useRef(0)
	if (!Object.areEqual(ref.current, value)) {
		ref.current = value
		signalRef.current += 1
	}
	return useMemo(() => (count ? signalRef.current : ref.current), [signalRef.current])
}

export default useDeepCompareMemoize
