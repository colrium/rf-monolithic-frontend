import React, {useState, useEffect, useLayoutEffect, memo, useCallback, useRef} from 'react';
import { connect } from "react-redux";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import throttle from "lodash/throttle";
import lodash from "lodash";
import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import NestedMenuItem from "components/NestedMenuItem";
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import { TextInput, SelectInput } from "components/FormInputs";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TuneIcon from '@material-ui/icons/Tune';
import SearchIcon from '@material-ui/icons/Search';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Tooltip from '@material-ui/core/Tooltip';
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme, theme_dark } from "assets/jss/app-theme";
import debounce from 'lodash/debounce';



const SelectWidgetComponent = memo((props) => {
	const {listValues, fieldDefinition, label, setValue, placeholder, readonly, max, min, value} = props;
	const [options, setOptions] = useState({});
	useEffect(()=>{
		let new_options = {}
		if (Array.isArray(listValues)) {
			listValues.map(({title, value}) => {
				new_options[value] = title;
			})
		}
		setOptions(new_options);
	}, [listValues]);

	const throttledOnChange = useRef(debounce(newValue => {
		if ( Function.isFunction(setValue)) {			
			Promise.all([setValue(newValue)]).catch(err => {});				
		}		
		
			
	}, 500)).current;


	return (
		<SelectInput
			options={options}
			onChange={(new_value) => throttledOnChange(new_value)}
			label={label}
			placeholder={placeholder}
			variant="standard"
			size={"small"}
			value={value}
			defaultValue={value}
			max={max}
			min={max}
		/>
	);
});

const FieldsSelectComponent = memo((props) => {
	const {items, label, setField, placeholder, readonly, max, min, value} = props;
	const [options, setOptions] = useState({});
	useEffect(()=>{
		let new_options = {}
		if (Array.isArray(items)) {
			items.map(({key, label, path, tooltip, disabled}) => {
				if (!disabled) {
					new_options[key] = label;
				}				
			});
		}
		setOptions(new_options);
	}, [items]);

	const throttledOnChange = useRef(debounce(newValue => {
		if ( Function.isFunction(setField)) {			
			Promise.all([setField(newValue)]).catch(err => {});			
		}		
		
			
	}, 250)).current;


	return (
		<SelectInput
			options={options}
			onChange={(new_value) => throttledOnChange(new_value)}
			label={label}
			placeholder={placeholder}
			variant="standard"
			size={"small"}
			value={value}
			defaultValue={value}
			max={max}
			min={max}
		/>
	);
});

// Choose your skin (ant/material/vanilla):
const InitialConfig = {
	...MaterialConfig,
	settings: {
		...MaterialConfig.settings,
		renderProvider: ({children, ...rest}) => (<MuiThemeProvider {...rest} theme={theme}>{children}</MuiThemeProvider>),
		/*renderField: (props) => {
			console.log("renderField props", props);
				return (
					<FieldsSelectComponent {...props} />
				)
		},*/
	},
	widgets: {
		...MaterialConfig.widgets,
		select: {
			...MaterialConfig.widgets.select,
			factory: (props)=> {
                return (
					<SelectWidgetComponent {...props} />
				)
            }
		}
	}
};



// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = {"id": QbUtils.uuid(), "type": "group"};
let onChangeFired = false;

const BuilderComponent = (props) => {
	return (
		<Builder {...props} />
	);
}

const BuilderResult = (props) => {
	const {tree: immutableTree, config} = props;
	return (
		<div className="query-builder-result">
			<div>Query string: <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre></div>
			<div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
		</div>
	);
}

