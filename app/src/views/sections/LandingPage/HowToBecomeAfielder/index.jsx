/** @format */


import Button from '@mui/material/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@mui/material/Typography";
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import compose from "recompose/compose";
import { Link } from "react-router-dom";
import Hidden from '@mui/material/Hidden';



import ApiService from "services/Api";

const styles = theme => ({


});


const SectionComponent = (props) => {
	const { theme } = props;
	return (
		<Section className={"p-0 my-2 "} id="being-a-fielder">
			<GridContainer className={"p-0"}>
				<GridItem xs={12} className={"p-0 py-2"}>
					<Typography variant="h3" color="textPrimary" className="pb-4" paragraph>Being a Fielder</Typography>
				</GridItem>
			</GridContainer>

			<GridContainer className={"p-0 px-6 inverse"} >
				<GridItem xs={3} className={"p-0"}>
					<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/girl.png")} className="w-full h-auto" alt="girl" />
				</GridItem>

				<GridItem xs={6} className={"flex flex-col items-center justify-center p-0"}>
					<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo.svg")} className="w-full h-auto" alt="girl" />
					<Hidden smDown>
						<Typography variant="subtitle1" className="pt-12 w-full text-3xl text-center accent-text uppercase" paragraph>Become a Fielder Today!</Typography>
					</Hidden>

					<Hidden mdUp>
						<Typography variant="subtitle1" className="pt-12 w-full text-3xl text-center accent-text uppercase" paragraph>JOIN US</Typography>
					</Hidden>
				</GridItem>

				<GridItem xs={3} className={"p-0"}>
					<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/boy.png")} className="w-full h-auto" alt="boy" />
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
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/1_Blue_BG.png")} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="secondary" paragraph>
							From the comfort of wherever you live or study, simply register on the Realfield app or website.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/people-on-realfield.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/people-on-commission.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-commission" />
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="secondary" paragraph>
							Get assignments to collect data as part of our Fielder team.
						</Typography>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/2_Blue_BG.png")} className="w-12 h-12" />

					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/3_Blue_BG.png")} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="secondary" paragraph>
							And get paid weekly without delays through your M-Pesa.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/people-payments.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
					</GridItem>
				</GridContainer>
			</Hidden>

			<Hidden mdUp>
				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start mb-4"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/1_Blue_BG.png")} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-xl font-bold" color="secondary">
							From the comfort of wherever you live or study, simply register on the Realfield app or website.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/people-on-realfield.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>

					<GridItem xs={12} className={"p-0 pb-4  flex flex-row items-start mb-4"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/2_Blue_BG.png")} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-xl font-bold" color="secondary">
							Get assignments to collect data as part of our Fielder team.
						</Typography>


					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/people-on-commission.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-commission" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start mb-4"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/3_Blue_BG.png")} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-xl font-bold" color="secondary">
							And get paid weekly without delays through your M-Pesa.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/people-payments.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="people-on-realfield" />
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
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/1_Green_BG.png")} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-lg font-bold" color="primary" paragraph>
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/boy-on-survey.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/girl-on-survey.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="girl-on-survey" />
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="primary" paragraph>
							Build up on your communication and interpersonal skills.
						</Typography>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/2_Green_BG.png")} className="w-12 h-12" />

					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/3_Green_BG.png")} className="w-12 h-12" />
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="primary" paragraph>
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/resumes.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="resumes" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} md={6} className={"p-0 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/hands-on-device.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="hands-on-device" />
					</GridItem>

					<GridItem xs={12} md={6} className={"sm:py-4 md:p-0 flex flex-row items-start"}>
						<Typography variant="body1" className="mx-8 text-xl font-bold" color="primary" paragraph>
							Get paid weekly on data collected through your M-Pesa.
						</Typography>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/4_Green_BG.png")} className="w-12 h-12" />

					</GridItem>
				</GridContainer>
			</Hidden>


			<Hidden mdUp>
				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/1_Green_BG.png")} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/boy-on-survey.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/2_Green_BG.png")} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Build up on your communication and interpersonal skills.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/girl-on-survey.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/3_Green_BG.png")} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Gain local knowledge about your community.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/resumes.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>


				<GridContainer className={"p-0 sm:px-8 md:px-12 lg:px-24 xl:px-32"}>
					<GridItem xs={12} className={"p-0 pb-4 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/4_Green_BG.png")} className="w-12 h-12 mr-4" />
						<Typography variant="body1" className="text-lg font-bold" color="primary">
							Get paid weekly on data collected through your M-Pesa.
						</Typography>
					</GridItem>

					<GridItem xs={12} className={"p-0 pb-8 flex flex-row items-start"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/hands-on-device.png")} className="w-full h-auto shadow-2xl rounded-md inverse" alt="boy-on-survey" />
					</GridItem>
				</GridContainer>

			</Hidden>

			<Hidden smDown>
				<GridContainer className={"p-0 py-16"}>

					<GridItem xs={12} className={"p-0 flex  sm:flex-col md:flex-row items-center justify-center"}>
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo.svg")} className="w-auto h-8" alt="logo" />

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

export default compose(connect(mapStateToProps, {}), withTheme)(SectionComponent);
