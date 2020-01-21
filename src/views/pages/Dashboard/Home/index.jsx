import React, {Suspense, lazy} from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import LazyModule from "components/LazyModule";

//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";
import withRoot from "utils/withRoot";
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
				scrollTop: 0
			});
		}
	}

	render() {
		const { classes, auth, location } = this.props;
		let homepageSections = {
			"quicklinks" : false,
			"static_aggregates": true,
			"static_map": true, 
			"compact_aggregates": false, 
			"compact_maps": false, 
			"calendar": true,
		}
		return (
			<GridContainer className={classes.root}>
				<GridItem xs={12} >

					{ homepageSections.quicklinks && <GridContainer>
						<GridItem xs={12}>
							<LazyModule 
								resolve={() => import("./components/QuickActions")}
								placeholderType="skeleton"
								placeholder={[
									[ { variant: "circle", width: 40, height: 40}, { variant: "text", width: 100, className: "mx-2 mt-4" }],
									{ variant: "rect", width: "100%", height: 300, className: "my-2" },
								]}
							/>						
						</GridItem>
					</GridContainer> }

					{ (homepageSections.static_aggregates || homepageSections.static_map) && <GridContainer>
						{ homepageSections.static_aggregates && <GridItem xs={12} sm={12} md={(auth.user.isCustomer || !homepageSections.static_map) ? 12 : 4} style={{maxHeight: 900, overflowX:"hidden", overflowY:"auto"}}>
							<LazyModule 
								resolve={() => import("views/widgets/Overview/AggregatesOverview")} 
								placeholder={[
									{ variant: "rect", width: "100%", height: 200, className:"mt-4"},
									{ variant: "rect", width: "100%", height: 200, className:"mt-4"},
									{ variant: "rect", width: "100%", height: 200, className:"mt-4"},
								]}

							/>
							
						</GridItem> }
						{ !auth.user.isCustomer && homepageSections.static_map && <GridItem xs={12} sm={12} md={!homepageSections.static_aggregates ? 12 : 8}>
							<LazyModule 
								resolve={() => import("views/widgets/Overview/GoogleMapOverview")}
								placeholderType="skeleton"
								placeholder={[
									[ 
										{ variant: "circle", width: 40, height: 40}, 
										{ variant: "text", width: 100, className: "mx-2 mt-4" }, 
									],
									{ variant: "rect", width: "100%", height: 600, className: "mt-4" },
								]}
							/>							
						</GridItem>}
					</GridContainer> }

					

					{ (homepageSections.compact_aggregates || homepageSections.compact_maps) &&  <GridContainer>
						{homepageSections.compact_aggregates && <GridItem xs={12} sm={12} md={(auth.user.isCustomer || !homepageSections.compact_maps) ? 12 : 4}>
							<LazyModule 
								resolve={() => import("views/widgets/Overview/CompactAggregatesOverview")} 
								placeholder={[
									[ 
										{ variant: "circle", width: 40, height: 40}, 
										{ variant: "text", width: 100, className: "mx-2 mt-4" }, 
									],
									{ variant: "circle", width: 250, height: 250, className: "mx-auto sm:md:4 md:mt-16" },
								]}
							/>
							
						</GridItem>}
						{ (!auth.user.isCustomer && homepageSections.compact_maps) && <GridItem xs={12} md={!homepageSections.compact_aggregates ? 12 : 8}>
							<LazyModule 
								resolve={() => import("views/widgets/Overview/GoogleMapOverview")}
								placeholderType="skeleton"
								placeholder={[
									[ 
										{ variant: "circle", width: 40, height: 40}, 
										{ variant: "text", width: 100, className: "mx-2 mt-4" }, 
									],
									{ variant: "rect", width: "100%", height: 500, className: "mt-4" },
								]}
							/>							
						</GridItem>}
					</GridContainer> }

					{ homepageSections.calendar && <GridContainer>
						<GridItem xs={12}>
							<LazyModule 
								resolve={() => import("views/widgets/Overview/OverviewCalendar")}
								placeholderType="skeleton" 
								placeholder={[
									[ 
										{ variant: "circle", width: 40, height: 40}, 
										{ variant: "text", width: 100, className: "mx-2 mt-4" }, 
									],
									{ variant: "rect", width: "100%", height: 500, className: "mt-4" },
								]}
							/>							
						</GridItem>
					</GridContainer> }

					
				</GridItem>
			</GridContainer>
		);
	}
}
const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav
});

Page.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withRoot(
	compose(
		withStyles(styles),
		connect(
			mapStateToProps,
			{ appendNavHistory }
		)
	)(Page)
);
