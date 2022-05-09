/** @format */

import { app } from "assets/jss/app-theme.jsx";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";



// Sections for this page
import WhyUsSection from "views/sections/LandingPage/WhyUs";

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
		document.title = app.title("Why Realfield?");
	}

	render() {
		const { classes, auth, theme, device, ...rest } = this.props;
		return (
			<GridContainer
				className={classes?.root + " p-0"}
				direction="column"
				alignItems="center"
				justify="center"
			>
				<GridContainer className={"p-0"}>
					<GridItem xs={12} className={"p-0"}>
						<WhyUsSection />
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

export default (
	compose(connect(mapStateToProps, {}), withTheme)(Page)
);
