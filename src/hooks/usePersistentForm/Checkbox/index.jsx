/** @format */

import React, { useCallback } from "react"
import { Controller } from "react-hook-form"
import Stack from "@mui/material/Stack"
import Checkbox from "@mui/material/Checkbox"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"

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
		color,
		label,
		title,
		render,
		helperText,
		...rest
	} = props

	const formState = control._formState
	const handleOnChange = useCallback(
		defaultOnChange => e => {
			if (Function.isFunction(defaultOnChange)) {
				defaultOnChange(e.target.checked)
			}
			// if (Function.isFunction(onChange)) {
			// 	onChange(e)
			// }
		},
		[onChange]
	)

	const renderField = useCallback(
		params => {
			if (Function.isFunction(render)) {
				return render(params)
			}
			const {
				field: { onChange: fieldOnChange, value: fieldValue, ref: fieldRef, ...fieldParams },
				fieldState: { isTouched, invalid, isDirty, error },
			} = params
			return (
				<FormControl component="fieldset" variant="standard">
					{!!title && <FormLabel component="legend">{title}</FormLabel>}
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									{...fieldParams}
									checked={!!fieldValue}
									onChange={handleOnChange(fieldOnChange)}
									disabled={disabled || formState.isSubmitting}
									color={invalid ? "error" : color || "primary"}
									ref={ref || fieldRef}
									{...rest}
								/>
							}
							label={label}
						/>
					</FormGroup>
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
				</FormControl>
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

export default React.memo(Field)
