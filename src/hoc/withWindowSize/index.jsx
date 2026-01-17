/** @format */

import React from "react"
import { useWindowSize } from "react-use"

const withWindowSize = Component => {
	const componentWithWindowSize = Component =>
		React.forwardRef((otherProps, ref) => {
			const windowSize = useWindowSize()
			return <Component windowSize={windowSize} {...otherProps} ref={ref} />
		})
	return componentWithWindowSize(Component)
}

export default withWindowSize
