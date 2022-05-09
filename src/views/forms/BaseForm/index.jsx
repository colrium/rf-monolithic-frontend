/** @format */
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { Snackbar } from "@mui/material";

import { Add as AddIcon, EditOutlined as EditIcon } from "@mui/icons-material";
import {
	TextInput,
	DateInput,
	DateTimeInput,
	RadioInput,
	WysiwygInput,
	CheckboxInput,
	SliderInput,
	TranferListInput,
	MultiSelectInput,
	SelectInput,
	FileInput,
	MapInput,
	DynamicInput,
	GooglePlacesAutocomplete,
} from "components/FormInputs";
import { colors } from "assets/jss/app-theme";
// Externals
import classNames from "classnames";
import Avatar from "components/Avatar";
import Button from "components/Button";
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import PropTypes from "prop-types";
import ApiService from "services/Api";
import * as definations from "definations";
//
//Redux imports
import { change, reduxForm, reset } from "redux-form";
//
import { withNetworkServices } from "contexts/NetworkServices"

//
import { ServiceDataHelper, UtilitiesHelper } from "utils/Helpers"

const LightInputField = props => {
	const { component: InputComponent, ...rest } = props
	return <InputComponent {...rest} />
}

class BaseForm extends React.Component {
	state = {
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
		openSnackBar: false,
		snackbarMessage: "",
		snackbarColor: "success",
	}

	constructor(props) {
		super(props)
		//

		const { defination, record } = props
		this.creatingNew = record ? false : true
		this.defination = defination
		this.ref_input_types = ["select", "transferlist", "multiselect", "radio", "checkbox", "dynamic"]

		this.handleChange = this.handleChange.bind(this)
		this.setFieldValue = this.setFieldValue.bind(this)
		this.unSetFieldValue = this.unSetFieldValue.bind(this)
		this.onCloseSnackbar = this.onCloseSnackbar.bind(this)
		this.applyChangeEffects = this.applyChangeEffects.bind(this)
		this.callDefinationMethod = this.callDefinationMethod.bind(this)

		this.handleResetForm = this.handleResetForm.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.mounted = false
		this.prepareForForm()
	}

	componentDidMount() {
		this.mounted = true
	}

