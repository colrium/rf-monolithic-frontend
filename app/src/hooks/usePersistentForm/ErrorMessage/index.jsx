import * as React from 'react';
import { useFormContext, get } from 'react-hook-form';

const ErrorMessage = ({
    as,
    errors,
    name,
    message,
    render,
    ...rest
}) => {
    const methods = useFormContext();
    const error = get(errors || methods.formState.errors, name);

    if (!error) {
        return null;
    }

    const { message: messageFromRegister, types } = error;
    const props = Object.assign({}, rest, {
        children: messageFromRegister || message,
    });

    return React.isValidElement(as) ? React.cloneElement(as, props)
        : render ? (render({
            message: messageFromRegister || message,
            messages: types,
        })) : React.createElement((as) || React.Fragment, props);
};

export default ErrorMessage;