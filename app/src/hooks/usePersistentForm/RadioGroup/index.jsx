import React, { useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {useSetState, useDidUpdate, useDidMount} from "hooks"

const Field = (props) => {
    const { name, control, defaultValue, rules, label, shouldUnregister, onChange, disabled, render, formControlProps, formLabelProps, radioProps, options = {}, ...rest } = props;
    const [state, setState] = useSetState({
        options: new Map(),
        loading: false,
    })
    const resolveOptions = useCallback((targetOptions) => {
        let resolvedOptions = new Map();
        if (JSON.isJSON(targetOptions)) {
            Object.entries(targetOptions).map(([optionKey, optionValue]) => {
                resolvedOptions.set(optionKey, optionValue);
            })
        }
        else if (Array.isArray(targetOptions)) {
            targetOptions.map((option) => {
                let key = option?.value || option?.key || option?.id || option?._id || option;
                resolvedOptions.set(key, option);
            })
        }

        return resolvedOptions;
    }, [])

    useDidMount(() => {
        let targetOptions = options;
        if (JSON.isJSON(options) || Array.isArray(options) ) {
            targetOptions = options;
            let resOptions = resolveOptions(targetOptions);
            setState({
                options: resOptions,
            });
        }
        else if (Function.isFunction(options)) {
            Promise.all([options()]).then(res => {
                let resOptions = resolveOptions(res[0]);
                setState({
                    options: resOptions,
                });
            })
            
        }
    });

    useDidUpdate(() => {
        let targetOptions = options;
        if (JSON.isJSON(options) || Array.isArray(options) ) {
            targetOptions = options;
            let resOptions = resolveOptions(targetOptions);
            setState({
                options: resOptions,
            });        }
        else if (Function.isFunction(options)) {
            Promise.all([options()]).then(res => {
                let resOptions = resolveOptions(res[0]);
                setState({
                    options: resOptions,
                });
            });            
        }
    }, [options]);


    const renderField = useCallback((params) => {
        if (Function.isFunction(render)) {
            return render(params)
        }
        const { field: { onChange: fieldOnChange, required: fieldRequired, label: fieldLabel, ...fieldParams }, fieldState: { isTouched, invalid, isDirty, error }, formState: { isSubmitting } } = params;

        return (
            <FormControl component="fieldset" {...formControlProps}>
                <FormLabel component="legend" required={fieldRequired} {...formLabelProps}>{label}</FormLabel>
                <RadioGroup
                    onChange={onChange || fieldOnChange}
                    {...fieldParams}
                    {...rest}
                >
                    {[...state.options.keys()].map((key, index) => (
                        JSON.isJSON(state.options.get(key)) ? (
                            <FormControlLabel value={key} control={<Radio {...radioProps} />} {...state.options.get(key)} key={`radio-group-${name}-${index}`} />
                        ) : (
                            <FormControlLabel value={key} control={<Radio  {...radioProps} />} label={state.options.get(key)} key={`radio-group-${name}-${index}`} />
                        )
                    ))}                    
                </RadioGroup>
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