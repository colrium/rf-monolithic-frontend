/** @format */

import { useContext } from "react"
import CacheDatabaseContext from "./CacheDatabaseContext"
import { useDidMount } from "hooks"

export default function useCacheDatabase(target = "") {
	const context = useContext(CacheDatabaseContext)

	if (!context) {
		throw new Error(
			"useCacheDatabase should be used within CacheDatabaseProvider. \n Make sure you are rendering a CacheDatabaseProvider at the top of your component hierarchy"
		)
	}

	return context
}
