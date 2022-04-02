/** @format */
import { useRef, useCallback, useMemo } from "react"
import useDidUpdate from "./useDidUpdate"
import useDidMount from "./useDidMount"
function isPrimitive(val) {
	return val == null || /^[sbn]/.test(typeof val)
}

function checkDeps(deps) {
	if (!deps || !deps.length) {
		throw new Error("useDidUpdate should not be used with no dependencies. Use useEffect instead.")
	}
	if (deps.every(isPrimitive)) {
		throw new Error("useDidUpdate should not be used with dependencies that are all primitive values. Use useEffect instead.")
	}
}

function useDeepCompareMemoize(value) {
	const ref = useRef([...value])
	const signalRef = useRef(0)

	if (!Object.areEqual(value)) {
		ref.current = value
		signalRef.current += 1
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => signalRef.current, [signalRef.current])
}

const useDeepMemo = (cb, deps) => {
	return useMemo(() => cb(deps), [useDeepCompareMemoize(deps)])
}

export default useDeepMemo
