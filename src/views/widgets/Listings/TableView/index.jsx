/** @format */

//
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";
import EmptyStateImage from "assets/img/empty-state-table.svg";
import Avatar from "components/Avatar";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { formats } from "config/data";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import ReactJson from 'react-json-view'
import { attachments as AttachmentsService } from "services";
import { apiCallRequest, closeDialog, openDialog } from "state/actions";
//
import { FilesHelper, ServiceDataHelper, UtilitiesHelper } from "hoc/Helpers";
import { withErrorHandler } from "hoc/ErrorHandler";
import { withGlobals } from "contexts/Globals";
import styles from "./styles";

class TableView extends React.Component {
	state = {
		loading: true,
		load_error: false,
		defination: null,
		service: null,
		query: { p: 1 },
		dt_columns: [],
		records: [],
		raw_data: [],
		raw_data_mutated: false,
		mouseX: null,
		mouseY: null,
		actionsView: "contextMenu",

		context: null,
	};
	constructor(props) {
		super(props);
		const { defination, service, query, cache: { data: cachedData } } = props;
		this.state.defination = defination;
		this.state.service = service;
		this.state.query = query ? { ...query, p: 1 } : { p: 1 };
		this.state.records = Array.isArray(cachedData[defination.name])? cachedData[defination.name] : [];
		this.mounted = false;
		this.handleDeleteItemConfirm = this.handleDeleteItemConfirm.bind(this);
		this.handleDeleteItem = this.handleDeleteItem.bind(this);
		this.handleOnRowContextMenu = this.handleOnRowContextMenu.bind(this);
		this.handleSocketsOnCreate = this.handleSocketsOnCreate.bind(this);
	}

	componentDidMount() {
        const { cache, defination, sockets } = this.props;
        if (sockets) {
			if (sockets.default) {
				sockets.default.on("create", this.handleSocketsOnCreate);
			}
		}
        this.mounted = true;
        this.loadContext();
        this.prepareData((Array.isArray(cache.data[defination.name])? cache.data[defination.name] : []));
    }

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		const { cache, defination } = this.props;
		return {
			contextReloadRequired: !Object.areEqual(prevProps.defination, this.props.defination),
			dataReloadRequired: !Object.areEqual(prevProps.query,this.props.query),
			/*dataPreparationRequired: Array.isArray(cache.data[defination.name])? !cache.data[prevProps.defination.name].equals(prevProps.cache.data[defination.name]) : (Array.isArray(prevProps.cache.data[defination.name])? !prevProps.cache.data[prevProps.defination.name].equals(cache.data[defination.name]) : false),*/
			dataPreparationRequired: false,
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true;
		if (snapshot.contextReloadRequired) {
			this.loadContext();
			this.prepareData();
		}
		if (snapshot.dataReloadRequired) {
			const { query } = this.props;
			this.setState(
				{ query: query ? { p: 1, ...query } : { p: 1 } },
				this.loadData
			);
		}
		if (this.state.raw_data_mutated) {
			this.setState({ raw_data_mutated: false }, this.prepareData(this.state.raw_data));
		}
	}
	componentWillUnmount() {
		const { sockets } = this.props;
		if (sockets) {
			if (sockets.default) {
				sockets.default.off("create", this.handleSocketsOnCreate);
			}
		}
    }

	handleSocketsOnCreate = (event) => {
		const { defination, sockets } = this.props;
		const { context, action } = event;
		const { raw_data } = this.state;
		if (defination.model === context) {
			this.setState(prevState => {
                const { raw_data } = prevState;
                let new_raw_data = Array.isArray(raw_data)? raw_data : [];
                new_raw_data.unshift(action.result);
                return {
					raw_data: new_raw_data,
					raw_data_mutated: true,
				}
            });
				
		}
		
	}

	handleDeleteItemConfirm = item_id => event => {
		const { openDialog, closeDialog } = this.props;
		let that = this;
		openDialog({
			title: "Confirm Delete",
			body:
				"Are you sure you want delete entry? This action might be irreversible",
			actions: {
				cancel: {
					text: "Cancel",
					color: "default",
					onClick: () => closeDialog(),
				},
				delete: {
					text: "Delete",
					color: "error",
					onClick: this.handleDeleteItem(item_id),
				},
			},
		});
	};

