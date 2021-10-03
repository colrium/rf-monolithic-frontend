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
import { useReducer, useEffect, useMemo, useCallback, useRef } from "react";
import useDidMount from "./useDidMount";
import useWillUnmount from "./useWillUnmount";
import useSetState from "./useSetState";
import useDidUpdate from "./useDidUpdate";
import * as ReduxForm from "redux-form";
import { useSelector, useDispatch } from 'react-redux';

const DEFAULT_CONFIG = {
    form: "defaultForm",
    initialValues: {},
    onSubmit: values => alert(JSON.stringify(values, null, 2)),
    volatile: false,
}
const useReduxForm = (config = DEFAULT_CONFIG) => {
    const { form, initialValues, onSubmit, volatile, ...otherMeta } = config;
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
        hasSubmitSucceeded,
        hasSubmitFailed,
        submit
    } = ReduxForm;

    const dispatch = useDispatch();
    const storeState = useSelector(state => (state));
    const { form: forms } = storeState;
    //const {forms} = useSelector(storeState => ({ ...storeState, forms: (storeState?.forms??{})}));

    const formValuesSelected = useSelector(getFormValues(form))
    //const [state, dispatchState] = useReducer(reducer, forms);
    const formValues = useMemo(() => (forms[form] && forms[form].values), [forms]);

    useDidMount(() => {
        if (JSON.isJSON(initialValues)) {
            dispatch(initialize(form, initialValues, true, otherMeta))
        }

        //console.log("useReduxForm", "submit", submit);

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
        getFormInitialValues: (...args) => getFormValues(form)(storeState, ...args),
        getFormSyncErrors: (...args) => getFormValues(form)(storeState, ...args),
        getFormMeta: (...args) => getFormValues(form)(storeState, ...args),
        getFormAsyncErrors: (...args) => getFormValues(form)(storeState, ...args),
        getFormSyncWarnings: (...args) => getFormValues(form)(storeState, ...args),
        getFormSubmitErrors: (...args) => getFormValues(form)(storeState, ...args),
        getFormError: (...args) => getFormValues(form)(storeState, ...args),
        getFormNames: (...args) => getFormValues(form)(storeState, ...args),
        isDirty: isDirty(form)(storeState),
        isPristine: isPristine(form)(storeState),
        isValid: isValid(form)(storeState),
        isInvalid: isInvalid(form)(storeState),
        isSubmitting: () => isSubmitting(form)(forms),
        hasSubmitSucceeded: hasSubmitSucceeded(form)(storeState),
        hasSubmitFailed: hasSubmitFailed(form)(storeState),
        useFieldValue: (name, initialValue = undefined, isVolatile = false) => {
            useEffect(() => {
                dispatch(registerField(form, name, Field));
                if (JSON.isJSON(formValues) && !(name in formValues)) {
                    dispatch(change(name, initialValue));
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


            return [((formValues && formValues[name]) || null), value => dispatch(change(form, name, value))];
        },
        useFieldValues: (initial = {}) => {
            const [fieldValues, setFieldValues] = useSetState((formValues ?? {}));
            const setValues = async (values, callback = null) => {
                setFieldValues(values, async (changes) => {
                    //console.log("setFieldValues changes", changes, "formValues", formValues)
                    for (const [name, values] of Object.entries(changes)) {
                        if (JSON.isJSON(formValues) && !(name in formValues)) {
                            dispatch(registerField(form, name, Field));
                        }
                        dispatch(change(form, name, values[1]));
                    }
                    if (Function.isFunction(callback)) {
                        try {
                            callback(changes);
                        } catch (error) {
                            //console.log("useFieldValues set callback error", error)
                        }
                    }
                });
            };
            return [fieldValues, setValues];
        }
    };
}


export default useReduxForm;