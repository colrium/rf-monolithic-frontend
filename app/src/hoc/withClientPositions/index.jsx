/** @format */

import React from "react"
import { useClientPositions } from "hooks"

const withClientPositions = config => Component => {
	const componentWithClientPositions = Component =>
		React.forwardRef((otherProps, ref) => {
			const clientPositions = useClientPositions({ ...config })
			return <Component clientPositions={clientPositions} {...otherProps} ref={ref} />
		})
	return componentWithClientPositions(Component)
}

export default withClientPositions
