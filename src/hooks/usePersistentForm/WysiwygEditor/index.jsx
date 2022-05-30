/** @format */

import React, { useCallback } from "react"
import { Controller } from "react-hook-form"
import WysiwygEditor from "components/WysiwygEditor"

const Field = React.forwardRef((props, ref) => {
	const { name, control, defaultValue, rules, shouldUnregister, helperText, disabled, render, ...rest } = props

	const renderField = useCallback(
		params => {
			if (Function.isFunction(render)) {
				return render(params)
			}
			const {
				field,
				fieldState: { isTouched, invalid, isDirty, error },
				formState: { isSubmitting },
			} = params

			//

			return (
				<WysiwygEditor
					disabled={disabled || isSubmitting}
					error={invalid}
					helperText={error?.message || helperText}
					ref={ref}
					{...rest}
					{...field}
				/>
			)
		},
		[render]
	)

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue || []}
			rules={rules}
			shouldUnregister={shouldUnregister}
			render={renderField}
		/>
	)
})

export default React.memo(Field, (prevProps, nextProps) => true)
