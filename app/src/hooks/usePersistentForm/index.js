import { useCallback, useMemo, useRef, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import Alert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { useLatest } from 'react-use';
import { addForm, setForm, removeForm } from "state/actions";
import ErrorMessage from "./ErrorMessage";
import Field from "./Field";
import TextField from "./TextField";
import FilePicker from "./FilePicker"
import RadioGroup from "./RadioGroup";
import Select from "./Select";
import Autocomplete from "./Autocomplete";
import { useDidMount, useDidUpdate, useWillUnmount } from "hooks";
import { EventRegister } from "utils";

const DEFAULT_CONFIG = {
    name: "default",
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: undefined,
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
    initialValues: {},
    onSubmit: values => { },
    watch: true,
    exclude: [],
    include: [],
}





const usePersistentForm = (config = DEFAULT_CONFIG) => {
    const {
        name,
        mode,
        reValidateMode,
        criteriaMode,
        resolver,
        context,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        delayError,
        defaultValues,
        onSubmit,
        watch: watchFields,
        exclude,
        validate,
        persistOnChange,
        ...options
    } = { ...DEFAULT_CONFIG, ...config };
	const dispatch = useDispatch()
    const { forms } = useSelector(storeState => ({ ...storeState, forms: (storeState?.forms || {}) }));
    const stateValues = useMemo(() => (JSON.isJSON(forms[name]) ? forms[name] : {}), [forms]);

    const stateValuesRef = useLatest(stateValues)
    const subscriptionRef = useLatest(null)

    const { control, handleSubmit, watch, setValue, getValues, trigger, formState, ...rest } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: stateValues || defaultValues || initialValues || {},
        resolver: resolver,
        context: context,
        criteriaMode: criteriaMode,
        shouldFocusError: shouldFocusError,
        shouldUnregister: shouldUnregister,
        shouldUseNativeValidation: shouldUseNativeValidation,
        delayError: delayError,
        // shouldUseNativeValidation: true,
        ...options
    });

    const { errors } = formState;

    const initializeForm = useCallback(() => {
        if (!forms[name]) {
            EventRegister.emit('form-changed', { name, ...getValues() });
        }
    }, []);

	const persistFormValues = async form_data => {
		let persist_values = { ...form_data, persist_timestamp: new Date() }
		dispatch(setForm(persist_values))
	}

    const validateForm = useCallback(Function.debounce(async (changes) => {
        let { change } = changes;
        trigger(change?.field);
    }, 550), [])


    const handleOnWatchedValue = useCallback((data, { name: fieldName }) => {
        let prevFieldValue = JSON.getDeepPropertyValue(fieldName, stateValuesRef.current);
        let newFieldValue = JSON.getDeepPropertyValue(fieldName, data);
        let nextStateValue = JSON.setDeepPropertyValue(fieldName, newFieldValue, stateValuesRef.current);
        nextStateValue.name = name;
        stateValuesRef.current = nextStateValue;
		persistFormValues(nextStateValue)
        EventRegister.emit('form-changed', { form: nextStateValue, change: { field: fieldName, prevValue: prevFieldValue } });
    }, []);




    useDidMount(() => {
        initializeForm()
		const subscription = watch(handleOnWatchedValue)
		const formChange = EventRegister.on("form-changed", validateForm)
		return () => {
			subscription.unsubscribe()
			EventRegister.off(formChange)
		}
    });

	useWillUnmount(() => {
		persistFormValues()
	})


    const handleOnSubmit = useCallback(() => {
        handleSubmit(onSubmit(stateValuesRef.current))
    }, [])

    const ControlField = useCallback(forwardRef((params, ref) => {
        return (
            <Field
                control={control}
                ref={ref}
                {...params}
            />
        )
    }), [control])

    const ErrorMessageComponent = useCallback(() => forwardRef((params, ref) => {
        return (
            <ErrorMessage
                errors={errors}
                ref={ref}
                render={({ message }) => <Alert severity="error">{message}</Alert>}
                {...params}
            />
        )
    }), [errors])

    const ControlTextField = useCallback(forwardRef((params, ref) => {
        return (
            <TextField
                control={control}
                ref={ref}
                {...params}
            />
        )
    }), [control])

    const ControlRadioGroup = useCallback(forwardRef((params, ref) => {
        return (
            <RadioGroup
                control={control}
                ref={ref}
                {...params}
            />
        )
    }), [control])

    const ControlSelect = useCallback(forwardRef((params, ref) => {
        return (
            <Select
                control={control}
                ref={ref}
                {...params}
            />
        )
    }), [control])

    const ControlAutocomplete = useCallback(forwardRef((params, ref) => {
        return (
            <Autocomplete
                control={control}
                ref={ref}
                {...params}
            />
        )
    }), [control])

	const ControlFilePicker = useCallback(
		forwardRef((params, ref) => {
			return <FilePicker control={control} ref={ref} {...params} />
		}),
		[control]
	)



    return {
        submit: handleOnSubmit,
        ErrorMessage: ErrorMessageComponent,
        Field: ControlField,
        TextField: ControlTextField,
        RadioGroup: ControlRadioGroup,
        Select: ControlSelect,
        Autocomplete: ControlAutocomplete,
		FilePicker: ControlFilePicker,
        Controller,
        values: stateValues,
        control, handleSubmit, watch, setValue, getValues, trigger, formState, ...rest
    };
}

export default usePersistentForm;
