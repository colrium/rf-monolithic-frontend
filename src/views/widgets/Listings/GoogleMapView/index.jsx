/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import EmptyStateImage from "assets/img/empty-state-table.svg";
import GoogleMap from "components/GoogleMap";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { apiCallRequest, closeDialog, openDialog } from "state/actions";
import { withErrorHandler } from "hoc/ErrorHandler";
import styles from "./styles";



class GoogleMapView extends React.Component {
	calendarRef = React.createRef();
	state = {
		loading: true,
		load_error: false,
		defination: null,
		service: null,
		query: { p: 1 },
		records: [],
	};
	constructor(props) {
		super(props);
		const { defination, service, query } = props;

		this.state.defination = defination;
		this.state.service = service;
		this.state.query = query ? { ...query, p: 1 } : { p: 1 };

		this.handleDeleteItemConfirm = this.handleDeleteItemConfirm.bind(this);
		this.handleDeleteItem = this.handleDeleteItem.bind(this);
	}

	componentDidMount() {
		this.loadContext();
		this.prepareData();
	}
	getSnapshotBeforeUpdate(prevProps) {
		return {
			contextReloadRequired:
				!Object.areEqual(prevProps.defination, this.props.defination) &&
				!Object.areEqual(prevProps.service, this.props.service),
			dataReloadRequired: !Object.areEqual(
				prevProps.query,
				this.props.query
			),
			dataPreparationRequired: prevProps.cache !== this.props.cache,
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot.contextReloadRequired) {
			this.loadContext();
			this.prepareData();
		}
		if (snapshot.dataReloadRequired) {
			const { query } = this.props;
			this.setState(
				{ query: query ? { ...query, p: 1 } : { p: 1 } },
				this.loadData
			);
		}
		if (snapshot.dataPreparationRequired) {
			this.prepareData();
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
					onClick: event => {
						closeDialog();
						this.handleDeleteItem(item_id);
					},
				},
			},
		});
	};

	handleDeleteItem = item_id => event => {
		const { openDialog, closeDialog } = this.props;
		openDialog({
			title: "Deleting safely",
			body: "Please wait. Executing safe delete...",
			actions: {
				close: {
					text: "Close",
					color: "default",
					onClick: () => closeDialog(),
				},
			},
		});
	};

	loadContext() {
		const { defination, service, query, cache } = this.props;
		if (defination) {
			this.setState(
				{
					defination: defination,
					service: service,
					query: query ? { ...query, p: 1 } : { p: 1 },
					loading: false,
				},
				this.loadData
			);
		}
	}

	loadData() {
		const { auth, apiCallRequest, defination, cache } = this.props;
		if (defination) {
			apiCallRequest(
				defination.name,
				{
					uri: defination.endpoint,
					type: "records",
					params: this.state.query,
					data: {},
				},
				true
			);
		} else {
			this.setState(state => ({
				records: [],
				load_error: { msg: "No Context defination or provided" },
				loading: false,
			}));
		}
	}

	prepareData() {
		const { auth, cache, defination } = this.props;
		let cached_data = Array.isArray(cache) ? cache : [];
		let resolved_data = [];

		if (
			Function.isFunction(
				defination.views.listing.googlemapview.resolveData
			)
		) {
			defination.views.listing.googlemapview
				.resolveData(cached_data, true)
				.then(resolve => {
					this.setState(state => ({
						records: resolve,
						loading: false,
					}));
				})
				.catch(err => {
					
					this.setState(state => ({ records: [], loading: false }));
				});
		}
	}
	render() {
		const { classes, googleMapProps, api, defination } = this.props;
		return (
			<GridContainer className={classes.root}>
				<GridItem className="p-0 m-0" xs={12}>
					<GridContainer className="p-0 m-0">
						<GridContainer className="p-0 m-0">
							<GridItem className="p-0 m-0" xs={12}>
								<GridContainer className="p-0 m-0">
										<GridItem xs={12} className="p-0 m-0">
											<GoogleMap
												defaultZoom={5}
												{...googleMapProps}

												disabled={
													api ? api.loading : true
												}
												polylines={
													defination &&
													defination.views.listing
														.googlemapview.type ===
														"polyline"
														? this.state.records
														: []
												}
												markers={
													defination.views.listing
														.googlemapview.type ===
													"marker"
														? this.state.records
														: []
												}
												circles={
													defination.views.listing
														.googlemapview.type ===
													"circle"
														? this.state.records
														: []
												}
												
											/>
										</GridItem>
									</GridContainer>
							</GridItem>
						</GridContainer>
						{(api ? api.complete && api.error : false) && (
							<GridContainer>
								<GridItem xs={12}>
									<Typography
										color="error"
										variant="body2"
										center
										fullWidth
									>
										{"An error occured. \n " +
											api.error.msg}
									</Typography>
								</GridItem>
							</GridContainer>
						)}
					</GridContainer>
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
	googleMapProps: {
		height: "900px",
	},
	query: {},
};

const mapStateToProps = (state, ownProps) => {
	const { defination } = ownProps;
	return {
		auth: state.auth,
		cache: defination ? state.cache.data[defination.name] : null,
		api: defination ? state.api[defination.name] ? state.api[defination.name] : {} : {},
	};
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, { apiCallRequest, openDialog, closeDialog }),
	withErrorHandler
)(GoogleMapView);
