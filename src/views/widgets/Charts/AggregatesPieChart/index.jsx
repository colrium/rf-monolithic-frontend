/** @format */

import { Menu, MenuItem } from "@mui/material";
//

import { MoreVert as AggregateMenuIcon } from "@mui/icons-material";
import { colors } from "assets/jss/app-theme";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";
import React from "react";
import { defaults, Pie } from "react-chartjs-2";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { apiCallRequest } from "state/actions";
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
//
import ApiService from "services/Api";
import { UtilitiesHelper } from "utils/Helpers";


//
// defaults.global.legend.display = false;

class AggregatesPieChart extends React.Component {
	state = {
		loading: true,
		load_error: false,
		aggregate: "status",
		aggregates: [],
		chart_data: {
			labels: [],
			datasets: [
				{
					data: [],
				},
			],
		},
		aggregateMenuEl: null,
	};
	aggregatables = [];
	colors = [];

	constructor(props) {
		super(props);

		this.handleShowAggregateMenu = this.handleShowAggregateMenu.bind(this);
		this.handleCloseAggregateMenu = this.handleCloseAggregateMenu.bind(
			this
		);
	}

	componentDidMount() {
		this.prepareForData();
		this.loadAggregates();
		this.prepareChartData();
	}

	componentDidUpdate(prevProps) {
		if (!Object.areEqual(this.props.defination, prevProps.defination)) {
			this.prepareForData();
			this.loadAggregates();
		} else if (!Object.areEqual(prevProps.api, this.props.api)) {
			this.prepareChartData();
		} else if (Array.isArray(this.props.cache)) {
			if (!this.props.cache.equals(prevProps.cache)) {
				this.prepareChartData();
			}
		} else if (Array.isArray(prevProps.cache)) {
			if (!prevProps.cache.equals(this.props.cache)) {
				this.prepareChartData();
			}
		}
	}

	prepareForData() {
		let {
			dynamic,
			monochrome,
			color,
			colors,
			defination,
			service,
			aggregate,
			onResolveAggregates,
		} = this.props;

		if (dynamic) {
			this.aggregatables = [];
			for (let [column, properties] of Object.entries(
				defination.scope.columns
			)) {
				if (properties.possibilities) {
					this.aggregatables.push({
						name: column,
						label: properties.label,
					});
				}
			}
		}

		if (!aggregate && this.aggregatables.length > 0) {
			aggregate = this.aggregatables[0].name;
			if (onResolveAggregates) {
				onResolveAggregates(defination.name, this.aggregatables);
			}
		}

		if (dynamic) {
			this.state.aggregate = aggregate;

			//generate color scheme if monochromatic
			if (monochrome) {
				let no_of_colors =
					this.aggregatables.length > 0
						? this.aggregatables.length
						: 1;
				let monochrome_colors = UtilitiesHelper.monochromeColorScheme(
					color,
					no_of_colors
				);
				this.colors = monochrome_colors;
			} else if (colors) {
				this.colors = colors;
			} else {
				let no_of_colors =
					this.aggregatables.length > 0
						? this.aggregatables.length
						: 1;
				let rotation_colors = UtilitiesHelper.rotationColorScheme(
					color,
					no_of_colors
				);
				this.colors = rotation_colors;
			}
		}
	}

	prepareChartData() {
		const {
			monochrome,
			color,
			colors,
			aggregate,
			defination,
			service,
			auth,
			onLoadAggregates,
			cache,
			api,
		} = this.props;
		if (Array.isArray(cache)) {
			let possibilities = defination.scope.columns[this.state.aggregate]
				? defination.scope.columns[this.state.aggregate].possibilities
				: {};
			if (typeof possibilities === "function") {
				possibilities = possibilities(false, auth.user);
			}
			//generate color scheme if monochromatic
			if (monochrome) {
				let no_of_colors = cache.length > 0 ? cache.length : 1;
				let monochrome_colors = UtilitiesHelper.monochromeColorScheme(
					api.loading || api.error ? "#595959" : color,
					no_of_colors
				);
				this.colors = monochrome_colors;
			} else if (colors) {
				this.colors =
					api.loading || api.error
						? UtilitiesHelper.monochromeColorScheme("#595959")
						: colors;
			} else {
				let no_of_colors = cache.length > 0 ? cache.length : 1;
				let rotation_colors = UtilitiesHelper.rotationColorScheme(
					api.loading || api.error ? "#595959" : color,
					no_of_colors
				);
				this.colors = rotation_colors;
			}

			let chart_data_labels = [];
			let chart_data_data = [];
			let onload_callback_data = [];

			if (typeof possibilities === "object") {
				for (var i = 0; i < cache.length; i++) {
					if (cache[i]._id in possibilities) {
						chart_data_labels.push(possibilities[cache[i]._id]);
						chart_data_data.push(cache[i].count);
						if (onLoadAggregates) {
							onload_callback_data.push({
								name: cache[i]._id,
								label: possibilities[cache[i]._id],
								count: cache[i].count,
								color: this.colors[i],
							});
						}
					}
				}
			}

			let chart_data = {
				labels: chart_data_labels,
				datasets: [
					{
						data: chart_data_data,
						backgroundColor: this.colors,
					},
				],
			};

			this.setState(state => ({
				aggregates: cache,
				chart_data: chart_data,
				loading: false,
			}));
			if (onLoadAggregates) {
				onLoadAggregates(onload_callback_data);
			}
		} else {
			let chart_data_labels = [];
			let chart_data_data = [];
			let onload_callback_data = [];

			let chart_data = {
				labels: chart_data_labels,
				datasets: [
					{
						data: chart_data_data,
						backgroundColor: this.colors,
					},
				],
			};

			this.setState(state => ({
				aggregates: cache,
				chart_data: chart_data,
				loading: false,
			}));
			if (onLoadAggregates) {
				onLoadAggregates(onload_callback_data);
			}
		}
	}

