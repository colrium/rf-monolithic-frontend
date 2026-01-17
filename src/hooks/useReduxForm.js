/*
-------------USAGE-----------
const config = {
  form: "testForm",
  initialValues: { first_name: "Collins", last_name: "Mutugi" },
  onSubmit: values => alert(JSON.stringify(values, null, 2))
};
const { forms, useFieldValue, destroy, reset, submit } = useReduxForm(config);
const [firstName, setFirstName] = useFieldValue("first_name")
*/
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useDidMount from "./useDidMount";
import useWillUnmount from "./useWillUnmount";
import useSetState from "./useSetState";
import useDidUpdate from "./useDidUpdate";
import * as ReduxForm from "redux-form";
import { useSelector, useDispatch } from 'react-redux';
import { useUpdate } from 'react-use';

const DEFAULT_CONFIG = {
    form: "defaultForm",
    initialValues: {},
    onSubmit: values => alert(JSON.stringify(values, null, 2)),
    volatile: false,
    keepDirty: true,
}
const useReduxForm = (config = DEFAULT_CONFIG) => {
    const { form, initialValues, onSubmit, volatile, keepDirty, ...otherMeta } = { ...DEFAULT_CONFIG, ...config };
    const {
        Field,
        reducer,
        arrayInsert,
        arrayMove,
        arrayPop,
        arrayPush,
        arrayRemove,
        arrayRemoveAll,
        arrayShift,
        arraySplice,
        arraySwap,
        arrayUnshift,
        autofill,
        blur,
        change,
        clearAsyncError,
        clearSubmitErrors,
        clearFields,
        destroy,
        focus,
        initialize,
        registerField,
        reset,
        resetSection,
        setSubmitFailed,
        setSubmitSucceeded,
        startAsyncValidation,
        startSubmit,
        stopSubmit,
        stopAsyncValidation,
        touch,
        unregisterField,
        untouch, //End of actions
        getFormValues,
        getFormInitialValues,
        getFormSyncErrors,
        getFormMeta,
        getFormAsyncErrors,
        getFormSyncWarnings,
        getFormSubmitErrors,
        getFormError,
        getFormNames,
        isDirty,
        isPristine,
        isValid,
        isInvalid,
        isSubmitting,
        isAsyncValidating,
        hasSubmitSucceeded,
        hasSubmitFailed,
        submit,
        ...rest
    } = ReduxForm;

    const dispatch = useDispatch();
    const storeState = useSelector(state => (state));
    const { form: forms } = storeState;
    //const {forms} = useSelector(storeState => ({ ...storeState, forms: (storeState?.forms??{})}));

    const formValuesSelected = useSelector(getFormValues(form))
    //const [state, dispatchState] = useReducer(reducer, forms);
    const formValues = useMemo(() => (forms[form] && forms[form].values), [forms]);

    useDidMount(() => {
        // 
        if (JSON.isJSON(initialValues) && JSON.isEmpty(formValues)) {
            // 
            dispatch(initialize(form, initialValues, keepDirty, otherMeta))
        }
    });


    useWillUnmount(() => {
        if (volatile) {
            dispatch(destroy(form));
        }
    });



    return {
        Field,
        forms,
        state: forms[form],
        arrayInsert: (...args) => {
            dispatch(arrayInsert(form, ...args))
        },
        arrayMove: (...args) => {
            dispatch(arrayMove(form, ...args))
        },
        arrayPop: (...args) => {
            dispatch(arrayPop(form, ...args))
        },
        arrayPush: (...args) => {
            dispatch(arrayPush(form, ...args))
        },
        arrayRemove: (...args) => {
            dispatch(arrayRemove(form, ...args))
        },
        arrayRemoveAll: (...args) => {
            dispatch(arrayRemoveAll(form, ...args))
        },
        arrayShift: (...args) => {
            dispatch(arrayShift(form, ...args))
        },
        arraySplice: (...args) => {
            dispatch(arraySplice(form, ...args))
        },
        arraySwap: (...args) => {
            dispatch(arraySwap(form, ...args))
        },
        arrayUnshift: (...args) => {
            dispatch(arrayUnshift(form, ...args))
        },
        autofill: (...args) => {
            dispatch(autofill(form, ...args))
        },
        blur: (...args) => {
            dispatch(blur(form, ...args))
        },
        change: (...args) => {
            dispatch(change(form, ...args))
        },
        clearAsyncError: (...args) => {
            dispatch(clearAsyncError(form, ...args))
        },
        clearSubmitErrors: () => {
            dispatch(clearSubmitErrors(form))
        },
        clearFields: (...args) => {
            dispatch(clearFields(form, ...args))
        },
        destroy: () => {
            dispatch(destroy(form));
        },
        focus: (...args) => {
            dispatch(focus(form, ...args))
        },
        initialize: (...args) => {
            dispatch(initialize(form, ...args))
        },
        registerField: (name) => {
            dispatch(registerField(form, name, Field))
        },
        reset: () => {
            dispatch(reset(form));
        },
        resetSection: (...args) => {
            dispatch(resetSection(form, ...args))
        },
        setSubmitFailed: (...args) => {
            dispatch(setSubmitFailed(form, ...args))
        },
        setSubmitSucceeded: () => {
            dispatch(setSubmitSucceeded(form))
        },
        startAsyncValidation: () => {
            dispatch(startAsyncValidation(form))
        },
        startSubmit: () => {
            dispatch(startSubmit(form))
        },
        stopSubmit: (...args) => {
            dispatch(stopSubmit(form, ...args))
        },
        stopAsyncValidation: (...args) => {
            dispatch(stopAsyncValidation(form, ...args))
        },
        submit: e => {
            if (e?.preventDefault) {
                e.preventDefault();
            }
            dispatch(submit(form))
            Promise.all([onSubmit(formValues)]).finally(() => dispatch(stopSubmit(form)));
        },
        touch: (...args) => {
            dispatch(touch(form, ...args))
        },
        unregisterField: (name) => {
            dispatch(unregisterField(form, name));
        },
        untouch: (...args) => {
            dispatch(untouch(form, ...args))
        },
        //Selectors
        getFormValues: (...args) => getFormValues(form)(storeState, ...args),
        getFormInitialValues: (...args) => getFormInitialValues(form)(storeState, ...args),
        getFormSyncErrors: (...args) => getFormSyncErrors(form)(storeState, ...args),
        getFormMeta: (...args) => getFormMeta(form)(storeState, ...args),
        getFormAsyncErrors: (...args) => getFormAsyncErrors(form)(storeState, ...args),
        getFormSyncWarnings: (...args) => getFormSyncWarnings(form)(storeState, ...args),
        getFormSubmitErrors: (...args) => getFormSubmitErrors(form)(storeState, ...args),
        getFormError: (...args) => getFormError(form)(storeState, ...args),
        getFormNames: (...args) => getFormNames(storeState, ...args),
        isDirty: isDirty(form)(storeState),
        isPristine: isPristine(form)(storeState),
        isValid: isValid(form)(storeState),
        isInvalid: isInvalid(form)(storeState),
        isSubmitting: () => isSubmitting(form)(forms),
        hasSubmitSucceeded: hasSubmitSucceeded(form)(storeState),
        hasSubmitFailed: hasSubmitFailed(form)(storeState),
        isAsyncValidating: isAsyncValidating(form)(storeState),
        useFieldValue: (name, initialValue = undefined, isVolatile = false) => {
            const value = ((formValues && formValues[name]) || undefined);
            const valueRef = useRef(((formValues && formValues[name]) || undefined));
            const update = useUpdate();
            const [fieldValue, setFieldValue, getFieldValue] = useSetState({ value: valueRef.current });
            useEffect(() => {
                dispatch(registerField(form, name, Field));
                //
                if (JSON.isJSON(formValues)) {
                    if (!(name in formValues)) {
                        dispatch(change(form, name, initialValue));
                    }
                }

                if (isVolatile) {
                    return () => {
                        dispatch(unregisterField(form, name));
                    };
                }
                return () => {
                    //do nothing
                };
            }, []);


            useDidUpdate(() => {
                valueRef.current = value

            }, [value])

            const setValue = useCallback((patch) => {
                if (Function.isFunction(patch)) {
                    Promise.all([patch(valueRef.current)]).then(patches => {
                        if (Array.isArray(patches)) {
                            valueRef.current = patches[0];
                            dispatch(blur(form, name, patches[0]));
                        }
                    }).catch(error => console.error("useFieldValue error", error))
                }
                else {
                    valueRef.current = patch;
                    //setFieldValue(patch);
                    dispatch(blur(form, name, patch));
                }
            }, []);





            return [value, setValue];
        },
        useFieldValues: (initial = {}) => {
            const [fieldValues, setFieldValues, getFieldValues] = useSetState((formValues ?? {}));
            const setValues = async (values, callback = null) => {
                setFieldValues(values);
                for (const [name, value] of Object.entries(values)) {
                    if (JSON.isJSON(formValues) && !(name in formValues)) {
                        dispatch(registerField(form, name, Field));
                    }
                    dispatch(change(form, name, value));
                }

            };
            return [fieldValues, setValues];
        },
        ...rest
    };
}


export default useReduxForm;