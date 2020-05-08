/** @format */

import { app } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { setDashboardAppBarDisplayed, setDashboardDrawerDisplayed, setDashboardFooterDisplayed } from "state/actions";
import {withErrorHandler} from "hoc/ErrorHandler";



class Page extends Component {
	componentDidMount() {
		const {
			setDashboardAppBarDisplayed,
			setDashboardDrawerDisplayed,
			setDashboardFooterDisplayed,
		} = this.props;
		document.title = app.title("Page Builder");
		setDashboardAppBarDisplayed(false);
		setDashboardDrawerDisplayed(false);
		setDashboardFooterDisplayed(false);
	}

	componentWillUnmount() {
		const {
			setDashboardAppBarDisplayed,
			setDashboardDrawerDisplayed,
			setDashboardFooterDisplayed,
		} = this.props;
		setDashboardAppBarDisplayed(true);
		setDashboardDrawerDisplayed(true);
		setDashboardFooterDisplayed(true);
	}

	render() {
		const { classes } = this.props;

		return (
			<GridContainer className="m-0 p-0">
				<GridItem xs={12}></GridItem>
			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(
		connect(mapStateToProps, {
			setDashboardAppBarDisplayed,
			setDashboardDrawerDisplayed,
			setDashboardFooterDisplayed,
		})
	)(Page)
);
