/** @format */

import Hidden from "@mui/material/Hidden";
import Box from "@mui/material/Box"
import { app } from "assets/jss/app-theme";
import classNames from "classnames";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import React from "react";
import { makeStyles } from '@mui/styles';
import AnimatedChevronMap from "views/widgets/AnimatedChevronMap";
import { intercom } from "config";
import Intercom from "react-intercom";
import { Link, useLocation, Outlet } from "react-router-dom"
import { useTheme } from "@mui/material/styles"
import {  useDidMount, useDidUpdate } from "hooks"

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
		background: theme.palette.secondary,
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
}));

const pathTitles = {
	"/auth/login": app.title("Login"),
	"/auth/forgot-password": app.title("Forgot password"),
	"/auth/reset-password": app.title("Reset Password"),
}

const AuthPage = (props) => {
	const classes = useStyles();
	const location = useLocation()

	useDidMount(() => {
		document.title = pathTitles[location.pathname] || app.title("")
	});
	useDidUpdate(()=>{
		document.title = pathTitles[location.pathname] || app.title("")
	}, [location])
	const theme = useTheme();
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
								backgroundColor: theme =>
									theme.palette.secondary.light,
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
										className={classes?.info_map_container}
									>
										<AnimatedChevronMap
											mapcolor={
												theme.palette.background.paper
											}
											popUpStyle={{
												background:
													"linear-gradient(to right, #8C189B, #6a0f75)",
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
						className={"flex flex-col items-center justify-center"}
					>
						<Box
							className={"p-4 flex flex-col items-center"}
							sx={
								{
									// backgroundColor: theme => theme.palette.background.paper,
								}
							}
						>
							<Link
								to={"/home".toUriWithLandingPagePrefix()}
								className={"pb-20"}
							>
								<img
									alt={app.name + " logo"}
									className={classNames(
										classes?.login_logo,
										"center"
									)}
									src={app.logo}
								/>
							</Link>
							<Outlet />
						</Box>
					</GridItem>
				</GridContainer>
			</GridContainer>
			<Intercom appID={intercom.app.id} {...intercom.app.user} />
		</div>
	)

}

export default AuthPage
