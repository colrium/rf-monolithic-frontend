/** @format */

import React, { useCallback } from "react"
import { Controller } from "react-hook-form"
import FileDropZone from "components/FileDropZone"
import { FormHelperText, Stack } from "@mui/material"

const Field = React.forwardRef((props, ref) => {
	const {
		name,
		control,
		defaultValue,
		rules,
		shouldUnregister,
		helperText,
		onChange,
		onFocus,
		onBlur,
		disabled,
		render,
		...rest
	} = props

	const handleOnChange = useCallback(
		defaultOnChange => e => {
			if (Function.isFunction(defaultOnChange)) {
				defaultOnChange(e)
			}
			if (Function.isFunction(onChange)) {
				onChange(e)
			}
		},
		[onChange]
	)

	const handleOnFocus = useCallback(
		defaultOnFocus => e => {
			if (Function.isFunction(defaultOnFocus)) {
				defaultOnFocus(e)
			}
			if (Function.isFunction(onFocus)) {
				onFocus(e)
			}
		},
		[onFocus]
	)

	const handleOnBlur = useCallback(
		defaultOnBlur => e => {
			if (Function.isFunction(defaultOnBlur)) {
				defaultOnBlur(e)
			}
			if (Function.isFunction(onBlur)) {
				onBlur(e)
			}
		},
		[onBlur]
	)


	const renderField = useCallback(
		params => {
			if (Function.isFunction(render)) {
				return render(params)
			}
			const {
				field: {
					onChange: fieldOnChange,
					onFocus: fieldOnFocus,
					onBlur: fieldOnBlur,
					value: fieldValue,
					...fieldParams
				},
				fieldState: { isTouched, invalid, isDirty, error },
				formState: { isSubmitting },
			} = params

			//

			return (
				<FileDropZone
					{...fieldParams}
					value={fieldValue}
					onChange={handleOnChange(fieldOnChange)}
					onFocus={handleOnFocus(fieldOnFocus)}
					onBlur={handleOnBlur(fieldOnBlur)}
					disabled={disabled || isSubmitting}
					error={isTouched && !!error?.message}
					helperText={
						<Stack className="w-full">
							{isTouched && !!error?.message && (
								<FormHelperText component="div" error>
									{error?.message}
								</FormHelperText>
							)}
							{!!props.helperText && (
								<FormHelperText component="div" error={false}>
									{props.helperText}
								</FormHelperText>
							)}
						</Stack>
					}
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
