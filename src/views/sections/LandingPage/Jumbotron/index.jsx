import React, {useState, useEffect} from "react";
import { app, colors } from "assets/jss/app-theme.jsx";
import Button from '@material-ui/core/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Section from "components/Section";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import ChevronMap from 'assets/img/realfield/chevron-map.png';
import { Link, HashRouter, Route, Switch } from "react-router-dom";
import compose from "recompose/compose";
import withStyles from "@material-ui/core/styles/withStyles";
import { withErrorHandler } from "hoc/ErrorHandler";
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
		const { classes, auth, theme, device,  ...rest } = props;


		
		return (
			<Section
					className={"flex flex-col justify-center min-h-screen p-0"}
					id="jumbotron"
					title={false}
					style={{
						minHeight: "70vh"
					}}
				>
					<GridContainer className={"p-0"}>
						<GridItem xs={12} sm={12} md={12} className={"p-0"}>
						<Hidden mdUp className="flex flex-row">
							<GridContainer alignItems="center" justify="center" className={"p-0"}>
								<GridItem
									xs={12}
									sm={12}
									md={6}
									lg={4}
									className={"relative p-0 -mt-40"}
								>
									<GridContainer className={"p-0"}
										style={{
											backgroundImage:"url(" +ChevronMap+ ")",
											backgroundRepeat: "no-repeat",
											backgroundAttachment: "scroll",
											backgroundPosition: "center top",
											backgroundSize: "auto 180px",
										}}
									>
										<GridItem xs={12} className={"p-0"}>
											<Typography className={"font-black text-5xl mb-2 w-full text-center"} variant="h1">
												<span>Ethical Data</span><span className="avenir">.</span>
											</Typography>
											<Typography className={"font-black text-5xl w-full text-center"} variant="h1">
												<span>Real Time</span><span className="avenir">.</span>
											</Typography>

										</GridItem>

										<GridItem xs={12} className={"my-12 p-0 flex flex-col items-center"}>
											<Typography
												variant="body1"
												className={"w-full text-center font-bold"}												
											>
												For data you can’t find online.
											</Typography>
										</GridItem>
										
											<GridItem xs={12} className={"flex p-0"}>
												<GridContainer className={"p-0 flex flex-col items-center"}>
													<Link to={"/home#commission-a-survey".toUriWithLandingPagePrefix()} color="inherit" className={"mb-8 w-7/12"}>
														<Button
																style={{ background: colors.hex.accent, color: theme.palette.background.paper}}
																size="large"
																variant="contained"
																className={"w-full"}
																classes={{
																	label: "capitalize inverse-text md:text-sm"
																}}
															>
																Get Quote
															</Button>
													</Link>
													<Link to={"/home#commission-a-survey".toUriWithLandingPagePrefix()} color="inherit" className={"w-7/12"}>
															<Button
																color="primary"
																outlined
																style={{ margin: "auto" }}
																size="large"
																variant="outlined"
																className={"w-full"}
																classes={{
																	label: "capitalize primary-text md:text-sm"
																}}
															>
																Request demo
															</Button>
													</Link>
												</GridContainer>
											</GridItem>
										
									</GridContainer>
								</GridItem>

								{/*<GridItem xs={12} sm={12} md={6} lg={8} className={"p-0"}>
									<AnimatedChevronMap />
								</GridItem>*/}
							</GridContainer>
							</Hidden>
							<Hidden smDown>
								<GridContainer className={"p-0"}>
									<GridItem
										xs={12}
										sm={12}
										md={4}
										className={"relative flex flex-col justify-center p-0"}
									>
										<GridContainer className={"p-0"}>
											<GridItem xs={12} className={"mb-4 p-0"}>
												<Typography className={"font-black md:text-4xl lg:text-5xl xl:text-6xl w-full text-left"} variant="h1" style={{fontSize: "4vw !important"}}>
													<span>Ethical Data</span><span className="avenir">.</span>
												</Typography>
												<Typography className={"font-black md:text-4xl lg:text-5xl xl:text-6xl w-full text-left"} variant="h1">													
													<span>Real Time</span><span className="avenir">.</span>
												</Typography>

											</GridItem>

											<GridItem xs={12} className={"mb-12 p-0"}>
												{/*<Typography
													className={classes.subtitle+" font-bold"}
													variant="body1"
												>
													Pioneering the remote collection of ethical, accurate and reliable face-to-face and primary data across Africa and frontier markets, real time. 
												</Typography>*/}
												<Typography
													className={classes.subtitle+" font-bold"}
													variant="body1"
												>
													For data you can’t find online.
												</Typography>

												{/*<Typography
													className={classes.subtitle}
													variant="body1"
												>
													primary data collection services.
												</Typography>*/}
											</GridItem>
												<GridItem xs={12} className={"p-0"}>
													<GridContainer className={"p-0 flex flex-row pl-8"}>
														<Link to={"/home#commission-a-survey".toUriWithLandingPagePrefix()} color="inherit" className={"mb-4"}>
															<Button
																	style={{ background: colors.hex.accent, color: theme.palette.background.paper}}
																	size="large"
																	variant="contained"
																	classes={{
																		label: "capitalize inverse-text md:text-sm"
																	}}
																>
																	Get Quote
																</Button>
														</Link>
														<Link to={"/home#commission-a-survey".toUriWithLandingPagePrefix()} color="inherit" className={"mx-4"}>
																<Button
																	color="primary"
																	outlined
																	style={{ margin: "auto" }}
																	size="large"
																	variant="outlined"
																	classes={{
																		label: "capitalize primary-text md:text-sm"
																	}}
																>
																	Request demo
																</Button>
														</Link>
													</GridContainer>
												</GridItem>
										</GridContainer>
									</GridItem>

									<GridItem xs={12} sm={12} md={8} className={"p-0"}>
										<AnimatedChevronMap />
									</GridItem>
								</GridContainer>
							</Hidden>
						</GridItem>
					</GridContainer>
				</Section>
		);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(connect(mapStateToProps, {}), withTheme, withStyles(styles))(SectionComponent)
);
