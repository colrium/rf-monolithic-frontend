/** @format */


import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import Color from "color";
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import Grid from '@mui/material/Grid';
;
//
import { withTheme } from '@mui/styles';
import LazyModule from "components/LazyModule";
import Typography from '@mui/material/Typography';
import * as definations from "definations"
import PropTypes from "prop-types"
import React, { Component } from "react"
import { connect } from "react-redux"
import compose from "recompose/compose"
import ApiService from "services/Api"

//

class Overview extends Component {
	state = {
		counts: {},
		aggregates: {},
		loaded: {},
		loading: {},
		main_loading: true,
	}

	constructor(props) {
		super(props)
		this.handleShowOptionsMenu = this.handleShowOptionsMenu.bind(this)
		this.handleCloseOptionsMenu = this.handleCloseOptionsMenu.bind(this)
		this.handleOnResolveAggregates = this.handleOnResolveAggregates.bind(this)
		this.backgroundColors = {}
		for (let [name, defination] of Object.entries(definations)) {
			this.backgroundColors[name] = Color(defination.color ? defination.color : colors.hex.primary)
				.rgb()
				.array()
				.join(",")
		}
	}

	async componentDidMount() {
		const { auth } = this.props

		for (let [name, defination] of Object.entries(definations)) {
			if (!defination.access.restricted(auth.user)) {
				let that = this
				ApiService.getContextRequests(defination?.endpoint)
					.getRecordsCount()
					.then(response => {
						that.setState(state => ({
							counts: {
								...state.counts,
								[name]: response.body.data.count,
							},
						}))
					})
			}
		}
	}

	handleShowOptionsMenu = name => event => {}

	handleCloseOptionsMenu = name => event => {}

	handleOnResolveAggregates(name, aggregates) {
		this.setState(state => ({
			aggregates: { ...state.aggregates, [name]: aggregates },
		}))
	}

	handleAggregateMenuItemClick = column => event => {}

	render() {
		const { className, auth, contexts, gridSize, theme, chartType } = this.props

		const rootClassName = classNames(`p-0`, className)

		return (
			<Grid container className={rootClassName}>
				{Object.entries(definations).map(
					([name, defination], index) =>
						!defination.access.restricted(auth.user) &&
						defination.access.view.summary(auth.user) &&
						contexts.includes(name) && (
							<Grid item  xs={12} md={gridSize} key={name + "-aggregates"}>
								<Card
									className="rounded p-0"
									style={{
										/*background:
											"rgba(" +
											this.backgroundColors[name] +
											", 0.2)",*/
										background: theme.palette.background.paper,
									}}
								>
									<CardContent className="p-0">
										{chartType === "pie" && (
											<LazyModule
												resolve={() => import("views/widgets/Charts/AggregatesPieChart")}
												placeholder={[
													{
														variant: "rect",
														width: "30%",
														height: 50,
														className: "m-auto float-right",
													},
													{
														variant: "circle",
														width: 150,
														height: 150,
														className: "m-auto mt-4",
													},
													{
														variant: "text",
														width: "50%",
														className: "m-auto mt-4",
													},
												]}
												defination={defination}
												service={ApiService.getContextRequests(defination.endpoint)}
												color={defination.color ? defination.color : colors.hex.primary}
												dynamic
												showTitle
												showMenu
												monochrome
											/>
										)}
										{chartType === "bar" && (
											<LazyModule
												resolve={() => import("views/widgets/Charts/AggregatesBarChart")}
												placeholder={[
													{
														variant: "rect",
														width: "30%",
														height: 50,
														className: "m-auto float-right",
													},
													{
														variant: "circle",
														width: 150,
														height: 150,
														className: "m-auto mt-4",
													},
													{
														variant: "text",
														width: "50%",
														className: "m-auto mt-4",
													},
												]}
												defination={defination}
												service={ApiService.getContextRequests(defination.endpoint)}
												color={defination.color ? defination.color : colors.hex.primary}
												dynamic
												showTitle
												showMenu
												monochrome
											/>
										)}
									</CardContent>
									<CardActions>
										{defination.icon}
										<Typography variant="caption">
											Total {defination.label} : {this.state.counts[name] ? this.state.counts[name] + "" : "0"}
										</Typography>
									</CardActions>
								</Card>
							</Grid>
						)
				)}
			</Grid>
		)
	}
}

Overview.propTypes = {
	className: PropTypes.string,

	gridSize: PropTypes.number,
	chartType: PropTypes.string,
	contexts: PropTypes.array,
}

Overview.defaultProps = {
	gridSize: 12,
	chartType: "pie",
	contexts: ["commissions", "surveys", "responses"],
}

const mapStateToProps = state => ({
	auth: state.auth,
})

export default compose(
	withTheme,

	connect(mapStateToProps, {})
)(Overview)
