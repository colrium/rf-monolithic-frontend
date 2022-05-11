/** @format */

import { CircularProgress, Icon } from "@mui/material";

//
import Calendar from "components/Calendar";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";
import React from "react";
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import { closeDialog, openDialog } from "state/actions";
//
import ApiService from "services/Api";


class TimelineView extends React.Component {
	calendarRef = React.createRef();
	state = {
		loading: true,
		load_error: false,
		records: [],
	};

	constructor(props) {
		super(props);
		const { defination, service, query } = props;

		this.state.defination = defination;
		this.state.service = service;
		this.state.query = query ? { ...query, p: 1 } : { p: 1 };

		this.handleEditItem = this.handleEditItem.bind(this);
		this.handleDeleteItemConfirm = this.handleDeleteItemConfirm.bind(this);
		this.handleDeleteItem = this.handleDeleteItem.bind(this);
	}

	componentDidMount() {
		this.loadContext();
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
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot.contextReloadRequired) {
			this.loadContext();
		}
		if (snapshot.dataReloadRequired) {
			const { query } = this.props;
			this.setState(
				{ query: query ? { ...query, p: 1 } : { p: 1 } },
				this.loadData
			);
		}
	}

	componentWillUnmount() {
		const { openDialog, closeDialog } = this.props;
		closeDialog();
	}

	handleEditItem(event) {
		const { auth } = this.props;

		if (
			!this.state.defination.access.actions.update.restricted(auth.user)
		) {
			window.location.href =
				"/" +
				this.state.defination.access.actions.update.uri(
					event.schedule.id
				);
		}
	}

	handleDeleteItemConfirm(event) {
		const { openDialog, closeDialog } = this.props;
		let that = this;
		openDialog({
			title: "Confirm Delete",
			body:
				"Are you sure you want delete " +
				event.schedule.title +
				"? This action might be irreversible",
			actions: {
				cancel: {
					text: "Cancel",
					color: "default",
					onClick: () => closeDialog(),
				},
				delete: {
					text: "Delete",
					color: "error",
					onClick: this.handleDeleteItem(event.schedule.id),
				},
			},
		});
	}

	handleDeleteItem = item_id => event => {
		const { openDialog, closeDialog } = this.props;

		openDialog({
			title: "Deleting safely",
			body: "Please wait. Executing safe delete...",
			actions: {},
		});

		this.state.service
			.deleteRecordById(item_id)
			.then(res => {
				closeDialog();
				this.loadData();
			})
			.catch(e => {
				closeDialog();
			});
	};

	loadContext() {
		const { defination, service, query, auth } = this.props;
		if (defination) {
			this.setState(
				{
					defination: defination,
					service: service,
					query: query ? { ...query, p: 1 } : { p: 1 },
					calendars: [
						{
							id: defination.name,
							name: defination.label,
							bgColor: defination.color,
							borderColor: defination.color,
						},
					],
					records: [],
					loading: false,
				},
				this.loadData
			);
		}
	}

	loadData() {
		const { auth } = this.props;

		if (this.state.defination && this.state.service) {
			this.setState(state => ({ records: [], loading: true }));
			this.state.service
				.getRecords(this.state.query)
				.then(res => {
					let raw_data = res.body.data;
					this.state.defination.views.listing.calendarview
						.resolveData(raw_data)
						.then(data => {
							this.setState(state => ({
								records: data,
								loading: false,
							}));
						})
						.catch(err => {
							this.setState(state => ({
								records: [],
								load_error: { msg: err },
								loading: false,
							}));
						});
				})
				.catch(err => {
					this.setState(state => ({
						records: [],
						load_error: { msg: err },
						loading: false,
					}));
				});
		} else {
			this.setState(state => ({
				records: [],
				load_error: { msg: "No Context defination or provided" },
				loading: false,
			}));
		}
	}

	render() {

		return (
			<Grid container className={`p-0`}>
				{this.state.defination && (
					<Grid item  className="p-0 m-0" xs={12}>
						{this.state.loading ? (
							<Grid container
								justify="center"
								alignItems="center"
							>
								<Grid item  xs={1}>
									<CircularProgress
										size={24}
										thickness={4}
										color="secondary"
										disableShrink
									/>
								</Grid>
							</Grid>
						) : (
							<Grid container className="p-0 m-0">
								{this.state.load_error ? (
									<Grid container>
										<Grid item  xs={12}>
											<Typography
												color="error"
												variant="h1"
																								fullWidth
											>
												<Icon fontSize="large">
													error
												</Icon>
											</Typography>
										</Grid>
										<Grid item  xs={12}>
											<Typography
												color="error"
												variant="body1"
																								fullWidth
											>
												An error occured.
												<br />
												Status Code :{" "}
												{this.state.load_error.code}
												<br />
												{this.state.load_error.msg}
											</Typography>
										</Grid>
									</Grid>
								) : (
									<Grid container className="p-0 m-0">
										<Grid item  className="p-0 m-0" xs={12}>
											{Array.isArray(
												this.state.records
											) &&
												this.state.records.length > 0 ? (
												<Grid container className="p-0 m-0">
													<Grid item  xs={12}>
														<Calendar
															icon={
																this.state
																	.defination
																	.icon
															}
															title={
																this.state
																	.defination
																	.label
															}
															title_color={
																this.state
																	.defination
																	.color
															}
															icon_color={
																this.state
																	.defination
																	.color
															}
															subtitle=""
															calendars={
																this.state
																	.calendars
															}
															view="month"
															schedules={
																this.state
																	.records
															}
															onClickEdit={
																this
																	.handleEditItem
															}
															onClickDelete={
																this
																	.handleDeleteItemConfirm
															}
														/>
													</Grid>
												</Grid>
											) : (
												<Grid container
													className="p-0 m-0"
													justify="center"
													alignItems="center"
												>
													<img
														alt="Empty list"
														src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/empty-state-table.svg")}
													/>
													<Typography
														color="grey"
														variant="body2"
																												fullWidth
													>
														No{" "}
														{this.state.defination
															.label
															? this.state
																.defination
																.label
															: "Records"}{" "}
														found
													</Typography>
												</Grid>
											)}
										</Grid>
									</Grid>
								)}
							</Grid>
						)}
					</Grid>
				)}
			</Grid>
		);
	}
}
TimelineView.propTypes = {
	className: PropTypes.string,

	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	calendarProps: PropTypes.object,
	query: PropTypes.object,
};

TimelineView.defaultProps = {
	calendarProps: {
		height: "900px",
		defaultView: "month",
		disableDblClick: true,
		disableClick: true,
		isReadOnly: false,
		useDetailPopup: true,
		useCreationPopup: false,
		scheduleView: true,
		taskView: false,
	},
	query: {},
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default (
	compose(

		connect(mapStateToProps, { openDialog, closeDialog })
	)(TimelineView)
);
