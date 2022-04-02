import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import AutoComplete from "components/AutoComplete"
import {
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
	InputBase,
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
					error={invalid}
					helperText={
						<Stack className="w-full">
							{!!error?.message && (
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
