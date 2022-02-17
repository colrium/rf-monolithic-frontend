import { useCallback, useMemo, useRef, forwardRef, useEffect } from "react";
import { useForm as useReactHookForm, Controller } from "react-hook-form";
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import { useSelector, useDispatch } from 'react-redux';
import { useLatest } from 'react-use';
import { setForm, removeForm } from "state/actions";
import ErrorMessage from "./ErrorMessage";
import Field from "./Field";
import TextField from "./TextField";
import FilePicker from "./FilePicker"
import RadioGroup from "./RadioGroup";
import Checkbox from "./Checkbox";
import Select from "./Select";
import Autocomplete from "./Autocomplete";
import { useDidMount, useDidUpdate, useWillUnmount } from "hooks";
import { EventRegister } from "utils";

const DEFAULT_CONFIG = {
	name: "default",
	mode: "all",
	reValidateMode: "onChange",
	resolver: undefined,
	context: undefined,
	criteriaMode: "firstError",
	shouldFocusError: true,
	shouldUnregister: false,
	shouldUseNativeValidation: false,
	delayError: undefined,
	defaultValues: {},
	watch: true,
	volatile: false,
	exclude: [],
	include: [],
}





const useForm = (config = DEFAULT_CONFIG) => {
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
		onSubmitError,
		watch: watchFields,
		exclude,
		validate,
		volatile,
		persistOnChange,
		...options
	} = { ...DEFAULT_CONFIG, ...config }
	const dispatch = useDispatch()
    const { forms } = useSelector(storeState => ({ ...storeState, forms: (storeState?.forms || {}) }));
    const persistedValues = useMemo(() => forms[name]?.values , [forms])

    const persistedValuesRef = useLatest(persistedValues)
    const subscriptionRef = useLatest(null)

    const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		trigger,
		reset,
		resetField,
		formState,
		...rest
	} = useReactHookForm({
		mode: mode || "onSubmit",
		reValidateMode: reValidateMode || "onChange",
		defaultValues: persistedValues || defaultValues || {},
		resolver: resolver,
		context: context,
		criteriaMode: criteriaMode,
		shouldFocusError: shouldFocusError,
		shouldUnregister: shouldUnregister,
		shouldUseNativeValidation: shouldUseNativeValidation,
		delayError: delayError,
		// shouldUseNativeValidation: true,
		...options,
	})

    const { errors } = formState;

	const persistFormValues = useCallback(
		async form_data => {
			const persist_values = JSON.merge(getValues(), {...form_data});
			if (!volatile) {
				dispatch(
					setForm(name, {
						values: persist_values,
						persist_timestamp: new Date(),
					})
				)
			}
		},
		[volatile, name]
	)


    const initializeForm = useCallback(() => {
        if (!forms[name] && !volatile) {
			EventRegister.emit("form-changed", { name, values: getValues() })
		}
    }, []);




    const validateForm = useCallback(
		Function.debounce(async (validationData, triggerMode = "change") => {
			if (
				triggerMode === "change" &&
				(mode === "onChange" || reValidateMode === "onChange")
			) {
				let { change } = validationData || {}
				trigger(change?.field)
			}
		}, 550),
		[mode, reValidateMode]
	)


    const handleOnWatchedValue = useCallback((data, { name: fieldName, values, type }) => {
			let prevFieldValue = JSON.getDeepPropertyValue(
				fieldName,
				persistedValuesRef.current
			)
			let newFieldValue = JSON.getDeepPropertyValue(fieldName, data)
			let nextStateValue = JSON.setDeepPropertyValue(
				fieldName,
				newFieldValue,
				persistedValuesRef.current
			)
			persistedValuesRef.current = nextStateValue
			EventRegister.emit("form-changed", {
				name: name,
				values: nextStateValue,
				change: { field: fieldName, prevValue: prevFieldValue },
				type: type
			})

    }, []);




    useDidMount(() => {
        initializeForm()

			const subscription = watch(handleOnWatchedValue)
			const formChange = EventRegister.on("form-changed", ({detail:formData}) => {
				validateForm(formData, formData.type)
				persistFormValues(formData.values)
			})
			return () => {
				subscription.unsubscribe()
				formChange.remove()
			}

    });

	useWillUnmount(() => {
		persistFormValues(getValues())
	})


    const resetValues = useCallback(() => {
		reset(
			{ ...defaultValues },
			{
				keepErrors: false,
				keepDirty: false,
				keepIsSubmitted: false,
				keepTouched: false,
				keepIsValid: true,
				keepSubmitCount: false,
			}
		)
		// persistFormValues({ ...defaultValues })
	}, [])

	const submitForm = useCallback(
		(e = undefined) => {
			if (Function.isFunction(e?.preventDefault)) {
				e.preventDefault()
			}
			const onSubmitHandler = Function.isFunction(onSubmit)
				? onSubmit
				: (vals, e) => console.warn("onSubmit ", vals, e)
			const onSubmitErrorHandler = Function.isFunction(onSubmitError)
				? onSubmitError
				: (vals, e) => console.error("onSubmitError ", vals, e)

			handleSubmit(onSubmitHandler, onSubmitErrorHandler)()
		},
		[onSubmit, onSubmitError]
	)

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
        return <TextField control={control} {...params} ref={ref} />
    }), [control, errors])

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

	const ControlCheckbox = useCallback(
		forwardRef((params, ref) => {
			return <Checkbox control={control} ref={ref} {...params} />
		}),
		[control]
	)

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
		submit: submitForm,
		ErrorMessage: ErrorMessageComponent,
		Field: ControlField,
		TextField: ControlTextField,
		RadioGroup: ControlRadioGroup,
		Select: ControlSelect,
		Autocomplete: ControlAutocomplete,
		FilePicker: ControlFilePicker,
		Checkbox: ControlCheckbox,
		Controller,
		values: getValues(),
		persistedValues,
		resetValues,
		reset,
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		trigger,
		formState,
		resetField,
		...rest,
	}
}

export default useForm;
