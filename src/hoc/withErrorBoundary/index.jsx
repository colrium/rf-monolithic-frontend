/** @format */

import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "components/ErrorFallback"

const withErrorBoundary = Component => {
	const componentWithErrorBoundary = Component =>
		React.forwardRef((props, ref) => {
			return (
				<ErrorBoundary
					FallbackComponent={ErrorFallback}
					onReset={() => {
						// reset the state of your app so the error doesn't happen again
					}}
				>
					<Component {...props} ref={ref} />
				</ErrorBoundary>
			)
		})
	return componentWithErrorBoundary(Component)
}

export default withErrorBoundary