	componentWillUnmount() {
		this.mounted = false
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		this.mounted = false
		return {
			preparationRequired: !Object.areEqual(prevProps.defination, this.props.defination),
			applyChangeEffectsRequired: !Object.areEqual(prevState.field_values, this.state.field_values),
			loadPossibilitesRequired: Object.size(this.state.onChangeEffectsFields) > 0,
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true

		if (snapshot.preparationRequired) {
			this.prepareForForm()
			this.loadFieldValuePosibilities()
		}
		if (snapshot.applyChangeEffectsRequired) {
			this.applyChangeEffects()
		}
		if (snapshot.loadPossibilitesRequired) {
			this.loadFieldValuePosibilities()
		}
	}

	prepareForForm() {
		const { defination, initialValues, initialize, exclude, record, fields, form_state, auth, change, onValuesChange } = this.props
		this.defination = defination

		let field_values = {}
		let initializeRedux = true

		if (form_state) {
			if (JSON.isJSON(form_state.values)) {
				field_values = form_state.values
				initializeRedux = false
				if (Function.isFunction(onValuesChange)) {
					let labels = {}
					for (let key of Object.keys(field_values)) {
						if (key in this.state.value_possibilities) {
							labels[key] = this.state.value_possibilities[key][field_values[key]]
						} else if (key in defination.scope.columns) {
							labels[key] = field_values[key]
						}
					}
					onValuesChange(field_values, labels)
				}
			}
		} else if (JSON.isJSON(initialValues) && Object.size(initialValues) > 0) {
			field_values = initialValues
		}
		this.state.field_values = field_values

		//const { evaluatedFields, onChangeEffects } = this.evaluateFields();
		this.evaluateFields().then(({ evaluatedFields, onChangeEffects }) => {
			let arrangedFields = { unpositioned: {} }

			for (let [name, properties] of Object.entries(evaluatedFields)) {
				if ((Array.isArray(fields) && fields.includes(name) && !exclude) || (!Array.isArray(fields) && !exclude)) {
					if (this.creatingNew && (properties.input.default || properties.input.value) && !(name in field_values)) {
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

			if (initializeRedux) {
				initialize(field_values)
			}

			/*for (let [name, properties] of Object.entries(evaluatedFields)) {
				if (properties.input.position) {
					if (properties.input.position) {
						if (!(properties.input.position in arrangedFields)) {
							arrangedFields[properties.input.position] = {};
						}
						arrangedFields[properties.input.position][name] = properties;
					}
					else {
						arrangedFields.unpositioned[name] = properties;
					}
				}
			}*/

			/* if (Object.size(field_values) === 0) {
				for (const [name, properties] of Object.entries(evaluatedFields)) {
					if (Array.isArray(fields)) {
						if ((exclude && fields.includes(name)) || !fields.includes(name)) {
							continue;
						}
					}
					if ((name in field_values) && properties.input.default) {
						field_values[name] = properties.input.default;
					}
				}
			} */

			this.setState(
				{
					record: record,
					fields: evaluatedFields,
					arrangedFields: arrangedFields,
					onChangeEffects: onChangeEffects,
					evaluating: false,
				},
				() => {
					this.loadFieldValuePosibilities()
				}
			)
			//this.state = { ...this.state, record: record, fields: evaluatedFields, arrangedFields: arrangedFields, onChangeEffects: onChangeEffects, evaluating: false };
		})
	}

	async applyChangeEffects(mounted = true) {
		const { initialize } = this.props
		const instance = this
		let onChangeEffectsFields = {}
		let fields = JSON.parse(JSON.stringify(this.state.fields))
		let field_values = this.state.field_values
		let value_possibilities = this.state.value_possibilities
		let fieldValuesChanged = false
		for (const [name, onChangeEffect] of Object.entries(this.state.onChangeEffects)) {
			if (Function.isFunction(onChangeEffect)) {
				const field = await onChangeEffect(instance)
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
			initialize(field_values)
		}

		if (Object.size(onChangeEffectsFields) > 0) {
			if (mounted) {
				this.setState({
					fields: fields,
					field_values: field_values,
					value_possibilities: value_possibilities,
					onChangeEffectsFields: onChangeEffectsFields,
					evaluating: false,
				})
			} else {
				this.state.fields = fields
				this.state.field_values = field_values
				this.state.value_possibilities = value_possibilities
				this.state.onChangeEffectsFields = onChangeEffectsFields
				this.state.evaluating = false
			}
		}
	}

	loadFieldValuePosibilities() {
		const { auth, fields, exclude, defination } = this.props
		let fields_to_load = {}
		let loading_fields = {}
		let value_possibilities = {}
		if (Object.size(this.state.onChangeEffectsFields) > 0) {
			for (let [effect_field_name, effect_field_properties] of Object.entries(this.state.onChangeEffectsFields)) {
				/* if (!(effect_field_properties.input.type in this.ref_input_types)) {
					continue;
				} */
				if (JSON.isJSON(effect_field_properties.reference) && !this.state.loading[effect_field_name]) {
					fields_to_load[effect_field_name] = effect_field_properties
					loading_fields[effect_field_name] = true
				} else if (
					(JSON.isJSON(effect_field_properties.possibilities) && !(effect_field_name in this.state.value_possibilities)) ||
					!Object.areEqual(this.state.value_possibilities[effect_field_name], effect_field_properties.possibilities)
				) {
					value_possibilities[effect_field_name] = effect_field_properties.possibilities
				} else if (Array.isArray(effect_field_properties.possibilities) && !(effect_field_name in this.state.value_possibilities)) {
					let possibilities = {}
					for (var i = 0; i < effect_field_properties.possibilities.length; i++) {
						possibilities[effect_field_properties.possibilities[i]] = effect_field_properties.possibilities[i]
					}
					value_possibilities[effect_field_name] = possibilities
				}
			}
		} else {
			for (let [field_name, field_properties] of Object.entries(this.state.fields)) {
				/* if (!(field_properties.input.type in this.ref_input_types)) {
					continue;
				} */
				if (JSON.isJSON(field_properties.reference) && !this.state.loading[field_name]) {
					if (!(field_name in this.state.value_possibilities)) {
						fields_to_load[field_name] = field_properties
						loading_fields[field_name] = true
					}
				} else if (
					(JSON.isJSON(field_properties.possibilities) && !(field_name in this.state.value_possibilities)) ||
					!Object.areEqual(this.state.value_possibilities[field_name], field_properties.possibilities)
				) {
					value_possibilities[field_name] = field_properties.possibilities
				} else if (Array.isArray(field_properties.possibilities) && !(field_name in this.state.value_possibilities)) {
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

			this.state.value_possibilities = { ...this.state.value_possibilities, ...value_possibilities }
		}

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
						let service = definations[service_key] ? ApiService.getContextRequests(definations[service_key]?.endpoint) : false

						let execute_service_call =
							service &&
							service_query &&
							this.state.last_field_changed !== name &&
							this.ref_input_types.includes(field.input.type)

						if (execute_service_call) {
							this.setState(prevState => ({ loading: { ...prevState.loading, [name]: true } }))
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
									if (this.mounted) {
										this.setState(state => ({
											value_possibilities: {
												...state.value_possibilities,
												[name]: possibilities,
											},
											loading: { ...state.loading, [name]: false },
										}))
									} else {
										this.state.value_possibilities = { ...this.state.value_possibilities, [name]: possibilities }
										this.state.loading = { ...this.state.loading, [name]: false }
									}
								})
								.catch(err => {
									if (this.mounted) {
										this.setState(state => ({
											loading: { ...state.loading, [name]: false },
											openSnackBar: true,
											snackbarMessage: "Error fetching " + field.label + " ::: " + err.msg,
											snackbarColor: "warning",
										}))
									} else {
										this.state.loading = { ...this.state.loading, [name]: false }
										this.state.openSnackBar = true
										this.state.snackbarMessage = "Error fetching " + field.label + " ::: " + err.msg
										this.state.snackbarColor = "warning"
									}
								})
						}
					}
				}
			}
			this.setState({ onChangeEffectsFields: {} })
		}
	}

	async evaluateFields() {
		const that = this
		const columns = that.defination.scope.columns
		let fields = {}
		let onChangeEffects = {}
		for (const [name, properties] of Object.entries(columns)) {
			// Define onChange effects

			//Evaluate value
			let field = JSON.parse(JSON.stringify(properties))

			if (properties.input.default) {
				if (Function.isFunction(properties.input.default)) {
					field.input.default = await that.callDefinationMethod(properties.input.default)
				} else {
					field.input.default = properties.input.default
				}
			}

			if (Function.isFunction(properties.label)) {
				field.label = await that.callDefinationMethod(properties.label)
			}
			if (Function.isFunction(properties.input.type)) {
				field.input.type = await that.callDefinationMethod(properties.input.type)
			}

			if (Function.isFunction(properties.input.default)) {
				field.input.value = await that.callDefinationMethod(properties.input.default)
			}

			if (Function.isFunction(properties.input.value)) {
				field.input.value = await that.callDefinationMethod(properties.input.value)
			}

			if (Function.isFunction(properties.input.required)) {
				field.input.required = await that.callDefinationMethod(properties.input.required)
			}
			if (Function.isFunction(properties.input.props)) {
				field.input.props = await that.callDefinationMethod(properties.input.props)
			}

			if (properties.restricted) {
				if (Function.isFunction(properties.restricted.input)) {
					field.restricted.input = await that.callDefinationMethod(properties.restricted.input)
				} else if (Boolean.isBoolean(properties.restricted.input)) {
					field.restricted.input = properties.restricted.input
				}
			}
			if (properties.reference) {
				if (Function.isFunction(properties.reference)) {
					field.reference = await that.callDefinationMethod(properties.reference)
					if (JSON.isJSON(field.reference)) {
						if (Function.isFunction(field.reference.name)) {
							field.reference.name = await that.callDefinationMethod(field.reference.name)
						}
						if (Function.isFunction(field.reference.resolves)) {
							field.reference.resolves = await that.callDefinationMethod(field.reference.resolves)
						}
						if (Function.isFunction(field.reference.service_query)) {
							field.reference.service_query = await that.callDefinationMethod(field.reference.service_query)
						}
					} else {
						delete field.reference
					}
				} else {
					if (Function.isFunction(properties.reference.name)) {
						field.reference.name = await that.callDefinationMethod(properties.reference.name)
					} else {
						field.reference.name = properties.reference.name
					}
					if (Function.isFunction(properties.reference.resolves)) {
						field.reference.resolves = await that.callDefinationMethod(properties.reference.resolves)
					} else {
						field.reference.resolves = properties.reference.resolves
					}
					if (Function.isFunction(properties.reference.service_query)) {
						field.reference.service_query = await that.callDefinationMethod(properties.reference.service_query)
					} else {
						field.reference.service_query = properties.reference.service_query
					}
				}
			}
			if (properties.possibilities) {
				if (Function.isFunction(properties.possibilities)) {
					field.possibilities = await that.callDefinationMethod(properties.possibilities)
				}
			}

			fields[name] = field

			onChangeEffects[name] = async instance => {
				let field_with_effects = JSON.parse(JSON.stringify(properties))
				if (properties.input.default) {
					if (Function.isFunction(properties.input.default)) {
						field_with_effects.input.default = await instance.callDefinationMethod(properties.input.default)
					}
				}

				if (Function.isFunction(properties.label)) {
					field_with_effects.label = await instance.callDefinationMethod(properties.label)
				}
				if (Function.isFunction(properties.input.type)) {
					field_with_effects.input.type = await instance.callDefinationMethod(properties.input.type)
				}
				if (Function.isFunction(properties.input.disabled)) {
					field_with_effects.input.disabled = await instance.callDefinationMethod(properties.input.disabled)
				}
				if (Function.isFunction(properties.input.default)) {
					field_with_effects.input.default = await instance.callDefinationMethod(properties.input.default)
				}
				if (Function.isFunction(properties.input.value)) {
					field_with_effects.input.value = await instance.callDefinationMethod(properties.input.value)
				}
				if (Function.isFunction(properties.input.required)) {
					field_with_effects.input.required = await instance.callDefinationMethod(properties.input.required)
				}
				if (Function.isFunction(properties.input.props)) {
					field_with_effects.input.props = await instance.callDefinationMethod(properties.input.props)
				}

				if (properties.restricted) {
					if (Function.isFunction(properties.restricted.input)) {
						field_with_effects.restricted.input = await instance.callDefinationMethod(properties.restricted.input)
					} else if (Boolean.isBoolean(properties.restricted.input)) {
						field_with_effects.restricted.input = properties.restricted.input
					} else {
						field_with_effects.restricted.input = false
					}
				}

				if (properties.reference) {
					//field_with_effects.reference = properties.reference;
					if (Function.isFunction(properties.reference)) {
						field_with_effects.reference = await instance.callDefinationMethod(properties.reference)
						if (JSON.isJSON(field_with_effects.reference)) {
							if (Function.isFunction(field_with_effects.reference.name)) {
								field_with_effects.reference.name = await instance.callDefinationMethod(field_with_effects.reference.name)
							}
							if (Function.isFunction(field_with_effects.reference.resolves)) {
								field_with_effects.reference.resolves = await instance.callDefinationMethod(
									field_with_effects.reference.resolves
								)
							}
							if (Function.isFunction(field_with_effects.reference.service_query)) {
								field_with_effects.reference.service_query = await instance.callDefinationMethod(
									field_with_effects.reference.service_query
								)
							}
						} else {
							delete field_with_effects.reference
						}
					} else {
						if (Function.isFunction(properties.reference.name)) {
							field_with_effects.reference.name = await instance.callDefinationMethod(properties.reference.name)
						} else {
							field_with_effects.reference.name = properties.reference.name
						}
						if (Function.isFunction(properties.reference.resolves)) {
							field_with_effects.reference.resolves = await instance.callDefinationMethod(properties.reference.resolves)
						} else {
							field_with_effects.reference.resolves = properties.reference.resolves
						}
						if (Function.isFunction(properties.reference.service_query)) {
							field_with_effects.reference.service_query = await instance.callDefinationMethod(
								properties.reference.service_query
							)
						} else {
							field_with_effects.reference.service_query = properties.reference.service_query
						}
					}
				}
				if (properties.possibilities) {
					if (Function.isFunction(properties.possibilities)) {
						field_with_effects.possibilities = await instance.callDefinationMethod(properties.possibilities)
					}
				}

				if (!Object.areEqual(instance.state.fields[name], field_with_effects)) {
					return field_with_effects
				} else {
					return false
				}
			}
		}
		return { evaluatedFields: fields, onChangeEffects: onChangeEffects }
	}

	unSetFieldValue(name) {
		const { change, onValuesChange } = this.props
		if (JSON.isJSON(this.state.field_values)) {
			let values = JSON.parse(JSON.stringify(this.state.field_values))
			if (name in values) {
				delete values[name]
				if (!JSON.isJSON(values)) {
					values = {}
				}
				this.setState({ field_values: values }, () => {
					change(name, null)
					if (Function.isFunction(onValuesChange)) {
						let labels = {}
						for (let key of Object.keys(values)) {
							if (key in this.state.value_possibilities && key !== name) {
								labels[key] = this.state.value_possibilities[key][values[key]]
							}
						}
						onValuesChange(values, labels)
					}
				})
			}
		}
	}

	setFieldValue(name, value) {
		const { change, onValuesChange } = this.props
		change(name, value)
		let values = JSON.parse(JSON.stringify(this.state.field_values))
		if (!JSON.isJSON(values)) {
			values = {}
		}
		values[name] = value

		this.setState(
			{
				field_values: values,
				last_field_changed: name,
			},
			() => {
				if (Function.isFunction(onValuesChange)) {
					let labels = {}
					for (let key of Object.keys(values)) {
						if (key in this.state.value_possibilities) {
							labels[key] = this.state.value_possibilities[key][values[key]]
						}
					}
					onValuesChange(values, labels)
				}
			}
		)
	}

	handleChange =
		name =>
		(value, event = null) => {
			this.setFieldValue(name, value)
		}

	onCloseSnackbar() {
		this.setState({
			openSnackBar: false,
		})
	}

	handleResetForm() {
		const { reset, form, initialValues } = this.props
		this.setState(state => ({ field_values: JSON.isJSON(initialValues) ? initialValues : {} }))
		if (Function.isFunction(reset) && String.isString(form)) {
			reset(form)
		}
	}

	handleKeyPress(event) {
		if ((event.key === "s" || event.key === "S") && event.ctrlKey) {
			event.preventDefault()
			this.handleSubmit(event)
			//
		}
	}

	async callDefinationMethod(method) {
		const { auth, form_state, initialValues } = this.props
		let field_values = {}
		let method_data = null
		if (method.length === 0) {
			method_data = method()
		} else if (method.length === 1) {
			method_data = method(this)
		} else if (method.length === 2) {
			method_data = method(this.state.field_values, auth.user)
		} else if (method.length === 3) {
			method_data = method(this.state.field_values, auth.user, this)
		}
		return Promise.all([method_data])
			.then(data => {
				return method_data
			})
			.catch(err => {})
	}

	renderFieldInput(name, field, restricted = false) {
		const {
			auth,
			form_state,
			record,
			initialValues,
			change,
			text_fields_variant,
			validation,
			layout,
			textFieldsProps,
			selectFieldsProps,
			textareaFieldsProps,
		} = this.props
		let that = this

		let field_values = { ...this.state.default_field_values, ...this.state.field_values }

		//Evaluate value
		let value = undefined
		if (name in field_values) {
			value = field_values[name]
		}

		let inputProps = {}
		if (field.input.props) {
			inputProps = field.input.props
		}

		if (field.input.type === "radio") {
			if (layout == "inline") {
				return (
					<LightInputField
						name={name}
						component={SelectInput}
						disabled={restricted}
						value={value}
						validate={validation}
						variant={text_fields_variant}
						required={validation && field.input.required}
						disabled={restricted}
						margin="dense"
						onChange={this.handleChange(name)}
						options={this.state.value_possibilities[name] ? this.state.value_possibilities[name] : {}}
						placeholder={"Select " + field.label.singularize()}
						validate={validation}
						size="small"
						{...inputProps}
					/>
				)
			} else {
				return (
					<LightInputField
						name={name}
						component={RadioInput}
						label={field.label}
						defaultValue={value}
						onChange={this.handleChange(name)}
						required={field.input.required}
						disabled={restricted}
						options={this.state.value_possibilities[name] ? this.state.value_possibilities[name] : {}}
						validate={validation}
						{...inputProps}
					/>
				)
			}

			return ""
		} else if (field.input.type === "select") {
			return (
				<LightInputField
					name={name}
					component={SelectInput}
					disabled={restricted}
					value={value}
					onChange={this.handleChange(name)}
					options={this.state.value_possibilities[name] ? this.state.value_possibilities[name] : {}}
					placeholder={"Select " + field.label.singularize()}
					validate={true}
					variant={text_fields_variant}
					required={validation && field.input.required}
					disabled={restricted}
					label={field.label}
					loading={this.state.loading[name]}
					size="small"
					{...selectFieldsProps}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "multiselect") {
			value = Array.isArray(value) ? value : []

			return (
				<LightInputField
					name={name}
					component={MultiSelectInput}
					disabled={restricted}
					value={value}
					label={field.label}
					onChange={this.handleChange(name)}
					options={this.state.value_possibilities[name] ? this.state.value_possibilities[name] : {}}
					placeholder={"Select " + field.label}
					required={validation && field.input.required}
					disabled={restricted}
					variant={text_fields_variant}
					isMulti
					validate={validation}
					loading={this.state.loading[name]}
					{...selectFieldsProps}
					{...inputProps}
				/>
			)

			return ""
		} else if (field.input.type === "transferlist") {
			if (this.state.value_possibilities[name]) {
				return (
					<LightInputField
						name={name}
						component={TranferListInput}
						label={field.label}
						defaultValue={value}
						onChange={this.handleChange(name)}
						value_options={this.state.value_possibilities[name]}
						validate={validation}
						{...inputProps}
					/>
				)
			}
			return ""
		} else if (["email", "number", "phone", "text", "password"].includes(field.input.type)) {
			return (
				<LightInputField
					name={name}
					type={field.input.type}
					disabled={restricted}
					component={TextInput}
					defaultValue={value}
					label={field.label}
					variant={text_fields_variant}
					onChange={this.handleChange(name)}
					required={field.input.required}
					fullWidth
					validate={validation}
					{...textFieldsProps}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "textarea") {
			return (
				<LightInputField
					name={name}
					disabled={restricted}
					component={TextInput}
					label={field.label}
					variant={text_fields_variant}
					multiline
					rows={4}
					defaultValue={value}
					onChange={this.handleChange(name)}
					required={field.input.required}
					fullWidth
					validate={validation}
					{...textareaFieldsProps}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "wysiwyg") {
			return (
				<LightInputField
					name={name}
					disabled={restricted}
					component={WysiwygInput}
					label={field.label}
					variant={text_fields_variant}
					defaultValue={value}
					onChange={this.handleChange(name)}
					required={field.input.required}
					fullWidth
					validate={validation}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "date") {
			return (
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
					value={value}
					onChange={this.handleChange(name)}
					required={field.input.required}
					inputVariant={text_fields_variant}
					format="DD/MM/YYYY"
					color="primary"
					{...inputProps}
					validate={validation}
				/>
			)
		} else if (field.input.type === "datetime") {
			return (
				<LightInputField
					name={name}
					label={field.label}
					disabled={restricted}
					component={DateTimeInput}
					autoOk
					variant="inline"
					inputVariant={text_fields_variant}
					value={value}
					onChange={this.handleChange(name)}
					required={field.input.required}
					validate={validation}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "checkbox") {
			return (
				<LightInputField
					name={name}
					disabled={restricted}
					checked={value}
					value={value}
					component={CheckboxInput}
					label={field.label}
					onChange={this.handleChange(name)}
					required={field.input.required}
					validate={validation}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "slider") {
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

			if (this.state.value_possibilities[name]) {
				for (let [possibility_value, possibility_label] of Object.entries(this.state.value_possibilities[name])) {
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
				return (
					<LightInputField
						name={name}
						label={field.label}
						component={SliderInput}
						marks
						min={min_value}
						max={max_value}
						step={step_value}
						defaultValue={default_value}
						onChange={this.handleChange(name)}
						validate={validation}
						{...inputProps}
					/>
				)
			}
			return ""
		} else if (field.input.type === "file") {
			let acceptedFiles = ["image/*", "video/*", "audio/*", "application/*"]
			let defaultInputProps = {
				maxFileSize: 300000000,
				upload: true,
				filesLimit: Array.isArray(field.type) ? 20 : 1,
			}

			inputProps = { ...defaultInputProps, ...inputProps }
			return (
				<LightInputField
					name={name}
					label={field.label}
					component={FileInput}
					value={value}
					onChange={this.handleChange(name)}
					required={field.input.required}
					validate={validation}
					variant={text_fields_variant}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "map") {
			return (
				<LightInputField
					name={name}
					label={field.label}
					component={MapInput}
					value={value}
					onChange={this.handleChange(name)}
					required={field.input.required}
					validate={validation}
					{...inputProps}
				/>
			)
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
			return (
				<LightInputField
					name={name}
					type={field.input.type}
					label={field.label}
					component={GooglePlacesAutocomplete}
					value={value}
					onChange={this.handleChange(name)}
					required={field.input.required}
					validate={validation}
					variant={text_fields_variant}
					{...inputProps}
				/>
			)
		} else if (field.input.type === "dynamic") {
			inputProps.mode = ["defination", "generation"].includes(inputProps.mode) ? inputProps.mode : "defination"
			inputProps.blueprint = JSON.isJSON(inputProps.blueprint) ? inputProps.blueprint : {}
			if (String.isString(value)) {
				try {
					value = JSON.parse(value)
				} catch (e) {
					value = {}
				}
			}
			return (
				<LightInputField
					name={name}
					component={DynamicInput}
					label={field.label}
					value={value}
					onChange={this.handleChange(name)}
					disabled={restricted}
					variant={text_fields_variant}
					required={field.input.required}
					validate={validation}
					{...inputProps}
				/>
			)
		}
	}

	renderField(name) {
		const { layout, inputColumnSize } = this.props
		const field = this.state.fields[name]
		let restricted = this.state.submitting
		if (!this.state.submitting && field.restricted) {
			restricted = field.restricted.input
		}
		if (layout == "inline") {
			/*if (this.state.loading[name]) {
				return (
					<TableCell key={"field_" + name} >
						<Typography> {field.label}</Typography>
						<Skeleton variant="rect" width={"100%"} height={50} />
					</TableCell>
				);
			} else {
				return (
					<TableCell key={"field_" + name} >
						{this.renderFieldInput(name, field, restricted)}
					</TableCell>
				);
			}*/
			return <TableCell key={"field_" + name}>{this.renderFieldInput(name, field, restricted)}</TableCell>
		} else {
			return (
				<GridItem
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
					{this.renderFieldInput(name, field, restricted)}
				</GridItem>
			)
		}
	}

	async handleSubmit(event) {
		event.preventDefault()
		const submit_event = event
		const { defination, record, fields, exclude, onSubmit, onSubmitSuccess, onSubmitSuccessMessage } = this.props

		let form_data = this.state.field_values && typeof this.state.field_values === "object" ? this.state.field_values : {}
		if (onSubmit) {
			this.setState(state => ({ submitting: true }))
		}
		let service = defination ? ApiService.getContextRequests(defination?.endpoint) : false
		if (onSubmit) {
			let submit_callback = onSubmit(form_data, submit_event)
			Promise.all([submit_callback])
				.then(res => {
					this.setState({
						openSnackBar: true,
						snackbarMessage: onSubmitSuccessMessage
							? onSubmitSuccessMessage
							: UtilitiesHelper.singularize(this.defination.label) + " changes saved",
						snackbarColor: "success",
						submitting: false,
					})
					if (Function.isFunction(onSubmitSuccess)) {
						onSubmitSuccess(res)
					}
				})
				.catch(err => {
					this.setState({
						openSnackBar: true,
						snackbarMessage: typeof err.msg === "object" ? JSON.stringify(err.msg) : err.msg,
						snackbarColor: "error",
						submitting: false,
					})
				})
		} else if (service) {
			//
			if (record) {
				service
					.update(record, form_data)
					.then(response => {
						this.setState({
							openSnackBar: true,
							snackbarMessage: onSubmitSuccessMessage
								? onSubmitSuccessMessage
								: UtilitiesHelper.singularize(this.defination.label) + " changes saved",
							snackbarColor: "success",
							submitting: false,
						})
						if (Function.isFunction(onSubmitSuccess)) {
							onSubmitSuccess(response.body.data)
						}
					})
					.catch(err => {
						this.setState({
							openSnackBar: true,
							snackbarMessage: typeof err.msg === "object" ? JSON.stringify(err.msg) : err.msg,
							snackbarColor: "error",
							submitting: false,
						})
					})
			} else {
				service
					.create(form_data)
					.then(response => {
						this.setState({
							openSnackBar: true,
							snackbarMessage: onSubmitSuccessMessage
								? onSubmitSuccessMessage
								: "New " + UtilitiesHelper.singularize(this.defination.label) + " added",
							snackbarColor: "success",
							submitting: false,
						})
						if (Function.isFunction(onSubmitSuccess)) {
							onSubmitSuccess(response.body.data)
						}
					})
					.catch(err => {
						this.setState({
							openSnackBar: true,
							snackbarMessage: typeof err.msg === "object" ? JSON.stringify(err.msg) : err.msg,
							snackbarColor: "error",
							submitting: false,
						})
					})
			}
		}
	}

	render() {
		const {
			className,
			defination,
			record,
			form,
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
			...rest
		} = this.props
		let formClasses = classNames({
			[`p-0`]: true,
			[className]: className,
			[`cursor-wait`]: this.state.submitting,
		})

		return (
			<form
				className={formClasses}
				id={form ? form : `${this.defination.name}-form`}
				autoComplete="off"
				onKeyDown={this.handleKeyPress}
				onSubmit={this.handleSubmit}
			>
				<Card elevation={0} className="p-0 bg-transparent">
					{show_title ? (
						<CardHeader
							avatar={
								<Avatar aria-label="Password" color={this.defination ? this.defination.color : colors.hex.default}>
									{record ? <EditIcon /> : <AddIcon />}
								</Avatar>
							}
							title={this.defination ? UtilitiesHelper.singularize(this.defination.label) : "Record"}
							subheader={record ? "Update " : "New "}
						/>
					) : (
						""
					)}

					<CardContent className="m-0 p-0 py-4">
						{layout == "normal" && (
							<GridContainer className="m-0 p-0">
								{Object.keys(this.state.fields).map((column_name, column_index) =>
									Array.isArray(fields) && fields.length > 0
										? exclude
											? fields.includes(column_name)
												? ""
												: this.renderField(column_name)
											: fields.includes(column_name)
											? this.renderField(column_name)
											: ""
										: this.renderField(column_name)
								)}
							</GridContainer>
						)}

						{layout == "inline" && (
							<GridContainer className="m-0 p-0">
								<GridItem xs={12}>
									<Table className="w-full ">
										<TableBody>
											<TableRow>
												{Object.keys(this.state.fields).map((column_name, column_index) => {
													return (Array.isArray(fields) ? fields.includes(column_name) : true) &&
														(Array.isArray(exclude) ? !exclude.includes(column_name) : exclude ? false : true)
														? this.renderField(column_name)
														: ""
												})}
											</TableRow>
										</TableBody>
									</Table>
								</GridItem>
							</GridContainer>
						)}
					</CardContent>

					{(show_discard || show_submit) && Object.keys(this.state.fields).length > 0 && (
						<CardActions>
							<GridContainer className="m-0 p-0">
								{show_discard && (
									<GridItem
										xs={12}
										md={6}
										className="flex flex-row items-center justify-center md:items-start md:justify-start"
									>
										{!DiscardBtn && (
											<Button className="sm:w-full md:w-auto" variant="text" outlined onClick={this.handleResetForm}>
												{" "}
												Discard changes{" "}
											</Button>
										)}
										{DiscardBtn && (
											<DiscardBtn
												className="sm:w-full md:w-auto"
												variant="text"
												outlined
												onClick={this.handleResetForm}
												{...(discardBtnProps ? discardBtnProps : {})}
											/>
										)}
									</GridItem>
								)}

								{show_submit && (
									<GridItem
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
									</GridItem>
								)}
							</GridContainer>
						</CardActions>
					)}
				</Card>

				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					open={this.state.openSnackBar}
					autoHideDuration={6000}
					onClose={this.onCloseSnackbar}
				>
					<SnackbarContent onClose={this.onCloseSnackbar} color={this.state.snackbarColor} message={this.state.snackbarMessage} />
				</Snackbar>
			</form>
		)
	}
}

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

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	form_state: state.form[ownProps.form],
})

export default withNetworkServices(compose(connect(mapStateToProps, { change, reset }))(reduxForm({ enableReinitialize: true })(BaseForm)))
