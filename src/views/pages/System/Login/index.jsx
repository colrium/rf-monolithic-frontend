import Hidden from "@material-ui/core/Hidden";
import withStyles from "@material-ui/core/styles/withStyles";
import { app, colors } from "assets/jss/app-theme";
import classNames from "classnames";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import withRoot from "utils/withRoot";
import LoginForm from "views/forms/LoginForm";
import AnimatedChevronMap from "views/widgets/AnimatedChevronMap";

const styles = theme => ({
	root: {
		minHeight: "100vh",
		height: "100vh",
		padding: "0",
		margin: "0",
		overflow: "auto"
	},
	login_container: {
		padding: "0"
	},
	login_logo: {
		width: "15rem",
		height: "auto",
		marginTop: theme.spacing(2)
	},
	info_wrapper: {
		background: "#87c49e"
	},
	info_container: {
		color: colors.inverse,
		height: "100%",
		width: "100%"
	},
	form_wrapper: {
		height: "100%",
		background: colors.hex.inverse,
		overflow: "auto"
	},
	info_map_container: {
		padding: "0 10%"
	},
	form_container: {
		height: "100%",
		width: "100%"
	}
});

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.onLogin = this.onLogin.bind(this);
	}

	componentDidMount() {
		document.title = app.title("Login");
	}

	onLogin() {
		window.location.href = "/".toUriWithDashboardPrefix(); //relative to domain
	}

	render() {
		const { classes } = this.props;
		return (
			<div>
				<GridContainer className={classes.root}>
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
									<GridContainer className={classes.info_content}>
										<GridItem xs={12} className={classes.info_map_container}>
											<AnimatedChevronMap mapcolor={colors.hex.inverse} />
										</GridItem>

										<GridItem xs={12}>
											<Typography color="inverse" center variant="h5">
												Realfield.io
											</Typography>
										</GridItem>

										<GridItem xs={12}>
											<Typography color="inverse" center variant="body2">
												We're not smart, we are here to give you the data to be
												smart.
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
								className={classes.form_container}
								direction="row"
								justify="center"
								alignItems="center"
							>
								<GridItem xs={12}>
									<img
										alt={app.name + " logo"}
										className={classNames(classes.login_logo, "center")}
										src={app.logo}
									/>
								</GridItem>
								<GridItem xs={12}>
									<LoginForm onLogin={this.onLogin} />
								</GridItem>
							</GridContainer>
						</GridItem>
					</GridContainer>
				</GridContainer>
			</div>
		);
	}
}

export default withRoot(withStyles(styles)(Login));
