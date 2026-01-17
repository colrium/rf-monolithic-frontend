/** @format */

import { useEffect, useRef } from "react"
import useDeepCompareMemoize from "./useDeepCompareMemoize"
const useWhyDidYouUpdate = (name, props) => {
	const ref = useRef(props)
	const updateCounts = useDeepCompareMemoize(props, true)
	useEffect(() => {
		if (updateCounts > 0) {
			const difference = Object.difference(ref.current, props)
			console.log(
				`[useWhyDidYouUpdate] ${name} update ${updateCounts} differences `,
				JSON.stringify(difference?.differences, null, 2)
			)
			// update ref with current props for next hook call
			ref.current = props
		}
	}, [updateCounts])
}
export default useWhyDidYouUpdate
