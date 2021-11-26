import React from "react";


import Button from '@mui/material/Button';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';



import ApiService from "services/Api";

import { Link } from "react-router-dom";
import compose from "recompose/compose";


const styles = theme => ({
	root: {
		color: theme.palette.text.primary,
		position: "relative",
		padding: 0,
		display: "flex",
		flexDirection: "row",
	},
	title: {
		color: theme.palette.text.secondary,
		textDecoration: "none",
	},
	subtitle: {
		margin: "10px auto 0",
	},
	contentWrapper: {
		maxHeight: "100%",
		overflowY: "auto",
		background: theme.palette.background.surface,
		overflowX: "hidden",
		flex: 1,
	},
	heading: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
	},

});


const SectionComponent = (props) => {
	const { classes, auth, theme, device, ...rest } = props;


	return (
		<Section className={"p-0 min-h-screen"} id="why-us" >
			<GridContainer className={"p-0"}>
				<GridItem xs={12} md={12} className="p-0 pb-8">
					<GridContainer className={"p-0"}>
						<GridItem xs={12} className="p-0 mb-2">

							<Typography variant="h3" color="textSecondary" className="mb-2" gutterBottom>
								Why should you use Realfield?
							</Typography>


						</GridItem>



						{/*<GridItem xs={12} className="p-0 mb-2">
								<ol className="list-decimal pl-4">
									<li className={"mb-4"}><b>High quality </b>empirical data</li>
									<li className={"mb-4"}><b>Real time </b>data supply through our API or directly downloadable</li>
									<li className={"mb-4"}><b>Accessible </b>pricing</li>
									<li className={"mb-4"}><b>Ethical </b>sourcing</li>
								</ol>								
							</GridItem>*/}
					</GridContainer>

					<GridContainer className={"p-0"}>
						<GridItem xs={12} className="p-0 px-2 md:px-12 mb-2 flex flex-row items-center">
							<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/1_Blue_BG.png")} className="w-12 h-12 mx-4 md:mx-12" />
							<Typography variant="subtitle2">High quality empirical data</Typography>
						</GridItem>

						<GridItem xs={12} className="p-0 px-2 md:px-12 mb-2 flex flex-row items-center">
							<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/1_Blue_BG.png")} className="w-12 h-12 mx-4 md:mx-12" />
							<Typography variant="subtitle2">Real time results</Typography>
						</GridItem>

						<GridItem xs={12} className="p-0 px-2 md:px-12 mb-2 flex flex-row items-center">
							<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/3_Blue_BG.png")} className="w-12 h-12 mx-4 md:mx-12" />
							<Typography variant="subtitle2">Ethical sourcing</Typography>
						</GridItem>

						<GridItem xs={12} className="p-0 px-2 md:px-12 mb-2 flex flex-row items-center">
							<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Blue_BG/4_Blue_BG.png")} className="w-12 h-12 mx-4 md:mx-12" />
							<Typography variant="subtitle2">Accessible pricing</Typography>
						</GridItem>


					</GridContainer>
				</GridItem>

				<GridItem xs={12} className="p-0" id="realfield-advantage">
					<Typography variant="h3" className="mb-2" paragraph>
						The real advantages of Realfield data:
					</Typography>
				</GridItem>

				<GridItem xs={12} className="p-0 flex flex-row items-center py-4">
					<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo-chevron.svg")} className="w-4 h-4 mr-4" />
					<Typography variant="subtitle1">
						Why are our ethical data collection practices important for your project?
					</Typography>
				</GridItem>

				<GridItem xs={12} className="p-0 px-8">
					<Typography variant="subtitle2" paragraph>
						Do you really want your entire project to suffer under the huge reputational risks you could face – not to mention the legal risks – just for using unethically sourced dirty data?
					</Typography>

					<Typography variant="subtitle2" paragraph>
						Our ethical standards safeguard your reputation, your project and your results. All data we supply is collected according to local legal standards and GDPR requirements and will be reviewed as regulations and laws evolve.
					</Typography>
				</GridItem>


				<GridItem xs={12} className="flex flex-col items-center  py-4" id="ethical-principles">
					<Link
						to={"/ethical-principles".toUriWithLandingPagePrefix()}
						className="block"
					>
						<Button className={"capitalize text-3xl font-semibold"}>Learn more about our Ethical Principles</Button>

					</Link>
				</GridItem>

				<GridItem xs={12} className="p-0 flex flex-row items-center pb-4">
					<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo-chevron.svg")} className="w-4 h-4 mr-4" />
					<Typography variant="subtitle1">
						What else have we got?
					</Typography>
				</GridItem>

				<GridContainer className={"p-0 mb-4"}>
					<GridItem xs={12} className="p-0 px-2 py-4 md:px-12 mb-2 flex flex-row items-center">
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/1_Green_BG.png")} className="w-12 h-12 mx-4 md:mx-12" />
						<Typography variant="subtitle2">We work where few others can, building a fast-growing network of Fielders across Africa and emerging markets.</Typography>
					</GridItem>

					<GridItem xs={12} className="p-0 px-2 py-4 md:px-12 mb-2 flex flex-row items-center">
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/2_Green_BG.png")} className="w-12 h-12 mx-4 md:mx-12" />
						<Typography variant="subtitle2">We provide flexibility and full transparency to adapt to the needs of your project during the collection process.</Typography>
					</GridItem>

					<GridItem xs={12} className="p-0 px-2 py-4 md:px-12 mb-2 flex flex-row items-center">
						<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/Green_Bg/3_Green_BG.png")} className="w-12 h-12 mx-4 md:mx-12" />
						<Typography variant="subtitle2">We offer an A-Z service including collection design, large-scale field operation, data quality assurance, and annotation.</Typography>
					</GridItem>

				</GridContainer>

				<GridContainer className={"p-0"}>
					<GridItem xs={12}>
						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={"why-us-data-accordion"}
								id={"why-us-data-accordion"}
							>
								<Typography variant="h5">Data</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<GridContainer className={"p-0"}>
									<GridItem xs={12}>
										<Typography variant="body1" className="accent-text mb-4" gutterBottom paragraph>
											Realfield supplies high quality, primary citizen and consumer data, both quantitative and qualitative, collected through observation, interviews, questionnaires, schedules, and experiments.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Data is a characteristic of information typically numerical and collected through observation. Data becomes information when considered in context post-analysis. Primary data is unique data obtained for the first time.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Data Collection is the act of gathering data. Primary data is typically collected through observation, interviews, questionnaires, schedules, and experiments. The mode of data collection is informed by the method of analysis; quantitative or qualitative. Data collected for quantitative analysis is typically numerical. Qualitative data is typically textual.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Amongst the most valuable data for evidence-based decision making is citizen and consumer data.
										</Typography>
									</GridItem>
								</GridContainer>
							</AccordionDetails>
						</Accordion>

						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={"why-us-data-quality-accordion"}
								id={"why-us-data-quality-accordion"}
								classes={{
									root: "bg-transparent"
								}}
							>
								<Typography variant="h5">Data Quality</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<GridContainer className={"p-0"}>
									<GridItem xs={12}>
										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Data quality is important because it directly affects your strategic decision making. Poor quality data results in poor decisions that costs time and money. In 2016, IBM estimated that poor quality data cost the companies $3.1 trillion in the U.S. alone. Simply put, garbage in, garbage out.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											According to recent research, 8 out of 10 AI projects fail, and a stunning 96% of those failures are due to the lack of data quality. It’s just that important.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											High quality data on the other hand, leads to smart decisions. It is the essential ingredient for robust analysis and the generation of unique insights in any academic field or industry sector. High quality data saves money and saves time.
										</Typography>


										<Typography variant="subtitle1" className="my-6" gutterBottom>
											Realfield’s 7 Characteristics of High Quality Data.
										</Typography>

										<ol>
											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Consistency
												</Typography>

												<Typography variant="body1" paragraph>
													Data free of contradictions in your databases. This means that if two values are examined from separate data sets, they will match or align.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Accuracy
												</Typography>

												<Typography variant="body1" paragraph>
													Data that is error-free and exact. Accuracy is achieved when a measured value matches the actual (true) value and it contains no mistakes, such as outdated information, redundancies, and typos. Your goal is to continually increase the accuracy of your data, even as your datasets grow in size.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Completeness
												</Typography>

												<Typography variant="body1" paragraph>
													Data is considered “complete” when records are “full” and contain enough information to draw conclusions. Tracking this data quality metric involves finding any fields that contain missing or incomplete values. All data entries must be complete in order to compose a high-quality data set.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Auditability
												</Typography>

												<Typography variant="body1" paragraph>
													Data is auditable when it is accessible, and changes are traceable.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Validity
												</Typography>

												<Typography variant="body1" paragraph>
													Data validity or data integrity is achieved when data points exist in the same and correct format everywhere they appear. Having a high rate of validity means that all data aligns with established formatting rules.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Uniqueness
												</Typography>

												<Typography variant="body1" paragraph>
													Data recorded no more than once is unique.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Timeliness
												</Typography>

												<Typography variant="body1" paragraph>
													Data is available and accurate. It’s important to collect data in a timely manner in order to ensure that it is relevant and fit for purpose in analysis and the generation of insights.
												</Typography>

												<Typography variant="body1" className="accent-text" paragraph>
													Realfield offers real time data ensuring its relevance and fitness for purpose.
												</Typography>
											</li>
										</ol>
									</GridItem>
								</GridContainer>

							</AccordionDetails>
						</Accordion>

						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={"why-us-data-ethics-accordion"}
								id={"why-us-data-ethics-accordion"}
							>
								<Typography variant="h5">Data Ethics</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<GridContainer className={"p-0"}>
									<GridItem xs={12}>
										<Typography className="m-auto" paragraph>
											Realfield’s deep commitment to ethical data collection safeguards your reputation, your project and your insights.
										</Typography>

										<Typography className="m-auto" paragraph>
											For more information, see our <a href={"ethical-principles".toUriWithLandingPagePrefix()} className="underline primary-text">Ethical Principles</a>
										</Typography>
									</GridItem>
								</GridContainer>
							</AccordionDetails>
						</Accordion>

					</GridItem>



				</GridContainer>
			</GridContainer>

		</Section>
	);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default (
	compose(connect(mapStateToProps, {}), withTheme)(SectionComponent)
);
