import React from "react";


import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import Grid from '@mui/material/Grid';
;
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
		<Section className={"p-0 min-h-screen pb-16"} id="why-us" sx={{ backgroundColor: theme => theme.palette.background.paper }}>
			<Grid container className={"p-0"}>
				<Grid item  xs={12} md={12} className="p-0 pb-8">
					<Grid container className={"p-0"}>
						<Grid item  xs={12} className="p-0 mb-2">
							<Typography variant="h4" color="textSecondary" className="mb-2" gutterBottom>
								Why should you use Realfield?
							</Typography>
						</Grid>
					</Grid>

					<Grid container className={"p-0"}>
						<Grid item  xs={12} className="p-0 mb-2 flex flex-row items-center">
							<Box
								className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
								sx={{
									backgroundColor: theme => theme.palette.secondary.main,
								}}
							>
								<Typography className="font-bold" color="background.paper">
									1
								</Typography>
							</Box>

							<Typography className="flex-1" variant="subtitle2">
								Swift understanding of people's preferences, attitudes and behaviours
							</Typography>
						</Grid>

						<Grid item  xs={12} className="p-0 mb-2 flex flex-row items-center">
							<Box
								className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
								sx={{
									backgroundColor: theme => theme.palette.secondary.main,
								}}
							>
								<Typography className="font-bold" color="background.paper">
									2
								</Typography>
							</Box>

							<Typography className="flex-1" variant="subtitle2">
								High quality empirical data
							</Typography>
						</Grid>

						<Grid item  xs={12} className="p-0 mb-2 flex flex-row items-center">
							<Box
								className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
								sx={{
									backgroundColor: theme => theme.palette.secondary.main,
								}}
							>
								<Typography className="font-bold" color="background.paper">
									3
								</Typography>
							</Box>
							<Typography className="flex-1" variant="subtitle2">
								Real time results
							</Typography>
						</Grid>

						<Grid item  xs={12} className="p-0  mb-2 flex flex-row items-center">
							<Box
								className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
								sx={{
									backgroundColor: theme => theme.palette.secondary.main,
								}}
							>
								<Typography className="font-bold" color="background.paper">
									4
								</Typography>
							</Box>
							<Typography className="flex-1" variant="subtitle2">
								Ethical sourcing
							</Typography>
						</Grid>

						<Grid item  xs={12} className="p-0 mb-2 flex flex-row items-center">
							<Box
								className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
								sx={{
									backgroundColor: theme => theme.palette.secondary.main,
								}}
							>
								<Typography className="font-bold" color="background.paper">
									5
								</Typography>
							</Box>
							<Typography className="flex-1" variant="subtitle2">
								Accessible pricing
							</Typography>
						</Grid>
					</Grid>
				</Grid>

				<Grid item  xs={12} className="p-0" id="realfield-approach">
					<Typography variant="h4" className="mb-2" color="text.secondary" paragraph>
						Realfield's Ethical Approach
					</Typography>
				</Grid>

				<Grid item  xs={12} className="p-0 py-2">
					<Typography color="text.secondary">
						Why are our ethical data collection practices important for your project?
					</Typography>
				</Grid>

				<Grid item  xs={12} className="p-0 py-2">
					<Typography color="text.secondary">
						Do you really want your entire project to suffer under the huge reputation risks you could face - not to mention the
						legal risks - just for using unethically sourced dirty data?
					</Typography>
				</Grid>
				<Grid item  xs={12} className="p-0 py-2">
					<Typography color="text.secondary">
						Our ethical standards safeguard your reputation, your project and your results. All data we supply is collected
						according to local legal standards and GDPR requirements and will be reviewed as regulations and laws evolve.
					</Typography>
				</Grid>

				<Grid item  xs={12} className="flex flex-col items-center my-8" id="ethical-principles">
					<Link to={"/ethical-principles".toUriWithLandingPagePrefix()} className="block">
						<Button className="capitalize rounded-full" size="large" variant="contained">
							Learn more about our Ethical Principles
						</Button>
					</Link>
				</Grid>

				<Grid item  xs={12} className="p-0" id="realfield-advantage">
					<Typography variant="h4" className="mb-2" color="text.secondary" paragraph>
						The Real Advantages of Realfield
					</Typography>
				</Grid>

				<Grid container className={"p-0 my-4"}>
					<Grid item  xs={12} className="p-0 mb-2 flex flex-row  items-center">
						<Box
							className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
							sx={{
								backgroundColor: theme => theme.palette.primary.main,
							}}
						>
							<Typography className="font-bold" color="background.paper">
								1
							</Typography>
						</Box>
						<Typography className="flex-1" variant="subtitle2">
							We work fast and accurately to provide understanding where few others can, enabled by our network of primary
							data collectors
						</Typography>
					</Grid>

					<Grid item  xs={12} className="p-0 mb-2 flex flex-row items-center">
						<Box
							className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
							sx={{
								backgroundColor: theme => theme.palette.primary.main,
							}}
						>
							<Typography className="font-bold" color="background.paper">
								2
							</Typography>
						</Box>
						<Typography className="flex-1" variant="subtitle2">
							We provide flexibility and full transparency to adapt to the needs of your project during the collection
							process.
						</Typography>
					</Grid>

					<Grid item  xs={12} className="p-0 mb-2 flex flex-row items-center">
						<Box
							className="w-10 h-10 rounded-full flex flex-row items-center justify-center mr-4"
							sx={{
								backgroundColor: theme => theme.palette.primary.main,
							}}
						>
							<Typography className="font-bold" color="background.paper">
								3
							</Typography>
						</Box>
						<Typography className="flex-1" variant="subtitle2">
							We offer an A-Z service including collection design, large-scale field operation, data quality assurance, and
							annotation.
						</Typography>
					</Grid>
				</Grid>

				<Grid container className={"p-0"}>
					<Grid item  xs={12}>
						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={"why-us-data-accordion"}
								id={"why-us-data-accordion"}
							>
								<Typography variant="h5">Data</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Grid container className={"p-0"}>
									<Grid item  xs={12}>
										<Typography variant="body1" className="accent-text mb-4" gutterBottom paragraph>
											Realfield supplies high quality, primary citizen and consumer data, both quantitative and
											qualitative, collected through observation, interviews, questionnaires, schedules, and
											experiments.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Data is a characteristic of information typically numerical and collected through observation.
											Data becomes information when considered in context post-analysis. Primary data is unique data
											obtained for the first time.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Data Collection is the act of gathering data. Primary data is typically collected through
											observation, interviews, questionnaires, schedules, and experiments. The mode of data collection
											is informed by the method of analysis; quantitative or qualitative. Data collected for
											quantitative analysis is typically numerical. Qualitative data is typically textual.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Amongst the most valuable data for evidence-based decision making is citizen and consumer data.
										</Typography>
									</Grid>
								</Grid>
							</AccordionDetails>
						</Accordion>

						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={"why-us-data-quality-accordion"}
								id={"why-us-data-quality-accordion"}
								classes={{
									root: "bg-transparent",
								}}
							>
								<Typography variant="h5">Data Quality</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Grid container className={"p-0"}>
									<Grid item  xs={12}>
										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											Data quality is important because it directly affects your strategic decision making. Poor
											quality data results in poor decisions that costs time and money. In 2016, IBM estimated that
											poor quality data cost the companies $3.1 trillion in the U.S. alone. Simply put, garbage in,
											garbage out.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											According to recent research, 8 out of 10 AI projects fail, and a stunning 96% of those failures
											are due to the lack of data quality. It’s just that important.
										</Typography>

										<Typography variant="body1" className="mb-4" gutterBottom paragraph>
											High quality data on the other hand, leads to smart decisions. It is the essential ingredient
											for robust analysis and the generation of unique insights in any academic field or industry
											sector. High quality data saves money and saves time.
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
													Data free of contradictions in your databases. This means that if two values are
													examined from separate data sets, they will match or align.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Accuracy
												</Typography>

												<Typography variant="body1" paragraph>
													Data that is error-free and exact. Accuracy is achieved when a measured value matches
													the actual (true) value and it contains no mistakes, such as outdated information,
													redundancies, and typos. Your goal is to continually increase the accuracy of your data,
													even as your datasets grow in size.
												</Typography>
											</li>

											<li>
												<Typography variant="body1" className="accent-text bold-text" paragraph>
													Completeness
												</Typography>

												<Typography variant="body1" paragraph>
													Data is considered “complete” when records are “full” and contain enough information to
													draw conclusions. Tracking this data quality metric involves finding any fields that
													contain missing or incomplete values. All data entries must be complete in order to
													compose a high-quality data set.
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
													Data validity or data integrity is achieved when data points exist in the same and
													correct format everywhere they appear. Having a high rate of validity means that all
													data aligns with established formatting rules.
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
													Data is available and accurate. It’s important to collect data in a timely manner in
													order to ensure that it is relevant and fit for purpose in analysis and the generation
													of insights.
												</Typography>

												<Typography variant="body1" className="accent-text" paragraph>
													Realfield offers real time data ensuring its relevance and fitness for purpose.
												</Typography>
											</li>
										</ol>
									</Grid>
								</Grid>
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
								<Grid container className={"p-0"}>
									<Grid item  xs={12}>
										<Typography className="m-auto" paragraph>
											Realfield’s deep commitment to ethical data collection safeguards your reputation, your project
											and your insights.
										</Typography>

										<Typography className="m-auto" paragraph>
											For more information, see our{" "}
											<a href={"ethical-principles".toUriWithLandingPagePrefix()} className="underline primary-text">
												Ethical Principles
											</a>
										</Typography>
									</Grid>
								</Grid>
							</AccordionDetails>
						</Accordion>
					</Grid>
				</Grid>
			</Grid>
		</Section>
	)
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default (
	compose(connect(mapStateToProps, {}), withTheme)(SectionComponent)
);
