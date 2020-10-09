import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Zoom from "@material-ui/core/Zoom";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import YouTubeIcon from "@material-ui/icons/YouTube";
import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import logo from "assets/img/realfield/logo.svg";
import { app, colors } from "assets/jss/app-theme";
import Button from '@material-ui/core/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import { intercom } from "config";
import PropTypes from "prop-types";
import Intercom from "react-intercom";
import { Link } from "react-router-dom";
import RequestDemoForm from "views/forms/RequestDemoForm";
import {withErrorHandler} from "hoc/ErrorHandler";
import styles from "./styles";

function ScrollTop(props) {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 100,
	});

	const handleClick = event => {
		const anchor = (event.target.ownerDocument || document).querySelector(
			"#back-to-top-anchor"
		);

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation">
				{children}
			</div>
		</Zoom>
	);
}

ScrollTop.propTypes = {
	children: PropTypes.element.isRequired,
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

function Footer(props) {
	

	let {
		app: { settings },
		classes,
		className,
		color,
		columnWidgets,
		absoluteFooter,
	} = props;


	const inverseColor = ["inverse", "transparent"].includes(color)? "default" : "inverse";


	return (
		<footer
			className={"w-full "+ color}
			style={{
				backgroundImage:
					"url(" +
					require("assets/img/realfield/logo-rotated.png") +
					")",
				backgroundRepeat: "no-repeat",
				backgroundAttachment: "scroll",
				backgroundPosition: "right center",
				backgroundSize: "auto 180px",
			}}
			id="footer"
		>
			<div className="fixed flex items-center flex-col bottom-0 right-0 mr-8 mb-24 z-50">
				<ScrollTop className="mb-12" {...props}>
					<Fab
						color="primary"
						size="small"
						aria-label="scroll back to top"
					>
						<KeyboardArrowUpIcon />
					</Fab>
				</ScrollTop>
				
			</div>
			<Intercom appID={intercom.app.id} {...intercom.app.user} />
			<GridContainer className={className}>
				{!columnWidgets && (
					<GridContainer className=" md:px-24 ">
						<GridItem sm={12} lg={5} className="p-0 m-0 mb-8">
							<GridContainer className="p-0 m-0">
								<GridItem sm={12} className="p-0 m-0">
									<GridItem xs={12} className={"mb-6 p-0"}>
											<Typography className={classes.title+" mb-2 font-extrabold"} variant="h2" paragraph>
												<span>Ethical Data</span><span className="avenir">.</span>
											</Typography>
											<Typography className={classes.title+" mb-4 font-extrabold"} variant="h2" paragraph>
												<span>Real Time</span><span className="avenir">.</span>
											</Typography>

											<Typography className="inverse-text" variant="body2" paragraph>
												For data you can’t find online
											</Typography>

									</GridItem>
									
									
								</GridItem>
							</GridContainer>
						</GridItem>

						<GridItem sm={12} lg={7} className="p-0 m-0 mb-8">
							<GridContainer className="p-0 m-0">
								
								<GridItem className="pl-4" sm={12} md={4}>

									<Typography
										className="w-full block pb-4 uppercase"
										color={inverseColor}
										variant="h5"
									>
										Real Data
									</Typography>

									<Link
											to={"/why-us".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Why Realfield?
											</Button>
									</Link>

									<Link
											to={"/why-us#realfield-advantage".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Realfield Advantage
											</Button>
									</Link>

									<Link
											to={"/about-us#data".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text px-0"}
												classes={{
													label: "capitalize inverse-text justify-start"
												}}
											>
												Data
											</Button>
									</Link>

									<Link
											to={"/about-us#data-quality".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Data Quality
											</Button>
									</Link>

									<Link
											to={"/about-us#data-ethics".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Data Ethics
											</Button>
									</Link>

									<Link
											to={"/ethical-principles".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Ethical Principles
											</Button>
									</Link>

									
								</GridItem>

								<GridItem className="pl-4" sm={12} md={4}>
									<Typography
										className="w-full block pb-4 uppercase"
										color={inverseColor}
										variant="h5"
									>
										Product
									</Typography>

									<Link
											to={"/home#products".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize text-current"
												}}
											>
												Surveys
											</Button>
									</Link>

									<Link
											to={"/home#products".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Queries
											</Button>
									</Link>									
								</GridItem>

								<GridItem className="pl-4" sm={12} md={4}>
									<Typography
										className="w-full block pb-4 uppercase"
										color={inverseColor}
										variant="h5"
									>
										About Us									
									</Typography>

									<Link
											to={"/about-us".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Who we are
											</Button>
									</Link>

									<Link
											to={"/about-us#being-a-fielder".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Being a Fielder
											</Button>
									</Link>

									<Link
											to={"/about-us#faqs".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												FAQs
											</Button>
									</Link>

									<Link
											to={"/jobs".toUriWithLandingPagePrefix()}
											className="block"
										>
											<Button
												className={"inverse-text justify-start px-0"}
												classes={{
													label: "capitalize inverse-text"
												}}
											>
												Jobs
											</Button>
									</Link>

									
								</GridItem>
							</GridContainer>
						</GridItem>

						<GridItem md={5} className="p-0 m-0 mb-8">
							<GridContainer className="p-0 m-0">
								<GridItem sm={12} md={8} className="p-0">
									<Typography
										className="w-full pl-0 block pb-4"
										variant="body2"
									>
										For more information, or to schedule a demo, drop us a line 
									</Typography>
									<RequestDemoForm
										className="w-full block pb-4"
										color={inverseColor}
									/>
								</GridItem>
							</GridContainer>
						</GridItem>

						<GridItem md={7} className="p-0 m-0 mb-8">
							<GridContainer className="p-0 m-0">
								<GridItem className="pl-4 block" sm={12} md={6}>
									{settings.social && (
										<GridContainer className="p-0 m-0">
											<Typography
												className="w-full block"
												color={inverseColor}
												variant="h5"
											>
												Social
											</Typography>
										</GridContainer>
									)}
									{settings.social && (
										<GridContainer className="p-0 m-0">
											{Object.entries(settings.social).map(
												([name, url], index) =>
													!String.isEmpty(url) &&
													String.isUrl(url) && (
														<IconButton
															className="text-white"
															aria-label={name}
															href={url}
															target="_blank"
															key={
																name + "-button"
															}
														>
															{name ===
																"twitter" && (
																<TwitterIcon />
															)}
															{name ===
																"linkedin" && (
																<LinkedInIcon />
															)}
															{name ===
																"instagram" && (
																<InstagramIcon />
															)}
															{name ===
																"whatsapp" && (
																<WhatsAppIcon />
															)}
															{name ===
																"facebook" && (
																<FacebookIcon />
															)}
															{name ===
																"youtube" && (
																<YouTubeIcon />
															)}
															{name ===
																"google_plus" && (
																<GooglePlusIcon />
															)}
														</IconButton>
													)
											)}
										</GridContainer>
									)}
								</GridItem>

								<GridItem className="pl-4 block" sm={12} md={6}>
									<Typography
										className="w-full block pb-4"
										color={inverseColor}
										variant="h5"
									>
										Contact
									</Typography>
									{!String.isEmpty(settings.contact["phone"]) && (
										<Typography
											className="w-full secondary-text block pb-4"
											variant="h4"
											paragraph
										>
											{settings.contact["phone"]}
										</Typography>
									)}
									{!String.isEmpty(settings.contact["email"]) && (
										<Typography
											className="w-full secondary-text block pb-4"
											variant="h4"
											paragraph
										>
											{settings.contact["email"]}
										</Typography>
									)}
								</GridItem>

							</GridContainer>
						</GridItem>
					</GridContainer>
				)}
			</GridContainer>
			{absoluteFooter && (
				<GridContainer className={classes.absoluteFooter}>
					{absoluteFooter}
				</GridContainer>
			)}

			{!absoluteFooter && (
				<GridContainer className={classes.absoluteFooter+" md:px-20"}>
					<GridItem className="p-0 pl-0 flex sm:flex-col lg:flex-row items-center" sm={12} md={6}>
						<Link
										className="pl-0 block"
										to={"/home".toUriWithLandingPagePrefix()}
										color="inherit"
									>
										<Button color="inherit" simple>
											{
												<img
													src={logo}
													className="h-8"
													alt="logo"
												/>
											}
										</Button>
									</Link>
						{/*<Typography
							className="mt-2 mb-1 pl-2 pr-2"
							variant="body1"
						>
							&copy; {settings.general["copyright"].replaceAll("YYYY", new Date().format("Y"))}
						</Typography>*/}
						<Typography
							className="mt-2 mb-1 pl-2 pr-2"
							variant="body1"
						>
							{settings.general["trademark"]}
						</Typography>
					</GridItem>
					<GridItem
						className="p-0 pl-4 block flex flex-row items-center justify-center"
						sm={12}
						md={3}
					>

						<Link
										className="pl-0 block"
										to={"/privacy-policy".toUriWithLandingPagePrefix()}
										color="inherit"
									>
										<Button color="inherit" classes={{label: "capitalize"}} simple>
											Terms.
										</Button>
						</Link>
					</GridItem>

					<GridItem
						className="p-0 pl-4 block flex flex-row items-center justify-center"
						sm={12}
						md={3}
					>
						<Link
										className="pl-0 block"
										to={"/privacy-policy".toUriWithLandingPagePrefix()}
										color="inherit"
									>
										<Button color="inherit" classes={{label: "capitalize"}} simple>
											Privacy.
										</Button>
						</Link>
					</GridItem>
				</GridContainer>
			)}
		</footer>
	);
}

Footer.propTypes = {
	className: PropTypes.string,
	columnWidgets: PropTypes.array,
	absoluteFooter: PropTypes.node,
	color: PropTypes.oneOf(Object.keys(colors.hex)),
};

Footer.defaultProps = {
	color: "primary",
};

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default withErrorHandler(connect(mapStateToProps, {})(withStyles(styles)(React.memo(Footer))));
