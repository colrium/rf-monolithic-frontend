import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Intercom from 'react-intercom';
import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/Button";
import Typography from "components/Typography";
import RequestDemoForm from "views/forms/RequestDemoForm";
import withRoot from "utils/withRoot";
import {intercom} from "config";
import { withSettingsContext } from "contexts/Settings";
import { app, colors } from "assets/jss/app-theme";
import logo from 'assets/img/realfield/logo.svg';
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
		const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
		
		if (anchor) {
			anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	};

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation" >
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
	let [state, setState] = useState(props);
	useEffect(() => {  setState(props); }, [props]);
	let { classes, className, color, columnWidgets, absoluteFooter, settingsContext } = state;
	const inverseColor = ["inverse", "transparent"].includes(color)? "default" : "inverse";
	
	
	
	return (
		<footer className={" w-full "+color} style={{backgroundImage: "url(" + require('assets/img/realfield/logo-rotated.png') + ")", backgroundRepeat: "no-repeat", backgroundAttachment: "scroll", backgroundPosition: "right center", backgroundSize: "auto 180px" }}>
			
			<div className="fixed flex items-center flex-col bottom-0 right-0 mr-8 mb-24 z-50">
				<ScrollTop {...props}>
					<Fab color="primary" size="small" aria-label="scroll back to top">
						<KeyboardArrowUpIcon />
					</Fab>
				</ScrollTop>
				<Intercom appID={intercom.app.id} { ...intercom.app.user } />
			</div>
			
			<GridContainer className={className}>
				{!columnWidgets && <GridContainer>
					<GridItem sm={12} className="p-0 m-0 mb-8">
						<GridContainer className="p-0 m-0">
							<GridItem sm={12} md={4}>
								{ !String.isEmpty(settingsContext.settings.general["site-tagline"]) && <Typography className="w-full pl-4 block pb-8" variant="body1">{settingsContext.settings.general["site-tagline"] }</Typography>}
								<Link className="pl-4 block" to={"/home".toUriWithLandingPagePrefix()} color="inherit"><Button  color="inherit" simple>{<img src={logo} className="h-8" alt="logo"/>}</Button></Link>
							</GridItem>
							<GridItem className="pl-4" sm={12} md={4}>
								<Typography className="w-full pl-4 block pb-4" color={inverseColor} variant="h3">Links</Typography>
								{ settingsContext.settings.reading["enable-blog"] && <Link to={"/blog".toUriWithLandingPagePrefix()} className="block"><Button className={inverseColor+"_text"} simple >Blog</Button></Link>}
								{ settingsContext.settings.reading["enable-press"] && <Link to={"/press".toUriWithLandingPagePrefix()}  className="block"><Button className={inverseColor+"_text"} simple >Press</Button></Link>}
								{ settingsContext.settings.reading["enable-faq"] && <Link to={"/faq".toUriWithLandingPagePrefix()}  className="block"><Button className={inverseColor+"_text"} simple >FAQ</Button></Link>}
							</GridItem>

							<GridItem className="pl-4" sm={12} md={4}>
								<Typography className="w-full pl-4 block pb-4" color={inverseColor} variant="h3">Legal</Typography>
								<Link to={"/terms-of-use".toUriWithLandingPagePrefix()} className="block"><Button className={inverseColor+"_text"} simple >Terms of Use</Button></Link>
								<Link to={"/end-user-agreement".toUriWithLandingPagePrefix()}  className="block"><Button className={inverseColor+"_text"} simple >End user Agreement</Button></Link>
								<Link to={"/privacy-policy".toUriWithLandingPagePrefix()}  className="block"><Button className={inverseColor+"_text"} simple >Privacy Policy</Button></Link>
							</GridItem>
						</GridContainer>
					</GridItem>

					<GridItem sm={12} className="p-0 m-0 mb-8">
						<GridContainer className="p-0 m-0">
							<GridItem sm={12} md={4}>
								<Typography className="w-full pl-4 block pb-4" variant="body2">Information you can't find online</Typography>
								<RequestDemoForm className="w-full pl-4 block pb-4" color={inverseColor} />
							</GridItem>
							<GridItem className="pl-4 block" sm={12} md={4}>
								{ settingsContext.settings.social && <GridContainer className="p-0 m-0">
									<Typography className="w-full pl-4 block" color={inverseColor} variant="h3">Social</Typography>
								</GridContainer> }
								{ settingsContext.settings.social && <GridContainer className="p-0 m-0">
									{Object.entries(settingsContext.settings.social).map(([name, url], index)=>(
										(!String.isEmpty(url) && String.isUrl(url)) && <IconButton className="text-white" aria-label={name} href={url} target="_blank" key={name+"-button"}> 
											{ name === "twitter" &&  <TwitterIcon />}
											{ name === "linkedin" && <LinkedInIcon /> }
											{ name === "instagram" && <InstagramIcon />}
											{ name === "whatsapp" && <WhatsAppIcon /> }
											{ name === "facebook" && <FacebookIcon />  }
											{ name === "youtube" && <YouTubeIcon />  }											
										</IconButton>											
									))}
								</GridContainer> }
							</GridItem>

							<GridItem className="pl-4 block" sm={12} md={4}>
								<Typography className="w-full pl-4 block pb-4" color={inverseColor} variant="h3">Contact</Typography>
								{!String.isEmpty(settingsContext.settings["contact-phone"]) && <Typography className="w-full pl-4 block pb-4" color={inverseColor} variant="body2">{settingsContext.settings["contact-phone"]}</Typography>}
								{!String.isEmpty(settingsContext.settings["contact-email"]) && <Typography className="w-full pl-4 block pb-4" color={inverseColor} variant="body2">{settingsContext.settings["contact-email"]}</Typography>}
							</GridItem>
						</GridContainer>
					</GridItem>
				</GridContainer>}
				
				
			</GridContainer>
			{ absoluteFooter && <GridContainer className={classes.absoluteFooter}>
					{absoluteFooter}
				</GridContainer> }

			{ !absoluteFooter && <GridContainer className={classes.absoluteFooter}>
					<GridItem className="p-0 pl-4 block" sm={12} md={6}>
						<Typography className="mt-2 mb-1 pl-2 pr-2" variant="body1"> &copy; Copyright {app.name}. { new Date().format("Y") } </Typography>
					</GridItem>
					<GridItem className="p-0 pl-4 block flex justify-end" sm={12} md={6}>
						<Typography className="mt-2 mb-1 pl-2 pr-2" variant="body1"> Registered in Eng & wales Co No. </Typography>
					</GridItem>
				</GridContainer> }
			
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

export default withSettingsContext(withStyles(styles)(Footer));
