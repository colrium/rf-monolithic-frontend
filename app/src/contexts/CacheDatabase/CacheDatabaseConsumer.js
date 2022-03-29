/** @format */

import React from "react"
import CacheDatabaseContext from "./CacheDatabaseContext"

export default function CacheDatabaseConsumer({ children }) {
	return (
		<CacheDatabaseContext.Consumer>
			{context => {
				if (!context) {
					throw new Error(
						"CacheDatabaseConsumer components should be rendered within CacheDatabaseProvider.Make sure you are rendering a CacheDatabaseProvider at the top of your component hierarchy"
					)
				}
				return children(context)
			}}
		</CacheDatabaseContext.Consumer>
	)
}
