/** @format */

import { useCallback, useMemo, forwardRef, createContext, useRef } from "react"
import { useForm as useReactHookForm, Controller } from "react-hook-form"
import Typography from "@mui/material/Typography"
import { generate, Observable } from "rxjs"
import Alert from "@mui/material/Alert"
import { useSelector, useDispatch } from "react-redux"
import { useLatest } from "react-use"
import { setForm, removeForm } from "state/actions"
import ErrorMessage from "./ErrorMessage"
import Field from "./Field"
import TextField from "./TextField"
import FilePicker from "./FilePicker"
import RadioGroup from "./RadioGroup"
import Checkbox from "./Checkbox"
import Select from "./Select"
import Autocomplete from "./Autocomplete"
import WysiwygEditor from "./WysiwygEditor"
import Form from "./Form"
import { useDidMount, useDidUpdate, useWillUnmount, useWhyDidYouUpdate } from "hooks"
import { EventRegister } from "utils"

export const Context = createContext({})
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
	resetOnSubmitSuccess: true,
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
		resetOnSubmitSuccess,
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
	const { forms } = useSelector(storeState => ({ ...storeState, forms: storeState?.forms || {} }))
	const persistedValues = useMemo(() => forms[name]?.values, [forms])

	const watchSubscriptionRef = useRef(null)

	const form = useReactHookForm({
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
	const { control, handleSubmit, watch, setValue, getValues, trigger, reset, resetField, formState, ...rest } = form

	const { errors } = formState

	// const whyDidYouUpdate = useWhyDidYouUpdate("useForm", config)
	const valuesRef = useRef(getValues())
	const persistFormValues = useCallback(
		persistValues => {
			if (!volatile) {
				dispatch(
					setForm(name, {
						values: persistValues,
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
	}, [])

	const validateForm = useCallback(
		Function.debounce(async (validationData, triggerMode = "change") => {
			if (triggerMode === "change" && (mode === "onChange" || reValidateMode === "onChange")) {
				let { change } = validationData || {}
				trigger(change?.field)
			}
		}, 550),
		[mode, reValidateMode]
	)

	const handleOnWatchedValue = useCallback(
		subscriber =>
			(data, { name: fieldName, values, type }) => {
				let prevFieldValue = JSON.getDeepPropertyValue(fieldName, valuesRef.current)
				let newFieldValue = JSON.getDeepPropertyValue(fieldName, data)
				valuesRef.current = getValues()
				subscriber.next({
					...formState,
					values: valuesRef.current,
					change: {
						name: name,
						change: { field: fieldName, prevValue: prevFieldValue },
						type: type,
					},
				})
			},
		[formState]
	)
	const observerRef = useRef(
		new Observable(subscriber => {
			watchSubscriptionRef.current = watch(handleOnWatchedValue(subscriber))
		})
	)

	useDidMount(() => {
		initializeForm()

		const subscription = observerRef.current.subscribe({
			next(observerRes) {
				if (observerRes) {
					const { change, values, ...data } = observerRes
					if (change?.type) {
						validateForm(values, change.type)
						// persistFormValues(values)
					}
				}
			},
			error(err) {
				console.error("something wrong occurred: " + err)
			},
			complete() {
				console.log("done")
			},
		})
		return () => {
			if (watchSubscriptionRef.current) {
				watchSubscriptionRef.current.unsubscribe()
			}
			subscription.unsubscribe()
			persistFormValues(valuesRef.current)
		}
	})

	const resetValues = useCallback(() => {
		reset(
			{ ...defaultValues },
			{
				keepErrors: false,
				keepDirty: false,
				keepIsSubmitted: false,
				keepTouched: false,
				keepIsValid: false,
				keepSubmitCount: false,
			}
		)
		persistFormValues({ ...defaultValues })
	}, [])

	const submitForm = useCallback(
		(e = undefined) => {
			if (Function.isFunction(e?.preventDefault)) {
				e.preventDefault()
			}
			const onSubmitHandler = Function.isFunction(onSubmit) ? onSubmit : (vals, e) => console.warn("onSubmit ", vals, e)
			const onSubmitErrorHandler = Function.isFunction(onSubmitError)
				? onSubmitError
				: (vals, e) => console.error("onSubmitError ", vals, e)

			handleSubmit(onSubmitHandler, onSubmitErrorHandler)()
			Promise.all()
				.then(() => {
					if (resetOnSubmitSuccess) {
						resetValues()
					}
				})
				.catch(err => console.error("Error submitting form", err))
		},
		[onSubmit, onSubmitError, resetOnSubmitSuccess]
	)

	const ControlField = useCallback(
		forwardRef((params, ref) => {
			return <Field control={control} ref={ref} {...params} />
		}),
		[control]
	)

	const ErrorMessageComponent = useCallback(
		() =>
			forwardRef((params, ref) => {
				return <ErrorMessage ref={ref} render={({ message }) => <Alert severity="error">{message}</Alert>} {...params} />
			}),
		[]
	)

	const ControlTextField = useCallback(
		forwardRef((params, ref) => {
			return <TextField control={control} {...params} ref={ref} />
		}),
		[control]
	)

	const ControlRadioGroup = useCallback(
		forwardRef((params, ref) => {
			return <RadioGroup control={control} ref={ref} {...params} />
		}),
		[control]
	)

	const ControlSelect = useCallback(
		forwardRef((params, ref) => {
			return <Select control={control} ref={ref} {...params} />
		}),
		[control]
	)

	const ControlCheckbox = useCallback(
		forwardRef((params, ref) => {
			return <Checkbox control={control} ref={ref} {...params} />
		}),
		[control]
	)

	const ControlAutocomplete = useCallback(
		forwardRef((params, ref) => {
			return <Autocomplete control={control} ref={ref} {...params} />
		}),
		[control]
	)

	const ControlFilePicker = useCallback(
		forwardRef((params, ref) => {
			return <FilePicker control={control} ref={ref} {...params} />
		}),
		[control]
	)
	const ControlWysiwygEditor = useCallback(
		forwardRef((params, ref) => {
			return <WysiwygEditor control={control} ref={ref} {...params} />
		}),
		[control]
	)
	const FormComponent = forwardRef(({ children, ...rest }, ref) => {
		return (
			<Form onSubmit={submitForm} {...rest} ref={ref}>
				{children}
			</Form>
		)
	})

	return {
		Context,
		Form: FormComponent,
		submit: submitForm,
		ErrorMessage: ErrorMessageComponent,
		Field: ControlField,
		TextField: ControlTextField,
		RadioGroup: ControlRadioGroup,
		Select: ControlSelect,
		Autocomplete: ControlAutocomplete,
		FilePicker: ControlFilePicker,
		WysiwygEditor: ControlWysiwygEditor,
		Checkbox: ControlCheckbox,
		Controller,
		observer$: observerRef.current,
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

export default Function.memoize(useForm)
