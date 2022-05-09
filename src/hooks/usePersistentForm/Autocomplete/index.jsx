import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import AutoComplete from "components/AutoComplete"
import {
	FormHelperText,
	Stack,
} from "@mui/material"

const Field = React.forwardRef((props, ref) => {
	const {
		name,
		control,
		defaultValue,
		value,
		rules,
		shouldUnregister,
		onChange,
		disabled,
		render,
		helperText,
		sx,
		...rest
	} = props

	const formState = control._formState
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

	const renderField = useCallback(
		params => {
			if (Function.isFunction(render)) {
				return render(params)
			}
			const {
				field: { onChange: fieldOnChange, ...fieldParams },
				fieldState: { isTouched, invalid, isDirty, error },
			} = params
			return (
				<AutoComplete
					onChange={handleOnChange(fieldOnChange)}
					disabled={disabled || formState.isSubmitting}
					error={isTouched && !!error?.message}
					helperText={
						<Stack className="w-full">
							{isTouched && !!error?.message && (
								<FormHelperText component="div" error>
									{error?.message}
								</FormHelperText>
							)}
							{!!helperText && (
								<FormHelperText component="div" error={false}>
									{helperText}
								</FormHelperText>
							)}
						</Stack>
					}
					sx={{
						"& .MuiFormHelperText-root": {
							marginLeft: `2px !important`,
							marginRight: `2px !important`,
						},
						...sx,
					}}
					{...rest}
					{...fieldParams}
					ref={ref}
				/>
			)
		},
		[render]
	)

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={rules}
			shouldUnregister={shouldUnregister}
			render={renderField}
		/>
	)
})

export default React.memo(Field);
