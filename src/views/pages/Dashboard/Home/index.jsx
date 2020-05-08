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
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";
import {withErrorHandler} from "hoc/ErrorHandler";
//
import styles from "views/pages/styles";



class Page extends React.Component {

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
		} = this.props;
		/*let homepageSections = {
			quicklinks: preferences.dashboard["quicklinks"],
			static_aggregates: preferences.dashboard["static-aggregates"],
			static_map: preferences.dashboard["static-map"],
			compact_aggregates: preferences.dashboard["compact-aggregates"],
			compact_maps: preferences.dashboard["compact-maps"],
			calendar: preferences.dashboard["calendar"],
		};*/
		let sections = Object.entries(preferences.dashboard).filter(([key, value])=>{
			return key !== "view";
		});
		
		sections.sort(function(a, b){
			return Number.parseNumber(a[1].position, 0) - Number.parseNumber(b[1].position, 0)
		});

		return (
			<GridContainer className={classes.root}>
				
					{sections.map(([section_name, section_prefs]) => (
						section_prefs.visible && <GridItem xs={12} md={Number.parseNumber(section_prefs.width)} className="p-2" key={section_name+"-section"}>
							<Card>
								{section_name === "map" && <LazyModule
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
								/>}

								{(section_name === "charts" && section_prefs.type === "dynamic" ) && <LazyModule
										resolve={() =>
											import(
												"views/widgets/Overview/CompactAggregatesOverview"
											)
										}
										placeholder={[
											[
												{
													variant: "circle",
													width: 40,
													height: 40,
												},
												{
													variant: "text",
													width: 100,
													className: "mx-2 mt-4",
												},
											],
											{
												variant: "circle",
												width: 250,
												height: 250,
												className:
													"mx-auto sm:md:4 md:mt-16",
											},
										]}
									/>}

								{(section_name === "charts" && section_prefs.type === "static" ) && <LazyModule
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
								/> }

								{section_name === "timeline" && <LazyModule
									resolve={() =>
										import(
											"views/widgets/Overview/OverviewCalendar"
										)
									}
									placeholderType="skeleton"
									placeholder={[
										[
											{
												variant: "circle",
												width: 40,
												height: 40,
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
											height: 500,
											className: "mt-4",
										},
									]}
								/> }

								{section_name === "actions" && <LazyModule
									resolve={() =>
										import("./components/QuickActions")
									}
									placeholderType="skeleton"
									placeholder={[
										[
											{
												variant: "circle",
												width: 40,
												height: 40,
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
											height: 300,
											className: "my-2",
										},
									]}
								/> }
							</Card>
						</GridItem>
					))}

					
				
			</GridContainer>
		);
	}
}
const mapStateToProps = state => ({
	app: state.app,
	auth: state.auth,
	nav: state.nav,
});

Page.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default compose( withStyles(styles), connect(mapStateToProps, { appendNavHistory }), withErrorHandler )(Page);
