/** @format */
import React, { useCallback } from "react"
import { connect } from "react-redux"
import compose from "recompose/compose"
import { Snackbar } from "@mui/material"

import { Add as AddIcon, EditOutlined as EditIcon } from "@mui/icons-material"

import { colors } from "assets/jss/app-theme"
// Externals
import classNames from "classnames"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import { useDispatch, useSelector } from "react-redux"
//
import Grid from '@mui/material/Grid'

import SnackbarContent from "components/Snackbar/SnackbarContent"
import PropTypes from "prop-types"
import { useSetState, usePersistentForm, useDidMount, useDidUpdate } from "hooks"
//
import { useNetworkServices, useNotificationsQueue } from "contexts"
//
import { ServiceDataHelper, UtilitiesHelper } from "utils/Helpers"

const LightInputField = props => {
	const { component: InputComponent, ...rest } = props
	return <InputComponent {...rest} />
}



const BaseForm = React.forwardRef((props, ref) => {
	const {
		className,
		defination,
		record,
		id,
		fields,
		exclude,
		show_title,
		show_submit,
		show_discard,
		SubmitBtn,
		submitBtnProps,
		DiscardBtn,
		discardBtnProps,
		submit_btn_text,
		pristine,
		layout,
		volatile = false,
		name,
		SidebarComponent,
		inputColumnSize,
		text_fields_variant,
		validation,
		textFieldsProps,
		selectFieldsProps,
		textareaFieldsProps,
		initialValues,
		onValuesChange,
		...rest
	} = props
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const ref_input_types = ["select", "transferlist", "multiselect", "radio", "checkbox", "dynamic"]
	const { Api: ApiService, SocketIO, definations } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()
	const {
		submit,
		ErrorMessage,
		Field,
		TextField,
		RadioGroup,
		Select,
		Autocomplete,
		FilePicker,
		WysiwygEditor,
		Checkbox,
		Controller,
		values,
		persistedValues,
		resetValues,
		reset,
		control,
		watch,
		setValue,
		getValues,
		trigger,
		formState,
		resetField,
	} = usePersistentForm({
		name: `${name || defination?.name || "unnamed"}-${record?._id || record?.uuid || "new"}-form`,
		volatile: volatile,
		defaultValues: record || initialValues || {},
	})
	const [state, setState, getState] = useSetState({
		record: false,
		loading: {},
		load_error: false,
		submitting: false,
		submit_error: false,
		fields: {},
		onChangeEffects: {},
		onChangeEffectsFields: {},
		evaluating: true,
		field_values: {},
		default_field_values: {},
		last_field_changed: false,
		show_passwords: {},
		value_possibilities: {},
	})

	const callDefinationMethod = useCallback(
		method => {
			let method_data = null
			if (method.length === 0) {
				method_data = method()
			} else if (method.length === 1) {
				method_data = method(values)
			} else if (method.length === 2) {
				method_data = method(values, auth?.user)
			} else if (method.length === 3) {
				method_data = method(values, auth?.user)
			}
			return Promise.all([method_data])
				.then(data => {
					return method_data
				})
				.catch(err => {})
		},
		[auth, values]
	)

	const loadFieldValuePosibilities = useCallback(
		() => {
			let fields_to_load = {}
			let loading_fields = {}
			let value_possibilities = {}
			let currentState = getState()
			if (Object.size(currentState.onChangeEffectsFields) > 0) {
				for (let [effect_field_name, effect_field_properties] of Object.entries(currentState.onChangeEffectsFields)) {
					/* if (!(effect_field_properties.input.type in ref_input_types)) {
					continue;
				} */
					if (JSON.isJSON(effect_field_properties.reference) && !currentState.loading[effect_field_name]) {
						fields_to_load[effect_field_name] = effect_field_properties
						loading_fields[effect_field_name] = true
					} else if (
						(JSON.isJSON(effect_field_properties.possibilities) && !(effect_field_name in currentState.value_possibilities)) ||
						!Object.areEqual(newState.value_possibilities[effect_field_name], effect_field_properties.possibilities)
					) {
						value_possibilities[effect_field_name] = effect_field_properties.possibilities
					} else if (
						Array.isArray(effect_field_properties.possibilities) &&
						!(effect_field_name in newState.value_possibilities)
					) {
						let possibilities = {}
						for (var i = 0; i < effect_field_properties.possibilities.length; i++) {
							possibilities[effect_field_properties.possibilities[i]] = effect_field_properties.possibilities[i]
						}
						value_possibilities[effect_field_name] = possibilities
					}
				}
			} else {

				for (let [field_name, field_properties] of Object.entries(currentState.fields)) {
					/* if (!(field_properties.input.type in ref_input_types)) {
					continue;
				} */
					if (JSON.isJSON(field_properties?.reference) && !currentState.loading[field_name] && field_properties?.reference?.name !== "attachments") {
						if (currentState.value_possibilities && !currentState.value_possibilities[field_name]) {
							fields_to_load[field_name] = field_properties
							loading_fields[field_name] = true
						}
					} else if (
						(JSON.isJSON(field_properties?.possibilities) &&
							currentState.value_possibilities &&
							!(field_name in currentState.value_possibilities)) ||
						!Object.areEqual(currentState.value_possibilities[field_name], field_properties.possibilities)
					) {
						value_possibilities[field_name] = field_properties.possibilities
					} else if (
						Array.isArray(field_properties.possibilities) &&
						currentState.value_possibilities &&
						!(field_name in currentState.value_possibilities)
					) {
						let possibilities = {}
						for (var i = 0; i < field_properties.possibilities.length; i++) {
							possibilities[field_properties.possibilities[i]] = field_properties.possibilities[i]
						}
						value_possibilities[field_name] = possibilities
					}
				}
			}

			if (Object.size(value_possibilities) > 0) {
				//
				currentState.value_possibilities = { ...currentState.value_possibilities, ...value_possibilities }

			}


			setState({value_possibilities: { ...currentState.value_possibilities, ...value_possibilities } })

			if (Object.size(fields_to_load) > 0) {
				for (let [name, field] of Object.entries(fields_to_load)) {
					if (Array.isArray(fields) && fields.length > 0) {
						if ((exclude && fields.includes(name)) || !fields.includes(name)) {
							continue
						}
					}

					if (JSON.isJSON(field.reference)) {
						//Reference field Service Calls
						if (String.isString(field.reference.name) && JSON.isJSON(field.reference.service_query)) {
							let service_key = field.reference.name
							let service_query = field.reference.service_query
							let service = definations[service_key]
								? ApiService.getContextRequests(definations[service_key]?.endpoint)
								: false

							let execute_service_call =
								service &&
								service_query &&
								currentState.last_field_changed !== name &&
								ref_input_types.includes(field?.input?.type)

							if (execute_service_call) {
								setState(prevState => ({ loading: { ...prevState.loading, [name]: true } }))
								service
									.getRecords(service_query)
									.then(response => {
										let raw_data = response.body.data

										let possibilities = {}
										let resolves = field.reference.resolves
										let resolve_columns = fields_to_load

										if (resolves.emulation) {
											if (resolves.emulation.defination in definations) {
												if (Array.isArray(raw_data)) {
													let new_raw_data = []
													for (let j = 0; j < raw_data.length; j++) {
														if (resolves.emulation.key in raw_data[j]) {
															if (Array.isArray(raw_data[j][resolves.emulation.key])) {
																new_raw_data = new_raw_data.concat(raw_data[j][resolves.emulation.key])
															} else {
																new_raw_data.push(raw_data[j][resolves.emulation.key])
															}
														}
													}
													raw_data = new_raw_data
												}
												resolve_columns = definations[resolves.emulation.defination].scope.columns
											} else {
												raw_data = []
											}
										}
										if (raw_data.length > 0) {
											let resolvable_data = []
											for (var i = 0; i < raw_data.length; i++) {
												resolvable_data.push({ [name]: raw_data[i] })
											}
											let resolved_data = ServiceDataHelper.resolveReferenceColumnsDisplays(
												resolvable_data,
												resolve_columns,
												auth.user
											)
											for (var j = 0; j < resolved_data.length; j++) {
												possibilities[resolved_data[j][name].value] = resolved_data[j][name].resolve
											}
										}
										queueNotification({content: "Data fetched " + field.label + " ::: " + err.msg})
										setState(prevState => {

											return ({
											value_possibilities: {
												...prevState.value_possibilities,
												[name]: possibilities,
											},
											loading: { ...prevState.loading, [name]: false },
										})})
									})
									.catch(err => {
										queueNotification({severity: "error", content: "Error fetching " + field.label + " ::: " + err.msg})
										setState(prevState => ({
											loading: { ...prevState.loading, [name]: false },
										}))
									})
							}
						}
					}
				}
				setState({ onChangeEffectsFields: {} })
			}
		},
		[auth, fields, exclude]
	)


	const prepareForForm = useCallback(() => {
		let currentState = getState()

		let field_values = {}
		let initializeRedux = true

		if (JSON.isJSON(values)) {
			field_values = values
			initializeRedux = false
			if (Function.isFunction(onValuesChange)) {
				let labels = {}
				for (let key of Object.keys(field_values)) {
					if (key in currentState.value_possibilities) {
						labels[key] = currentState.value_possibilities[key][field_values[key]]
					} else if (key in defination.scope.columns) {
						labels[key] = field_values[key]
					}
				}
				onValuesChange(field_values, labels)
			}
		} else if (JSON.isJSON(initialValues) && Object.size(initialValues) > 0) {
			field_values = initialValues
		}
		currentState.field_values = field_values

		//const { evaluatedFields, onChangeEffects } = evaluateFields();
		evaluateFields().then(({ evaluatedFields, onChangeEffects }) => {
			let arrangedFields = { unpositioned: {} }

			for (let [name, properties] of Object.entries(evaluatedFields)) {
				if ((Array.isArray(fields) && fields.includes(name) && !exclude) || (!Array.isArray(fields) && !exclude)) {
					if (!!record && (properties.input.default || properties.input.value) && !(name in field_values)) {
						if (properties.input.value) {
							field_values[name] = properties.input.value
						} else {
							field_values[name] = properties.input.default
						}
						if (!initializeRedux) {
							initializeRedux = true
						}
					}
				}
			}

			setState(
				{
					record: record,
					fields: evaluatedFields,
					arrangedFields: arrangedFields,
					onChangeEffects: onChangeEffects,
					evaluating: false,
				},
				loadFieldValuePosibilities
			)
		})
	}, [defination, initialValues, exclude, record, fields, values, onValuesChange])


	const evaluateFields = useCallback(async () => {
		const columns = { ...defination?.scope?.columns }
		let fields = {}
		let onChangeEffects = {}
		for (const [name, properties] of Object.entries(columns)) {
			// Define onChange effects

			//Evaluate value
			let field = JSON.parse(JSON.stringify(properties))

			if (properties.input.default) {
				if (Function.isFunction(properties.input.default)) {
					field.input.default = await callDefinationMethod(properties.input.default)
				} else {
					field.input.default = properties.input.default
				}
			}

			if (Function.isFunction(properties.label)) {
				field.label = await callDefinationMethod(properties.label)
			}
			if (Function.isFunction(properties?.input?.type)) {
				field.input.type = await callDefinationMethod(properties.input.type)
			}

			if (Function.isFunction(properties.input.default)) {
				field.input.value = await callDefinationMethod(properties.input.default)
			}

			if (Function.isFunction(properties.input.value)) {
				field.input.value = await callDefinationMethod(properties.input.value)
			}

			if (Function.isFunction(properties.input.required)) {
				field.input.required = await callDefinationMethod(properties.input.required)
			}
			if (Function.isFunction(properties.input.props)) {
				field.input.props = await callDefinationMethod(properties.input.props)
			}

			if (properties.restricted) {
				if (Function.isFunction(properties.restricted.input)) {
					field.restricted.input = await callDefinationMethod(properties.restricted.input)
				} else if (Boolean.isBoolean(properties.restricted.input)) {
					field.restricted.input = properties.restricted.input
				}
			}
			if (properties.reference) {
				if (Function.isFunction(properties.reference)) {
					field.reference = await callDefinationMethod(properties.reference)
					if (JSON.isJSON(field.reference)) {
						if (Function.isFunction(field.reference.name)) {
							field.reference.name = await callDefinationMethod(field.reference.name)
						}
						if (Function.isFunction(field.reference.resolves)) {
							field.reference.resolves = await callDefinationMethod(field.reference.resolves)
						}
						if (Function.isFunction(field.reference.service_query)) {
							field.reference.service_query = await callDefinationMethod(field.reference.service_query)
						}
					} else {
						delete field.reference
					}
				} else {
					if (Function.isFunction(properties.reference.name)) {
						field.reference.name = await callDefinationMethod(properties.reference.name)
					} else {
						field.reference.name = properties.reference.name
					}
					if (Function.isFunction(properties.reference.resolves)) {
						field.reference.resolves = await callDefinationMethod(properties.reference.resolves)
					} else {
						field.reference.resolves = properties.reference.resolves
					}
					if (Function.isFunction(properties.reference.service_query)) {
						field.reference.service_query = await callDefinationMethod(properties.reference.service_query)
					} else {
						field.reference.service_query = properties.reference.service_query
					}
				}
			}
			if (properties.possibilities) {
				if (Function.isFunction(properties.possibilities)) {
					field.possibilities = await callDefinationMethod(properties.possibilities)
				}
			}

			fields[name] = field

			onChangeEffects[name] = async () => {
				let field_with_effects = JSON.parse(JSON.stringify(properties))
				if (properties.input.default) {
					if (Function.isFunction(properties.input.default)) {
						field_with_effects.input.default = await callDefinationMethod(properties.input.default)
					}
				}

				if (Function.isFunction(properties.label)) {
					field_with_effects.label = await callDefinationMethod(properties.label)
				}
				if (Function.isFunction(properties.input.type)) {
					field_with_effects.input.type = await callDefinationMethod(properties.input.type)
				}
				if (Function.isFunction(properties.input.disabled)) {
					field_with_effects.input.disabled = await callDefinationMethod(properties.input.disabled)
				}
				if (Function.isFunction(properties.input.default)) {
					field_with_effects.input.default = await callDefinationMethod(properties.input.default)
				}
				if (Function.isFunction(properties.input.value)) {
					field_with_effects.input.value = await callDefinationMethod(properties.input.value)
				}
				if (Function.isFunction(properties.input.required)) {
					field_with_effects.input.required = await callDefinationMethod(properties.input.required)
				}
				if (Function.isFunction(properties.input.props)) {
					field_with_effects.input.props = await callDefinationMethod(properties.input.props)
				}

				if (properties.restricted) {
					if (Function.isFunction(properties.restricted.input)) {
						field_with_effects.restricted.input = await callDefinationMethod(properties.restricted.input)
					} else if (Boolean.isBoolean(properties.restricted.input)) {
						field_with_effects.restricted.input = properties.restricted.input
					} else {
						field_with_effects.restricted.input = false
					}
				}

				if (properties.reference) {
					//field_with_effects.reference = properties.reference;
					if (Function.isFunction(properties.reference)) {
						field_with_effects.reference = await callDefinationMethod(properties.reference)
						if (JSON.isJSON(field_with_effects.reference)) {
							if (Function.isFunction(field_with_effects.reference.name)) {
								field_with_effects.reference.name = await callDefinationMethod(field_with_effects.reference.name)
							}
							if (Function.isFunction(field_with_effects.reference.resolves)) {
								field_with_effects.reference.resolves = await callDefinationMethod(
									field_with_effects.reference.resolves
								)
							}
							if (Function.isFunction(field_with_effects.reference.service_query)) {
								field_with_effects.reference.service_query = await callDefinationMethod(
									field_with_effects.reference.service_query
								)
							}
						} else {
							delete field_with_effects.reference
						}
					} else {
						if (Function.isFunction(properties.reference.name)) {
							field_with_effects.reference.name = await callDefinationMethod(properties.reference.name)
						} else {
							field_with_effects.reference.name = properties.reference.name
						}
						if (Function.isFunction(properties.reference.resolves)) {
							field_with_effects.reference.resolves = await callDefinationMethod(properties.reference.resolves)
						} else {
							field_with_effects.reference.resolves = properties.reference.resolves
						}
						if (Function.isFunction(properties.reference.service_query)) {
							field_with_effects.reference.service_query = await callDefinationMethod(
								properties.reference.service_query
							)
						} else {
							field_with_effects.reference.service_query = properties.reference.service_query
						}
					}
				}
				if (properties.possibilities) {
					if (Function.isFunction(properties.possibilities)) {
						field_with_effects.possibilities = await callDefinationMethod(properties.possibilities)
					}
				}

				if (!Object.areEqual(state.fields[name], field_with_effects)) {
					return field_with_effects
				} else {
					return false
				}
			}
		}
		return { evaluatedFields: fields, onChangeEffects: onChangeEffects }
	}, [defination])

	const applyChangeEffects = useCallback(async () => {
		let currentState = getState()
		let onChangeEffectsFields = {}
		let fields = currentState.fields
		let field_values = currentState.field_values
		let value_possibilities = currentState.value_possibilities
		let fieldValuesChanged = false
		for (const [name, onChangeEffect] of Object.entries(currentState.onChangeEffects)) {
			if (Function.isFunction(onChangeEffect)) {
				const field = await onChangeEffect()
				if (JSON.isJSON(field)) {
					fields[name] = field
					/*if (field.input.value && field_values[name] !== field.input.value) {
						field_values[name] = field.input.value;
						fieldValuesChanged = true;
					}*/
					if (field.possibilities && !Object.areEqual(field.possibilities, value_possibilities)) {
						if (field_values[name] && !(field_values[name] in field.possibilities)) {
							field_values[name] = field.input.value
						}
						value_possibilities[name] = field.possibilities
						//fieldValuesChanged = true;
					} else if (field.input.value && field_values[name] !== field.input.value) {
						field_values[name] = field.input.value
						fieldValuesChanged = true
					}
					onChangeEffectsFields[name] = field
				}
			}
		}
		if (fieldValuesChanged) {
			// initialize(field_values)
		}

		if (Object.size(onChangeEffectsFields) > 0) {
				setState({
					fields: fields,
					field_values: field_values,
					value_possibilities: value_possibilities,
					onChangeEffectsFields: onChangeEffectsFields,
					evaluating: false,
				})
		}


	}, [])

	const handleSubmit = useCallback((event) => {
		if (event) {
			event.preventDefault()
		}


	}, [])

	const handleKeyPress = useCallback(event => {
		if ((event.key === "s" || event.key === "S") && event.ctrlKey) {
			event.preventDefault()
			handleSubmit(event)
			//
		}
	}, [])

	const renderFieldInput = useCallback(
		(name, field, restricted = false) => {
			const { text_fields_variant, validation, layout, textFieldsProps, selectFieldsProps, textareaFieldsProps } = props
			const currentState = getState()

			let field_values = { ...currentState.default_field_values, ...values }

			//Evaluate value
			let value = undefined
			if (name in field_values) {
				value = field_values[name]
			}

			let inputProps = {}
			if (field.input.props) {
				inputProps = field.input.props
			}

			if (field?.input?.type === "radio") {
				return (
					<RadioGroup
						name={name}
						label={field.label}
						required={field.input.required}
						disabled={restricted}
						options={{...currentState.value_possibilities[name]}}
						validate={validation}
						{...inputProps}
					/>
				)
			} else if (field?.input?.type === "select") {
				return (
					<Autocomplete
						name={name}
						disabled={restricted}
						options={{...currentState.value_possibilities[name]}}
						placeholder={"Select " + field.label.singularize()}
						validate={true}
						variant={text_fields_variant}
						required={validation && field.input.required}
						label={field.label}
						loading={currentState.loading[name]}
						size="small"
						{...selectFieldsProps}
						{...inputProps}
					/>
				)
			} else if (field?.input?.type === "multiselect") {
				value = Array.isArray(value) ? value : []

				return (
					<Autocomplete
						name={name}
						disabled={restricted}
						label={field.label}
						options={{...currentState.value_possibilities[name]}}
						placeholder={"Select " + field.label}
						required={validation && field.input.required}
						variant={text_fields_variant}

						loading={currentState.loading[name]}
						{...selectFieldsProps}
						{...inputProps}
						multiple
					/>
				)

				return ""
			} else if (field?.input?.type === "transferlist") {
				/* if (currentState.value_possibilities[name]) {
				return (
					<LightInputField
						name={name}
						component={TranferListInput}
						label={field.label}


						value_options={currentState.value_possibilities && currentState.value_possibilities[name]}
						validate={validation}
						{...inputProps}
					/>
				)
			} */
				return ""
			} else if (["email", "number", "phone", "text", "password"].includes(field.input.type)) {
				return (
					<TextField
						name={name}
						type={field.input.type}
						disabled={restricted}
						label={field.label}
						variant={text_fields_variant}
						required={field.input.required}
						fullWidth
						validate={validation}
						{...textFieldsProps}
						{...inputProps}
					/>
				)
			} else if (field?.input?.type === "textarea") {
				return (
					<TextField
						name={name}
						disabled={restricted}
						label={field.label}
						variant={text_fields_variant}
						multiline
						minRows={4}
						required={field.input.required}
						fullWidth
						validate={validation}
						{...textareaFieldsProps}
						{...inputProps}
					/>
				)
			} else if (field?.input?.type === "wysiwyg") {
				return (
					<WysiwygEditor
						name={name}
						disabled={restricted}
						label={field.label}
						variant={text_fields_variant}
						required={field.input.required}
						fullWidth
						validate={validation}
						rows={15}
						{...inputProps}
					/>
				)
			} else if (field?.input?.type === "date") {
				/* return (
				<LightInputField
					fullWidth
					margin="normal"
					name={name}
					label={field.label}
					disabled={restricted}
					component={DateInput}
					autoOk
					variant="inline"
					openTo="date"
					invalidDateMessage=""


					required={field.input.required}
					inputVariant={text_fields_variant}
					format="DD/MM/YYYY"
					color="primary"
					{...inputProps}
					validate={validation}
				/>
			) */
				return ""
			} else if (field?.input?.type === "datetime") {
				/* return (
				<LightInputField
					name={name}
					label={field.label}
					disabled={restricted}
					component={DateTimeInput}
					autoOk
					variant="inline"
					inputVariant={text_fields_variant}


					required={field.input.required}
					validate={validation}
					{...inputProps}
				/>
			) */
				return ""
			} else if (field?.input?.type === "checkbox") {
				return (
					<Checkbox
						name={name}
						disabled={restricted}
						label={field.label}
						required={field.input.required}
						validate={validation}
						{...inputProps}
					/>
				)
			} else if (field?.input?.type === "slider") {
				let default_value = value !== undefined ? value : false
				let step_value = 5
				let min_value = false
				let max_value = false
				let marks = []
				let values = []
				if (String.isString(field.input.default) || Number.isNumber(field.input.default)) {
					if (field.input.default.length > 0) {
						default_value = Number.parseNumber(field.input.default)
					}
				}

				if (currentState.value_possibilities[name]) {
					for (let [possibility_value, possibility_label] of Object.entries(currentState.value_possibilities[name])) {
						//if possibility_value is float parseFloat else if value is integer parseInt
						possibility_value = /[-+]?(?:\d*\.\d+\.?\d*)(?:[eE][-+]?\d+)?/gim.test(possibility_value)
							? parseFloat(possibility_value)
							: /^[-+]?(\d*)?\d+$/gim.test(possibility_value)
							? parseInt(possibility_value)
							: false
						//evaluate and push step
						step_value =
							values.length > 0
								? Math.abs(possibility_value - values[values.length - 1]) < step_value
									? Math.abs(possibility_value - values[values.length - 1])
									: step_value
								: !default_value
								? possibility_value
								: step_value
						default_value = !default_value ? possibility_value : default_value
						min_value = !min_value ? possibility_value : possibility_value < min_value ? possibility_value : min_value
						max_value = !max_value ? possibility_value : possibility_value > max_value ? possibility_value : max_value
						values.push(possibility_value)
						marks.push({ value: possibility_value, label: possibility_label })
					}
					min_value = !min_value ? 0 : min_value
					max_value = !max_value ? 1 : max_value
					default_value = default_value ? default_value : min_value
					/* return (
					<LightInputField
						name={name}
						label={field.label}
						component={SliderInput}
						marks
						min={min_value}
						max={max_value}
						step={step_value}
						defaultValue={default_value}

						validate={validation}
						{...inputProps}
					/>
				) */
				}
				return ""
			} else if (field?.input?.type === "file") {
				let acceptedFiles = ["image/*", "video/*", "audio/*", "application/*"]
				let defaultInputProps = {
					maxFileSize: 300000000,
					upload: true,
					filesLimit: Array.isArray(field.type) ? 20 : 1,
				}

				inputProps = { ...defaultInputProps, ...inputProps }
				return (
					<FilePicker
						name={name}
						label={field.label}
						required={field.input.required}
						validate={validation}
						variant={text_fields_variant}
						{...inputProps}
					/>
				)
			} else if (field?.input?.type === "map") {
				/* return (
				<LightInputField
					name={name}
					label={field.label}
					component={MapInput}


					required={field.input.required}
					validate={validation}
					{...inputProps}
				/>
			) */
				return ""
			} else if (
				[
					"street_number",
					"route",
					"neighborhood",
					"political",
					"locality",
					"administrative_area_level_1",
					"administrative_area_level_2",
					"administrative_area_level_3",
					"administrative_area_level_4",
					"sublocality_level_1",
					"country",
					"postal_code",
				].includes(field.input.type)
			) {
				/* return (
				<LightInputField
					name={name}
					type={field.input.type}
					label={field.label}
					component={GooglePlacesAutocomplete}


					required={field.input.required}
					validate={validation}
					variant={text_fields_variant}
					{...inputProps}
				/>
			) */
			} else if (field?.input?.type === "dynamic") {
				inputProps.mode = ["defination", "generation"].includes(inputProps.mode) ? inputProps.mode : "defination"
				inputProps.blueprint = JSON.isJSON(inputProps.blueprint) ? inputProps.blueprint : {}
				if (String.isString(value)) {
					try {
						value = JSON.parse(value)
					} catch (e) {
						value = {}
					}
				}
				/* return (
				<LightInputField
					name={name}
					component={DynamicInput}
					label={field.label}


					disabled={restricted}
					variant={text_fields_variant}
					required={field.input.required}
					validate={validation}
					{...inputProps}
				/>
			) */
			}
			return ""
		},
		[values, state]
	)

	const renderField = useCallback(name => {
		const { fields, submitting } = getState()
		const field = fields[name]
		let restricted = submitting
		if (!submitting && field.restricted) {
			restricted = field.restricted.input
		}
		if (layout == "inline") {
			/*if (loading[name]) {
				return (
					<TableCell key={"field_" + name} >
						<Typography> {field.label}</Typography>
						<Skeleton variant="rect" width={"100%"} height={50} />
					</TableCell>
				);
			} else {
				return (
					<TableCell key={"field_" + name} >
						{renderFieldInput(name, field, restricted)}
					</TableCell>
				);
			}*/
			return <TableCell key={"field_" + name}>{renderFieldInput(name, field, restricted)}</TableCell>
		} else {
			return (
				<Grid item
					className={"p-0 m-0 px-1 py-1"}
					md={
						field.input.size
							? inputColumnSize < 12 && field.input.size < inputColumnSize
								? inputColumnSize
								: field.input.size
							: inputColumnSize
					}
					style={field.input?.type === "hidden" ? { display: "none" } : {}}
					key={"field_" + name}
				>
					{renderFieldInput(name, field, restricted)}
				</Grid>
			)
		}
	}, [])

	const handleResetForm = useCallback(() => {}, [])

	useDidMount(() => {
		prepareForForm()
	})

	useDidUpdate(() => {
		prepareForForm()
	}, [record, defination])

	useDidUpdate(() => {
		// applyChangeEffects()
	}, [values])



	return (
		<form
			className={` ${className}`}
			id={id ? id : `${defination?.name}-form`}
			autoComplete="off"
			onKeyDown={handleKeyPress}
			onSubmit={handleSubmit}
			ref={ref}
		>
			<Card elevation={0} className="p-0 bg-transparent">
				{show_title ? (
					<CardHeader
						avatar={
							<Avatar aria-label="Password" color={defination ? defination.color : colors.hex.default}>
								{record ? <EditIcon /> : <AddIcon />}
							</Avatar>
						}
						title={defination ? UtilitiesHelper.singularize(defination.label) : "Record"}
						subheader={record ? "Update " : "New "}
					/>
				) : (
					""
				)}

				<CardContent className="m-0 p-0 py-4 flex flex-row">
				<Grid container className="m-0 p-0 flex-1">
					<ErrorMessage />
				</Grid>

					{layout == "normal" && (
						<Grid container className="m-0 p-0 flex-1">
							{Object.keys(state.fields).map((column_name, column_index) =>
								Array.isArray(fields) && fields.length > 0
									? exclude
										? fields.includes(column_name)
											? ""
											: renderField(column_name)
										: fields.includes(column_name)
										? renderField(column_name)
										: ""
									: renderField(column_name)
							)}
						</Grid>
					)}

					{layout == "inline" && (
						<Grid container className="m-0 p-0">
							<Grid item  xs={12}>
								<Table className="w-full ">
									<TableBody>
										<TableRow>
											{Object.keys(state.fields).map((column_name, column_index) => {
												return (Array.isArray(fields) ? fields.includes(column_name) : true) &&
													(Array.isArray(exclude) ? !exclude.includes(column_name) : exclude ? false : true)
													? renderField(column_name)
													: ""
											})}
										</TableRow>
									</TableBody>
								</Table>
							</Grid>
						</Grid>
					)}
					{!!SidebarComponent && <SidebarComponent values={values} />}
				</CardContent>

				{(show_discard || show_submit) && Object.keys(state.fields).length > 0 && (
					<CardActions>
						<Grid container className="m-0 p-0">
							{show_discard && (
								<Grid item
									xs={12}
									md={6}
									className="flex flex-row items-center justify-center md:items-start md:justify-start"
								>
									{!DiscardBtn && (
										<Button className="sm:w-full md:w-auto" variant="text" outlined onClick={handleResetForm}>
											{" "}
											Discard changes{" "}
										</Button>
									)}
									{DiscardBtn && (
										<DiscardBtn
											className="sm:w-full md:w-auto"
											variant="text"
											outlined
											onClick={handleResetForm}
											{...(discardBtnProps ? discardBtnProps : {})}
										/>
									)}
								</Grid>
							)}

							{show_submit && (
								<Grid item
									xs={12}
									md={show_discard ? 6 : 12}
									className="flex flex-row items-center justify-center md:items-end md:justify-end"
								>
									{!SubmitBtn && (
										<Button type="submit" className="sm:w-full md:w-auto" color="primary" outlined>
											{" "}
											{submit_btn_text ? submit_btn_text : "Save Changes"}{" "}
										</Button>
									)}
									{SubmitBtn && (
										<SubmitBtn
											type="submit"
											className="sm:w-full md:w-auto"
											color="primary"
											outlined
											{...(submitBtnProps ? submitBtnProps : {})}
										/>
									)}
								</Grid>
							)}
						</Grid>
					</CardActions>
				)}
			</Card>
		</form>
	)
})

