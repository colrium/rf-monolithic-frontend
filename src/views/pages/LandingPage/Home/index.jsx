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
import SignupForm from "views/forms/Auth/Signup"
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

				<Grid container className={"p-0 md:px-0"} id="get-started">
						<Grid container sx={{}} className={"p-0 xs:px-4 md:px-32  py-16"}>
							<Grid item xs={12} className={`flex flex-col py-4`}>
								<Typography variant="h3" color="text.secondary" className={`mb-4`}>
									Sign up to start
								</Typography>
								<Typography variant="body1" color="text.disabled">
									To join our Community, schedule a demo or start a project, please complete the following sign -up form.
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<SignupForm
									googleLoginProps={{
										sx: {
											backgroundColor: theme => theme.palette.action.hover,
											color: theme => theme.palette.google.main,
										},
									}}
								/>
							</Grid>
						</Grid>
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
