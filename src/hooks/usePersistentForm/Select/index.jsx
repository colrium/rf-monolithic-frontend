import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Field = React.forwardRef((props, ref) => {
    const { name, control, defaultValue, rules, shouldUnregister, onChange, disabled, render, formControlProps, inputLabelProps, menuItemProps, label, variant, options = {}, ...rest } = props;

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
    const renderField = useCallback((params) => {
        if (Function.isFunction(render)) {
            return render(params)
        }
        const {
			field: {
				onChange: fieldOnChange,
				required: fieldRequired,
				ref: fieldRef,
				...fieldParams
			},
			fieldState: { isTouched, invalid, isDirty, error },
			formState: { isSubmitting },
		} = params

        return (
			<FormControl
				component="fieldset"
				variant={variant}
				fullWidth
				{...formControlProps}
			>
				<InputLabel
					required={fieldRequired}
					{...inputLabelProps}
					id={`select-input-${name}-label`}
				>
					{" "}
					{label}
				</InputLabel>
				<Select
					label={label}
					id={`select-input-${name}`}
					labelId={`select-input-${name}-label`}
					onChange={handleOnChange(fieldOnChange)}
					disabled={disabled || formState.isSubmitting}
					ref={ref || fieldRef}
					{...rest}
					{...fieldParams}
				>
					<MenuItem value="">
						<em>None</em>
					</MenuItem>
					{JSON.isJSON(options) &&
						Object.entries(options).map(([key, value], index) =>
							JSON.isJSON(value) ? (
								<MenuItem
									{...menuItemProps}
									value={key}
									key={`select-option-${name}-${index}`}
								>
									{value}
								</MenuItem>
							) : (
								<MenuItem
									{...menuItemProps}
									value={key}
									key={`select-option-${name}-${index}`}
								>
									{value}
								</MenuItem>
							)
						)}
				</Select>
			</FormControl>
		)
    }, [render, rest]);

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
