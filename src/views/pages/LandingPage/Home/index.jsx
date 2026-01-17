/** @format */


import { app } from "assets/jss/app-theme.jsx";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"

// Sections for this page
import JumbotronSection from "views/sections/LandingPage/Jumbotron";
import SignupSection from "views/sections/LandingPage/Signup"
import CommisionSurveySection from "views/sections/LandingPage/CommisionSurvey"
import ProjectComposerSection from "views/sections/LandingPage/ProjectComposer"
const styles = theme => ({})

class Page extends React.Component {
	componentDidMount() {
		document.title = app.title("Home")
		const { match, location } = this.props
	}

	render() {
		const { classes, auth, theme, device, ...rest } = this.props
		return (
			<Grid container className={"p-0"}>
				<Grid container className={"p-0"} sx={{ background: theme => theme.palette.background.paper }}>
					<JumbotronSection />
				</Grid>

				<Grid
					container
					className={"p-0"}
					sx={{
						backgroundColor: theme => theme.palette.accent.main,
						color: theme.palette.accent.contrastText,
					}}
				>
					<CommisionSurveySection />
				</Grid>

				<Grid container id="get-started">
					<SignupSection />
				</Grid>
			</Grid>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default (
	compose(connect(mapStateToProps, {}), withTheme)(Page)
);
