/** @format */

import { withStyles } from "@material-ui/core";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import Color from "color";
import Card from "components/Card";
import CardActions from "components/Card/CardActions";
import CardContent from "components/Card/CardContent";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
//
import LazyModule from "components/LazyModule";
import Typography from "components/Typography";
import {withGlobals} from "contexts/Globals";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";

import { withErrorHandler } from "hoc/ErrorHandler";

//
import styles from "./styles";

class Overview extends Component {
	state = {
		counts: {},
		aggregates: {},
		loaded: {},
		loading: {},
		main_loading: true,
	};

	constructor(props) {
		super(props);
		const { definations, services } = this.props;
		this.handleShowOptionsMenu = this.handleShowOptionsMenu.bind(this);
		this.handleCloseOptionsMenu = this.handleCloseOptionsMenu.bind(this);
		this.handleOnResolveAggregates = this.handleOnResolveAggregates.bind(
			this
		);
		this.backgroundColors = {};
		for (let [name, defination] of Object.entries(definations)) {
			this.backgroundColors[name] = Color(
				defination.color ? defination.color : colors.hex.primary
			)
				.rgb()
				.array()
				.join(",");
		}
	}

	async componentDidMount() {
		const { auth, definations, services } = this.props;

		for (let [name, defination] of Object.entries(definations)) {
			if (!defination.access.restricted(auth.user) && name in services) {
				let that = this;
				services[name].getRecordsCount().then(response => {
					that.setState(state => ({
						counts: {
							...state.counts,
							[name]: response.body.data.count,
						},
					}));
				});
			}
		}
	}

	handleShowOptionsMenu = name => event => {};

	handleCloseOptionsMenu = name => event => {};

	handleOnResolveAggregates(name, aggregates) {
		this.setState(state => ({
			aggregates: { ...state.aggregates, [name]: aggregates },
		}));
	}

	handleAggregateMenuItemClick = column => event => {};

	render() {
		const { classes, className, auth, definations, services } = this.props;

		const rootClassName = classNames(classes.root, className);

		return (
			<GridContainer className="p-0" className={rootClassName}>
				{Object.entries(definations).map(
					([name, defination], index) =>
						!defination.access.restricted(auth.user) &&
						defination.access.view.summary(auth.user) &&
						name in services && (
							<GridItem xs={12} key={name + "-aggregates"}>
								<Card
									elevation={0}
									className="rounded p-0"
									style={{
										background:
											"rgba(" +
											this.backgroundColors[name] +
											", 0.2)",
									}}
								>
									<CardContent className="p-0">
										<LazyModule
											resolve={() =>
												import(
													"views/widgets/Charts/AggregatesPieChart"
												)
											}
											placeholder={[
												{
													variant: "rect",
													width: "30%",
													height: 50,
													className:
														"m-auto float-right",
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
											service={services[name]}
											color={
												defination.color
													? defination.color
													: colors.hex.primary
											}
											dynamic
											showTitle
											showMenu
											monochrome
										/>
									</CardContent>
									<CardActions>
										<Typography
											className={classes.caption}
											variant="caption"
										>
											{defination.icon} Total{" "}
											{defination.label} :{" "}
											{this.state.counts[name]
												? this.state.counts[name] + ""
												: "0"}
										</Typography>
									</CardActions>
								</Card>
							</GridItem>
						)
				)}
			</GridContainer>
		);
	}
}

Overview.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withGlobals(compose(
	withStyles(styles),
	connect(mapStateToProps, {}),
	withErrorHandler
)(Overview));