	loadAggregates(query_data) {
		const { apiCallRequest, defination } = this.props;

		if (!query_data) {
			query_data = { g: this.state.aggregate };
		}

		let new_aggregate =
			"g" in query_data
				? query_data.g
				: "group" in query_data
					? query_data.group
					: false;
		this.setState(state => ({ aggregate: new_aggregate }));

		if (defination) {
			apiCallRequest(
				defination.name + "_aggregates",
				{
					uri: defination.endpoint,
					type: "aggregates",
					params: query_data,
					data: {},
					cache: true,
				},
			);
		}
	}

	handleShowAggregateMenu = event => {
		let aggregateMenuEl = event.currentTarget;
		this.setState({ aggregateMenuEl: aggregateMenuEl });
	};

	handleCloseAggregateMenu() {
		this.setState({ aggregateMenuEl: null });
	}

	handleAggregateMenuItemClick = column => event => {
		//this.handleCloseAggregateMenu();
		this.setState({ aggregateMenuEl: null });
		this.loadAggregates({ g: column });
	};

	render() {
		const {
			className,
			aggregate,
			dynamic,
			defination,
			service,
			showTitle,
			showMenu,
			api,
			cache,
		} = this.props;
		return (
			<Grid container className={`${className || ""} p-0 m-0`}>
				<Grid item xs={12} className="p-0 m-0">
					<Grid container className="p-0 m-0">
						<Grid container className="p-0 m-0">
							{(showMenu || showTitle) && (
								<Grid item xs={12}>
									<Grid container>
										{showTitle && !showMenu && (
											<Grid item xs={12}>
												<Typography variant="body1" fullWidth>
													{defination.scope.columns[this.state.aggregate]
														? defination.scope.columns[this.state.aggregate].label
														: "Unknown"}{" "}
													Aggregate
												</Typography>
											</Grid>
										)}

										{dynamic && showMenu && (
											<Grid item className="p-0 m-0" xs={12}>
												<Button
													aria-controls="aggregate-menu"
													aria-haspopup="true"
													onClick={this.handleShowAggregateMenu}
													className="float-right"
													size="md"
													aria-label="Aggregate Menu"
												>
													{defination.scope.columns[this.state.aggregate]
														? defination.scope.columns[this.state.aggregate].label
														: "Unknown"}{" "}
													Aggregate
													<AggregateMenuIcon />
												</Button>
												<Menu
													id="surveys-aggregate-menu"
													anchorEl={this.state.aggregateMenuEl}
													keepMounted
													open={Boolean(this.state.aggregateMenuEl)}
													onClose={this.handleCloseAggregateMenu}
												>
													{this.aggregatables.map((aggregatable, index) => (
														<MenuItem
															onClick={this.handleAggregateMenuItemClick(aggregatable.name)}
															key={"aggregate_" + aggregatable.name}
														>
															{aggregatable.label + " Aggregate"}
														</MenuItem>
													))}
												</Menu>
											</Grid>
										)}
									</Grid>
								</Grid>
							)}

							<Grid item className="p-2" xs={12}>
								{Array.isArray(this.state.chart_data.labels) && this.state.chart_data.labels.length > 0 ? (
									<Pie data={this.state.chart_data} />
								) : (
									<Grid container className="p-0 m-0 flex flex-col justify-center items-center">
										<FolderOpenIcon className="text-9xl" />
										<Typography className={`mt-4`} color="grey" variant="body2" fullWidth>
											No{" "}
											{defination.scope.columns[this.state.aggregate]
												? defination.scope.columns[this.state.aggregate].label
												: ""}{" "}
											Aggregates
										</Typography>
									</Grid>
								)}
							</Grid>
						</Grid>

						{api.complete && api.error && (
							<Grid container>
								<Grid item xs={12}>
									<Typography color="error" variant="body2" fullWidth>
										{"An error occured. \n " + api.error.msg}
									</Typography>
								</Grid>
							</Grid>
						)}
					</Grid>
				</Grid>
			</Grid>
		)
	}
}

AggregatesPieChart.propTypes = {
	className: PropTypes.string,

	dynamic: PropTypes.bool,
	showTitle: PropTypes.bool,
	showMenu: PropTypes.bool,
	monochrome: PropTypes.bool,
	color: PropTypes.string,
	colors: PropTypes.array,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	aggregate: PropTypes.string,
	onResolveAggregates: PropTypes.func,
	onLoadAggregates: PropTypes.func,
};

AggregatesPieChart.defaultProps = {
	//colors: [colors.hex.accent, colors.hex.primary, colors.hex.secondary, colors.hex.primarydark, colors.hex.default],
	color: colors.hex.accent,
	monochrome: true,
};

const mapStateToProps = (state, ownProps) => {
	const { defination } = ownProps;
	return {
		auth: state.auth,
		cache: defination
			? state.cache.data[defination.name + "_aggregates"]
			: null,
		api: defination
			? state.api[defination.name]
				? state.api[defination.name]
				: {}
			: {},
	};
};

export default compose(

	connect(mapStateToProps, { apiCallRequest })
)(AggregatesPieChart);
