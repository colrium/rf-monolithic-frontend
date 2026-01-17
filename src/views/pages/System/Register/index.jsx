/** @format */

import Hidden from "@mui/material/Hidden";

import { app, colors } from "assets/jss/app-theme";
import classNames from "classnames";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import React from "react";

import SignupForm from "views/forms/Auth/Signup"
import AnimatedChevronMap from "views/widgets/AnimatedChevronMap";
import { intercom } from "config";
import Intercom from "react-intercom";

const styles = theme => ({
	login_container: {
		padding: "0",
	},
	login_logo: {
		width: "15rem",
		height: "auto",
		marginTop: theme.spacing(2),
	},
	info_wrapper: {
		background: theme.palette.secondary.light,
	},
	info_container: {
		color: theme.palette.text.primary,
		height: "100%",
		width: "100%",
	},
	form_wrapper: {
		maxHeight: "100vh",
		background: theme.palette.background.default,
		overflow: "auto",
	},
	info_map_container: {
		padding: "0 10%",
	},
	form_container: {
		height: "100%",
		width: "100%",
	},
});

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.onSignupSuccess = this.onSignupSuccess.bind(this);
	}

	componentDidMount() {
		document.title = app.title("Register");
	}

	onSignupSuccess() {
		window.location.href = "/login"; //relative to domain
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={"relative h-screen w-screen p-0"}>
				<Grid container className={"absolute inset-0 h-screen w-screen overflow-hidden p-0"}>
					<Grid container className={classes?.login_container}>
						<Hidden smDown>
							<Grid item
								xs={12}
								sm={12}
								md={7}
								lg={8}
								className={classes?.info_wrapper}
							>
								<Grid container
									className={classes?.info_container}
									direction="row"
									justify="center"
									alignItems="center"
								>
									<Grid container
										className={classes?.info_content}
									>
										<Grid item
											xs={12}
											className={
												classes?.info_map_container
											}
										>
											<AnimatedChevronMap
												mapcolor={colors.hex.inverse}
												popUpStyle={{
													background: "linear-gradient(to right, #8C189B, #6a0f75)",
												}}
											/>
										</Grid>

										<Grid item  xs={12}>
											<Typography
																								variant="h5"
											>
												realfield.io
											</Typography>
										</Grid>

									</Grid>
								</Grid>
							</Grid>
						</Hidden>

						<Grid item
							xs={12}
							sm={12}
							md={5}
							lg={4}
							className={classes?.form_wrapper}
						>
							<Grid container
								justify="center"
								alignItems="center"
							>
								<Grid item  xs={12}>
									<img
										alt={app.name + " logo"}
										className={classNames(
											classes?.login_logo,
											"center",
										)}
										src={app.logo}
									/>


								</Grid>
								<Grid item  xs={12} className={"flex-grow "}>
									<SignupForm onSignupSuccess={this.onSignupSuccess} />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Intercom appID={intercom.app.id} {...intercom.app.user} />
			</div>
		);
	}
}

export default ((SignUp));
