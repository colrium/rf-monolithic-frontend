import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const Field = (props) => {
    const { name, control, defaultValue, rules, shouldUnregister, onChange, disabled, render, renderInput, label, variant, ...rest } = props;

    const renderField = useCallback((params) => {
        if (Function.isFunction(render)) {
            return render(params)
        }
        const { field: { onChange: fieldOnChange, ...fieldParams }, fieldState: { isTouched, invalid, isDirty, error }, formState: { isSubmitting } } = params;
        return (
            <Autocomplete
                {...fieldParams}
                onChange={onChange || fieldOnChange}
                disabled={disabled || isSubmitting}

                renderInput={(renderInputParams) => {
                    if (Function.isFunction(renderInput)) {
                        if (renderInput.length === 0) {
                            return renderInput();
                        }
                        else if (renderInput.length === 1) {
                            return renderInput(renderInputParams)
                        }
                        else if (renderInput.length === 2) {
                            return renderInput(renderInputParams, params)
                        }
                    }
                    return (
                        <TextField
                            error={error || invalid}
                            label={label}
                            variant={variant || "standard"}
                            {...renderInputParams}

                        />
                    )
                }}
                {...rest}
            />
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