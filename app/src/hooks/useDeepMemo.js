/** @format */
import { useRef, useMemo } from "react"

const useDeepMemo = value => {
	const ref = useRef(value)
	const signalRef = useRef(0)

	if (!Object.areEqual(value, ref.current)) {
		ref.current = value
		signalRef.current += 1
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => ref.current, [signalRef.current])
}

export default useDeepMemo
