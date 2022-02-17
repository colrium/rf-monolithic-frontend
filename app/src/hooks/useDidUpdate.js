/** @format */

import { useRef, useEffect, useMemo } from "react"

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
	const ref = useRef(value)
	const signalRef = useRef(0)

	if (!Object.areEqual(value, ref.current)) {
		ref.current = value
		signalRef.current += 1
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => ref.current, [signalRef.current])
}

const useDidUpdate = (effect, deps = []) => {
	const isFirstMountRef = useRef(true)
	if (process.env.NODE_ENV !== "production") {
		// checkDeps(deps)
	}

	useEffect(() => {
		if (!isFirstMountRef.current) {
			return effect()
		} else if (isFirstMountRef.current) {
			isFirstMountRef.current = false
		}
	}, [useDeepCompareMemoize(deps)])
}

export default useDidUpdate
