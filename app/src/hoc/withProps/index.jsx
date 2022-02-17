/** @format */

import React from "react"

const withProps = props => Component => {
	const componentWithProps = Component =>
		React.forwardRef((otherProps, ref) => (
			<Component {...props} {...otherProps} ref={ref} />
		))
	return componentWithProps(Component)
}

export default withProps
