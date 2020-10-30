/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
//
import Card from "components/Card";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import LazyModule from "components/LazyModule";
import PropTypes from "prop-types";
import React from "react";
import Icon from '@mdi/react'
import { mdiOverscan, mdiArrowCollapseAll  } from '@mdi/js';
import { connect } from "react-redux";
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";
import {withErrorHandler} from "hoc/ErrorHandler";
import { withTheme } from '@material-ui/core/styles';
//
import styles from "views/pages/styles";



class Page extends React.Component {
	state = {
		mainMapInFullWidth: true,
	};

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
			classes,
			app: {preferences},
			auth,
			location,
			theme,
			device,
		} = this.props;
		/*let homepageSections = {
			quicklinks: preferences.dashboard["quicklinks"],
			static_aggregates: preferences.dashboard["static-aggregates"],
			static_map: preferences.dashboard["static-map"],
			compact_aggregates: preferences.dashboard["compact-aggregates"],
			compact_maps: preferences.dashboard["compact-maps"],
			calendar: preferences.dashboard["calendar"],
		};*/
		

		return (
			<GridContainer className={classes.root}>
				


					<GridItem xs={12} lg={this.state.mainMapInFullWidth? 12 : 7} className="p-2">
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
												actions={device.window_size.width > 1280? [
													{
														icon: (
															<Icon 
																path={this.state.mainMapInFullWidth? mdiArrowCollapseAll : mdiOverscan}
																title="Toggle size"
																className={"invisible xl:visible"}
																size={0.8}   
																color={theme.palette.text.primary}
															/>
														),
														onClick: ()=> {
															this.setState(prevState=>({
																mainMapInFullWidth: !prevState.mainMapInFullWidth
															}))
														}
													}
												] : []}
										/>
						</Card>
					</GridItem>

					<GridItem xs={12} lg={this.state.mainMapInFullWidth? 12 : 5} className="p-2">
						<GridContainer className="p-0 m-0">
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
												wrapperSize={this.state.mainMapInFullWidth? 12 : 5}
										/>
						</GridContainer>
						<GridContainer className="p-0 m-0">
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
						</GridContainer>
					</GridItem>

					<GridItem xs={12} className="p-2">
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
					</GridItem>
					
				
			</GridContainer>
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
	classes: PropTypes.object.isRequired,
};

export default compose( withStyles(styles), connect(mapStateToProps, { appendNavHistory }), withTheme, withErrorHandler )(Page);
