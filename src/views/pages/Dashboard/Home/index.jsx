import React, {Suspense, lazy} from "react";
import PropTypes from "prop-types";
import LazyLoad from 'react-lazyload';
import ProgressIndicator from "components/ProgressIndicator";
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";
import withRoot from "utils/withRoot";
//
import styles from "views/pages/styles";
const CompactAggregatesOverview = (lazy(() => (import("views/widgets/Overview/CompactAggregatesOverview"))));
const GoogleMapOverview = (lazy(() => (import("views/widgets/Overview/GoogleMapOverview"))));
const OverviewCalendar = (lazy(() => (import("views/widgets/Overview/OverviewCalendar"))));
const QuickActions = (lazy(() => (import("./components/QuickActions"))));
const LocationSearchInput = (lazy(() => (import("components/GoogleMap/LocationSearchInput"))));



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
		return (
			<GridContainer className={classes.root}>
				<GridItem xs={12} >		
					<GridContainer>
						<GridItem xs={12}>
							<Suspense fallback={<ProgressIndicator type="circular" size={24} />} className="p-2 m-0 min-h-full min-w-full"> 
								<QuickActions />
							</Suspense>							
						</GridItem>
					</GridContainer>

					<GridContainer>
						<GridItem xs={12} sm={12} md={auth.user.isCustomer ? 12 : 5} lg={auth.user.isCustomer ? 12 : 4}>
							<Suspense fallback={<ProgressIndicator type="circular" size={24} />} className="p-2 m-0 min-h-full min-w-full">
								<CompactAggregatesOverview className={classes.full_height} />
							</Suspense>
							
						</GridItem>
						{ !auth.user.isCustomer && <GridItem xs={12} sm={12} md={7} lg={8}>
							<Suspense fallback={<ProgressIndicator type="circular" size={24} />} className="p-2 m-0 min-h-full min-w-full">
								<GoogleMapOverview />
							</Suspense>
							
						</GridItem>}
					</GridContainer>

					<GridContainer>
						<GridItem xs={12}>
							<Suspense fallback={<ProgressIndicator type="circular" size={24} />} className="p-2 m-0 min-h-full min-w-full">
								<OverviewCalendar />
							</Suspense>							
						</GridItem>
					</GridContainer>

					
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
