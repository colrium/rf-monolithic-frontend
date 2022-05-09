/** @format */

import React from "react"
import {usePersistentForm} from "hooks"

const withPersistentForm = (config) => Component => {
	const componentWithPersistentForm = Component =>
		React.forwardRef((otherProps, ref) => {
			const form = usePersistentForm({ ...config })
			return <Component form={form} {...otherProps} ref={ref} />
		})
	return componentWithPersistentForm(Component)
}

export default withPersistentForm
