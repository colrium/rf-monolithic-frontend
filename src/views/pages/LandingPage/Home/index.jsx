/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import { app, colors } from "assets/jss/app-theme.jsx";
import Button from '@material-ui/core/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
// react components for routing our app without refresh
import { Link, HashRouter, Route, Switch } from "react-router-dom";
import compose from "recompose/compose";
import { withErrorHandler } from "hoc/ErrorHandler";


// Sections for this page
import JumbotronSection from "views/sections/LandingPage/Jumbotron";
import StartProjectSection from "views/sections/LandingPage/StartYourProject";
import FAQsSection from "views/sections/LandingPage/FAQs";
import JobsSection from "views/sections/LandingPage/Jobs";
import AboutUsSection from "views/sections/LandingPage/AboutUs";
import ProductsSection from "views/sections/LandingPage/Products";
import CommisionSurveySection from "views/sections/LandingPage/CommisionSurvey";

const styles = theme => ({
	
});

class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Home");
		const {
			match,
			location,
		} = this.props;

	}

	render() {
		const { classes, auth, theme, device, ...rest } = this.props;
		return (
			<GridContainer className={"p-0"}>
				
				
				<GridContainer className={"p-0 px-4 md:pl-20 md:pr-4"} style={{ background: theme.palette.background.default }}>
					<JumbotronSection />
				</GridContainer>

				<GridContainer className={"p-0 px-4 md:px-48 py-4"} style={{ background: theme.palette.background.paper }}>
					<ProductsSection />
				</GridContainer>

				<GridContainer className={"p-0 px-4 md:px-0"} style={{ background: theme.palette.background.default }}>
					<CommisionSurveySection />
				</GridContainer>

				
			</GridContainer>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default withErrorHandler(
	compose(connect(mapStateToProps, {}), withStyles(styles), withTheme)(Page)
);
