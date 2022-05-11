/** @format */

//
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "components/Avatar";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { formats } from "config/data";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import ReactJson from 'react-json-view'
import {
	ContentCopyOutlined as ContentCopyOutlinedIcon,
	Launch as LaunchIcon,
	EditOutlined as EditOutlinedIcon,
	DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import { closeDialog, openDialog } from "state/actions";
import VirtualizedTable from "components/Virtualized/Table";
import DataTable from "components/DataTable";
import { FilesHelper, ServiceDataHelper, UtilitiesHelper } from "utils/Helpers";
import { useNetworkServices } from "contexts";
import { useSetState, useDidMount, useDidUpdate } from "hooks";

const TableView = props => {
	const {
		defination,
		service,
		query,
		auth,
		onLoadData,
		load_data,
	} = props;
	const [state, setState, getState] = useSetState({
		loading: true,
		load_error: false,
		columns: [],
		data: [],
		raw_data: [],
		raw_data_mutated: false,
		mouseX: null,
		mouseY: null,
		actionsView: "contextMenu",
		context: null,
		page: 0,
		order: "",
		orderBy: "",
		rowsPerPage: 10,
		selectedRow: null,
		selectedItems: {},
		openRows: {},
		filters: null,
		notificationsCount: 0,
	});
	let columnsRef = React.useRef([]);
	let queryRef = React.useRef(query);

	const {Api} = useNetworkServices()

	const isActionRestricted = useCallback((check, rowData={}) => {
		let actionRestricted = false;
		if (Function.isFunction(check)) {
			if (check.length === 0) {
				actionRestricted = check()
			}
			else if (check.length === 1) {
				actionRestricted = check(auth?.user || {})
			}
			else {
				actionRestricted = check(auth?.user || {}, rowData)
			}
		}
		return actionRestricted;
	}, [auth?.user])

	const getActionUri = useCallback((uri, rowData={}) => {
		let actionUri = "#";
		if (Function.isFunction(uri)) {
			if (check.length === 0) {
				actionUri = uri()
			}
			else if (check.length === 1) {
				actionUri = uri(auth?.user || {})
			}
			else {
				actionUri = uri(auth?.user || {}, rowData)
			}
		}
		return actionUri;
	}, [auth?.user])

	const getActionIconComponent = useCallback((action, rowData={}) => {
		let actionLink = "#";
		if (Function.isFunction(uri)) {
			if (check.length === 0) {
				actionUri = uri()
			}
			else if (check.length === 1) {
				actionUri = uri(auth?.user || {})
			}
			else {
				actionUri = uri(auth?.user || {}, rowData)
			}
		}
		return actionUri;
	}, [auth?.user])

	const parseColumns = useCallback(() => {
		let columnsArr = [];
		if (Object.isObject(defination?.scope?.columns)) {
			let freeActions = [];
			let actions = [];
			let tableviewActionsArr = []

				if (Function.isFunction(defination?.access?.actions?.tableview)) {
					tableviewActionsArr = defination.access.actions.tableview(auth.user)
				}
				else if (Array.isArray(defination?.access?.actions?.tableview)) {
					tableviewActionsArr = tableviewActionsArr.concat(defination.access.actions.tableview)
				}
				else if (!JSON.isEmpty(defination?.access?.actions)) {
					Object.entries(defination.access.actions).map(([actionKey, actionValue], actionIndex) => {
						let actionInitiallyRestricted = true;
						let actionRestrictedCallback = false;
						if (Function.isFunction(actionValue?.restricted)) {
							if (actionValue.restricted.length === 1) {
								actionInitiallyRestricted = actionValue.restricted(auth.user)
							}
							else {
								actionRestrictedCallback = actionValue.restricted
							}
						}
						else {
							actionInitiallyRestricted = !!actionValue?.restricted
						}
						if (!actionInitiallyRestricted) {
							const actionIcon = actionValue?.icon || actionValue?.link?.inline?.listing
							if (!actionValue?.isFreeAction) {
								tableviewActionsArr.push({
									...actionValue,
									id: actionKey,
									tooltip: actionValue?.tooltip || actionValue?.label || actionKey.humanize(),
									icon: actionIcon,
									// onClick: (event, rowData) => document.location.href = ( "commissions/delete/" + rowData._id).toUriWithDashboardPrefix(),
									hideCondition: (row) => isActionRestricted(actionRestrictedCallback, row),
								});
							}
							else{
								//
								freeActions.push({
									...actionValue,
									id: actionKey,
									tooltip: actionValue?.tooltip || actionValue?.label || actionKey.humanize(),
									icon: actionIcon,
									// onClick: (event, rowData) => document.location.href = ( "commissions/delete/" + rowData._id).toUriWithDashboardPrefix(),
									hideCondition: (row) => isActionRestricted(actionRestrictedCallback, row),
								});
							}

						}
					})


				}
				if (Array.isArray(tableviewActionsArr) && tableviewActionsArr.length > 0) {
					actions = tableviewActionsArr.reduce((actionsArr, action) => {
							if (!action?.isFreeAction) {
								actionsArr.push({
									...action,
									// icon: <LaunchIcon />
								})
							}
							else{
								freeActions.push(action)
							}
							return actionsArr;
						}, [])
					columnsArr.push({
						key: "actions",
						label: "Actions",
						className: "align-center",
						actions: actions,
					});
				}


			columnsArr.push({
				key: "_id",
				attribute: "_id",
				label: "ID",
			});
			columnsArr = Object.entries(defination?.scope?.columns).reduce(
				(columnsArrValue, [key, value]) => {
					let labelValue = value.label;
					if (Function.isFunction(value.label)) {
						labelValue = value.label(auth?.user);
					}

					columnsArrValue.push({
						key: key,
						attribute: key,
						label: labelValue,
						component: value.tableProps?.render,
						sortable:
							value.type !== "object" &&
							JSON.isEmpty(value.reference),
						object:
							value.type === "object" ||
							!JSON.isEmpty(value.reference),
						date: value.type === "date",
						datetime: value.type === "datetime",
						time: value.type === "time",
						boolean: value.type === "boolean",
						reference: !JSON.isEmpty(value.reference),
						truncate: value.truncate || 100,
						// className: !JSON.isEmpty(value.reference)? "p-2 text-blue-400 hover:text-blue-500 transition" : "p-2",
						className: !JSON.isEmpty(value.reference) ? (data, header) => (JSON.isJSON(data[key])? "p-2 text-blue-400 hover:text-blue-500 transition" : "p-2") : "p-2",
						resolveReferenceText: (data, header) => {
									if (header.reference) {
										let valueText = String.isString(data)
											? data
											: "";
										if (
											data &&
											Array.isArray(
												value.reference?.resolves
													?.display?.primary
											)
										) {
											if (JSON.isJSON(data)) {
												value.reference.resolves.display.primary.map(
													entry => {
														let entryValue =
															JSON.getDeepPropertyValue(
																entry,
																data
															);
														valueText = `${valueText} ${
															entryValue
																? entryValue
																: ""
														} `;
													}
												);
												valueText = valueText
													.trim()
													.truncate(50);
											}
										}
										return valueText;
									}
						},
					});
					return columnsArrValue;
				},
				columnsArr
			);
		}

		columnsRef.current = columnsArr
		// setState({
		// 	columns: columnsArr,
		// });
	}, [defination]);

	const loadData = useCallback(
		(reset = false) => {
			if (!!defination && defination?.endpoint) {
				setState(prevState => ({
					loading: true,
					load_error: false,
					data: reset ? [] : prevState.data,
					pages: reset ? 1 : prevState.pages,
					page: reset ? 0 : prevState.page,
					count: reset ? 0 : prevState.count,
				}))
				Api.get(defination.endpoint, { params: { ...queryRef.current } })
					.then(res => {
						const { sort } = { ...queryRef.current }
						const { data, pages, page, count } = { ...res?.body }
						//

						setState({
							loading: false,
							data: data,
							pages,
							page,
							count,
							sort: sort,
						})
						if (Function.isFunction(onLoadData)) {
							onLoadData(data, queryRef.current)
						}
					})
					.catch(e => {
						setState({
							load_error: e,
							loading: false,
						})
					})
			} else {
				setState({
					data: [],
					load_error: { msg: "No Context defination or provided" },
					loading: false,
				})
			}
		},
		[onLoadData, defination]
	)

	useDidMount(() => {
		parseColumns()
		loadData(false)
	})

	useDidUpdate(() => {
		queryRef.current = { ...queryRef.current, ...query }
		loadData(false)
	}, [query])

	useDidUpdate(() => {
		parseColumns()
		loadData(true)
	}, [defination])


	return (
		<Grid container className={"p-0"}>
			<Grid item  className="p-0 m-0" xs={12}>
				<DataTable
					rows={Array.isArray(state.data) ? state.data : []}
					totalCount={state.count}
					headers={columnsRef.current}
					sort={state.sort}
					order={state.order}
					onPageChange={(event, page) => {
						queryRef.current = { ...queryRef.current, page: page + 1 }
						loadData()
					}}
					onRowsPerPageChange={event => {
						queryRef.current = { ...queryRef.current, rpp: event?.target?.value || 10, pagination: event?.target?.value || 10 }
						loadData()
					}}
					orderBy={state.orderBy}
					loading={state.loading}
					page={state.page - 1}
					rowsPerPage={queryRef.current?.rpp || queryRef.current?.pagination || 10}
				/>
			</Grid>
		</Grid>
	)
};
TableView.propTypes = {
	className: PropTypes.string,

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
	query: { p: 1, pagination: 50 },
	cache_data: true,
	load_data: true,
	actionsType: "inline",
};

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default compose(connect(mapStateToProps, { openDialog, closeDialog }))(TableView);
