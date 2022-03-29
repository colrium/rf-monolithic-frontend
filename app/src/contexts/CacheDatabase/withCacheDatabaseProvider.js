/** @format */

import React from "react"
import CacheDatabaseProvider from "./CacheDatabaseProvider"

const withCacheDatabaseProvider = BaseComponent => {
	const withProvider = BaseComponent =>
		React.memo(props => {
			return (
				<CacheDatabaseProvider>
					<BaseComponent {...props} />
				</CacheDatabaseProvider>
			)
		})

	return withProvider(BaseComponent)
}

export default withCacheDatabaseProvider
