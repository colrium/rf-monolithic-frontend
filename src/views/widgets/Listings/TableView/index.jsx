import { Icon } from '@material-ui/core';
//
import Chip from '@material-ui/core/Chip';
import withStyles from "@material-ui/core/styles/withStyles";
import EmptyStateImage from 'assets/img/empty-state-table.svg';
import Avatar from 'components/Avatar';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Typography from 'components/Typography';
import ProgressIndicator from "components/ProgressIndicator";
//
import { formats } from 'config/data';
import MUIDataTable from "mui-datatables";
import PropTypes from 'prop-types';
import React from "react";
//
import clsx from "clsx";
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { attachments as AttachmentsService } from 'services';
import { closeDialog, openDialog } from 'state/actions';
//
import { FilesHelper, ServiceDataHelper, UtilitiesHelper } from 'utils/Helpers';
import withRoot from 'utils/withRoot';
import styles from './styles';



class TableView extends React.Component {
	state = {
		loading: true,
		load_error: false,
		defination: null,
		service: null,
		query: { p : 1 },
		dt_columns: [],
		records: [],
	};
	constructor(props) {
		super(props);
		const { defination, service, query } = props;
		this.state.defination = defination;
		this.state.service = service;
		this.state.query = query? {...query, p:1} : {p:1};
		this.handleDeleteItemConfirm = this.handleDeleteItemConfirm.bind(this);
		this.handleDeleteItem = this.handleDeleteItem.bind(this);
	}

	componentDidMount(){
		this.loadContext();
	}

	getSnapshotBeforeUpdate(prevProps) {
		return {
			contextReloadRequired: (!Object.areEqual(prevProps.defination, this.props.defination) && !Object.areEqual(prevProps.service, this.props.service)), 
			dataReloadRequired: !Object.areEqual(prevProps.query, this.props.query)
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot.contextReloadRequired) {
			this.loadContext();
		}
		if (snapshot.dataReloadRequired) {
			const { query } = this.props;
			this.setState({query: query? {...query, p:1} : {p:1}}, this.loadData);
		}
	} 
	

	handleDeleteItemConfirm = item_id => event => {
		const { openDialog, closeDialog } = this.props;
		let that = this;
		openDialog({
			title: "Confirm Delete",
			body: "Are you sure you want delete entry? This action might be irreversible",
			actions: {
				cancel: {
					text: "Cancel",
					color: "default",
					onClick: ()=> closeDialog(),
				},
				delete: {
					text: "Delete",
					color: "error",
					onClick: this.handleDeleteItem(item_id),
				}
			}
		});
	}

	handleDeleteItem = item_id => event => {
		const { openDialog, closeDialog } = this.props;

		openDialog({
			title: "Deleting ",
			body: "Please wait. Executing safe delete...",
			actions: {}
		});

		this.state.service.delete(item_id).then((res) => {
			closeDialog();
			this.loadData();

		}).catch(e=>{
			console.log("TableView delete error", e);
			closeDialog();
		})


	}

