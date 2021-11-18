/** @format */

import { Icon } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

//
import ApiService from "services/Api";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import * as Actions from "state/actions";
import Skeleton from '@mui/material/Skeleton';
import { apiCallRequest, closeDialog, openDialog } from "state/actions";



class ListView extends React.Component {

	state = {
		loading: true,
		load_error: false,
		raw_records: [],
		records: [],
	};
	constructor(props) {
		super(props);
		const { defination } = props;

		this.handleDeleteItemConfirm = this.handleDeleteItemConfirm.bind(this);
		this.handleDeleteItem = this.handleDeleteItem.bind(this);
	}

	componentDidMount() {
		const { cache, defination } = this.props;
		this.mounted = true;
		this.loadContext();
		this.prepareData((Array.isArray(cache.data[defination.name]) ? cache.data[defination.name] : []));
	}

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		const { cache, defination } = this.props;
		return {
			contextReloadRequired: !Object.areEqual(prevProps.defination, this.props.defination),
			dataReloadRequired: !Object.areEqual(prevProps.query, this.props.query),
			/*dataPreparationRequired: Array.isArray(cache.data[defination.name])? !cache.data[prevProps.defination.name].equals(prevProps.cache.data[defination.name]) : (Array.isArray(prevProps.cache.data[defination.name])? !prevProps.cache.data[prevProps.defination.name].equals(cache.data[defination.name]) : false),*/
			dataPreparationRequired: false,
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

	}


	handleDeleteItemConfirm = item_id => event => {
		const { dispatch } = this.props;
		let that = this;
		dispatch(
			Actions.openDialog({
				title: "Confirm Delete",
				body:
					"Are you sure you want delete entry? This action might be irreversible",
				actions: {
					cancel: {
						text: "Cancel",
						color: "default",
						onClick: () => dispatch(Actions.closeDialog()),
					},
					delete: {
						text: "Delete",
						color: "error",
						onClick: this.handleDeleteItem(item_id),
					},
				},
			})
		);
	};

	handleDeleteItem = item_id => event => {
		const { dispatch } = this.props;

		dispatch(
			Actions.openDialog({
				title: "Deleting safely",
				body: "Please wait. Executing safe delete...",
				actions: {
					close: {
						text: "Close",
						color: "default",
						onClick: () => dispatch(Actions.closeDialog()),
					},
				},
			})
		);
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
		const { auth, cache, defination, apiCallRequest, cache_data, onLoadData, load_data } = this.props;
		if (defination) {
			if (load_data) {
				apiCallRequest(defination.name,
					{
						uri: defination.endpoint,
						type: "records",
						params: this.state.query,
						data: {},
						cache: cache_data,
					}
				).then(res => {
					const { data } = res.body;
					if (Function.isFunction(onLoadData)) {
						onLoadData(data, this.state.query);
					}
					this.prepareData(data);
				}).catch(e => {
					this.setState(state => ({
						records: [],
						load_error: e,
						loading: false,
					}));
				});
			}
			else if (cache_data) {
				let data = Array.isArray(cache.data[defination.name]) ? cache.data[defination.name] : [];
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



	prepareData(data = null) {
		const { auth, cache, defination, entryItemProps } = this.props;
		let target_data = Array.isArray(data) ? data : (Array.isArray(cache.data[defination.name]) ? cache.data[defination.name] : []);
		let columns = defination ? defination.scope.columns : {};
		let resolved_data = [];

		if (Function.isFunction(defination.views.listing.listview.resolveData)) {
			defination.views.listing.listview.resolveData(target_data, auth.user, entryItemProps)
				.then(resolve => {
					this.setState(state => ({
						raw_records: data,
						records: resolve,
						loading: false,
					}));
				})
				.catch(err => {
					this.setState(state => ({ records: [], raw_records: [], loading: false }));
				});
		}
	}

	prepareForData() {
		const { defination, auth, dispatch } = this.props;

		let columns = defination.scope.columns;

		this.state.records = [];
		this.state.loading = false;
	}


	render() {
		const { defination, service, onClickEntry } = this.props;
		return (
			<GridContainer className={"p-0"}>
				<GridItem className="p-0 m-0" xs={12}>
					{this.state.loading ? (
						<GridContainer>
							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-3/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-8/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-4/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-3/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-5/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-9/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-4/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-3/12" />
								</div>
							</GridItem>

							<GridItem md={12} className={"flex flex-row items-center relative p-0 px-4 my-4"}>
								<Skeleton variant="circle" width={40} height={40} />
								<div className="flex-grow mx-2 flex flex-col">
									<Skeleton variant="text" className="w-4/12" />
								</div>
							</GridItem>
						</GridContainer>
					) : (
						<GridContainer className="p-0 m-0">
							{this.state.load_error ? (
								<GridContainer>
									<GridItem xs={12}>
										<Typography
											color="error"
											variant="h1"
																						fullWidth
										>
											<Icon fontSize="large">error</Icon>
										</Typography>
									</GridItem>
									<GridItem xs={12}>
										<Typography
											color="error"
											variant="body1"
											className={"w-full text-center"}
																						fullWidth
										>
											An error occured.
											<br />
											Status Code :{" "}
											{this.state.load_error.code}
											<br />
											{this.state.load_error.msg}
										</Typography>
									</GridItem>
								</GridContainer>
							) : (
								<GridContainer className="p-0 m-0">
									<GridItem className="p-0 m-0" xs={12}>
										{Array.isArray(this.state.records) &&
											this.state.records.length > 0 ? (
											<GridContainer className="p-0 m-0">
												<GridItem xs={12}>
													<List
														className={"p-0 transparent-bg"}
													>
														{this.state.records.map(
															(entry, index) => (
																<div
																	key={defination.name + "-" + index}
																>
																	<ListItem
																		button
																		alignItems="flex-start"
																		onClick={() => {
																			if (Function.isFunction(onClickEntry)) {
																				onClickEntry(this.state.raw_records[index], index);
																			}
																		}}
																	>
																		{entry.avatar && (
																			<ListItemAvatar>
																				{entry.avatar}
																			</ListItemAvatar>
																		)}
																		{entry.icon && (
																			<ListItemIcon>
																				{" "}
																				{
																					entry.icon
																				}{" "}
																			</ListItemIcon>
																		)}

																		<ListItemText
																			primary={
																				entry.title
																			}
																			secondary={
																				entry.body
																			}
																		/>

																	</ListItem>
																	<Divider
																		component="li"
																	/>
																</div>
															)
														)}
													</List>
												</GridItem>
											</GridContainer>
										) : (
											<GridContainer
												className="p-0 m-0"
												justify="center"
												alignItems="center"
											>
												<img
													alt="Empty list"
													src={ApiService.endpoint("/public/img/empty-state-table.svg")}
												/>
												<Typography
													color="grey"
													variant="body2"
																										fullWidth
												>
													No{defination?.label || "Records"} found
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

	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	show_actions: PropTypes.bool,
	query: PropTypes.object,
	cache_data: PropTypes.bool,
	load_data: PropTypes.bool,
	onLoadData: PropTypes.func,
	onClickEntry: PropTypes.func,
};

ListView.defaultProps = {
	show_actions: true,
	show_links: true,
	query: { p: 1 },
	load_data: true,
	cache_data: true,
};

const mapStateToProps = (state, ownProps) => {
	const { defination } = ownProps;
	return {
		auth: state.auth,
		cache: state.cache,
		api: state.api,
	};
};
export default compose(

	connect(mapStateToProps, { apiCallRequest, openDialog, closeDialog })
)(ListView);