const QueryBuilder = memo((props) => {
	const {value, onChange, format, title, className, search, sort, builder, ...rest} = props;
	
	const [internalValue, setInternalValue] = useState(JSON.isJSON(value)? (
														{
															...value,
															search: value.search,
															sort: value.sort,
															populate: value.populate,
															builder: {"id": QbUtils.uuid(), "type": "group", ...value.builder}, 
															config: {...InitialConfig, ...value.config},
															tree: QbUtils.checkTree(QbUtils.loadTree(({"id": QbUtils.uuid(), "type": "group", ...value.builder})), {...InitialConfig, ...value.config})
														}
												) : (
														{
															search: undefined, 
															sort: undefined, 
															populate: false,
															builder: {"id": QbUtils.uuid(), "type": "group"}, 
															config: InitialConfig,
															tree: QbUtils.checkTree(QbUtils.loadTree(({"id": QbUtils.uuid(), "type": "group"})), InitialConfig)
														}
												));
	const [showBuilder, setShowBuilder] = useState(false);
	const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
	

	const getExpectedValue = useCallback((newTree, newConfig) => {
		return (format==="querystring"? QbUtils.queryString(newTree, newConfig) : (format==="mongodb"? QbUtils.mongodbFormat(newTree, newConfig) : QbUtils.getTree(newTree)));
	}, [format]);

	
	useEffect(() => {
		if (!lodash.isEqual(value, internalValue)) {
			setInternalValue(JSON.isJSON(value)? ({
															...value,
															search: value.search,
															sort: value.sort,
															populate: value.populate,
															builder: {"id": QbUtils.uuid(), "type": "group", ...value.builder}, 
															config: {...InitialConfig, ...value.config},
															tree: QbUtils.checkTree(QbUtils.loadTree(({"id": QbUtils.uuid(), "type": "group", ...value.builder})), {...InitialConfig, ...value.config})
														}) : ({
															search: undefined,
															sort: undefined,
															populate: false,
															builder: {"id": QbUtils.uuid(), "type": "group"}, 
															config: InitialConfig,
															tree: QbUtils.checkTree(QbUtils.loadTree(({"id": QbUtils.uuid(), "type": "group"})), InitialConfig)
														}))
		}
	}, [value]);



	



	
	const throttledOnChange = useRef(debounce(newValue => {
		const {tree: newTree, config: newConfig, ...rest} = newValue;

		if ( Function.isFunction(onChange)) {
            let changeValue = {
				...rest,
				builder: QbUtils.getTree(newTree),
				querystring: QbUtils.queryString(newTree, newConfig),
				mongodb: QbUtils.mongodbFormat(newTree, newConfig),
				tree: newTree,
				config: newConfig,				
			};
            Promise.all([onChange(changeValue)]).catch(err => {});
        }
		onChangeFired = true;			
		
			
	}, 500)).current;


	const handleOnQueryBuilderChange = (newTree, newConfig) => {
		setInternalValue((currentInternalValue) => {
			return {
				...currentInternalValue,
				builder: QbUtils.getTree(newTree),
				tree: newTree,
				config: newConfig,
			}
		});
		
	}

	const handleOnSubmit = (internalValue) => (event) => {
		event.preventDefault();
		throttledOnChange(internalValue);
	}

	const handleOnSearchInputChange = (new_value) => {
		let fireOnChange = false;
		let new_internal_value = internalValue;
		setInternalValue((currentInternalValue) => {
			fireOnChange = String.isEmpty(new_value) && !String.isEmpty(currentInternalValue.search);
			new_internal_value = {
				...currentInternalValue,
				search: new_value,
			};
			return new_internal_value;
		});
		if (onChangeFired && fireOnChange) {
			throttledOnChange(new_internal_value);
		}
	}

	const handleOnPopulateChange = (event) => {
		event.preventDefault()
		let new_internal_value = internalValue;
		setInternalValue((currentInternalValue) => {
			new_internal_value =  {
				...currentInternalValue,
				populate: !currentInternalValue.populate,
			};
			return new_internal_value;
		});
		throttledOnChange(new_internal_value);
	}

	const handleOnSortBtnClick = (event) => {
		event.preventDefault();
		setSortMenuAnchorEl(event.currentTarget);
	}

	const handleOnSortByClick = (field_name, type="asc") => (event) => {
		event.preventDefault()
		let new_internal_value = internalValue;
		setInternalValue((currentInternalValue) => {
			let newSort = (String.isString(currentInternalValue.sort)? currentInternalValue.sort : "");
			let appendSort = (!newSort.includes(("-"+field_name)) && type==="desc") || (!newSort.includes(("-"+field_name)) && !newSort.includes(field_name) && type === "asc");
			newSort = newSort.replaceAll(" ", "").replaceAll(("-"+field_name+","), "").replaceAll((",-"+field_name), "").replaceAll(("-"+field_name), "").replaceAll((field_name+","), "").replaceAll((","+field_name), "").replaceAll(field_name, "");
			newSort = newSort+ (appendSort? ((newSort.length > 0? "," : "") +(type==="desc"? "-" : "")+field_name) : "");
			console.log("newSort", newSort);
			new_internal_value =  {
				...currentInternalValue,
				sort: newSort,
			};
			return new_internal_value;
		});

		//console.log("new_internal_value", new_internal_value);
		throttledOnChange(new_internal_value);
	}


	

	return (
			<form  className={"p-0 flex "+(className? (" "+className): "")} onSubmit={handleOnSubmit(internalValue)}>
				<Accordion expanded={showBuilder} className={"flex-grow"} elevation={0}>
					<AccordionSummary
						expandIcon={<Tooltip title="Toggle Query Builder">
							<IconButton disabled={!builder} onClick={() => setShowBuilder(!showBuilder)} color={showBuilder? "secondary" : "default"}>
								<TuneIcon fontSize="small" /> 
							</IconButton>
						</Tooltip>}
						aria-controls="panelqb-content"
						id="panelqb-header"
						className={"bg-transparent"}
					>
						<GridContainer className={"flex flex-row justify-center items-center"}>
							{search && <Tooltip title="Enter Search Query">
								<TextInput 
									variant="outlined" 
									placeholder="Search..."
									InputProps={{
										endAdornment: (<InputAdornment position="end">
											<Tooltip title="Search">										
												<IconButton type="submit" size="small"><SearchIcon fontSize="small" /> </IconButton>
											</Tooltip>
											
										</InputAdornment>)					        
									}}		
									value={internalValue.search}
									onChange={handleOnSearchInputChange}					 
									margin="dense"
									size="small"
								/>
							</Tooltip>}
							<Tooltip title="Populate and Resolve IDs">
								<IconButton className={internalValue.populate? "accent-text mx-1" : "mx-1"} onClick={handleOnPopulateChange}>				
									<AccountTreeIcon fontSize="small" />								
								</IconButton>
							</Tooltip>
							{sort && <Tooltip title="Sort">
								<IconButton disabled={false/*JSON.isEmpty(internalValue?.config?.fields?? {})*/} className={Boolean(internalValue.sort)? "accent-text" : ""} onClick={handleOnSortBtnClick}>
									<SortIcon fontSize="small" /> 
								</IconButton>
							</Tooltip>}

							<Menu
								id="sort-by-field-menu"
								anchorEl={sortMenuAnchorEl}
								keepMounted
								open={Boolean(sortMenuAnchorEl)}
								onClose={() => setSortMenuAnchorEl(null)}
							>
								
									{Object.entries(internalValue?.config?.fields?? {}).map(([field_name, field_props]) => (
										<NestedMenuItem
											label={field_props.label}
											parentMenuOpen={Boolean(sortMenuAnchorEl)}
											selected={(internalValue.sort?? "").includes(field_name)}
											MenuProps={{
												/*anchorOrigin: {
													vertical: 'center',
													horizontal: 'center'
												},
												transformOrigin: {
													vertical: 'center',
													horizontal: 'center'
												},*/
											}}
											leftIcon={null}
											rightIcon={(internalValue.sort?? "").includes(("-"+field_name))? (<ArrowDownwardIcon fontSize="small" className="ml-1" />) : ((internalValue.sort?? "").includes((field_name))? (<ArrowUpwardIcon fontSize="small" className="ml-1" />) : null )}
											key={"sort-field-"+field_name}
											button
										> 
											<MenuItem 
												disabled
											>
												{field_props.label}
											</MenuItem>
											<MenuItem 
												onClick={handleOnSortByClick(field_name, "asc")}
												selected={!(internalValue.sort?? "").includes(("-"+field_name)) && (internalValue.sort?? "").includes(field_name)}
												button
											>
												Ascending
											</MenuItem>
											<MenuItem 
												onClick={handleOnSortByClick(field_name, "desc")}
												selected={(internalValue.sort?? "").includes(("-"+field_name))}
												button
											>
												Descending
											</MenuItem>
										</NestedMenuItem>

									))} 

							</Menu>
						</GridContainer>
						
					</AccordionSummary>
					<AccordionDetails>
						<Query
							{...internalValue.config} 
							value={internalValue.tree}
							onChange={handleOnQueryBuilderChange}
							renderBuilder={BuilderComponent}
						/>
					</AccordionDetails>
				</Accordion>	
			</form>
	);

});



QueryBuilder.defaultProps = {
	title: false,
	search: true,
	builder: true,
	sort: true,
	value: {search: undefined, populate: true, builder: {"id": QbUtils.uuid(), "type": "group"}, config: {fields: {}}},
	format: "mongodb",
	fields: {}
}

const mapStateToProps = state => ({
	app: state.app,
});


export default connect(mapStateToProps, {})(QueryBuilder);