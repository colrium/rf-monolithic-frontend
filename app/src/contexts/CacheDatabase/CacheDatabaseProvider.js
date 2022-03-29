/** @format */

import React, { useCallback } from "react"
import CacheDatabaseContext from "./CacheDatabaseContext"
import getCacheDatabase from "./database"

const CacheDatabaseProvider = props => {
	const { children } = props
	const cacheDatabase = getCacheDatabase()
	return <CacheDatabaseContext.Provider value={cacheDatabase}>{children}</CacheDatabaseContext.Provider>
}

export default React.memo(CacheDatabaseProvider)
