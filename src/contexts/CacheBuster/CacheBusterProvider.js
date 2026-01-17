/** @format */

import React, { useRef } from "react"
import useClearCache from "./useClearCache"
import CacheBusterContext from "./CacheBusterContext"

export const CacheBusterProvider = props => {
	const { children, ...otherProps } = props
	const result = useClearCache(otherProps)
	return <CacheBusterContext.Provider value={result}>{children}</CacheBusterContext.Provider>
}

export default CacheBusterProvider
