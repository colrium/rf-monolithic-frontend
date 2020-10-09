/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import { app, colors } from "assets/jss/app-theme.jsx";
import Button from '@material-ui/core/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Section from "components/Section";
import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import SvgIcon from '@material-ui/core/SvgIcon';
import LogoChevronWhite from 'assets/img/realfield/chevron-white.svg';
import Logo from 'assets/img/realfield/logo.svg';
import DotsMap from 'assets/img/realfield/dots-map.png';
import SignupForm from "views/forms/SignupForm";
import { useGlobals } from "contexts/Globals";
import { closeDialog, openDialog } from "state/actions";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import { withErrorHandler } from "hoc/ErrorHandler";

const styles = theme => ({
	

});


const SectionComponent = (props) => {
	const { closeDialog, openDialog, auth } = props;

	const { definations, services } = useGlobals();
	
	let [popupMessage, setPopupMessage] = useState(false);
	

	const handleSignupFormSuccess = () => {
		openDialog({
			title: "Thank you for registering!",
			body: "We will be in touch directly to arrange a time to discuss your project and how we can provide you with the data you need. Realfield Team",
			actions: {
				cancel: {
					text: "OK",
					color: "default",
					onClick: () => closeDialog(),
				},
			},
		});
	}

	useEffect(() => {
		//handleSignupFormSuccess();
	}, []);

	return (
			<Section className={"p-0"} id="commission-a-survey" title={false}>			
							<GridContainer 
								className={"p-0 accent md:px-32 lg:px-48 md:py-6"}
								style={{
									backgroundImage:"url(" +DotsMap+ ")",
									backgroundRepeat: "no-repeat",
									backgroundAttachment: "scroll",
									backgroundPosition: "right top",
									backgroundSize: "auto 180px",
								}}
							>
								<Hidden smDown className="w-full flex">
									<GridItem 
										xs={12} 
										className={"flex flex-row items-center"} 									
									>
										<img src={LogoChevronWhite} className={"mr-4 h-8 w-8"} />
										<Typography variant="h4" className={"capitalize"} >
											COMMISSION A
										</Typography>

										<img src={Logo} className={"mx-4 h-6 w-auto"} />

										<Typography variant="h4" className={"capitalize"}>
											SURVEY
										</Typography>
									</GridItem>
								</Hidden>

								<Hidden mdUp className="w-full flex">
									<GridItem 
										xs={12} 
										className={"flex flex-col items-center justify-center"} 									
									>
										<img src={LogoChevronWhite} className={"mb-4 h-8 w-8"} />
										<Typography variant="h4" className={"capitalize"} >
											COMMISSION A
										</Typography>

										<img src={Logo} className={"my-4 h-6 w-auto"} />

										<Typography variant="h4" className={"capitalize"}>
											SURVEY
										</Typography>
									</GridItem>
								</Hidden>
								<GridItem xs={12} className={"px-2"}>
									<Typography variant="body1" paragraph className="font-bold">
										Data is the essential fuel required to power robust, evidence based analysis and decision making.
									</Typography>

									<Typography variant="body1" paragraph gutterBottom>
										Use the right data and get the analysis and insights you need. Use the wrong data and not only will your results be skewed rendering your analysis inaccurate, but you risk your project being on the wrong side of existing and future regulation and legislation. Garbage in, garbage out – it’s that simple. At Realfield we are dedicated to providing accurate, consistent, relevant and most importantly, ethical data. Real time. 
									</Typography>

									<Typography variant="body1" paragraph gutterBottom>
										Let us provide you with the right data to power your research and your insights. 
									</Typography>
								</GridItem>

							</GridContainer>
							<GridContainer className={"p-0 md:px-32 lg:px-48 md:py-6"}>						
								<GridItem xs={12} className={"py-1"}>
									<Typography variant="h3" color="textSecondary">
										Sign up to start
									</Typography>
								</GridItem>

								<GridItem xs={12} className={"py-0"}>
									<Typography variant="body2">
										To start your project or schedule a demo, please complete the following sign up form.
									</Typography>
								</GridItem>

								<GridItem xs={12} className={"py-1 px-0"}>
									<SignupForm 
										onSignupSuccess={handleSignupFormSuccess}
										role={"customer"}
										title={""}
									/>
								</GridItem>
							</GridContainer>
					
			</Section>
		);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default withErrorHandler(
	compose(connect(mapStateToProps, { closeDialog, openDialog }), withStyles(styles), withTheme)(SectionComponent)
);
