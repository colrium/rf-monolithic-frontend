import React, {useState, useEffect} from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { app, colors } from "assets/jss/app-theme.jsx";
import Button from '@material-ui/core/Button';
import Section from "components/Section";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from '@material-ui/core/Typography';
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';



import BlueBg1 from "assets/img/realfield/Blue_BG/1_Blue_BG.png";
import BlueBg2 from "assets/img/realfield/Blue_BG/2_Blue_BG.png";
import BlueBg3 from "assets/img/realfield/Blue_BG/3_Blue_BG.png";
import ProcessImg1 from "assets/img/realfield/process/process1.png";
import ProcessImg2 from "assets/img/realfield/process/process2.png";
import ProcessImg3 from "assets/img/realfield/process/process3.png";
import ProcessImg4 from "assets/img/realfield/process/process4.png";
import ProcessImg5 from "assets/img/realfield/process/process5.png";
import ProcessImg6 from "assets/img/realfield/process/process6.png";
import ProcessImg7 from "assets/img/realfield/process/process7.png";

import { withErrorHandler } from "hoc/ErrorHandler";

const styles = theme => ({
	cardContent: {
		color: theme.palette.background.paper,
	},	

});


const SectionComponent = (props) => {
		const { classes, auth, theme, device,  ...rest } = props;

		
		return (
			<Section className={"p-0 py-16"} id="products" title="Products">
				<GridContainer className={"p-0"}>
					<GridItem xs={12} md={12} className="p-0 mb-2 md:p-0">
						<Typography variant="subtitle2" color={"textSecondary"} className="font-black" paragraph>
							Realfield supplies high quality, primary citizen and consumer data, both quantitative and qualitative, collected through observation, interviews, questionnaires, schedules, and experiments.
						</Typography>

						<Typography variant="subtitle2" color={"textSecondary"} paragraph>
							Data isn’t just the “new oil” – it’s the critical fuel source you cannot do without. Use the right fuel and there is no limit to where you can go. Real time.
						</Typography>

						<Typography variant="subtitle2" color={"textSecondary"} paragraph>
							The highest quality data is accurate, consistent, relevant, unique and ethically sourced.
						</Typography>

						<Typography variant="subtitle2" color={"textSecondary"} paragraph>
							We supply our data through two primary products, Surveys and Queries. 
						</Typography>

						{/*<GridContainer className={"p-0 flex sm:flex-col md:flex-row sm:items-center md:justify-center"}>
														<Link to={"/home#commission-a-survey".toUriWithLandingPagePrefix()} color="inherit" className={"my-4 mx-2"}>
																<Button
																	style={{ background: colors.hex.accent, margin: "auto" }}
																	className="min-w-half"
																	variant="contained"
																	classes={{
																		label: "capitalize inverse-text sm:text-sm md:text-xs"
																	}}
																>
																	Get Quote
																</Button>
														</Link>
														<Link to={"/request-demo".toUriWithLandingPagePrefix()} color="inherit" className={"my-4 mx-2"}>
																<Button
																	color="primary"
																	outlined
																	style={{ margin: "auto" }}
																	className="min-w-half"
																	variant="outlined"
																	classes={{
																		label: "capitalize primary-text sm:text-sm md:text-xs"
																	}}
																>
																	Request demo
																</Button>
														</Link>
						</GridContainer>*/}
					</GridItem>


					<GridItem xs={12} md={6} className="p-0 md:pr-2 my-8">
						<Card className={"primary h-48 shadow-2xl"}>
							<CardContent className={classes.cardContent}>
								<Typography color="inherit" variant="h3" paragraph>
									SURVEYS
								</Typography>

								<Typography color="inherit" variant="body1" paragraph>
									Surveys, polls, panels, focus groups and video ethnographies are just a few of the types of surveys we can undertake to provide high quality quantitative and qualitative data.
								</Typography>
							</CardContent>
						</Card>
					</GridItem>

					<GridItem xs={12} md={6} className="p-0 md:pl-2 my-8">
						<Card className={"secondary h-48 shadow-2xl"}>
							<CardContent className={classes.cardContent}>
								<Typography color="inherit" variant="h3" paragraph>
									QUERIES
								</Typography>

								<Typography color="inherit" variant="body1" paragraph>
									Queries are 1-10 short questions that can be put to 50 people for fast response. Photographs and short video clips may also be provided 
								</Typography>
							</CardContent>
						</Card>
					</GridItem>
					<GridItem xs={12} md={12} className="p-0 my-4">
						<GridContainer className={"p-0 flex sm:flex-col md:flex-row sm:items-center md:justify-center"}>
														<Link to={"/home#commission-a-survey".toUriWithLandingPagePrefix()} color="inherit" className={"my-4 mx-2"}>
																<Button
																	style={{ background: colors.hex.accent, margin: "auto" }}
																	className="min-w-half"
																	variant="contained"
																	classes={{
																		label: "capitalize inverse-text sm:text-sm md:text-xs"
																	}}
																>
																	Get Quote
																</Button>
														</Link>
														<Link to={"/home#commission-a-survey".toUriWithLandingPagePrefix()} color="inherit" className={"my-4 mx-2"}>
																<Button
																	color="primary"
																	outlined
																	style={{ margin: "auto" }}
																	className="min-w-half"
																	variant="outlined"
																	classes={{
																		label: "capitalize primary-text sm:text-sm md:text-xs"
																	}}
																>
																	Request demo
																</Button>
														</Link>
						</GridContainer>
					</GridItem>

					<GridItem xs={12} md={12} className="p-0 my-8">
						<Typography color="textSecondary" variant="h3" paragraph>
							Data for Research, Analysis & Insights
						</Typography>

						<Typography color="textSecondary" variant="subtitle2" paragraph>
							At Realfield we view data as a commodity. We value each piece of data we collect on your behalf however you choose to analyse it, and for whatever research area or sector you work in. Brilliant insights need brilliant data.
						</Typography>
					</GridItem>

					

					<GridItem xs={12} md={12} className="p-0 mb-2">
						<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={"products-academic-research"}
									id={"products-academic-research"}
								>
									<Typography variant="h5">Academic Research</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<GridContainer className={"p-0"}>
										<GridItem xs={12} className={"p-0"}>

											<Typography variant="body1" className="mb-4" paragraph>
												Academic learning permeates all aspects of our society and drives innovation and growth. Primary research is the foundation of discovery, experimentation, and learning and is powered by primary data; data that is uniquely sourced to address the questions asked through the research. For years, professional academics and students alike would conduct their own fieldwork to gather primary data, but that is becoming increasingly difficult. Travel is expensive and the data collection process itself is costly and time consuming.
											</Typography>

											<Typography  variant="body1" className="mb-4" paragraph>
												While primary data collection has become increasingly difficult, the need for fresh thinking and new ideas has never been greater in a new global context where ‘misinformation’, ‘disinformation’, ‘dirty data’ and ‘alternative facts’ have entered the global lexicon. 
											</Typography>

											<Typography  variant="body1" className="mb-4" paragraph>
												To help stem the tide of mounting misinformation we developed Realfield, a platform that supplies high quality primary data ready for your analysis. We also believe that high quality, ethical data should be affordable to those who generate knowledge and we’ve designed special packages accessible even on a student’s budget. 
											</Typography>

											<Typography variant="body1" className="accent-text font-semibold" paragraph>
												Ask critical questions and seek the truth from its original source.
											</Typography>

											<Typography variant="body1" className="accent-text font-semibold" paragraph>
												Use our Survey product for primary data collection or try Queries – it’s ideal for grant applications, validating research design or academic papers!
											</Typography>
										</GridItem>
									</GridContainer>
								</AccordionDetails>
						</Accordion>

						<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={"market-research-public-private-sectors"}
									id={"market-research-public-private-sectors"}
								>
									<Typography variant="h5">Market Research [Public and Private Sectors]</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<GridContainer className={"p-0"}>
										<GridItem xs={12} className={"p-0"}>

											<Typography variant="body1" className="mb-4 font-bold" paragraph>
												Private Sector
											</Typography>

											<Typography variant="body1" paragraph>
												Businesses, large and small, in all sectors carry out market research to understand their customers better and to find out what drives them. Primary research using ground truth data, straight from the source is the only way to get direct unfiltered feedback from your customers or prospective customers about what they think about you, your products or your services. It’s what gives you an edge. It’s what helps you compete, and win.
											</Typography>

											<Typography  variant="body1" paragraph>
												In the past gathering data for primary research was time consuming and expensive but no longer. Now there is Realfield; a platform providing high quality unique primary data ethically, in real time, and with packages priced to suit your budget.
											</Typography>
											

											<Typography  variant="body1" className="accent-text font-semibold" paragraph>
												Use our Survey product for primary data collection or try Queries – it’s ideal for proposal writing, refining your pitch, drafting impactful white papers or as a guide to more penetrating market research!
											</Typography>

											<Typography  variant="body1" className="accent-text font-semibold" paragraph>
												Are you a small business owner or micro-entrepreneur? Get in touch and let us help you get the market research data you need to grow!
											</Typography>

											<Typography variant="body1" className="mb-4 font-bold" paragraph>
												Public Sector
											</Typography>

											<Typography variant="body1" paragraph>
												Governments, NGOs and civil society organisations all rely on primary research to analyse and understand complex challenges and wicked problems in order to improve the value of the services they provide. For many governments and organisations, primary research is at the heart of evidence-based decision making and the insights and recommendations produced from robust primary research are invaluable. 
											</Typography>

											<Typography  variant="body1" paragraph>
												Yet for too long too much time has been wasted and too much money spent on research that is outdated before it’s even submitted. Why? Because the primary data from polling, quantitative surveys, interviews, or focus groups has simply taken too long to collect.
											</Typography>
											

											<Typography variant="body1" className="accent-text font-semibold" paragraph>
												Save your budget for your interventions! At Realfield, we are focused on providing a supply of real time data for all of your primary research objectives, from longitudinal rural studies to public opinion polls, real time panels and focus groups to help get to the bottom of the questions you need answering. 
											</Typography>

											<Typography  variant="body1" className="accent-text font-semibold" paragraph>
												Use our Survey product for primary data or try Queries for conducting rapid assessments, guiding intervention design or undertaking Monitoring and Evaluation for your project!
											</Typography>
										</GridItem>
									</GridContainer>
								</AccordionDetails>
						</Accordion>


						<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={"products-digital-research"}
									id={"products-digital-research"}
								>
									<Typography variant="h5">Digital Research</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<GridContainer className={"p-0"}>
										<GridItem xs={12} className={"p-0 mb-4"}>

											<Typography variant="body1" paragraph>
												The emerging AI industry relies on data. And it needs lots of it. Data that is collected systematically, consistently, reliably, and ethically, over time. In short, projects using advanced statistical analyses and machine learning depend on accurate, reliably collected, annotated, labelled data.
											</Typography>

											<Typography  variant="body1" paragraph>
												Training data is paramount. Poor quality data will result in poor quality results. It’s just that simple. Garbage in, garbage out, even for the most elegantly crafted algorithms. 
											</Typography>

											<Typography  variant="body1" paragraph>
												More than this, across Africa and in most frontier markets, the data you need doesn’t exist in a pre-packaged, digital form online. It needs to be collected and cleaned and given that internet penetration across Africa is only at 39%, it can only be collected by human hands.
											</Typography>

											<Typography variant="body1" className="accent-text font-semibold" paragraph>
												To successfully deploy AI solutions, you need the right training data, and a lot of it. Realfield provides you with reliable training data at scale, across Africa and frontier markets, in real time.
											</Typography>

											<Typography variant="body1" className="accent-text font-semibold" paragraph>
												Use our Survey product for primary data collection or try Queries – it’s ideal for grant applications, validating research design or academic papers!
											</Typography>
										</GridItem>

										<GridItem xs={12} className="p-0 mb-2">
											<Typography  variant="body1" className="font-black" paragraph>
												What kind of data can Realfield supply?
											</Typography>
											<ol className="list-decimal pl-4">
												<li className={"mb-4 text-sm font-normal"}><span className="font-black">Observational data </span>for machine learning</li>
												<li className={"mb-4 text-sm font-normal"}><span className="font-black">Text </span>for text-based natural language processing</li>
												<li className={"mb-4 text-sm font-normal"}><span className="font-black">Images </span>for machine learning with image classification</li>
												<li className={"mb-4 text-sm font-normal"}><span className="font-black">Audio </span>data that is collected as utterances, time stamped, and categorized by region and dialect</li>
												<li className={"mb-4 text-sm font-normal"}><span className="font-black">Video </span>for training data for machine learning combining the best of audio and image annotation practices.</li>
											</ol>								
										</GridItem>
									</GridContainer>
								</AccordionDetails>
						</Accordion>
					</GridItem>

					<Hidden smDown>
						<GridItem xs={12} md={12} className="p-0  pt-8 pb-12">
							<Typography color="textSecondary" variant="h3" paragraph>
								Process
							</Typography>

							<Typography color="textSecondary" variant="subtitle2" paragraph>
								In the past, data collection was time consuming and expensive. Realfield’s pioneering process for ethically collecting robust face-to-face and primary data changes all of that.
							</Typography>

							<GridContainer className="p-0">
								<GridItem xs={12} className="p-0 pt-8 md:px-32 flex flex-row items-center justify-center">
									<img src={ProcessImg1} className="w-32 h-auto" alt="process1" />
									<Typography color="textSecondary" variant="h5" className="md:ml-12 flex-1" paragraph>
										<span>To </span> <span className="secondary-text">get started</span><span>, just sign up to meet your Realfield <br/> Data Collection Supervisor!</span>
									</Typography>
								</GridItem>
							</GridContainer>

							<GridContainer className="p-0">
								<GridItem xs={12} className="p-0 md:pr-32 flex flex-row items-center justify-start">
									<div className="flex flex-col md:pr-2">
										<img src={BlueBg1} className="w-12 h-12" />
										<Typography color="secondary" variant="body1" className="my-2 uppercase font-black" paragraph>
											Day 1
										</Typography>
									</div>
									
									<Typography color="textSecondary" variant="body1" className="md:mx-12  flex-1 text-xl font-bold">
										<span>Outline and </span> <span className="secondary-text">discuss </span> <span>your data requirements to make your project a success.</span>
									</Typography>
									
									<img src={ProcessImg2} className="w-32 h-auto" alt="process2" />
									
								</GridItem>

								<GridItem xs={12} className="p-0 md:px-32 flex flex-row items-center justify-center">
									<img src={ProcessImg3} className="w-32 h-auto" alt="process3" />								

									<Typography color="textSecondary" variant="body1" className="md:ml-12 flex-1 text-xl font-bold">
										<span>Next, we’ll</span> <span className="secondary-text">schedule </span> <span>collection start to ensure your timelines are met.</span>								  
									</Typography>
									
								</GridItem>

								<GridItem xs={12} className="p-0  md:px-32 flex flex-row items-center ">					
									

									<Typography color="textSecondary" variant="body1" className="md:mr-12 flex-1 text-xl font-bold">
										<span className="secondary-text">Choose </span><span>your </span> <span className="secondary-text">field team. </span> <span>You can select your own field team, or we can assign one for you that best suits your research design.</span>
									</Typography>

									<img src={ProcessImg4} className="w-32 h-auto" alt="process4" />
									
								</GridItem>
							</GridContainer>


							<GridContainer className="p-0 ">
								<GridItem xs={12} className="p-0 md:pr-32 flex flex-row items-center justify-center">
									<div className="flex flex-col pr-2">
										<img src={BlueBg2} className="w-12 h-auto md:mr-2" />
										<Typography color="secondary" variant="body1" className="uppercase font-black">
												Day 1
										</Typography>
										<Typography color="secondary" variant="body1" className="uppercase font-black">
												(a little later...)
										</Typography>
											
									</div>

									<img src={ProcessImg5} className="w-32 h-auto" alt="process5" />
									

									<Typography color="textSecondary" variant="body1" className="flex-1 md:ml-8 text-xl font-bold">
										<span className="secondary-text">Observe </span><span>your field team at work through our dashboard and </span> <span className="secondary-text">engage </span> <span>with your collection supervisor at any time to check on progress, </span> <span className="secondary-text">monitor</span> <span>the collection process or <span className="secondary-text">revise</span> your collection strategy.</span>
									</Typography>
									
									
								</GridItem>
							</GridContainer>

							<GridContainer className="p-0">
								<GridItem xs={12} className="p-0 pr-32 flex flex-row items-center justify-center">
									<div className="flex flex-col pr-2">
										<img src={BlueBg3} className="w-12 h-auto md:mr-2" />
										<Typography color="secondary" variant="body1" className="uppercase font-black">
												Day 1
											</Typography>
											<Typography color="secondary" variant="body1" className="uppercase font-black">
												(shortly after...)
											</Typography>
									</div>

									<Typography color="textSecondary" variant="body1" className="flex-1 text-xl font-bold">
										<span>Your data will be uploaded in real time onto the </span> <span className="secondary-text">dashboard </span> <span>for review or download it to analyse at your convenience.</span>
									</Typography>

									<img src={ProcessImg6} className="w-32 h-auto" alt="process6" />
								</GridItem>

								<GridItem xs={12} className="p-0 md:px-32 flex flex-row items-center justify-center">					
									<img src={ProcessImg7} className="w-32 h-auto" alt="process7" />

									<Typography color="textSecondary" variant="body1" className="md:mx-12 text-xl font-bold">
										<span className="secondary-text">Data Quality </span> <span>and </span> <span className="secondary-text">ethical data </span> <span>collection are central to our mission to provide you with the data you need, real time.</span>
									</Typography>
								</GridItem>
							</GridContainer>
						</GridItem>
					</Hidden>


					<Hidden mdUp>
						<GridItem xs={12} md={12} className="p-0  pt-8 pb-12" id="products-process">
							<Typography color="textSecondary" variant="h3" paragraph>
								Process
							</Typography>

							<Typography color="textSecondary" variant="subtitle2" paragraph>
								In the past, data collection was time consuming and expensive. Realfield’s pioneering process for ethically collecting robust face-to-face and primary data changes all of that.
							</Typography>

							<GridContainer className="p-0">
								<GridItem xs={3} className="p-0">
									<img src={ProcessImg1} className="w-16 h-auto" alt="process1" />
								</GridItem>

								<GridItem xs={9} className="p-0 flex flex-col items-center">
									<Typography color="textSecondary" variant="h5" paragraph>
										<span>To </span> <span className="secondary-text">get started</span><span>, just sign up to meet your Realfield <br/> Data Collection Supervisor!</span>
									</Typography>
								</GridItem>
							</GridContainer>

							<GridContainer className="p-0 pt-8">
								<GridItem xs={3} className="p-0 flex flex-row items-center">
									<div className="flex flex-col pr-2">
										<img src={BlueBg1} className="w-12 h-12" />										
									</div>
								</GridItem>

								<GridItem xs={9} className="p-0 flex flex-row items-center">
									<Typography color="secondary" variant="subtitle2" className="my-2 uppercase font-black" paragraph>
											Day 1
									</Typography>
								</GridItem>

								<GridItem xs={12} className="p-0  py-4 flex flex-row items-center ">					
									<img src={ProcessImg2} className="w-16 h-auto" alt="process5" />
									

									<Typography color="textSecondary" variant="body1" className="flex-1 ml-4 text-xl font-bold">
										<span>Outline and </span> <span className="secondary-text">discuss </span> <span>your data requirements to make your project a success.</span>
									</Typography>
								</GridItem>

								<GridItem xs={12} className="p-0 py-4 flex flex-row items-center ">					
									<img src={ProcessImg3} className="w-16 h-auto" alt="process4" />

									<Typography color="textSecondary" variant="body1" className="ml-4 flex-1 text-xl font-bold">
										<span>Next, we’ll</span> <span className="secondary-text">schedule </span> <span>collection start to ensure your timelines are met.</span>								  
									</Typography>
								</GridItem>

								<GridItem xs={12} className="p-0 py-4 flex flex-row items-center ">					
									<img src={ProcessImg4} className="w-16 h-auto" alt="process4" />

									<Typography color="textSecondary" variant="body1" className="ml-4 flex-1 text-xl font-bold">
										<span className="secondary-text">Choose </span><span>your </span> <span className="secondary-text">field team. </span> <span>You can select your own field team, or we can assign one for you that best suits your research design.</span>
									</Typography>
								</GridItem>

								
							</GridContainer>

							<GridContainer className="p-0 pt-8">
								<GridItem xs={3} className="p-0 flex flex-row items-center justify-start">
									<div className="flex flex-col md:pr-2">
										<img src={BlueBg2} className="w-12 h-12" />
										
									</div>
								</GridItem>

								<GridItem xs={9} className="p-0 flex flex-row items-center">
									<Typography color="secondary" variant="subtitle2" className="my-2 uppercase font-black" paragraph>
											Day 1 (a little later...)
									</Typography>
								</GridItem>

								
								<GridItem xs={12} className="p-0 flex flex-row items-center ">					
									<img src={ProcessImg5} className="w-16 h-auto" alt="process5" />
									

									<Typography color="textSecondary" variant="body1" className="flex-1 ml-4 text-xl font-bold">
										<span className="secondary-text">Observe </span><span>your field team at work through our dashboard and </span> <span className="secondary-text">engage </span> <span>with your collection supervisor at any time to check on progress, </span> <span className="secondary-text">monitor</span> <span>the collection process or <span className="secondary-text">revise</span> your collection strategy.</span>
									</Typography>
								</GridItem>
							</GridContainer>


							<GridContainer className="p-0 pt-8 ">
								<GridItem xs={3} className="p-0 flex flex-row items-center justify-start">
									<div className="flex flex-col md:pr-2">
										<img src={BlueBg3} className="w-12 h-12" />										
									</div>
								</GridItem>

								<GridItem xs={9} className="p-0 flex flex-row items-center">
									<Typography color="secondary" variant="subtitle2" className="my-2 uppercase font-black" paragraph>
											Day 1 (shortly after...)
									</Typography>
								</GridItem>

								<GridItem xs={12} className="p-0 py-4 flex flex-row items-center ">					
									<img src={ProcessImg3} className="w-16 h-auto" alt="process4" />
									<Typography color="textSecondary" variant="body1" className="ml-4 flex-1 text-xl font-bold">
										<span>Your data will be uploaded in real time onto the </span> <span className="secondary-text">dashboard </span> <span>for review or download it to analyse at your convenience.</span>
									</Typography>
								</GridItem>

								<GridItem xs={12} className="p-0 py-4 flex flex-row items-center ">					
									<img src={ProcessImg7} className="w-16 h-auto" alt="process5" />
									

									<Typography color="textSecondary" variant="body1" className="flex-1 ml-4 text-xl font-bold">
										<span className="secondary-text">Data Quality </span> <span>and </span> <span className="secondary-text">ethical data </span> <span>collection are central to our mission to provide you with the data you need, real time.</span>
									</Typography>
								</GridItem>
							</GridContainer>
						</GridItem>
					</Hidden>
					

				</GridContainer>
			</Section>
		);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(connect(mapStateToProps, {}), withStyles(styles), withTheme)(SectionComponent)
);
