/** @format */

import React, { useCallback } from "react"
import ApiData from "./ApiData"
import ApiDataContext from "./ApiDataContext"
import { EventRegister } from "utils"
import { useDidMount } from "hooks"
import getCacheDatabase from "contexts/CacheDatabase/database"

const ApiDataProvider = props => {
	const { children } = props
	const cacheDatabase = getCacheDatabase()

	const syncCacheData = useCallback(event => {
		const { scope, data } = event.detail
		console.log("scope", scope)
	}, [])

	useDidMount(() => {
		const onSyncCacheData = EventRegister.on("sync-cache-data", syncCacheData)

		return () => {
			onSyncCacheData.remove()
		}
	})

	return <ApiData>{ApiDataState => <ApiDataContext.Provider value={ApiDataState}>{children}</ApiDataContext.Provider>}</ApiData>
}

export default React.memo(ApiDataProvider)
