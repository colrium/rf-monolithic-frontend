/** @format */

import Hidden from "@material-ui/core/Hidden";
import withStyles from "@material-ui/core/styles/withStyles";
import { app, colors } from "assets/jss/app-theme";
import classNames from "classnames";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import { withErrorHandler } from "hoc/ErrorHandler";
import SignupForm from "views/forms/SignupForm";
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
				<GridContainer className={"absolute inset-0 h-screen w-screen overflow-hidden p-0"}>
					<GridContainer className={classes.login_container}>
						<Hidden smDown>
							<GridItem
								xs={12}
								sm={12}
								md={7}
								lg={8}
								className={classes.info_wrapper}
							>
								<GridContainer
									className={classes.info_container}
									direction="row"
									justify="center"
									alignItems="center"
								>
									<GridContainer
										className={classes.info_content}
									>
										<GridItem
											xs={12}
											className={
												classes.info_map_container
											}
										>
											<AnimatedChevronMap
												mapcolor={colors.hex.inverse}
												popUpStyle={{
													background: "linear-gradient(to right, #8C189B, #6a0f75)",
												}}
											/>
										</GridItem>

										<GridItem xs={12}>
											<Typography
												center
												variant="h5"
											>
												realfield.io
											</Typography>
										</GridItem>

									</GridContainer>
								</GridContainer>
							</GridItem>
						</Hidden>

						<GridItem
							xs={12}
							sm={12}
							md={5}
							lg={4}
							className={classes.form_wrapper}
						>
							<GridContainer
								justify="center"
								alignItems="center"
							>
								<GridItem xs={12}>
									<img
										alt={app.name + " logo"}
										className={classNames(
											classes.login_logo,
											"center",
										)}
										src={app.logo}
									/>

									
								</GridItem>
								<GridItem xs={12} className={"flex-grow "}>
									<SignupForm onSignupSuccess={this.onSignupSuccess} />
								</GridItem>
							</GridContainer>
						</GridItem>
					</GridContainer>
				</GridContainer>
				<Intercom appID={intercom.app.id} {...intercom.app.user} />
			</div>
		);
	}
}

export default withErrorHandler(withStyles(styles)(SignUp));
