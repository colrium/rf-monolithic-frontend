import React from "react";
import { colors } from "assets/jss/app-theme.jsx";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import Hidden from '@mui/material/Hidden';

import ApiService from "services/Api";
import { Link } from "react-router-dom";
import compose from "recompose/compose";


import AnimatedChevronMap from "views/widgets/AnimatedChevronMap";

const styles = theme => ({
	root: {
		zIndex: "12",
		color: colors.hex.text,
		position: "relative",
		minHeight: "100vh",

	},
	container: {
		color: colors.hex.default,
	},
	title: {
		color: theme.palette.text.secondary,
		textDecoration: "none",
	},
	subtitle: {
		margin: "10px auto 0",
	},
	titleWrapper: {
		position: "relative",
	},
	titleContainer: {
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
		padding: "0",
	},
	section: {
		background: theme.palette.background.paper,
		padding: theme.spacing(1, 2),
	},
});

const SectionComponent = (props) => {
	const { classes, auth, theme, device, ...rest } = props;



	return (
		<Section className={"flex flex-row items-center justify-center min-h-screen md:pr-4  md:py-0"} id="jumbotron" title={false}>
			<Grid container className={"p-0"}>
				<Grid item  xs={12} sm={12} md={12} className={"p-0"}>
					<Hidden mdUp className="flex flex-row">
						<Grid container alignItems="center" justify="center" className={"p-0"}>
							<Grid item  xs={12} sm={12} md={6} lg={4} className={"relative p-0 -mt-40"}>
								<Grid container
									className={"p-0"}
									style={{
										backgroundImage:
											"url(" +
											"https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/chevron-map.png" +
											")",
										backgroundRepeat: "no-repeat",
										backgroundAttachment: "scroll",
										backgroundPosition: "center top",
										backgroundSize: "auto 180px",
									}}
								>
									<Grid item  xs={12} className={"p-0"}>
										<Typography className={"font-black text-5xl mb-2 w-full text-center"} variant="h1">
											<span>Ethical Data</span>
											<span className="avenir">.</span>
										</Typography>
										<Typography className={"font-black text-5xl w-full text-center"} variant="h1">
											<span>Real Time</span>
											<span className="avenir">.</span>
										</Typography>
									</Grid>

									<Grid item  xs={12} className={"my-12 p-0 flex flex-col items-center"}>
										<Typography variant="body1" className={"w-full text-center font-bold"}>
											For data you can’t find online.
										</Typography>
									</Grid>

									<Grid item  xs={12} className={"flex p-0"}>
										<Grid container className={"p-0 flex flex-col items-center"}>
											<Link
												to={"/home#commission-a-survey".toUriWithLandingPagePrefix()}
												color="inherit"
												className={"mb-8 w-7/12"}
											>
												<Button
													style={{ background: colors.hex.accent, color: theme.palette.background.paper }}
													size="large"
													variant="contained"
													className="w-full capitalize rounded-full"
													color={"accent"}
													sx={{
														color: theme => `${theme.palette.inverse}`,
													}}
												>
													Get Quote
												</Button>
											</Link>
											<Link
												to={"/home#commission-a-survey".toUriWithLandingPagePrefix()}
												color="inherit"
												className={"w-7/12"}
											>
												<Button
													color="primary"
													variant="outlined"
													size="large"
													variant="outlined"
													className="w-full  md:text-sm capitalize rounded-full"
													color={"primary"}
													sx={
														{
															// color: (theme) => (`${theme.palette.primary}`)
														}
													}
												>
													Request demo
												</Button>
											</Link>
										</Grid>
									</Grid>
								</Grid>
							</Grid>

							{/*<Grid item  xs={12} sm={12} md={6} lg={8} className={"p-0"}>
									<AnimatedChevronMap />
								</Grid>*/}
						</Grid>
					</Hidden>
					<Hidden smDown>
						<Grid container className={"p-0  items-center "}>
							<Grid item  xs={12} sm={12} md={4} className={"relative p-0"}>
								<Grid container className={"p-0"}>
									<Grid item  xs={12} className={"mb-4 p-0"}>
										<Typography
											className={"font-black md:text-4xl lg:text-5xl xl:text-6xl w-full text-left"}
											variant="h1"
											style={{ fontSize: "4vw !important" }}
										>
											<span>Ethical Data</span>
											<span className="avenir">.</span>
										</Typography>
										<Typography
											className={"font-black md:text-4xl lg:text-5xl xl:text-6xl w-full text-left"}
											variant="h1"
										>
											<span>Real Time</span>
											<span className="avenir">.</span>
										</Typography>
									</Grid>

									<Grid item  xs={12} className={"mb-12 p-0"}>
										{/*<Typography
													className={classes?.subtitle+" font-bold"}
													variant="body1"
												>
													Pioneering the remote collection of ethical, accurate and reliable face-to-face and primary data across Africa and frontier markets, real time.
												</Typography>*/}
										<Typography className={classes?.subtitle + " font-bold"} variant="body1">
											For data you can’t find online.
										</Typography>

										{/*<Typography
													className={classes?.subtitle}
													variant="body1"
												>
													primary data collection services.
												</Typography>*/}
									</Grid>
									<Grid item  xs={12} className={"p-0"}>
										<Grid container className={"p-0 flex flex-row"}>
											<Link
												to={"/home#commission-a-survey".toUriWithLandingPagePrefix()}
												color="inherit"
												className={"mb-4"}
											>
												<Button
													size="large"
													variant="contained"
													className="w-full  md:text-sm capitalize rounded-full"
													color={"accent"}
												>
													Get Quote
												</Button>
											</Link>
											<Link
												to={"/home#commission-a-survey".toUriWithLandingPagePrefix()}
												color="inherit"
												className={"mx-4"}
											>
												<Button
													color="primary"
													variant="outlined"
													size="large"
													variant="outlined"
													className=" md:text-sm capitalize rounded-full"
												>
													Request demo
												</Button>
											</Link>
										</Grid>
									</Grid>
								</Grid>
							</Grid>

							<Grid item  xs={12} sm={12} md={8} className={"p-0"}>
								<AnimatedChevronMap />
							</Grid>
						</Grid>
					</Hidden>
				</Grid>
			</Grid>
		</Section>
	)
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default (
	compose(connect(mapStateToProps, {}), withTheme,)(SectionComponent)
);
