/** @format */
import { useCallback, useRef } from "react"
import useSetState from "./useSetState"
import useDidUpdate from "./useDidUpdate"
import useDidMount from "./useDidMount"
import useDeepCompareMemoize from "./useDeepCompareMemoize"
function checkDeps(deps, name) {
	const reactHookName = `React.useDerivedState`

	if (!deps) {
		throw new Error(`${name} should not be used with no dependencies. Use ${reactHookName} instead.`)
	}
}

const useDerivedState = (cb, deps, defaultValue = null, pauseDepsCheckOnsetValue = true) => {
	const [state, setState, getState] = useSetState({ value: defaultValue })
	const updateCounts = useDeepCompareMemoize(deps, true)
	if (process.env.NODE_ENV !== "production") {
		checkDeps(deps, "useDerivedState")
	}

	const externalMutationsRef = useRef(false)

	const applyCallback = useCallback(async () => {
		if (Function.isFunction(cb)) {
			const { value } = getState()
			const nextValue = await cb(value)
			// console.log("useDerivedState updateCounts", updateCounts, "nextValue", nextValue)
			setState({ value: nextValue })
		} else {
			throw new Error("useDerivedState: callback is not a function")
		}
	}, [updateCounts])
	useDidMount(() => {
		//
		applyCallback()
	})

	useDidUpdate(() => {
		//
		// console.log("useDerivedState updateCounts", updateCounts)
		if ((!externalMutationsRef.current && pauseDepsCheckOnsetValue) || (externalMutationsRef.current && !pauseDepsCheckOnsetValue)) {
			applyCallback()
		}
	}, [updateCounts])

	const setValue = useCallback(value => {
		setState({ value })
		if (!externalMutationsRef.current) {
			externalMutationsRef.current = true
		}
	}, [])

	const getValue = useCallback(() => {
		const { value } = getState()
		return value
	}, [])

	return [state.value, setValue, getValue]
}

export default useDerivedState