	loadContext(){
		const { classes, defination, service, query, auth } = this.props;
		if ( defination ) {
			let columns = defination.scope.columns;
			let dt_columns = [];
			if (!defination.access.restricted(auth.user) ) {
				dt_columns.push({
					name: "_id",
					label: "Actions",
					options: {
						filter: false,
						sort: false,
						customBodyRender: (value, tableMeta, updateValue) => {
							return (
								<GridContainer spacing={2} className={classes.data_actions_wrapper}>
									{ Object.keys(defination.access.actions).map((action_name, action_index) => (
										defination.access.actions[action_name].restricted(auth.user)? "" : ( <div key={value+"_"+action_name+"_action"}>
													{ action_name==="delete"? defination.access.actions[action_name].link.inline.listing(value, "error_text", this.handleDeleteItemConfirm(value)) : defination.access.actions[action_name].link.inline.listing(value) }
											</div>
										)
											
									))}
								</GridContainer>
							);
						}
					}
				});

				for (let [name, field] of Object.entries(columns)) {
					let display_field = true;
					if (field.restricted && "display" in field.restricted ) {
						if (typeof field.restricted.display === "function") {
							display_field = !field.restricted.display(false, auth.user);
						}
					}

					if (display_field) {
						if (UtilitiesHelper.isOfType(this.state.defination.views.listing.tableview.resolveData, "function")) {
							if (field.reference || field.possibilities) {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities? true : false,
										sort: true,
										customBodyRender: (value, tableMeta, updateValue) => {
											if (Array.isArray(value)) {
												return (
													<GridContainer spacing={2}>
														{ value.map((entry, cursor) => (
															<div key={cursor}> {entry} </div>
														)) }
													</GridContainer>
												)
											}
											else{
												return (
													value !== null && value !== undefined? value : ""
												);
											}
												
										}
									}
								});
							}
							else{
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities? true : false,
										sort: true,
									}
								});
							}
								
						}
						else{
							if (field.reference && field.input.type !== "file") {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities? true : false,
										sort: true,
										customBodyRender: (value, tableMeta, updateValue) => {
											if (Array.isArray(value)) {
												return (
													<GridContainer spacing={2}>
														{ value.map((entry, cursor) => (
															<Chip className={classes.valueChip} key={entry.value} label={entry.resolve}/>
														)) }
													</GridContainer>
												)
											}
											else{
												return (
													value !== null && value !== undefined? (<Chip label={value.resolve}/>) : ""
												);
											}
												
										}
									}
								});
							}
							else if (field.reference && field.input.type === "file") {
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities? true : false,
										sort: true,
										customBodyRender: (value, tableMeta, updateValue) => {
											if (Array.isArray(value)) {
												console.log("value", value);
												return (
													<GridContainer spacing={2}>
														{ value.map((entry, cursor) => (
															<Chip 
																className={classes.valueChip}  
																avatar={<Avatar color="#cfd8dc" textColor="#000000" src={FilesHelper.fileType(entry.resolve)==="image"? AttachmentsService.getAttachmentFileUrl(entry.value) : undefined}>{FilesHelper.fileIcon(entry.resolve)}</Avatar>} 
																label={entry.resolve}
																onClick={(e)=>{ e.preventDefault(); let win = window.open(AttachmentsService.getAttachmentFileUrl(entry.value), '_blank'); win.focus(); }}
																key={"file-"+entry.value}/>
														)) }
													</GridContainer>
												)
											}
											else{
												return (
													value !== null && value !== undefined? (<Chip  
														avatar={<Avatar color="#cfd8dc" textColor="#000000" src={FilesHelper.fileType(value.resolve)==="image"? AttachmentsService.getAttachmentFileUrl(value.value) : undefined}>{FilesHelper.fileIcon(value.resolve)}</Avatar>}
														onClick={(e)=>{ e.preventDefault(); let win = window.open(AttachmentsService.getAttachmentFileUrl(value.value), '_blank'); win.focus(); }}
														label={value.resolve}/>) : ""
												);
											}
												
										}
									}
								});
							}
							else{
								dt_columns.push({
									name: name,
									label: field.label,
									options: {
										filter: field.possibilities? true : false,
										sort: true,
									}
								});	
							}
						}
							
					}

						

								
				}
			}

			/*this.state.dt_columns = dt_columns;
			this.state.records = [];
			this.state.loading = false;*/

			this.setState({defination: defination, service: service, query: query? {...query, p:1} : {p:1}, dt_columns: dt_columns, records: [], loading: false}, this.loadData);
		}
	}


	parseData(entry){
		const {defination, auth} = this.props;		
		let parsed_data = entry;
		let columns = this.state.defination.scope.columns
		parsed_data["_id"] = entry._id;
		for (let [field_name, field] of Object.entries(columns)) {
			if (field.input.type === "date") {
				if (entry[field_name]){
					parsed_data[field_name] = new Date(entry[field_name]).format(formats.dateformats.date);
				} else {
					parsed_data[field_name] = "";
				}
			}
			if (field.input.type === "datetime" && entry[field_name]) {
				if (entry[field_name]){
					parsed_data[field_name] = new Date(entry[field_name]).format(formats.dateformats.datetime);
				} else {
					parsed_data[field_name] = "";
				}
			}
			if (field.input.type === "time") {
				if (entry[field_name]){
					parsed_data[field_name] = new Date(entry[field_name]).format(formats.dateformats.time);
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
			if (JSON.isJSON(parsed_data[field_name]) && !field.reference) {
				parsed_data[field_name] = JSON.stringify(parsed_data[field_name]);
			}	
			if (field.possibilities) {
				if (JSON.isJSON(field.possibilities)) {
					if (entry[field_name] in field.possibilities) {
						parsed_data[field_name] = field.possibilities[entry[field_name]];
					}
				}
				else if (Function.isFunction(field.possibilities)) {
					let possibilities_obj = field.possibilities(entry, auth.user);
					if (JSON.isJSON(possibilities_obj)) {
						if (entry[field_name] in possibilities_obj) {
							parsed_data[field_name] = possibilities_obj[entry[field_name]];
						}
					}
						
				}
			}			
		}
		return parsed_data;
	}
	
	loadData(){
		const { auth } = this.props;
		let columns = this.state.defination? this.state.defination.scope.columns : {}
		this.setState(state => ({ loading: true }));
		if (this.state.service) {
			this.state.service.getRecords(this.state.query).then((res) => {
				let raw_data = res.body.data;
				let resolved_data = [];

				if (UtilitiesHelper.isOfType(this.state.defination.views.listing.tableview.resolveData, "function")) {
					this.state.defination.views.listing.tableview.resolveData(raw_data, true).then((resolve)=>{
						this.setState(state => ({ records: resolve, loading: false }));
					}).catch(e=>{
						console.log("this.defination.views.listing.tableview.resolveData error", e);
						this.setState(state => ({ records: [], loading: false }));						
					});
				}
				else{
					resolved_data = ServiceDataHelper.resolveReferenceColumnsDisplays(raw_data, columns, auth.user);
					let that = this;
					console.log("resolved_data", resolved_data);
					let all_records = resolved_data.map(entry => {
						return that.parseData(entry);
					});
					this.setState(state => ({ records: all_records, loading: false }));
				}
					
				
			}).catch((err)=>{
				console.error("TableView loadData Error", err);
				this.setState(state => ({ load_error: err, loading: false }));
			});
		}
			
	}

	render() {
		const { classes } = this.props;
		const table_options = {
					filterType: 'dropdown',
					downloadOptions: {
						filename: (this.state.defination? this.state.defination.label: "Records")+' - '+new Date().format('d M Y H:i:s A')+'.csv', 
						separator: ','
					},
					resizableColumns: false,
					selectableRows: false,
					responsive: "scroll",
				};
		return (
			<GridContainer className={classes.root}>
					<GridItem className="p-0 m-0" xs={12}>
						{this.state.loading? (
							<GridContainer className={classes.full_height} justify="center" alignItems="center">
								<GridItem xs={1}>
									<ProgressIndicator size={24} thickness={4} className={classes.progress} color="secondary" disableShrink	/>
								</GridItem>
							</GridContainer>
							) : (
							<GridContainer className="p-0 m-0">
								{this.state.load_error? (
									<GridContainer >
										<GridItem xs={12}>
											<Typography color="error" variant="h1" center fullWidth>
												<Icon fontSize="large">error</Icon>
											</Typography>
										</GridItem>
										<GridItem xs={12}>										
											<Typography color="error" variant="body1" center fullWidth>
												An error occured. 
												<br />
												 {this.state.load_error.code && ' Code :'+this.state.load_error.code}
												<br />
												{this.state.load_error.msg}
											</Typography>
										</GridItem>
									</GridContainer>
									): (
									<GridContainer className="p-0 m-0">										
										<GridItem className="p-0 m-0" xs={12}>
										{ this.state.defination && Array.isArray(this.state.records) && this.state.records.length > 0? (
											<MUIDataTable
												title={this.state.defination.label}
												data={this.state.records}
												columns={this.state.dt_columns}
												options={table_options}
											/>
										) : (
											<GridContainer className="p-0 m-0" justify="center" alignItems="center">
												<img alt="Empty list" className={classes.emptyImage} src={EmptyStateImage} />
												<Typography className={classes.emptyText} color="grey" variant="body2" center fullWidth>
													No {this.state.defination.label? this.state.defination.label : "Records"} found
												</Typography>
											</GridContainer>
										)}
											
										</GridItem>
									</GridContainer>								
								)}
							</GridContainer>																
						)}
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
};

TableView.defaultProps = {
	show_actions: true,
	show_links: true,
	query: {p:1},
};


const mapStateToProps = state => ({
	auth: state.auth
});


export default withRoot(compose(withStyles(styles), connect(mapStateToProps, { openDialog, closeDialog }))(TableView));
