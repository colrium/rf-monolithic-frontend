import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const Field = React.forwardRef((props, ref) => {
    const { name, control, defaultValue, rules, shouldUnregister, component: Component, render, helperText, onChange, disabled, formControlProps, ...rest } = props;

    const renderField = useCallback((params) => {
        if (Function.isFunction(render)) {
            return render(params)
        }
        const { field: { onChange: fieldOnChange, ...fieldParams }, fieldState: { isTouched, invalid, isDirty, error }, formState: { isSubmitting } } = params;
        // 
        return (
            <FormControl component="fieldset" className="w-full" { ...formControlProps }>


                <Component
                    { ...fieldParams }
                    onChange={ onChange || fieldOnChange }
                    ref={ ref }
                    disabled={ disabled || isSubmitting }
                    error={ invalid }
                    helperText={ error?.message || helperText }
                    { ...rest }
                />
                { Boolean((error?.message || helperText)) && <FormHelperText error={ Boolean(error) } >
                    { error?.message ?? helperText }
                </FormHelperText> }
            </FormControl>
        );
    }, [render, rest]);

    return (
        <Controller
            name={ name }
            control={ control }
            defaultValue={ defaultValue }
            rules={ rules }
            shouldUnregister={ shouldUnregister }
            render={ renderField }
        />
    )
})

export default React.memo(Field);