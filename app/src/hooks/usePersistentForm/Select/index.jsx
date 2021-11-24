import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Field = (props) => {
    const { name, control, defaultValue, rules, shouldUnregister, onChange, disabled, render, formControlProps, inputLabelProps, menuItemProps, label, variant, options = {}, ...rest } = props;



    const renderField = useCallback((params) => {
        if (Function.isFunction(render)) {
            return render(params)
        }
        const { field: { onChange: fieldOnChange, required: fieldRequired, ...fieldParams }, fieldState: { isTouched, invalid, isDirty, error }, formState: { isSubmitting } } = params;

        return (
            <FormControl component="fieldset" variant={variant} fullWidth {...formControlProps}>
                <InputLabel required={fieldRequired}  {...inputLabelProps} id={`select-input-${name}-label`}> {label}</InputLabel>
                <Select
                    label={label}
                    id={`select-input-${name}`}
                    labelId={`select-input-${name}-label`}
                    onChange={onChange || fieldOnChange}
                    {...fieldParams}
                    {...rest}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {JSON.isJSON(options) && Object.entries(options).map(([key, value], index) => (
                        JSON.isJSON(value) ? (
                            <MenuItem  {...menuItemProps} value={key} key={`select-option-${name}-${index}`} >{value}</MenuItem>
                        ) : (
                            <MenuItem  {...menuItemProps} value={key} key={`select-option-${name}-${index}`} >{value}</MenuItem>
                        )
                    ))}
                </Select>
            </FormControl>
        );
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
}

export default React.memo(Field);