/** @format */

import React from "react"
import useCacheDatabase from "./useCacheDatabase"

const withCacheDatabase = BaseComponent => {
	const withContext = BaseComponent =>
		React.memo(props => {
			let context = useCacheDatabase()
			return <BaseComponent {...props} cacheDatabase={context} />
		})
	return withContext(BaseComponent)
}

export default withCacheDatabase
