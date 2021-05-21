/** @format */

import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import PropTypes from "prop-types";
import React from "react";
import lodash from "lodash";
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import TablePagination from '@material-ui/core/TablePagination';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useTheme } from '@material-ui/core/styles';
import {TextInput} from "components/FormInputs";
import QueryBuilder from "components/QueryBuilder";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CalendarView from "./CalendarView";
import GoogleMapOverview from "views/widgets/Overview/GoogleMapOverview";
import ListView from "./ListView";
import Chip from '@material-ui/core/Chip';
import { withErrorHandler } from "hoc/ErrorHandler";
import { ServiceDataHelper } from "hoc/Helpers";
import ApiService from "services/Api";
import * as definations from "definations";
//
import styles from "./styles";
//
import TableView from "./TableView";


function TablePaginationActions(props) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onChangePage } = props;

	
	const handleFirstPageButtonClick = (event) => {
		onChangePage(event, 0);
	};

	const handleBackButtonClick = (event) => {
		onChangePage(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onChangePage(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<div className={"ml-2 flex-shrink-0"}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
				{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</div>
	);
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};


class ListingView extends React.Component {
	state = {
		defination: null,
		service: null,
		view: "tableview",
		views: {},
		showViewOptions: true,
		showAddBtn: true,
		searchKeyword: "",
		query: {},
		pages: 10,
		page: 1,
		viewMenuAnchorEl: null,
		sortFields: [],
		filterAccordionExpanded: false,
		filterableFields: {},
		filterContext: false,
		filterMenuAnchor: null,
		filters: {
			values: {},
			labels: {},
		},
		fields: {},
		loading: {},
		value_possibilities: {},
		queryBuilderProps: {value: { populate: true, config: {fields: {}}}}

	};
	mounted = false;
	searchkeywordRef = React.createRef();

	constructor(props) {
		super(props);

		const { defination, query, cache, app } = props;
		this.state.defination = defination;
		this.state.service = ApiService.getContextRequests(defination.endpoint);
		this.state.query = query ? { 
			...query, 
			p: 1, 
			pagination: ('rpp' in query? query['rpp'] : ('pagination' in query? query['pagination'] : app.preferences.data.pagination)), 
			page: ('pg' in query? query['pg'] : ('page' in query? query['page'] : 1)), 
		} : { 
			p: 1, 
			pagination: ('rpp' in query? query['rpp'] : ('pagination' in query? query['pagination'] : app.preferences.data.pagination)), 
			page: ('pg' in query? query['pg'] : ('page' in query? query['page'] : 1)), 
		};

		let filterableFields = {};
			let filterContext = false;
			let searchKeyword = "";
			Object.entries(defination.scope.columns).map(([column_name, column_props], cursor) => {
				if (!["file", "dynamic", "textarea", "password", "wysiwyg", "map", "file", "slider", "multiselect"].includes(column_props.input.type)) {
					filterableFields[column_name] = column_props;
				}
			});
			if (JSON.isJSON(query)) {
				let filterContextMatched = false;
				let filterableColumns = Object.keys(filterableFields);
				Object.entries(query).map(([queryColumn, queryValue]) => {
					if (!filterContextMatched && filterableColumns.includes(queryColumn)) {
						filterContext = queryColumn;
						searchKeyword = queryValue;
						if (String.isString(queryValue)) {
							searchKeyword = queryValue;
						}
						else{
							searchKeyword = String(queryValue);
						}
						filterContextMatched = true;
					}
				})

			}
		
		if (!filterContext && (query.q || query.query)) {
			if (query.q) {
				this.state.searchKeyword = query.q;
			}
			else {
				this.state.searchKeyword = query.query;
			}
		}
		else {
			this.state.searchKeyword = searchKeyword;
			this.state.filterContext = filterContext;
		}


		this.handleViewItemClick = this.handleViewItemClick.bind(this);
		this.handleOnPageChanged = this.handleOnPageChanged.bind(this);

		this.handleOnRecordsPerPageChanged = this.handleOnRecordsPerPageChanged.bind(this);
		this.handleOnQueryBuilderChange = this.handleOnQueryBuilderChange.bind(this);
	}

	

	componentDidMount() {
		this.mounted = true;
		this.prepareForRender();
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
        this.mounted = false;
        return {
			prepareForRenderRequired: !Object.areEqual(prevProps.query, this.props.query),
			loadQueryBuilderPropsRequired: !Object.areEqual(prevState.fields, this.state.fields) || !Object.areEqual(prevState.value_possibilities, this.state.value_possibilities),
			paramsChangeApplicationRequired: !Object.areEqual(prevState.query, this.state.query),
		};
    }


	shouldComponentUpdate(nextProps, nextState) {
        let shouldUpdate = !Object.areEqual(this.props, nextProps) || !Object.areEqual(this.state, nextState);
        return shouldUpdate;
    }

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true;
		if (snapshot.prepareForRenderRequired) {
			this.prepareForRender();
			this.loadFieldValuePosibilities();
		}
		if (snapshot.loadQueryBuilderPropsRequired) {
			this.setQueryBuilderProps();
		}
	}

	handleViewItemClick = name => event => {
		if (this.mounted) {
			this.setState({ view: name, viewMenuAnchorEl: null });
		} else {
			this.state.view = name;
			this.state.viewMenuAnchorEl = null;
		}
	};

	handleShowViewsMenu = event => {
		const viewMenuAnchorEl = event.currentTarget;
		if (this.mounted) {
			this.setState({ viewMenuAnchorEl: viewMenuAnchorEl });
		} else {
			this.state.viewMenuAnchorEl = viewMenuAnchorEl;
		}
	};

	handleCloseViewsMenu = () => {
		if (this.mounted) {
			this.setState({ viewMenuAnchorEl: null });
		} else {
			this.state.viewMenuAnchorEl = null;
		}
	};

	handleOnPageChanged = (event, page) => {
		this.setState(prevState => ({ 
				page: page+1,
				query: {
					...prevState.query,
					page: page+1
				},
				viewMenuAnchorEl: null
			}));
	};

	handleOnRecordsPerPageChanged = (event) => {
		const pagination = Number.parseNumber(event.target.value, this.state.query.pagination);
		this.setState(prevState => ({ 
				page: 1,
				query: {
					...prevState.query,
					pagination: pagination
				}
			}));
	};


	async prepareForRender() {
		const { defination, query, view, showViewOptions, showAddBtn, app } = this.props;
		if (defination) {
            let all_views = {
				tableview: "Table View",
				listview: "List View",
				googlemapview: "Map View",
				vectormapview: "Vector Map View",
				calendarview: "Calendar View",
			};
            let views = {};
            let default_view = "tableview";
            if (defination.views.listing.default in all_views) {
				default_view = defination.views.listing.default;
			}
            for (let [name, label] of Object.entries(all_views)) {
				if (name in defination.views.listing) {
					views[name] = label;
				}
			}
            let filterableFields = {};
            let filterContext = false;
            let searchKeyword = "";
            this.evaluateFields().then(({ evaluatedFields, onChangeEffects }) => {
				if (this.mounted) {
					this.setState({
						defination: defination,						
						service: ApiService.getContextRequests(defination.endpoint),
						fields: evaluatedFields, 
						onChangeEffects: onChangeEffects,
						query: query ? { 
							...query, 
							p: 1,
							pagination: ('rpp' in query? query['rpp'] : ('pagination' in query? query['pagination'] : app.preferences.data.pagination)), 
							page: ('pg' in query? query['pg'] : ('page' in query? query['page'] : 1)), 
						} : { 
							p: 1,
							pagination: ('rpp' in query? query['rpp'] : ('pagination' in query? query['pagination'] : app.preferences.data.pagination)), 
							page: ('pg' in query? query['pg'] : ('page' in query? query['page'] : 1)), 
						},
						views: views,
						view: view ? view : default_view,
						showViewOptions: showViewOptions,
						showAddBtn: showAddBtn,

					}, () =>{
						this.loadFieldValuePosibilities();
					});
				} 
				else {
					this.state = {
						...this.state,
						defination: defination,
						service: ApiService.getContextRequests(defination.endpoint),
						fields: evaluatedFields, 
						onChangeEffects: onChangeEffects,
						query: query ? { 
							...query, 
							p: 1,
							pagination: ('rpp' in query? query['rpp'] : ('pagination' in query? query['pagination'] : app.preferences.data.pagination)), 
							page: ('pg' in query? query['pg'] : ('page' in query? query['page'] : 1)), 
						} : { 
							p: 1,
							pagination: ('rpp' in query? query['rpp'] : ('pagination' in query? query['pagination'] : app.preferences.data.pagination)), 
							page: ('pg' in query? query['pg'] : ('page' in query? query['page'] : 1)), 
						},
						views: views,
						view: view ? view : default_view,
						showViewOptions: showViewOptions,
						showAddBtn: showAddBtn,
					};
					this.loadFieldValuePosibilities();
				}
				

			}).catch(err => {});
            
	            
        }
	}

	async callDefinationMethod(method) {
		const { auth } = this.props;
		let field_values = {};
		let method_data = null;
		if (method.length === 0) {
			method_data = method();
		}
		else if (method.length === 1) {
			method_data = method(this);
		}
		else if (method.length === 2) {
			method_data = method({}, auth.user);
		}
		else if (method.length === 3) {
			method_data = method({}, auth.user);
		}
		return Promise.all([method_data]).then(data => {
			return method_data;
		}).catch(err => { return method_data; });
	}

	async evaluateFields() {
		const { defination } = this.props;
		let fields = {};
		let onChangeEffects = {};
		if (defination) {
			const columns = defination.scope.columns;
			for (const [name, properties] of Object.entries(columns)) {
				// Define onChange effects

				//Evaluate value
				let field = JSON.parse(JSON.stringify(properties));

				if (properties.input.default) {
					if (Function.isFunction(properties.input.default)) {
						field.input.default = await this.callDefinationMethod(properties.input.default);
					} else {
						field.input.default = properties.input.default;
					}
				}

				if (Function.isFunction(properties.label)) {
					field.label = await this.callDefinationMethod(properties.label);
				}
				if (Function.isFunction(properties.input.type)) {
					field.input.type = await this.callDefinationMethod(properties.input.type);
				}

				if (Function.isFunction(properties.input.default)) {
					field.input.value = await this.callDefinationMethod(properties.input.default);
				}

				if (Function.isFunction(properties.input.value)) {
					field.input.value =  await this.callDefinationMethod(properties.input.value);
				}

				if (Function.isFunction(properties.input.required)) {
					field.input.required = await this.callDefinationMethod(properties.input.required);
				}
				if (Function.isFunction(properties.input.props)) {
					field.input.props = await this.callDefinationMethod(properties.input.props);
				}

				if (properties.restricted) {
					if (Function.isFunction(properties.restricted.input)) {
						field.restricted.input = await this.callDefinationMethod(properties.restricted.input);
					}
					else if (Boolean.isBoolean(properties.restricted.input)) {
						field.restricted.input = properties.restricted.input;
					}

				}
				if (properties.reference) {
					if (Function.isFunction(properties.reference)) {
							field.reference = await this.callDefinationMethod(properties.reference);
							if (JSON.isJSON(field.reference)) {
								if (Function.isFunction(field.reference.name)) {
									field.reference.name = await this.callDefinationMethod(field.reference.name);
								}
								if (Function.isFunction(field.reference.resolves)) {
									field.reference.resolves = await this.callDefinationMethod(field.reference.resolves);
								}
								if (Function.isFunction(field.reference.service_query)) {
									field.reference.service_query = await this.callDefinationMethod(field.reference.service_query);
								}
							}
							else{
								delete field.reference;
							}
								
					}
					else{
						if (Function.isFunction(properties.reference.name)) {
							field.reference.name = await this.callDefinationMethod(properties.reference.name);
						}
						else {
							field.reference.name = properties.reference.name;
						}
						if (Function.isFunction(properties.reference.resolves)) {
							field.reference.resolves = await this.callDefinationMethod(properties.reference.resolves);
						}
						else {
							field.reference.resolves = properties.reference.resolves;
						}
						if (Function.isFunction(properties.reference.service_query)) {
							field.reference.service_query = await this.callDefinationMethod(properties.reference.service_query);
						}
						else {
							field.reference.service_query = properties.reference.service_query;
						}
					}
							
						
				}
				if (properties.possibilities) {
					if (Function.isFunction(properties.possibilities)) {
						field.possibilities = await this.callDefinationMethod(properties.possibilities);
					}
				}

				fields[name] = field;

				onChangeEffects[name] = async (instance) => {
					let field_with_effects = JSON.parse(JSON.stringify(properties));
					if (properties.input.default) {
						if (Function.isFunction(properties.input.default)) {
							field_with_effects.input.default = await instance.callDefinationMethod(properties.input.default);
						}
					}

					if (Function.isFunction(properties.label)) {
						field_with_effects.label = await instance.callDefinationMethod(properties.label);
					}
					if (Function.isFunction(properties.input.type)) {
						field_with_effects.input.type = await instance.callDefinationMethod(properties.input.type);
					}
					if (Function.isFunction(properties.input.disabled)) {
						field_with_effects.input.disabled = await instance.callDefinationMethod(properties.input.disabled);
					}
					if (Function.isFunction(properties.input.default)) {
						field_with_effects.input.default = await instance.callDefinationMethod(properties.input.default);
					}
					if (Function.isFunction(properties.input.value)) {
						field_with_effects.input.value = await instance.callDefinationMethod(properties.input.value);
					}
					if (Function.isFunction(properties.input.required)) {
						field_with_effects.input.required = await instance.callDefinationMethod(properties.input.required);
					}
					if (Function.isFunction(properties.input.props)) {
						field_with_effects.input.props = await instance.callDefinationMethod(properties.input.props);
					}
					if (properties.restricted) {
						if (Function.isFunction(properties.restricted.input)) {
							field_with_effects.restricted.input = await instance.callDefinationMethod(properties.restricted.input);
						}
						else if (Boolean.isBoolean(properties.restricted.input)) {
							field_with_effects.restricted.input = properties.restricted.input;
						}
						else {
							field_with_effects.restricted.input = false;
						}
					}

					if (properties.reference) {
						//field_with_effects.reference = properties.reference;
						if (Function.isFunction(properties.reference)) {
							field_with_effects.reference = await instance.callDefinationMethod(properties.reference);
							if (JSON.isJSON(field_with_effects.reference)) {
								if (Function.isFunction(field_with_effects.reference.name)) {
									field_with_effects.reference.name = await instance.callDefinationMethod(field_with_effects.reference.name);
								}
								if (Function.isFunction(field_with_effects.reference.resolves)) {
									field_with_effects.reference.resolves = await instance.callDefinationMethod(field_with_effects.reference.resolves);
								}
								if (Function.isFunction(field_with_effects.reference.service_query)) {
									field_with_effects.reference.service_query = await instance.callDefinationMethod(field_with_effects.reference.service_query);
								}
							}
							else{
								delete field_with_effects.reference;
							}							
						}
						else{
							if (Function.isFunction(properties.reference.name)) {
								field_with_effects.reference.name = await instance.callDefinationMethod(properties.reference.name);
							}
							else {
								field_with_effects.reference.name = properties.reference.name;
							}
							if (Function.isFunction(properties.reference.resolves)) {
								field_with_effects.reference.resolves = await instance.callDefinationMethod(properties.reference.resolves);
							}
							else {
								field_with_effects.reference.resolves = properties.reference.resolves;
							}
							if (Function.isFunction(properties.reference.service_query)) {
								field_with_effects.reference.service_query = await instance.callDefinationMethod(properties.reference.service_query);
							}
							else {
								field_with_effects.reference.service_query = properties.reference.service_query;
							}
						}
							
					}
					if (properties.possibilities) {
						if (Function.isFunction(properties.possibilities)) {
							field_with_effects.possibilities = await instance.callDefinationMethod(properties.possibilities);
						}					
					}
					
					if (!Object.areEqual(instance.state.fields[name], field_with_effects) ) {
						return field_with_effects;
					}
					else {
						return false;
					}



				};
			}
		}
			
		return { evaluatedFields: fields, onChangeEffects: onChangeEffects };

	}

	loadFieldValuePosibilities() {
		const { auth, fields, exclude, defination } = this.props;
		let fields_to_load = {};
		let loading_fields = {};
		let value_possibilities = {};
		if (Object.size(this.state.onChangeEffectsFields) > 0) {
			for (let [effect_field_name, effect_field_properties] of Object.entries(this.state.onChangeEffectsFields)) {
			
				if (JSON.isJSON(effect_field_properties.reference) && !this.state.loading[effect_field_name]) {
					fields_to_load[effect_field_name] = effect_field_properties;
					loading_fields[effect_field_name] = true;
				}
				else if ((JSON.isJSON(effect_field_properties.possibilities) && !(effect_field_name in this.state.value_possibilities)) || !Object.areEqual(this.state.value_possibilities[effect_field_name], effect_field_properties.possibilities)) {
					value_possibilities[effect_field_name] = effect_field_properties.possibilities;
				}
				else if (Array.isArray(effect_field_properties.possibilities) && !(effect_field_name in this.state.value_possibilities)) {
					let possibilities = {};
					for (var i = 0; i < effect_field_properties.possibilities.length; i++) {
						possibilities[effect_field_properties.possibilities[i]] = effect_field_properties.possibilities[i];
					}
					value_possibilities[effect_field_name] = possibilities;
				}

			}
		}
		else {
			for (let [field_name, field_properties] of Object.entries(this.state.fields)) {
				
				if (JSON.isJSON(field_properties.reference) && !this.state.loading[field_name]) {
					if (!(field_name in this.state.value_possibilities)) {
						fields_to_load[field_name] = field_properties;
						loading_fields[field_name] = true;
					}
				}
				else if ((JSON.isJSON(field_properties.possibilities) && !(field_name in this.state.value_possibilities)) || !Object.areEqual(this.state.value_possibilities[field_name], field_properties.possibilities)) {
					value_possibilities[field_name] = field_properties.possibilities;
				}
				else if (Array.isArray(field_properties.possibilities) && !(field_name in this.state.value_possibilities)) {
					let possibilities = {};
					for (var i = 0; i < field_properties.possibilities.length; i++) {
						possibilities[field_properties.possibilities[i]] = field_properties.possibilities[i];
					}
					value_possibilities[field_name] = possibilities;
				}
			}
		}
		
		if (Object.size(value_possibilities) > 0 ) {
			//console.log("loadFieldValuePosibilities fields_to_load", fields_to_load, "value_possibilities", value_possibilities);
			
			this.state.value_possibilities = { ...this.state.value_possibilities, ...value_possibilities };
		}
		
		if (Object.size(fields_to_load) > 0) {
			for (let [name, field] of Object.entries(fields_to_load)) {
				if (Array.isArray(fields) && fields.length > 0) {
					if ((exclude && fields.includes(name)) || !fields.includes(name)) {
						continue;
					}
				}

				if (JSON.isJSON(field.reference)) {
					//Reference field Service Calls
					if (String.isString(field.reference.name) && JSON.isJSON(field.reference.service_query)) {
						let service = ApiService.getContextRequests(defination.endpoint);
						let service_key = field.reference.name;
						let service_query = field.reference.service_query;
						

						let execute_service_call = service_query && this.state.last_field_changed !== name;

						if (execute_service_call) {							
							this.setState(prevState => ({ loading: { ...prevState.loading, [name]: true } }));
							service.getRecords(service_query).then(response => {
								let raw_data = response.body.data;

								let possibilities = {};
								let resolves = field.reference.resolves;
								let resolve_columns = fields_to_load;

								if (resolves.emulation) {

									if (resolves.emulation.defination in definations) {
										if (Array.isArray(raw_data)) {
											let new_raw_data = []
											for (let j = 0; j < raw_data.length; j++) {
												if (resolves.emulation.key in raw_data[j]) {
													if (Array.isArray(raw_data[j][resolves.emulation.key])) {
														new_raw_data = new_raw_data.concat(raw_data[j][resolves.emulation.key])
													}
													else {
														new_raw_data.push(raw_data[j][resolves.emulation.key])
													}

												}
											}
											raw_data = new_raw_data;
										}
										resolve_columns = definations[resolves.emulation.defination].scope.columns;
									}
									else {
										raw_data = [];
									}

								}
								if (raw_data.length > 0) {

									let resolvable_data = [];
									for (var i = 0; i < raw_data.length; i++) {
										resolvable_data.push({ [name]: raw_data[i] });
									}
									let resolved_data = ServiceDataHelper.resolveReferenceColumnsDisplays(
										resolvable_data,
										resolve_columns,
										auth.user
									);
									for (var j = 0; j < resolved_data.length; j++) {
										possibilities[resolved_data[j][name].value] = resolved_data[j][name].resolve;
									}
								}
								if (this.mounted) {
									this.setState(state => ({
										value_possibilities: {
											...state.value_possibilities,
											[name]: possibilities
										},
										loading: { ...state.loading, [name]: false }
									}));
								}
								else{
									this.state.value_possibilities = { ...this.state.value_possibilities, [name]: possibilities };
									this.state.loading = { ...this.state.loading, [name]: false }
								}
									

							}).catch(err => {
								if (this.mounted) {
									this.setState(state => ({
										loading: { ...state.loading, [name]: false },
										openSnackBar: true,
										snackbarMessage: "Error fetching " + field.label + " ::: " + err.msg,
										snackbarColor: "warning"
									}));
								}
								else{
									this.state.loading = { ...this.state.loading, [name]: false };
									this.state.openSnackBar = true;
									this.state.snackbarMessage = "Error fetching " + field.label + " ::: " + err.msg;
									this.state.snackbarColor = "warning";
								}

							});
						}
					}
				}

			}
			this.setState({ onChangeEffectsFields: {} });
		}
		

	}


	async setQueryBuilderProps() {
        const {auth, query, defination} = this.props;
        const {fields, value_possibilities} = this.state;
        let query_builder_fields = {
				_id: {
					label: "ID",
					type: "text",
					//valueSources: ['value', 'field'],
					valueSources: ['value'],
					fieldSettings: {
						//allowCustomValues: true,
					}
				},
				
			};

        if (fields) {
            Object.entries(fields).map(([column_name, column_props]) => {				
                
                let input_type = column_props.input.type;
                input_type = input_type === "checkbox"? "boolean" : input_type;
                input_type = input_type === "textarea" || input_type === "file"? "text" : input_type;
                input_type = input_type === "radio"? "select" : input_type;
                input_type = input_type === "slider"? (column_props.type === "integer"? "slider" : "select") : input_type;
                query_builder_fields[column_name] = {
                    label: column_props.label,
                    type: input_type,
                    valueSources: ['value'],
                    fieldSettings: {
                        min: column_props.input.min,
                        max: column_props.input.max,
                    },
                }
                if (input_type === "slider") {
                    query_builder_fields[column_name].type = 'number';
                    query_builder_fields[column_name].fieldSettings.preferWidgets = ['slider'];
                }

                if (!JSON.isEmpty(value_possibilities[column_name])) {
                    let listValues = [];
                    Object.entries(value_possibilities[column_name]).map(([key, value]) => {
                        listValues.push({ value: key, title: value })
                    });
                    query_builder_fields[column_name].fieldSettings.listValues = listValues;
                }
            });
        }
        query_builder_fields["created_on"] = query_builder_fields.created_on? query_builder_fields.created_on : {
        	label: "Created On",
			type: "date",
			valueSources: ['value'],
        }
        if (this.mounted) {
            this.setState(prevState => ({queryBuilderProps: {format: "mongodb", value: { populate: (prevState.query.p || prevState.query.populate), sort: (this.state.query.s || this.state.query.sort|| "-created_on"), config: {fields: query_builder_fields}}}}));
        }
        else {
            this.state.queryBuilderProps = {format: "mongodb", value:{ populate: (this.state.query.p || this.state.query.populate), sort: (this.state.query.s || this.state.query.sort || "-created_on"), config: {fields: query_builder_fields}}};
        }
    }

	handleOnQueryBuilderChange(new_value) {
        this.setState(prevState => {
			return {
				query: {
					...prevState.query,
					q: new_value.search,
					filter: new_value.mongodb,
					sort: new_value.sort,
					p: new_value.populate? 1 : 0,
				},
			};
		});
    }

	render() {
		const { classes, auth, query, defination, cache, api, showPagination, showSorter, cache_data, onLoadData, load_data, onClickEntry, sorterFormLayoutType } = this.props;
		const { view, queryBuilderProps, service } = this.state;
		return (
            <GridContainer className="p-0 m-0">
				<GridContainer className="p-0 m-0">
					{this.state.showViewOptions && (
						<GridItem sm={12} md={8}>
							
								{Object.entries(this.state.views).map(
									([name, label], index) => (
										<Button
											color={"primary"}
											variant={name === view? "contained" : "text"}
											onClick={(event) => {
                                                this.setState({ view: name, viewMenuAnchorEl: null });
                                            }}
											key={"btn-view-"+name}
										>
											{label}
										</Button>
									)
								)}
						</GridItem>
				)}
					{this.state.showAddBtn &&
						defination &&
						!defination.access.actions.create.restricted(
							auth.user
						) && (
							<GridItem
								sm={12}
								md={this.state.showViewOptions ? 4 : 12}
							>
								{defination.access.actions.create.link.inline.default(
									{ className: "float-right" }
								)}
							</GridItem>
						)}
				</GridContainer>

				<GridContainer className="p-1 m-0">
					{ (showSorter && view !== "googlemapview") && <GridItem xs={12} className="p-0 m-0 mb-2" >
						<Paper>
							<QueryBuilder onChange={this.handleOnQueryBuilderChange} {...queryBuilderProps}/>
						</Paper>
						
						
					</GridItem>}
					
					<GridItem xs={12} className="p-0 m-0">
						{view == "tableview" && <TableView
								defination={defination}
								service={this.state.service}
								query={this.state.query}
								cache_data={cache_data}
								load_data={load_data}
								onLoadData={onLoadData}
								onClickEntry={onClickEntry}
						/>}

						{view === "googlemapview" && (
							<GoogleMapOverview
								context={defination.name}
								service={this.state.service}
								query={this.state.query}
								cache_data={cache_data}
								load_data={load_data}
								onLoadData={onLoadData}
								onClickEntry={onClickEntry}
							/>
						)}

						{view === "calendarview" && (
							<CalendarView
								defination={defination}
								service={this.state.service}
								query={this.state.query}
								cache_data={cache_data}
								load_data={load_data}
								onLoadData={onLoadData}
								onClickEntry={onClickEntry}
							/>
						)}
						
						{view === "listview" && (
							<ListView
								defination={defination}
								service={this.state.service}
								query={this.state.query}
								cache_data={cache_data}
								load_data={load_data}
								onLoadData={onLoadData}
								onClickEntry={onClickEntry}
							/>
						)}
					</GridItem>

				</GridContainer>

				{ (showPagination && view != "googlemapview") && <GridContainer className="p-0 m-0 mb-4">
					<GridItem xs={12} className="p-2 flex items-center justify-center">
						<TablePagination 
							count={defination.name in cache.res? cache.res[defination.name].count : 1}
							page={defination.name in cache.res? cache.res[defination.name].page-1 : this.state.page-1}							
							rowsPerPage={this.state.query.pagination}
							onChangePage={this.handleOnPageChanged}
							labelRowsPerPage={"Records per page"}
							rowsPerPageOptions={[5, 10, 25, 50, 100, 250, 500, 1000, { value: -1, label: 'All' }]}
							onChangeRowsPerPage={this.handleOnRecordsPerPageChanged}
							ActionsComponent={TablePaginationActions}
							component="div"
							SelectProps={{
								label: "Records per page",
								variant: "outlined",
							}}
							classes={{
								toolbar: "flex-col-reverse px-2",
							}}
						/>
					</GridItem>
				</GridContainer> }
			</GridContainer>
        );
	}
}
ListingView.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	view: PropTypes.string,
	query: PropTypes.object,
	showViewOptions: PropTypes.bool,
	show_actions: PropTypes.bool,
	show_links: PropTypes.bool,
	showAddBtn: PropTypes.bool,
	showSorter: PropTypes.bool,
	sorterFormLayoutType: PropTypes.string,
	showPagination: PropTypes.bool,
	cache_data: PropTypes.bool,
	load_data: PropTypes.bool,
	onLoadData: PropTypes.func,
	onClickEntry: PropTypes.func,
};

ListingView.defaultProps = {
	show_actions: true,
	show_links: true,
	showViewOptions: true,
	showAddBtn: true,
	showPagination: true,
	showSorter: true,
	sorterFormLayoutType: "inline",
	query: {},
	load_data: true,
	cache_data: true,
};

const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
	api: state.api,
	app: state.app,
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps, {}),
	withErrorHandler
)(ListingView);