	handleDeleteItem = item_id => event => {
		const { openDialog, closeDialog } = this.props;
		closeDialog();
		if (item_id._id) {
			item_id = item_id._id;
		}
		this.state.service
			.delete(item_id)
			.then(res => {
				this.setState(prevState => {
					let new_records = prevState.records;
					if (Array.isArray(new_records)) {
						new_records = new_records.filter((record)=>{
							if (record.entry) {
								if (record.entry._id === item_id ) {
									return false;
								}
							}
							else if (record._id === item_id) {
								return false;
							}

							return true;
						});
					}

					if (!Array.isArray(new_records)) {
						new_records = [];
					}

					return {
						records: new_records,
					}
				});
			}).catch(e => {
				openDialog({
					title: "Delete failed",
					body: e.msg,
					actions: {},
				});
			});
	};

	handleOnRowContextMenu = index => event => {
        event.preventDefault();
        const mouseX = event.clientX - 2;
        const mouseY = event.clientY - 4;

        this.setState(prevState => ({
			mouseX: mouseX,
			mouseY: mouseY,
			context: prevState.raw_data[index],
		}));
    };

	handleOnRowContextMenuClose = event => {
		event.preventDefault();

		this.setState({
			mouseX: null,
			mouseY: null,
		});
	};

	loadContext() {
		const { classes, defination, service, query, auth, actionsType } = this.props;
		if (defination) {
			let columns = defination.scope.columns;
			let dt_columns = [];
			if (!defination.access.restricted(auth.user)) {
				dt_columns.push({
					name: "entry",
					label: String.isString(defination.label)? defination.label.singularize() : ("Action"),
					options: {
						filter: false,
						sort: false,
						/*customBodyRenderLite: (dataIndex, rowIndex) => {
							console.log("dataIndex", dataIndex);
							let value = this.state.records[dataIndex].entry;
							if (actionsType === "inline") {
								return (
									<GridContainer
										spacing={2}
										className={classes.data_actions_wrapper}
									>
										{Object.keys(defination.access.actions).map((action_name, action_index) =>
											!defination.access.actions[action_name].restricted(auth.user) && (
												<div
													key={
														value +
														"_" +
														action_name +
														"_action"
													}
												>
													{action_name === "delete" ? defination.access.actions[action_name].link.inline.listing(value,
																"error_text",
																this.handleDeleteItemConfirm(
																	value
																)
														  )
														: defination.access.actions[
																action_name
														  ].link.inline.listing(
																value
														  )}
												</div>
											)
										)}
									</GridContainer>
								);
							}
						},*/
						customBodyRender: (value, tableMeta, updateValue) => {
							if (actionsType === "inline") {
								return (
									<GridContainer
										spacing={2}
										className={classes.data_actions_wrapper}
									>
										{Object.keys(defination.access.actions).map((action_name, action_index) =>
											(Function.isFunction(defination.access.actions[action_name].restricted) && !defination.access.actions[action_name].restricted(auth.user)) && (
												<div
													key={
														value +
														"_" +
														action_name +
														"_action"
													}
												>
													{action_name === "delete" ? defination.access.actions[action_name].link.inline.listing(value, "error_text", this.handleDeleteItemConfirm(value)) : defination.access.actions[action_name].link.inline.listing(value)}
												</div>
											)
										)}
									</GridContainer>
								);
							}
								
						},
					},
				});

				for (let [name, field] of Object.entries(columns)) {
					let display_field = true;
					if (field.restricted && "display" in field.restricted) {
						if (typeof field.restricted.display === "function") {
							display_field = !field.restricted.display(
								false,
								auth.user
							);
						}
					}

					if (display_field) {
						if (
							UtilitiesHelper.isOfType(
								this.state.defination.views.listing.tableview
									.resolveData,
								"function"
							)
						) {
							if (field.reference || field.possibilities) {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities
											? true
											: false,
										sort: true,
										customBodyRender: (
											value,
											tableMeta,
											updateValue
										) => {
											if (Array.isArray(value)) {
												return (
													<GridContainer spacing={2}>
														{value.map(
															(entry, cursor) => (
																<div
																	key={cursor}
																>
																	{" "}
																	{entry}{" "}
																</div>
															)
														)}
													</GridContainer>
												);
											} else {
												return value !== null &&
													value !== undefined
													? value
													: "";
											}
										},
									},
								});
							} else {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities
											? true
											: false,
										sort: true,
									},
								});
							}
						} else {
							if (
								field.reference &&
								field.input.type !== "file" && !field.isAttachment
							) {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities
											? true
											: false,
										sort: true,
										customBodyRender: (
											value,
											tableMeta,
											updateValue
										) => {
											if (Array.isArray(value)) {
												return (
													<GridContainer spacing={2} className={"flex"}>
														{value.map(
															(entry, cursor) => (
																<Typography
																	key={entry.value}
																>
																{entry.resolve}
																</Typography>
															)
														)}
													</GridContainer>
												);
											} else {
												return value !== null &&
													value !== undefined ? (
													value.resolve
												) : (
													""
												);
											}
										},
									},
								});
							} 
							else if ( field.reference && (field.input.type === "file" || field.isAttachment) ) {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: Boolean(field.possibilities),
										sort: true,
										customBodyRender: (
											value,
											tableMeta,
											updateValue
										) => {
											if (Array.isArray(value)) {
												return (
													<GridContainer spacing={2}>
														{value.map(
															(entry, cursor) => (
																<Chip
																	className={
																		classes.valueChip
																	}
																	avatar={
																		<Avatar
																			color="#cfd8dc"
																			textColor="#000000"
																			src={
																				FilesHelper.fileType(
																					entry.resolve
																				) ===
																				"image"
																					? AttachmentsService.getAttachmentFileUrl(
																							entry.value
																					  )
																					: undefined
																			}
																		>
																			{FilesHelper.fileIcon(
																				entry.resolve
																			)}
																		</Avatar>
																	}
																	label={
																		entry.resolve
																	}
																	onClick={e => {
																		e.preventDefault();
																		let win = window.open(
																			AttachmentsService.getAttachmentFileUrl(
																				entry.value
																			),
																			"_blank"
																		);
																		win.focus();
																	}}
																	key={
																		"file-" +
																		entry.value
																	}
																/>
															)
														)}
													</GridContainer>
												);
											} 

											else {
												return value !== null &&
													value !== undefined ? (
													<Chip
														avatar={
															<Avatar
																color="#cfd8dc"
																textColor="#000000"
																src={
																	FilesHelper.fileType(
																		value.resolve
																	) ===
																	"image"
																		? AttachmentsService.getAttachmentFileUrl(
																				value.value
																		  )
																		: undefined
																}
															>
																{FilesHelper.fileIcon(
																	value.resolve
																)}
															</Avatar>
														}
														onClick={e => {
															e.preventDefault();
															let win = window.open(
																AttachmentsService.getAttachmentFileUrl(
																	value.value
																),
																"_blank"
															);
															win.focus();
														}}
														label={value.resolve}
													/>
												) : (
													""
												);
											}
										},
									},
								});
							}
							else if ( field.type === "object") {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: false,
										sort: false,
										customBodyRender: (
											value,
											tableMeta,
											updateValue
										) => {
											try {
												value = JSON.parse(value);
												return (
													<ReactJson name={field.label} src={value} enableClipboard={false}  displayDataTypes={false} collapsed/>
												);
											}catch(err) {
												return;
											}
											
												
											
											
											
										},
									},
								});
							} 
							else {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities
											? true
											: false,
										sort: true,
									},
								});
							}
						}
					}
				}
			}

			/*this.state.dt_columns = dt_columns;
			this.state.records = [];
			this.state.loading = false;*/

			this.setState(
				{
					defination: defination,
					service: service,
					query: query ? { ...query, p: 1 } : { p: 1 },
					dt_columns: dt_columns,
					records: [],
					loading: false,
				},
				this.loadData
			);
		}
	}

	parseData(entry) {
		const { defination, auth } = this.props;
		let parsed_data = entry;
		let columns = defination.scope.columns;
		parsed_data["entry"] = entry;
		for (let [field_name, field] of Object.entries(columns)) {
			if (field.input.type === "date") {
				if (entry[field_name]) {
					parsed_data[field_name] = new Date(
						entry[field_name]
					).format(formats.dateformats.date);
				} else {
					parsed_data[field_name] = "";
				}
			}
			if (field.input.type === "datetime" && entry[field_name]) {
				if (entry[field_name]) {
					parsed_data[field_name] = new Date(
						entry[field_name]
					).format(formats.dateformats.datetime);
				} else {
					parsed_data[field_name] = "";
				}
			}
			if (field.input.type === "time") {
				if (entry[field_name]) {
					parsed_data[field_name] = new Date(
						entry[field_name]
					).format(formats.dateformats.time);
				} else {
					parsed_data[field_name] = "";
				}
			}
			if (field.type === "boolean") {
				if (entry[field_name]) {
					parsed_data[field_name] = "Yes";
				} else {
					parsed_data[field_name] = "No";
				}
			}
			if (JSON.isJSON(parsed_data[field_name]) && !field.reference && field.type !== "object") {
				parsed_data[field_name] = JSON.stringify(parsed_data[field_name]);
			}
			if (field.possibilities) {
				if (JSON.isJSON(field.possibilities)) {
					if (entry[field_name] in field.possibilities) {
						parsed_data[field_name] =
							field.possibilities[entry[field_name]];
					}
				} else if (Function.isFunction(field.possibilities)) {
					let possibilities_obj = field.possibilities(
						entry,
						auth.user
					);
					if (JSON.isJSON(possibilities_obj)) {
						if (entry[field_name] in possibilities_obj) {
							parsed_data[field_name] =
								possibilities_obj[entry[field_name]];
						}
					}
				}
			}
		}
		return parsed_data;
	}

	loadData() {
		const { auth, cache, defination, apiCallRequest, cache_data, onLoadData, load_data } = this.props;
		if (defination ) {
			if (load_data) {
				this.setState({loading: true, load_error: false});
				apiCallRequest( defination.name,
					{
						uri: defination.endpoint,
						type: "records",
						params: this.state.query,
						data: {},
						cache: cache_data,
					}
				).then(data => {
					if (Function.isFunction(onLoadData)) {
						onLoadData(data, this.state.query);
					}
					this.setState({loading: false});
					this.prepareData(data);
				}).catch(e => {
					this.setState(state => ({
						records: [],
						load_error: e,
						loading: false,
					}));
				});
			}
			else {
				let data = Array.isArray(cache.data[defination.name])? cache.data[defination.name] : [];
				if (Function.isFunction(onLoadData)) {
					onLoadData(data, this.state.query);
				}
				this.prepareData(data);
			}
		}
		else {
			this.setState(state => ({
				records: [],
				load_error: { msg: "No Context defination or provided" },
				loading: false,
			}));
		}
	}

	prepareData(data=null) {
		const { auth, cache, defination } = this.props;
		let target_data = Array.isArray(data)? data : (Array.isArray(cache.data[defination.name]) ? cache.data[defination.name] : []);
		let columns = defination ? defination.scope.columns : {};
		let resolved_data = [];



		if (Function.isFunction(defination.views.listing.tableview.resolveData)) {
			defination.views.listing.tableview
				.resolveData(target_data, true)
				.then(resolve => {
					if (this.mounted) {
						this.setState(state => ({
							raw_data: target_data,
							records: resolve,
							loading: false,
						}));
					} else {
						this.state.records = resolve;
						this.state.loading = false;
					}
				})
				.catch(e => {
					if (this.mounted) {
						this.setState(state => ({
							raw_data: [],
							records: [],
							loading: false,
						}));
					} else {
						this.state.records = [];
						this.state.loading = false;
					}
				});
		} else {
			resolved_data = ServiceDataHelper.resolveReferenceColumnsDisplays(
				target_data,
				columns,
				auth.user
			);
			let that = this;
			let all_records = resolved_data.map(entry => {
				return that.parseData(entry);
			});
			this.setState(state => ({ records: all_records }));
		}
	}

	render() {
		const { classes, defination, api, cache, actionsType } = this.props;
		const table_options = {
			filterType: "dropdown",
			filter: true,
			downloadOptions: {
				filename:
					(defination ? defination.label : "Records") +
					" - " +
					new Date().format("d M Y H:i:s A") +
					".csv",
				separator: ",",
			},
			resizableColumns: false,
			selectableRows: "none",
			responsive: "scroll",
			pagination: false,
			rowHover: true,
			/*onCellClick: (colData, cellMeta) => {
				console.log("onCellClick colData", colData);
			},
			setRowProps: (row, dataIndex, rowIndex) => {
				console.log("setRowProps dataIndex", dataIndex);
				let rowProps = {};
				if (actionsType === "context") {
					rowProps.onContextMenu = this.handleOnRowContextMenu(dataIndex);
				}
				return rowProps;
			},*/
			customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {}
		};
		/*if (actionsType === "context") {
			table_options.customRowRender = (data, dataIndex, rowIndex) => {
						console.log("customRowRender data", data);
						return (
							<TableRow key={"row-"+rowIndex} onContextMenu={ this.handleOnRowContextMenu(dataIndex) }>
								{data.map((value, index)=>(
									<TableCell 
										key={"row-"+rowIndex+"-cell-"+index}
									>
										{ value }
									</TableCell>
								))}
							</TableRow>
						);
					};
		}*/
		return (
			<GridContainer className={classes.root}>
				<GridItem className="p-0 m-0" xs={12}>
					{ this.state.loading && <GridContainer className={classes.full_height} justify="center" alignItems="center">
								<GridItem xs={12} className="flex relative flex-row">
									<div className="flex-grow">
										<Skeleton variant="text" width={150}/>
									</div>
									<div className="flex">
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
										<Skeleton variant="circle" width={32} height={32} className="float-right mx-2"/>
									</div>
								</GridItem>
								
								<GridItem xs={12}>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
									<Skeleton variant="rect" width={"100%"} height={70} className="mt-2"/>
								</GridItem>
					</GridContainer> }

					{(!this.state.loading && Array.isArray(this.state.records)) && <GridContainer className="p-0 m-0">
						<GridContainer className="p-0 m-0">
							<GridItem className="p-0 m-0" xs={12}>
								{actionsType === "context" && <ClickAwayListener onContextMenu={this.handleOnRowContextMenuClose} onClickAway={this.handleOnRowContextMenuClose}>
										<Menu											
											open={this.state.mouseY !== null}
											onClose={this.handleOnRowContextMenuClose}
											anchorReference="anchorPosition"
											anchorPosition={ this.state.mouseY !== null && this.state.mouseX !== null? { top: this.state.mouseY, left: this.state.mouseX } : undefined }
										>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Copy</MenuItem>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Print</MenuItem>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Highlight</MenuItem>
											<MenuItem onClick={ this.handleOnRowContextMenuClose }>Email</MenuItem>
										</Menu>
									</ClickAwayListener>}

								{this.state.records.length > 0 ? (
									<MUIDataTable
										title={(api.loading ? "Loading " : "") + defination.label + (api.loading ? "..." : "")}
										data={this.state.records}
										columns={this.state.dt_columns}
										options={table_options}
									/>
								) : (
									<GridContainer
										className="p-0 m-0"
										justify="center"
										alignItems="center"
									>
										<img
											alt="Empty list"
											className={classes.emptyImage}
											src={EmptyStateImage}
										/>
										<Typography
											className={classes.emptyText}
											color="grey"
											variant="body2"
											center
											fullWidth
										>
											No{" "}
											{defination.label
												? defination.label
												: "Records"}{" "}
											found
										</Typography>
									</GridContainer>
								)}
							</GridItem>
						</GridContainer>
						{(api ? api.busy && api.error : false) && (
							<GridContainer>
								<GridItem xs={12}>
									<Typography
										color="error"
										variant="body2"
										center
										fullWidth
									>
										{"An error occured. \n " + api.error.msg +" \n Displaying cached data."}
									</Typography>
								</GridItem>
							</GridContainer>
						)}
					</GridContainer> }

				</GridItem>
			</GridContainer>
		);
	}
}
TableView.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	show_actions: PropTypes.bool,
	show_links: PropTypes.bool,
	query: PropTypes.object,
	cache_data: PropTypes.bool,
	load_data: PropTypes.bool,
	onLoadData: PropTypes.func,
	
};

TableView.defaultProps = {
	show_actions: true,
	show_links: true,
	query: { p: 1 },
	cache_data: true,
	load_data: true,
	actionsType: "inline",
};

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	cache: state.cache,
	api:state.api,
});

export default withErrorHandler(
	compose(
		withStyles(styles),
		withGlobals,
		connect(mapStateToProps, { openDialog, closeDialog, apiCallRequest })
	)(TableView)
);
