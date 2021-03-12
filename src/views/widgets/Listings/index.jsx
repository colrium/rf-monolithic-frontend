/** @format */

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import withStyles from "@material-ui/core/styles/withStyles";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import PropTypes from "prop-types";
import React, {useEffect} from "react";
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import Pagination from '@material-ui/lab/Pagination';
import TablePagination from '@material-ui/core/TablePagination';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useTheme } from '@material-ui/core/styles';
import {
	TextInput
} from "components/FormInputs";
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FilterListIcon from '@material-ui/icons/FilterList';
import CalendarView from "./CalendarView";
import GoogleMapView from "./GoogleMapView";
import GoogleMapOverview from "views/widgets/Overview/GoogleMapOverview";
import ListView from "./ListView";
import Chip from '@material-ui/core/Chip';
import ContextDataForm from "views/forms/BaseForm";
import { withErrorHandler } from "hoc/ErrorHandler";
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
		}
	};
	mounted = false;
	searchkeywordRef = React.createRef();

	constructor(props) {
		super(props);

		const { defination, service, query, cache, app } = props;
		this.state.defination = defination;
		this.state.service = service;
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
	}

	

	componentDidMount() {
		this.mounted = true;
		this.prepareForRender();
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		return {
			prepareForRenderRequired: !Object.areEqual(prevProps.query, this.props.query),
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true;
		if (snapshot.prepareForRenderRequired) {
			this.prepareForRender();
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
		const { defination, service, query, view, showViewOptions, showAddBtn, app } = this.props;
		if (defination && service) {
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
			console.log("this.searchkeywordRef", "this.searchkeywordRef")
			if (this.mounted) {
				this.setState(state => ({
					defination: defination,
					service: service,
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
					filterableFields: filterableFields,
					searchKeyword: searchKeyword,
					filterContext: filterContext,

				}));
			} else {
				this.state = {
					...this.state,
					defination: defination,
					service: service,
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
					filterableFields: filterableFields,
					searchKeyword: searchKeyword,
					filterContext: filterContext,
				};
			}
		}
	}

	render() {
		const { classes, auth, query, defination, service, cache, api, showPagination, showSorter, cache_data, onLoadData, load_data, onClickEntry, sorterFormLayoutType } = this.props;
		const { view } = this.state;
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
												console.log(name);
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
						<GridContainer className="p-0 m-0">
							

							<GridItem xs={12} className={"p-0"}>
								<Accordion 
									expanded={this.state.filterAccordionExpanded}
									className="p-0"
									variant="outlined"
								>
									{/*<AccordionSummary
										expandIcon={this.state.filterAccordionExpanded? <ExpandLessIcon /> : <FilterListIcon />}
										aria-controls="filter-panel1c-content"
										id="filter-panel1c-header"
										className="flex m-0 p-0 flex-grow"
										
									>*/}
									<Paper 
										component="form" 
										elevation={0}
										className={classes.searchRoot} 
										onSubmit={event => {
											event.preventDefault();
											this.setState(prevState => ({
												query: prevState.filterContext? {...prevState.query, [prevState.filterContext]: prevState.searchKeyword} : {...prevState.query, q: prevState.searchKeyword}
											}));
											console.log("Search submit searchKeyword", this.state.searchKeyword)
										}}
									>
										{!this.state.filterContext && <IconButton 
											className={classes.filterIconButton} 
											aria-label="Filter"
											onClick={(event)=>{
												event.preventDefault();
												this.setState({filterMenuAnchor: event.currentTarget});
											}}
										>
											<MenuIcon />
										</IconButton>}
										{(this.state.filterContext && this.state.filterableFields[this.state.filterContext])&& <Button  
											aria-label="Filter"
											size={"small"}
											color="secondary"
											onClick={(event)=>{
												event.preventDefault();
												this.setState({filterMenuAnchor: event.currentTarget});
											}}
										>
											{Function.isFunction(this.state.filterableFields[this.state.filterContext].label)? this.state.filterContext.humanize() : this.state.filterableFields[this.state.filterContext].label}
										</Button>}
										<Menu
									        id="filter-fields-menu"
									        anchorEl={this.state.filterMenuAnchor}
									        keepMounted
									        open={Boolean(this.state.filterMenuAnchor)}
									        onClose={() => this.setState({filterMenuAnchor: null})}
									    >
									    	

									        {Object.entries(this.state.filterableFields).map(([filterableField, filterableFieldProps], cursor) => (
									        	<MenuItem 
									        		onClick={()=> {
									        			this.setState({filterContext: (this.state.filterContext === filterableField? false : filterableField), filterMenuAnchor: null});									        			
									        		}}
									        		key={"filterableField-"+filterableField+"-"+cursor}
									        	>
									        		{Function.isFunction(filterableFieldProps.label)? filterableField.humanize() : filterableFieldProps.label}
									        	</MenuItem>
									        ))}
									    </Menu>
										<TextInput
											className={classes.searchInput}
											placeholder="Search..."
											inputProps={{ 'aria-label': 'Search' }}
											defaultValue={this.state.searchKeyword}
											onFocus={() => {
												if (!this.state.filterAccordionExpanded) {
													this.setState({ filterAccordionExpanded: true });
												}
											}}
											onChange={newKeyword => {
												this.setState(prevState=>{
													let newState = { searchKeyword: newKeyword };
													if (prevState.query) {
														if (prevState.query.q) {
															let newQuery = JSON.fromJSON(prevState.query);
															delete newQuery["q"];
															newState.query = newQuery;
														}
													}
													return newState;
												});
											}}
											variant={"base"}
											ref={ref => (this.searchkeywordRef = ref)}
										/>
										<IconButton 
											type="submit" className={classes.searchIconButton} aria-label="search">
											<SearchIcon />
										</IconButton>
									</Paper>
										
											
										
									{/*</AccordionSummary>*/}
									<AccordionDetails className={"p-0"}>
											{ Object.keys(this.state.filters.values).length > 0 && <GridContainer className="m-0">
												{Object.entries(this.state.filters.labels).map(([filter_name, filter_label], cursor) => {
														return (
															<Chip 
																className="mx-1 my-1 max-w-xs" 
																color="secondary"
																label={(String.isString(defination.scope.columns[filter_name].label)? (defination.scope.columns[filter_name].label+" : ") : "")+filter_label} 
																variant="outlined" 
																style={{maxWidth: 180}}
																key={"filter-chip-"+cursor}
															/>
														)

																	})}
											</GridContainer>}
									</AccordionDetails>
								</Accordion>
								
							</GridItem>
						</GridContainer>
						
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
							rowsPerPageOptions={[5, 10, 25, 50, 100, { value: -1, label: 'All' }]}
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
