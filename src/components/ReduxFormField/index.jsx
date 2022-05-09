import React from 'react'
import { Field, reduxForm } from 'redux-form'

const ReduxFormField = (props) => {
    const { input, label, placeholder, type, meta: { asyncValidating, touched, error }, ...rest } = props;
    return (
        <Field
            {...input}
            type={type}
            placeholder={label}
            placeholder={label}
            {...rest}
        />
    )
};

export default ReduxFormField;