BaseForm.defaultProps = {
	text_fields_variant: "filled",
	layout: "normal",
	exclude: false,
	show_title: true,
	show_submit: true,
	show_discard: true,
	validation: true,
	inputColumnSize: 12,
}

BaseForm.propTypes = {
	className: PropTypes.string,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any,
	record: PropTypes.string,
	text_fields_variant: PropTypes.string,
	inputColumnSize: PropTypes.number,
	layout: PropTypes.string,
	layoutProps: PropTypes.object,
	textFieldsProps: PropTypes.object,
	textareaFieldsProps: PropTypes.object,
	selectFieldsProps: PropTypes.object,
	validation: PropTypes.bool,
	show_title: PropTypes.bool,
	show_submit: PropTypes.bool,
	show_discard: PropTypes.bool,
	submit_btn_text: PropTypes.string,
	SubmitBtn: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
	submitBtnProps: PropTypes.object,
	DiscardBtn: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
	discardBtnProps: PropTypes.object,
	onSubmit: PropTypes.func,
	onSubmitSuccess: PropTypes.func,
	onValuesChange: PropTypes.func,
	onSubmitSuccessMessage: PropTypes.string,
	fields: PropTypes.array,
	exclude: PropTypes.bool,
	wrapper: PropTypes.node,
}

export default React.memo(BaseForm)
