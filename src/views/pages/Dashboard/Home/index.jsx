/** @format */


import { colors } from "assets/jss/app-theme";
//
import Card from "@mui/material/Card";
import Grid from '@mui/material/Grid';
;
import LazyModule from "components/LazyModule";
import PropTypes from "prop-types";
import React from "react";
import Icon from '@mdi/react'
import { mdiOverscan, mdiArrowCollapseAll } from '@mdi/js';
import { connect } from "react-redux";
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";
import GoogleMapOverview from "views/widgets/Overview/GoogleMapOverview"
import { withTheme } from '@mui/styles';
//
import { responses } from "definations";



class Page extends React.Component {
	state = {
		mainMapInFullWidth: true,
		counts_overview_contexts: {
			surveys: {
				type: "count",
				query: {},
			},
			commissions: {
				type: "count",
				query: {},
			},
			responses: {
				type: "count",
				query: {},
			},
			tracks: {
				type: "count",
				query: {},
			},

		}
	};

	constructor(props) {
		super(props);
		const { auth } = props;
		if (auth.user?.isAdmin) {
			this.state.counts_overview_contexts = {
				surveys: {
					type: "count",
					query: {},
				},
				commissions: {
					type: "count",
					query: {},
				},
				responses: {
					type: "count",
					query: {},
				},
				queries: {
					type: "count",
					query: {},
				},
				tracks: {
					type: "count",
					query: {},
				},
				applications: {
					type: "count",
					query: {},
				},
				users: {
					type: "aggregates",
					query: {
						group: "gender",
						role: "collector",
					},
					title: (value) => {
						let new_value = "";
						if (Array.isArray(value)) {
							value.map(entry => {
								if (entry._id) {
									new_value = new_value + (new_value.length > 0 ? " / " : "") + entry._id.humanize();
								}
							});
						}
						return new_value;
					},
					description: (value) => {
						let new_value = "";
						if (Array.isArray(value)) {
							value.map(entry => {
								if (entry._id) {
									new_value = new_value + (new_value.length > 0 ? " / " : "") + entry._id.humanize();
								}

							});
						}
						return "Total " + new_value;
					},
					resolveValue: (value) => {
						let new_value = "";
						if (Array.isArray(value)) {
							value.map(entry => {
								if (entry._id && entry.count) {
									new_value = new_value + (new_value.length > 0 ? " / " : "") + entry.count;
								}

							});
						}
						return new_value;
					},
				}
			};
		}
	}

	componentDidMount() {
		const { location, appendNavHistory } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "dashboard",
				uri: location.pathname,
				title: "Dashboard",
				view: null,
				color: colors.hex.primary,
				scrollTop: 0,
			});
		}
	}

	render() {
		const {
			app: { preferences },
			auth,
			location,
			theme,
			device,
		} = this.props;

		const { views: { dashboard: { counts: ResponsesCountsReport } } } = responses;


		return (
			<Grid container >

				<Grid item  xs={12} lg={this.state.mainMapInFullWidth ? 12 : 7} className="p-2">
					<Card>
						<LazyModule
							resolve={() =>
								import(
									"views/widgets/Overview/GoogleMapOverview"
								)
							}
							placeholderType="skeleton"
							placeholder={[
								[
									{
										variant: "circle",
										width: 40,
										height: 40,
										className: "mt-2 ml-4",
									},
									{
										variant: "text",
										width: 100,
										className: "mx-2 mt-4",
									},
								],
								{
									variant: "rect",
									width: "100%",
									height: 600,
									className: "mt-4",
								},
							]}
							actions={device.window_size.width > 1280 ? [
								{
									icon: (
										<Icon
											path={this.state.mainMapInFullWidth ? mdiArrowCollapseAll : mdiOverscan}
											title="Toggle size"
											className={"invisible xl:visible"}
											size={0.8}
											color={theme.palette.text.primary}
										/>
									),
									onClick: () => {
										this.setState(prevState => ({
											mainMapInFullWidth: !prevState.mainMapInFullWidth
										}))
									}
								}
							] : []}
						/>
					</Card>
				</Grid>

				<Grid item  xs={12} className="p-2">
					<Card className="w-full flex items-center" sx={{height: theme => "70vh"}}>
						<ResponsesCountsReport />
					</Card>
				</Grid>

				<Grid item  xs={12} lg={this.state.mainMapInFullWidth ? 12 : 5} className="p-2">
					<Grid container className="p-0 m-0">
						<LazyModule
							resolve={() =>
								import(
									"views/widgets/Overview/CountsOverview"
								)
							}
							placeholderType="skeleton"
							placeholder={[
								{
									variant: "text",
									width: "100%",
									className: "mx-2 mt-4",
								},
								{
									variant: "rect",
									width: 40,
									height: 40,
									className: "mt-2 ml-4",
								},
							]}
							contexts={this.state.counts_overview_contexts}
							wrapperSize={this.state.mainMapInFullWidth ? 12 : 5}
						/>
					</Grid>
					<Grid container className="p-0 m-0">
						<LazyModule
							resolve={() =>
								import(
									"views/widgets/Overview/CompactAggregatesOverview"
								)
							}
							placeholder={[
								{
									variant: "rect",
									width: "100%",
									height: 200,
									className: "mt-4",
								},
								{
									variant: "rect",
									width: "100%",
									height: 200,
									className: "mt-4",
								},
								{
									variant: "rect",
									width: "100%",
									height: 200,
									className: "mt-4",
								},
							]}
							chartType={"bar"}
							contexts={["responses"]}
						/>
					</Grid>
				</Grid>

				<Grid item  xs={12} className="p-2">
					<LazyModule
						resolve={() =>
							import(
								"views/widgets/Overview/AggregatesOverview"
							)
						}
						placeholder={[
							{
								variant: "rect",
								width: "100%",
								height: 200,
								className: "mt-4",
							},
							{
								variant: "rect",
								width: "100%",
								height: 200,
								className: "mt-4",
							},
							{
								variant: "rect",
								width: "100%",
								height: 200,
								className: "mt-4",
							},
						]}
						gridSize={4}
					/>
				</Grid>


			</Grid>
		);
	}
}
const mapStateToProps = state => ({
	app: state.app,
	auth: state.auth,
	nav: state.nav,
	device: state.device,
});

Page.propTypes = {

};

export default compose(connect(mapStateToProps, { appendNavHistory }), withTheme)(Page);
