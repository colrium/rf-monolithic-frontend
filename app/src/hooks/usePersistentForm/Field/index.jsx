import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
const Field = React.forwardRef((props, ref) => {
    const { name, control, defaultValue, rules, shouldUnregister, component: Component, render, helperText, onChange, disabled, ...rest } = props;

    const renderField = useCallback((params) => {
        if (Function.isFunction(render)) {
            return render(params)
        }
        const { field: { onChange: fieldOnChange, ...fieldParams }, fieldState: { isTouched, invalid, isDirty, error }, formState: { isSubmitting } } = params;
        // 
        return (
            <Component
                {...fieldParams}
                onChange={onChange || fieldOnChange}
                ref={ref}
                disabled={disabled || isSubmitting}
                error={invalid}
                helperText={error?.message || helperText}
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
})

export default React.memo(Field);