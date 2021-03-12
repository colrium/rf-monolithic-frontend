import React from "react";

import Button from '@material-ui/core/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Section from "components/Section";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import { withErrorHandler } from "hoc/ErrorHandler";

const SectionComponent = (props) => {
		const { classes, auth, theme, device,  ...rest } = props;


		
		return (
			<Section id="jobs">
									
						<GridContainer className={"p-0"}>
							<GridContainer className={"p-0 md:py-6"}>
								<GridItem xs={12}>
									<Typography variant="h1" className="accent-text w-full text-center">
										Welcome to Realfield!
									</Typography>
								</GridItem>

							</GridContainer>
							<GridContainer className={"p-0"}>	
								<GridItem xs={12} className={"flex flex-col mb-4"}>
									<Typography variant="body1" className="font-bold" paragraph>
										<span className="mr-2">We are now recruiting Fielders to undertake data collection for upcoming projects around the country. If you are interested in working for an exciting startup with an important ethical mission in East Africa's rapidly growing gig-economy and you have a reputation for fast reliable and efficient work,
										</span>
										<Link to={"/jobs#apply-link".toUriWithLandingPagePrefix()} className="accent-text">click the link below and signup now!</Link>
									</Typography>

									<Typography variant="body1" className="accent-text font-black w-full text-center" paragraph>
										Earn extra money working close to home
									</Typography>

									<Typography variant="body1" className="font-bold" paragraph>
										Accurate and timely information is absolutely essential for today's decision makers, yet reliable and relevant data has never been more rare.
									</Typography>

									<Typography variant="body1" paragraph>
										Our unyealding dedication to ethical data collection and data privacy combines the most robust data collection methods with online convinience and usability giving our clients real-time access to real data from real people
									</Typography>

									<Typography variant="body1" className="accent-text font-bold" paragraph>
										Required Qualifications:
									</Typography>

									<Typography variant="body1" paragraph>
										<ol className="list-decimal pl-4">
											<li className={"mb-4 text-sm font-normal"}>You must be over the age of 18</li>
											<li className={"mb-4 text-sm font-normal"}>You must have graduated OR be currently enrolled in a national or county university or college</li>
											<li className={"mb-4 text-sm font-normal"}> You must have a smartphone with Android OS capable of downloading the Realfield App from Google Play (we’re not operating on Apple’s iOS yet!)</li>
										</ol>										
									</Typography>

									<Typography variant="body1" className="font-bold accent-text" paragraph>
										Beyond these simple requirements, we are looking for people all across Kenya from Turkana to the Coast and everywhere in between! If you have a curious mind and enjoy speaking with new people, asking questions and learning new things – join us today! 

									</Typography>

									<Typography variant="body1" className="font-bold accent-text" paragraph>
										All you need to complete the sign-up form are the following documents available for upload: 
									</Typography>

									<Typography variant="body1" className="mb-10" paragraph>
										<ul className="list-disc pl-4">
											<li className={"mb-4 text-sm font-normal"}>Proof of enrollment in higher education OR graduation certificate from your university or college</li>
											<li className={"mb-4 text-sm font-normal"}>Government issued ID</li>
											<li className={"mb-4 text-sm font-normal"}>CV or résumé</li>
											<li className={"mb-4 text-sm font-normal"}>A recent selfie</li>
										</ul>

									</Typography>
								</GridItem>				
								<GridItem xs={12} className={"flex flex-col items-center"}>
									<Link to={"/apply".toUriWithLandingPagePrefix()}>
										<Button variant="contained" color="primary" id="apply-link">
											Join us!
										</Button>
									</Link>
								</GridItem>
							</GridContainer>
						</GridContainer>
				
					
			</Section>
		);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(connect(mapStateToProps, {}), withTheme)(SectionComponent)
);
