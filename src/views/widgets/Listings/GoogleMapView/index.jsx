import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Icon } from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
import EmptyStateImage from 'assets/img/empty-state-table.svg';
import GoogleMap from 'components/GoogleMap';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

import * as Actions from 'state/actions';
import styles from './styles';


class GoogleMapView extends React.Component {
	calendarRef = React.createRef();
	state = {
		loading: true,
		load_error: false,
		defination: null,
		service: null,
		query: { p : 1 },
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

	loadContext(){
		const { defination, service, query, auth } = this.props;
		if (defination) {
			this.setState({defination: defination, service: service, query: (query? {...query, p:1} : {p:1}), records: [], loading: false}, this.loadData);
		}

	}


	
	loadData(){
		const { auth } = this.props;		
		
		if (this.state.defination && this.state.service) {
			this.setState(state => ({ records: [], loading: true }));
			this.state.service.getRecords(this.state.query).then((res) => {
				let raw_data = res.body.data;
				this.state.defination.views.listing.googlemapview.resolveData(raw_data).then(data => {
					this.setState(state => ({ records: data, loading: false }));
				}).catch((err)=>{
					console.error("GoogleMapView resolveData err", err);
					this.setState(state => ({ records: [], load_error: err, loading: false }));
				});
				
			}).catch((err)=>{
				console.error("GoogleMapView loadData err", err);
				this.setState(state => ({ records: [], load_error: err, loading: false }));
			});
		}
		else{
			this.setState(state => ({ records: [], load_error: {msg: "No Context defination or provided"}, loading: false }));
		}
			
	}
	render() {
		const { classes, googleMapProps } = this.props;
		return (
			<GridContainer className={classes.root}>
					<GridItem className="p-0 m-0" xs={12}>
						{this.state.loading? (
							<GridContainer className="h-full p-0" justify="center" alignItems="center">
								<Skeleton variant="rect" width={"100%"} height={600} />
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
										{ Array.isArray(this.state.records) && this.state.records.length > 0? (
											<GridContainer className="p-0 m-0">
													<GridItem xs={12} className="p-0 m-0">
															<GoogleMap {...googleMapProps} polylines={this.state.defination && this.state.defination.views.listing.googlemapview.type === "polyline" ? this.state.records : []} markers={this.state.defination.views.listing.googlemapview.type === "marker" ? this.state.records : []} circles ={this.state.defination.views.listing.googlemapview.type === "circle" ? this.state.records : []} defaultZoom={5}/>
													</GridItem>	
											</GridContainer>
										) : (
											<GridContainer className="p-0 m-0" justify="center" alignItems="center">
												<img alt="Empty list" className={classes.emptyImage} src={EmptyStateImage} />
												<Typography className={classes.emptyText} color="grey" variant="body2" center fullWidth>
													No {this.state.defination && this.state.defination.label? this.state.defination.label : "Records"} found
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
GoogleMapView.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	show_actions: PropTypes.bool,
	show_links: PropTypes.bool,
	googleMapProps: PropTypes.object,
	query: PropTypes.object,
};

GoogleMapView.defaultProps = {
	googleMapProps : {
		height: "900px",
	},
	query: {},
};


const mapStateToProps = state => ({
	auth: state.auth
});


export default compose(withStyles(styles), connect(mapStateToProps, {}))(GoogleMapView);
