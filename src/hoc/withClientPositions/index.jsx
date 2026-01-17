/** @format */

import React from "react"
import { useClientPositions } from "hooks"

const withClientPositions = Component => {
	const componentWithClientPositions = Component =>
		React.forwardRef((otherProps, ref) => {
			const clientPositions = useClientPositions()
			return <Component clientsPositions={clientPositions} {...otherProps} ref={ref} />
		})
	return componentWithClientPositions(Component)
}

export default withClientPositions
