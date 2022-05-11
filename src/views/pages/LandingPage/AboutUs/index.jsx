/** @format */

import { app } from "assets/jss/app-theme.jsx";
import Grid from '@mui/material/Grid';
;
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";



// Sections for this page
import AboutUsSection from "views/sections/LandingPage/AboutUs";
import HowToBecomeAfielderSection from "views/sections/LandingPage/HowToBecomeAfielder";
import FAQsSection from "views/sections/LandingPage/FAQs";

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
		document.title = app.title("About Us");
	}

	render() {
		const { classes, auth, theme, device, ...rest } = this.props;
		return (
			<Grid container
				className={classes?.root + " p-0 "}
				direction="column"
				alignItems="center"
				justify="center"
			>
				<Grid container className={"p-0"}>
					<Grid item  xs={12} sm={12} md={12} className={"p-0"}>
						<AboutUsSection />
					</Grid>

					<Grid item  xs={12} sm={12} md={12} className={"p-0"}>
						<HowToBecomeAfielderSection />
					</Grid>

					<Grid item  xs={12} sm={12} md={12} className={"p-0"}>
						<FAQsSection />
					</Grid>
				</Grid>
			</Grid>
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
