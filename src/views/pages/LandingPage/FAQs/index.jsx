/** @format */


import { app } from "assets/jss/app-theme.jsx";
import Grid from '@mui/material/Grid';
;
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";



// Sections for this page
import FAQsSection from "views/sections/LandingPage/FAQs";

const styles = theme => ({
	root: {
		position: "relative",
		minHeight: "100vh",

	},
	container: {
		padding: 0,
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
		document.title = app.title("FAQs");
	}

	render() {
		const { classes, auth, theme, device, ...rest } = this.props;
		return (
			<div>
				<Grid container
					className={classes?.root + " sm:px-4 md:px-32"}
					direction="column"
					alignItems="center"
					justify="center"
				>
					<Grid container className={classes?.container}>
						<Grid item  xs={12} sm={12} md={12}>
							<FAQsSection />
						</Grid>
					</Grid>
				</Grid>
			</div>
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
