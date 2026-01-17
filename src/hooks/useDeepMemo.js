/** @format */
import useSetState from "./useSetState"
import useDidUpdate from "./useDidUpdate"
import useDidMount from "./useDidMount"
import useDeepCompareMemoize from "./useDeepCompareMemoize"
function checkDeps(deps, name) {
	const reactHookName = `React.useDeepMemo`

	if (!deps) {
		throw new Error(`${name} should not be used with no dependencies. Use ${reactHookName} instead.`)
	}
}

const useDeepMemo = (cb, deps, defaultValue: null) => {
	const [state, setState] = useSetState({ value: defaultValue })
	const updateCounts = useDeepCompareMemoize(deps, true)
	if (process.env.NODE_ENV !== "production") {
		checkDeps(deps, "useDeepMemo")
	}

	const applyCallback = async () => {
		if (Function.isFunction(cb)) {
			const nextValue = await cb()
			// console.log("useDeepMemo updateCounts", updateCounts, "nextValue", nextValue)
			setState({ value: nextValue })
		} else {
			throw new Error("useDeepMemo: callback is not a function")
		}
	}
	useDidMount(() => {
		//
		applyCallback()
	})

	useDidUpdate(() => {
		//
		// console.log("useDeepMemo updateCounts", updateCounts)
		applyCallback()
	}, [updateCounts])

	return state.value
}

export default useDeepMemo
