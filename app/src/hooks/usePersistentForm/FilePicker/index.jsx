/** @format */

import React, { useCallback } from "react"
import { Controller } from "react-hook-form"
import FileDropZone from "components/FileDropZone"

const Field = React.forwardRef((props, ref) => {
	const {
		name,
		control,
		defaultValue,
		rules,
		shouldUnregister,
		helperText,
		onChange,
		disabled,
		render,
		...rest
	} = props



	const renderField = useCallback(
		params => {
			if (Function.isFunction(render)) {
				return render(params)
			}
			const {
				field: {
					onChange: fieldOnChange,
					value: fieldValue,
					...fieldParams
				},
				fieldState: { isTouched, invalid, isDirty, error },
				formState: { isSubmitting },
			} = params

			const handleOnChange = () => {

			}
			//

			return (
				<FileDropZone
					{...fieldParams}
					defaultValue={fieldValue}
					onChange={onChange || handleOnChange}
					disabled={disabled || isSubmitting}
					error={invalid}
					helperText={error?.message || helperText}
					ref={ref}
					{...rest}
				/>
			)
		},
		[render, rest]
	)

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={ defaultValue || []}
			rules={rules}
			shouldUnregister={shouldUnregister}
			render={renderField}
		/>
	)
})

export default React.memo(Field)
