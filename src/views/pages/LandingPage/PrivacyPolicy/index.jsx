/** @format */

import { app } from "assets/jss/app-theme.jsx";
import Grid from '@mui/material/Grid';
;
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";



// Sections for this page
import PrivacyPolicySection from "views/sections/LandingPage/PrivacyPolicy";

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
		document.title = app.title("Privacy Policy");
	}

	render() {
		const { classes, auth, theme, device, ...rest } = this.props;
		return (
			<Grid container
				className={"min-height-screen"}
				direction="column"
				alignItems="center"
				justify="center"
			>
				<Grid container className={"p-0"}>
					<Grid item  xs={12} className={"p-0"}>
						<PrivacyPolicySection />
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
