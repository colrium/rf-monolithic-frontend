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
// react components for routing our app without refresh
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import { withErrorHandler } from "hoc/ErrorHandler";


// Sections for this page
import DemoRequestSection from "views/sections/LandingPage/DemoRequest";

const styles = theme => ({
	root: {
		position: "relative",
		minHeight: "100vh",

	},
	title: {		
		color: theme.palette.text.secondary,
		textDecoration: "none",
	},
	subtitle: {
		margin: "10px auto 0",
	},
});

class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Request Demo");
	}

	render() {
		const { classes, auth, theme, device, ...rest } = this.props;
		return (
				<GridContainer
					className={classes.root+" sm:px-4 md:px-32"}
					direction="column"
					alignItems="center"
					justify="center"
				>
					<GridContainer className={"p-0"}>
						<GridItem xs={12} sm={12} md={12} className={"p-0"}>
							<DemoRequestSection />
						</GridItem>					
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

