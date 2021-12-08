/** @format */

//
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "components/Avatar";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Skeleton from '@mui/material/Skeleton';
import { formats } from "config/data";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import ReactJson from 'react-json-view'
import ApiService from "services/Api";
import { apiCallRequest, closeDialog, openDialog } from "state/actions";
//
import { FilesHelper, ServiceDataHelper, UtilitiesHelper } from "hoc/Helpers";

import { useSetState, useDidMount } from "hooks";


const TableView = (props) => {
	const { defination, service, query: propsQuery, cache: { data: cachedData }, auth, apiCallRequest, cache_data, onLoadData, load_data } = props;
	const [state, setState, getState] = useSetState({
		loading: true,
		load_error: false,
		defination: null,
		service: null,
		query: { ...propsQuery, p: 1 },
		columns: [],
		records: Array.isArray(cachedData[defination?.name]) ? cachedData[defination.name] : [],
		raw_data: [],
		raw_data_mutated: false,
		mouseX: null,
		mouseY: null,
		actionsView: "contextMenu",
		context: null,
	});

	const parseColumns = useCallback(() => {

	}, []);


	const loadData = useCallback(() => {
		if (!!defination && defination?.endpoint) {
			const { query } = getState()
			if (load_data) {
				setState({ loading: true, load_error: false });
				apiCallRequest(defination.name,
					{
						uri: defination.endpoint,
						type: "records",
						params: query,
						data: {},
						cache: cache_data,
					}
				).then(res => {
					const { data } = res.body;
					//
					setState({ loading: false, records: data });
					if (Function.isFunction(onLoadData)) {
						onLoadData(data, query);
					}

				}).catch(e => {
					setState({
						load_error: e,
						loading: false,
					});
				});
			}
			else {
				let data = Array.isArray(cache.data[defination.name]) ? cache.data[defination.name] : [];
				if (Function.isFunction(onLoadData)) {
					onLoadData(data, query);
				}
			}
		}
		else {
			setState({
				records: [],
				load_error: { msg: "No Context defination or provided" },
				loading: false,
			});
		}
	}, [load_data, cache_data, onLoadData, defination]);


	useDidMount(() => {
		parseColumns();
		loadData();
	});

	return (
		<GridContainer className={ "p-0" }>
			<GridItem className="p-0 m-0" xs={ 12 }>

			</GridItem>
		</GridContainer>
	);
}
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
	query: { p: 1 },
	cache_data: true,
	load_data: true,
	actionsType: "inline",
};

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	cache: state.cache,
	api: state.api,
});

export default (compose(connect(mapStateToProps, { openDialog, closeDialog, apiCallRequest }))(TableView));
