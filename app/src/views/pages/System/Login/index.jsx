/** @format */

import Hidden from "@mui/material/Hidden";

import { app, colors } from "assets/jss/app-theme";
import classNames from "classnames";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import { makeStyles } from '@mui/styles';
import LoginForm from "views/forms/LoginForm";
import AnimatedChevronMap from "views/widgets/AnimatedChevronMap";
import { intercom } from "config";
import Intercom from "react-intercom";
import { Link } from "react-router-dom";
import { useDidUpdate, useVisibility, useDidMount, useSetState } from "hooks"

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: "100vh",
		height: "100vh",
		padding: "0",
		margin: "0",
		overflow: "auto",
	},
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
		height: "100%",
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
}));

const Login = (props) => {
	const classes = useStyles();
	useDidMount(() => {
		document.title = app.title("Login");
	});

	const onLogin = () => {
		window.location.href = "/".toUriWithDashboardPrefix(); //relative to domain
	}

	return (
		<div>
			<GridContainer className={classes?.root}>
				<GridContainer className={classes?.login_container}>
					<Hidden smDown>
						<GridItem
							xs={12}
							sm={12}
							md={7}
							lg={8}
							className={"p-20"}
							sx={{
								backgroundColor: theme => theme.palette.secondary.main
							}}
						>
							<GridContainer
								className={classes?.info_container}
								direction="row"
								justify="center"
								alignItems="center"
							>
								<GridContainer
									className={classes?.info_content}
								>
									<GridItem
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
									</GridItem>

									<GridItem xs={12}>
										<Typography
											className={"w-full text-center"}
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
						className={classes?.form_wrapper}
					>
						<GridContainer
							className={classes?.form_container}
							direction="row"
							justify="center"
							alignItems="center"
						>
							<GridItem xs={12}>
								<Link to={"/home".toUriWithLandingPagePrefix()}>

									<img
										alt={app.name + " logo"}
										className={classNames(
											classes?.login_logo,
											"center"
										)}
										src={app.logo}
									/>
								</Link>
							</GridItem>
							<GridItem xs={12}>
								<LoginForm onLogin={onLogin} />
							</GridItem>
						</GridContainer>
					</GridItem>
				</GridContainer>
			</GridContainer>
			<Intercom appID={intercom.app.id} {...intercom.app.user} />
		</div>
	);

}

export default ((Login));
