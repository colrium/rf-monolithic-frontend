/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import { app, colors } from "assets/jss/app-theme.jsx";
import Button from '@material-ui/core/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@material-ui/core/Typography";
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import compose from "recompose/compose";
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiNumeric1, mdiNumeric2, mdiNumeric3, mdiNumeric4 } from '@mdi/js';
import { Link } from "react-router-dom";
import Hidden from '@material-ui/core/Hidden';
import { withErrorHandler } from "hoc/ErrorHandler";
import LogoImg from "assets/img/realfield/logo.svg";
import BoyImg from "assets/img/realfield/boy.png";
import GirlImg from "assets/img/realfield/girl.png";
import BoyOnSurveyImg from "assets/img/realfield/boy-on-survey.png";
import GirlOnSurveyImg from "assets/img/realfield/girl-on-survey.png";
import HandsOnDeviceImg from "assets/img/realfield/hands-on-device.png";
import PeopleOnCommissionImg from "assets/img/realfield/people-on-commission.png";
import PeopleOnRealfieldImg from "assets/img/realfield/people-on-realfield.png";
import PeoplePaymentsImg from "assets/img/realfield/people-payments.png";
import BlueBg1 from "assets/img/realfield/Blue_BG/1_Blue_BG.png";
import BlueBg2 from "assets/img/realfield/Blue_BG/2_Blue_BG.png";
import BlueBg3 from "assets/img/realfield/Blue_BG/3_Blue_BG.png";
import GreenBg1 from "assets/img/realfield/Green_Bg/1_Green_BG.png";
import GreenBg2 from "assets/img/realfield/Green_Bg/2_Green_BG.png";
import GreenBg3 from "assets/img/realfield/Green_Bg/3_Green_BG.png";
import GreenBg4 from "assets/img/realfield/Green_Bg/4_Green_BG.png";
import ResumesImg from "assets/img/realfield/resumes.png";

const styles = theme => ({
	

});


const SectionComponent = (props) => {
	const {theme} = props;
		return (
			<Section className={"p-0 my-2 "} id="being-a-fielder">	
				<GridContainer className={"p-0"}>	
					<GridItem xs={12} className={"p-0 py-2"}>
						<Typography variant="h3" color="textPrimary" className="pb-4" paragraph>Being a Fielder</Typography>
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 px-6 inverse"} >
					<GridItem xs={3} className={"p-0"}>
						<img src={GirlImg} className="w-full h-auto" alt="girl" />
					</GridItem>

					<GridItem xs={6} className={"flex flex-col items-center justify-center p-0"}>
						<img src={LogoImg} className="w-full h-auto" alt="girl" />
						<Hidden smDown>
							<Typography variant="subtitle1" className="pt-12 w-full text-3xl text-center accent-text uppercase" paragraph>Become a Fielder Today!</Typography>
						</Hidden>

						<Hidden mdUp>
							<Typography variant="subtitle1" className="pt-12 w-full text-3xl text-center accent-text uppercase" paragraph>JOIN US</Typography>
						</Hidden>						
					</GridItem>

					<GridItem xs={3} className={"p-0"}>
						<img src={BoyImg} className="w-full h-auto" alt="boy" />
					</GridItem>
				</GridContainer>	

				<GridContainer className={"p-0"}>	
					<GridItem xs={12} className={"py-4 flex flex-col items-center justify-center p-0"}>
						<Typography variant="h3" color="secondary" paragraph>3 Easy Steps</Typography>
						<Typography variant="h3" className="pb-2" color="secondary" paragraph>to becoming a Fielder</Typography>
					</GridItem>
				</GridContainer>	

				<Hidden smDown>
				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={BlueBg1} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="secondary" paragraph>
							From the comfort of wherever you live or study, simply register on the Realfield app or website.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={PeopleOnRealfieldImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={PeopleOnCommissionImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-commission" />
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="secondary" paragraph>
							Get assignments to collect data as part of our Fielder team.
						</Typography>
						<img src={BlueBg2} className="w-12 h-12" />
						
					</GridItem>					
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={BlueBg3} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="secondary" paragraph>
							And get paid weekly without delays through your M-Pesa.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={PeoplePaymentsImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
					</GridItem>
				</GridContainer>
				</Hidden>

				<Hidden mdUp>
				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start mb-4"}>
						<img src={BlueBg1} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-xl font-bold" color="secondary">
							From the comfort of wherever you live or study, simply register on the Realfield app or website.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={PeopleOnRealfieldImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>						

					<GridItem xs={12} className={"p-0 pb-4  flex flex-row items-start mb-4"}>
						<img src={BlueBg2} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-xl font-bold" color="secondary">
							Get assignments to collect data as part of our Fielder team.
						</Typography>
						
						
					</GridItem>		

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={PeopleOnCommissionImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-commission" />
					</GridItem>			
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start mb-4"}>
						<img src={BlueBg3} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-xl font-bold" color="secondary">
							And get paid weekly without delays through your M-Pesa.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={PeoplePaymentsImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
					</GridItem>
				</GridContainer>
				</Hidden>


				<GridContainer className={"p-0 pt-2 pb-12"}>	
					<GridItem xs={12} className={"p-0 flex flex-col justify-center items-center"}>
						<Link to={"/apply".toUriWithLandingPagePrefix()}>
							<Button variant="contained" color="primary">
								Apply
							</Button>
						</Link>
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-4"}>	
					<GridItem xs={12} className={"p-0 flex flex-col justify-center items-center"}>
						<Typography variant="h3" color="primary" paragraph>
							Being a Fielder
						</Typography>
						<Typography variant="subtitle2" color="primary" paragraph>
							There are many benefits to becoming a Fielder, including being part of a great team in an innovative start-up!
						</Typography>
					</GridItem>
				</GridContainer>

				<Hidden smDown>
				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={GreenBg1} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-lg font-bold" color="primary" paragraph>
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={BoyOnSurveyImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={GirlOnSurveyImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="girl-on-survey" />
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="primary" paragraph>
							Build up on your communication and interpersonal skills.
						</Typography>
						<img src={GreenBg2} className="w-12 h-12" />
						
					</GridItem>					
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={GreenBg3} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="primary" paragraph>
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={ResumesImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="resumes" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={HandsOnDeviceImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="hands-on-device" />
					</GridItem>

					<GridItem xs={12} md={6} className={"sm:py-4 md:p-0 flex flex-row items-start"}>
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="primary" paragraph>
							Get paid weekly on data collected through your M-Pesa.
						</Typography>
						<img src={GreenBg4} className="w-12 h-12" />
						
					</GridItem>					
				</GridContainer>
				</Hidden>


				<Hidden mdUp>
				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={GreenBg1} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={BoyOnSurveyImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={GreenBg2} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Build up on your communication and interpersonal skills.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={GirlOnSurveyImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={GreenBg3} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={ResumesImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>


				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>	
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={GreenBg4} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Get paid weekly on data collected through your M-Pesa.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={HandsOnDeviceImg} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

				</Hidden>

				<Hidden smDown>
				<GridContainer className={"p-0 py-16"}>	

					<GridItem xs={12} className={"p-0 flex  sm:flex-col md:flex-row items-center justify-center"}>
						<img src={LogoImg} className="w-auto h-8" alt="logo" />

						<Typography variant="h4" className="mx-8 font-bold">
							Ethical Data. Real Time.
						</Typography>
						
					</GridItem>					
				</GridContainer>	
				</Hidden>

			</Section>
		);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default compose(connect(mapStateToProps, {}), withStyles(styles), withTheme, withErrorHandler)(SectionComponent);
