import { useContext } from 'react';
import ApiDataContext from './ApiDataContext';
import { useDidMount } from "hooks"

export default function useApiData(target = "") {
	const context = useContext(ApiDataContext)

	if (JSON.isEmpty(context)) {
		throw new Error(
			"useApiData should be used within ApiDataProvider. \n Make sure you are rendering a ApiDataProvider at the top of your component hierarchy"
		)
	} else if (!String.isEmpty(target) && !(target in context)) {
		// throw new Error(`useApiData unrecognized key ${target}`)
	} /* else if (!String.isEmpty(target) && JSON.isJSON(context[target])) {
		return context[target]
	} */

	const { initializeData, clearData, data, ...rest } = context[target] || {}

	useDidMount(() => {
		if (Function.isFunction(initializeData)) {
			initializeData()
		}

		return () => {
			if (Function.isFunction(clearData)) {
				clearData()
			}
		}
	})

	return { initializeData, clearData, data, ...rest }
}
