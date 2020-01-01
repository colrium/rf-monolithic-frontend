import { Icon } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from "@material-ui/core/styles/withStyles";
//
import EmptyStateImage from 'assets/img/empty-state-table.svg';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Typography from 'components/Typography';
import ProgressIndicator from "components/ProgressIndicator";
import PropTypes from 'prop-types';
import React from "react";
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import * as Actions from 'state/actions';
//
import { UtilitiesHelper } from 'utils/Helpers';
import styles from './styles';









class ListView extends React.Component {
	calendarRef = React.createRef();
	state = {
		loading: true,
		load_error: false,
		records: [],
	};
	constructor(props) {
		super(props);
		const { defination } = props;
		
		this.handleDeleteItemConfirm = this.handleDeleteItemConfirm.bind(this);
		this.handleDeleteItem = this.handleDeleteItem.bind(this);
	}

	componentDidMount(){
		this.prepareForData();
		this.loadAll({p: 1});
	}

	componentWillReceiveProps(nextProps) {
		if(!Object.entries(this.props.defination).equals(Object.entries(nextProps.defination))){
			/*this.prepareForData();
			this.loadAll({p: 1});*/
		}
	}

	componentDidUpdate(prevProps) {
		if(!Object.entries(this.props.defination).equals(Object.entries(prevProps.defination)) || !Object.entries(this.props.service).equals(Object.entries(prevProps.service))){
			//this.loadAll({p: 1});
			this.prepareForData();
			this.loadAll({p: 1});
		}
	} 

	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch(Actions.closeDialog());
	}

	handleChangeCalendarView = view => event => {
		this.setState(state => ({view: view}));
	}

	handleDeleteItemConfirm = item_id => event => {
		const { dispatch } = this.props;
		let that = this;
		dispatch(Actions.openDialog({
			title: "Confirm Delete",
			body: "Are you sure you want delete entry? This action might be irreversible",
			actions: {
				cancel: {
					text: "Cancel",
					color: "default",
					onClick: ()=> dispatch(Actions.closeDialog()),
				},
				delete: {
					text: "Delete",
					color: "error",
					onClick: this.handleDeleteItem(item_id),
				}
			}
		}))
	}

	handleDeleteItem = item_id => event => {
		const { dispatch } = this.props;

		dispatch(Actions.openDialog({
			title: "Deleting safely",
			body: "Please wait. Executing safe delete...",
			actions: {
				close: {
					text: "Close",
					color: "default",
					onClick: ()=> dispatch(Actions.closeDialog()),
				}
			}
		}));
	}

	prepareForData(){
		const { classes, defination, auth, dispatch } = this.props;

		let columns = defination.scope.columns;
		
		this.state.records = [];
		this.state.loading = false;

	}


	parseData(entry){
		const {defination, service, auth} = this.props;		
		let parsed_data = entry;
		let columns = defination.scope.columns
		
		return parsed_data;
	}
	
	loadAll(query_data){
		const { service, auth, defination } = this.props;
		let columns = defination.scope.columns
		this.setState(state => ({ loading: true }));
		service.getRecords(query_data).then((res) => {
			let raw_data = res.body.data;
			if (UtilitiesHelper.isOfType(defination.views.listing.listview.resolveData, "function") ) {
				defination.views.listing.listview.resolveData(raw_data).then(data => {
					this.setState(state => ({ records: data, loading: false }));
				}).catch((err)=>{
					console.log("err", err);
					this.setState(state => ({ records: [], load_error: err, loading: false }));
				});
			}
				
			
		}).catch((err)=>{
			console.log("err", err);
			this.setState(state => ({ records: [], load_error: err, loading: false }));
		});
	}
	render() {
		const { classes, defination, service, googleMapProps } = this.props;
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
												Status Code : {this.state.load_error.code}
												<br />
												{this.state.load_error.msg}
											</Typography>
										</GridItem>
									</GridContainer>
									): (
									<GridContainer className="p-0 m-0">										
										<GridItem className="p-0 m-0" xs={12}>
										{ Array.isArray(this.state.records) && this.state.records.length > 0? (
											<GridContainer className="p-0 m-0">
													<GridItem xs={12}>
														<List className={classes.root}>
															{ this.state.records.map((entry, index) => (
																<div key={defination.name+'-'+index}>
																	<ListItem alignItems="flex-start">
																		{ entry.avatar && <ListItemAvatar> {entry.avatar} </ListItemAvatar> }
																		{ entry.icon && <ListItemIcon> {entry.icon} </ListItemIcon> }
																		
																		<ListItemText primary={entry.title} secondary={entry.body} />
		      														</ListItem>
																	<Divider variant="inset" component="li" />
																</div>
															)) }
																
														</List>
													</GridItem>	
											</GridContainer>
										) : (
											<GridContainer className="p-0 m-0" justify="center" alignItems="center">
												<img alt="Empty list" className={classes.emptyImage} src={EmptyStateImage} />
												<Typography className={classes.emptyText} color="grey" variant="body2" center fullWidth>
													No {defination.label? defination.label : "Records"} found
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
ListView.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	show_actions: PropTypes.bool,
	show_links: PropTypes.bool,
	query: PropTypes.object,
};

ListView.defaultProps = {
	query: {}
};


const mapStateToProps = state => ({
	auth: state.auth
});


export default compose(withStyles(styles), connect(mapStateToProps, {}))(ListView);
