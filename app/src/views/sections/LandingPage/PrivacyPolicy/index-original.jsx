import React from "react";


import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';


import ApiService from "services/Api";

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


				<GridItem xs={12} className="p-0 flex flex-col items-center  py-4">
					<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo-black.svg")} className="sm:w-5/6 md:w-4/6 lg:w-1/3 h-auto" />
				</GridItem>

				<GridItem xs={12} className="p-0 py-4">
					<Typography variant="subtitle1" paragraph>
						Privacy Policy (September 2020)
					</Typography>

					<Typography variant="subtitle1" paragraph>
						About Us
					</Typography>

					<Typography variant="body1" paragraph>
						Realfield is an UK-based data supply, research and analytics company, and our address is Fitzroy House, Crown Street, Ipswich, Suffolk, IP1 3LG.  You can reach our privacy team at  <a href="mailto:privacy@realfield.io" className="underline">privacy@realfield.io</a>.
					</Typography>

					<Typography variant="subtitle1" paragraph>
						The Personal Data We Collect
					</Typography>

					<Typography variant="body1" paragraph>
						We process (use) personal data to run our projects, conduct research, develop business, meet new partners, and create products.
					</Typography>

					<Typography variant="body1" paragraph>
						We process data about people for the following purposes:
					</Typography>

					<Typography variant="body1" paragraph>
						<ul className="list-disc px-4">
							<li>Research</li>
							<li>Public relations and marketing</li>
							<li>Sales and Business Development</li>
							<li>Creating products and analytics based on data</li>
							<li>General office administration and accounting</li>
							<li>Planning and hosting events and seminars</li>
							<li>Management of our teams (HR, payroll, accreditation) and vendors</li>
						</ul>
					</Typography>

					<Typography variant="subtitle1" paragraph>
						How We Use Data
					</Typography>

					<Typography variant="body1" paragraph>
						The data we collect are for a range of purposes, but all of them are legitimate, lawful, and proportionate, as they are required to be under GDPR and as they should be according to ethical data principles.
					</Typography>

					<Typography variant="body1" paragraph>
						We process the following categories of personal data for the purposes set out.
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">
					<Typography variant="body1" paragraph>
						Processing Purpose
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">
					<Typography variant="body1" paragraph>
						Category of Information Processed
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						Sales and Marketing
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>Contact names</li>
							<li>Telephone numbers (land line and mobile)</li>
							<li>Social media identifiers (e.g. twitter accounts)</li>
							<li>Email addresses</li>
							<li>Postal addresses</li>
						</ul>
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						Executing Projects
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>Contact names (project stakeholders and participants)</li>
							<li>Email addresses</li>
							<li>Contact phone numbers</li>
						</ul>
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						Research Efforts
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>Student names</li>
							<li>Email addresses</li>
							<li>Scripts / assignments</li>
						</ul>
					</Typography>
				</GridItem>


				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						Hosting and Promoting Events
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>Attendee contact information</li>

						</ul>
					</Typography>
				</GridItem>


				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						General Office Administration and Accounting
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>Contact names</li>
							<li>Contact details</li>
							<li>Tax identifiers</li>
							<li>Timesheets</li>
							<li>Data associated with accounts receivable or accounts payable.</li>
						</ul>
					</Typography>
				</GridItem>


				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						HR Administration and Management of Sub Vendors
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>Contact names</li>
							<li>Contact details (address, email and phone number)</li>
							<li>PPSN (for employees)</li>
							<li>Attendance records/time sheets</li>
							<li>Training records</li>
							<li>Sick certs and data relating to occupational health</li>
							<li>CVs</li>
						</ul>
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						Health and Safety
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>Occupational health data</li>
							<li>Accident reports, including details of injuries and contact information for injured parties or witnesses</li>
						</ul>
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 flex flex-col justify-center py-4 pr-4">
					<Typography variant="body2" paragraph>
						Website Performance Management and Security
					</Typography>
				</GridItem>

				<GridItem xs={12} sm={6} className="p-0 py-4">

					<Typography variant="body2" paragraph>
						<ul className="list-disc px-4">
							<li>IP Addresses (in server log files)</li>
						</ul>
					</Typography>
				</GridItem>

				<GridItem xs={12} className="p-0 py-4">
					<Typography variant="subtitle1" paragraph>
						Cookies
					</Typography>

					<Typography variant="subtitle2" paragraph>
						[CYBOT ENTRY]
					</Typography>

					<Typography variant="subtitle1" paragraph>
						Third Party Recipients
					</Typography>

					<Typography variant="body1" paragraph>
						In the course of our business we are required to disclose data to third parties who are not data processors on our behalf.
					</Typography>

					<Typography variant="body1" paragraph>
						For many of our processing activities, we are required to disclose data to third parties who are not data processors acting on our behalf or data controllers on whose behalf we are working. Categories of recipients include:
					</Typography>

					<Typography variant="body1" paragraph>
						<ul className="list-disc px-12">
							<li>Tax authorities</li>
							<li>Law enforcement (where required for the investigation, detection, or prosecution of criminal offences)</li>
						</ul>
					</Typography>

					<Typography variant="subtitle1" paragraph>
						Cross Border Transfer
					</Typography>

					<Typography variant="body1" paragraph>
						Some of our service providers or partners are based outside the EU/EEA. We make sure to only use providers who are processing data outside EU on a valid basis.
					</Typography>

					<Typography variant="body1" paragraph>
						We use of services provided by third parties for the delivery of our services which may necessitate the transfer of personal data outside the EU/EEA (including suites such as GSuite or <a href="http://office365.com/" className="underline">Office365</a>, and similar tools). Where data needs to be transferred or processed outside the EU/EEA, we chose providers who process data on the basis of
					</Typography>

					<Typography variant="body1" paragraph>
						<ul className="list-disc px-12">
							<li>Model Contract Clauses</li>
							<li>An Adequacy Decision from the European Commission.</li>
						</ul>
					</Typography>

					<Typography variant="body1" paragraph>
						In exceptional circumstances we will rely on the consent of the data subject or the necessity of the processing for the performance of or conclusion/performance of a contract that the Data Subject has entered into. On a case by case basis, we may rely on other grounds for transfer, including processing that is necessary for the establishment, exercise, or defence of legal claims.
					</Typography>

					<Typography variant="subtitle1" paragraph>
						Data Processors
					</Typography>

					<Typography variant="body1" paragraph>
						We use a variety of 3rd party tools to run the business.
					</Typography>

					<Typography variant="body1" paragraph>
						The categories of suppliers used includes:
					</Typography>

					<Typography variant="body1" paragraph>
						<ul className="list-disc px-12">
							<li>Telephones & Comms</li>
							<li>Office productivity</li>
							<li>HR Management</li>
							<li>Accounting</li>
							<li>Payment Processing</li>
						</ul>
					</Typography>

					<Typography variant="body1" paragraph>
						We use a variety of data processors in the course of our work. Our current list of processors is:
					</Typography>

					<Typography variant="body1" paragraph>
						Data Processor &nbsp; &nbsp; Purpose for Processing &nbsp; &nbsp; Cross Border Transfer?
					</Typography>

					<Typography variant="body1" paragraph>
						This list is maintained on a quarterly basis or when new suppliers are added.
					</Typography>

					<Typography variant="subtitle1" paragraph>
						Keeping Data
					</Typography>

					<Typography variant="body1" paragraph>
						We retain data for as little time as possible. Our retention periods are based on:
					</Typography>

					<Typography variant="body1" paragraph>
						<ul className="list-disc px-12">
							<li>Statutory Obligations</li>
							<li>Contractual Requirements</li>
							<li>Quality Assurance</li>
							<li>Prudent risk management</li>
						</ul>
					</Typography>

					<Typography variant="body1" paragraph>
						We retain personal data about individuals for a range of periods. The basis for our retention periods is based on:
					</Typography>

					<Typography variant="body1" paragraph>
						<ul className="list-disc px-12">
							<li>Statutory Obligations</li>
							<li>Contractual obligations</li>
							<li>Quality assurance standard obligations provided by our training partners or accrediting bodies.</li>
							<li>For reasonable periods after the conclusion of engagements and risk management purposes.</li>
						</ul>
					</Typography>

					<Typography variant="body1" paragraph>
						On a case by case basis, records may be retained for longer where required for actual or potential legal actions or the management or mitigation of operational or strategic risks to the organisation.  Where records are subject to this kind of “hold” process, the ongoing retention will be reviewed on an annual basis.
					</Typography>

					<Typography variant="subtitle1" paragraph>
						Your Rights
					</Typography>

					<Typography variant="body1" paragraph>
						You have a range of rights under EU Data Protection law. Among these rights is the right to assistance from a Supervisory Authority. Our Supervisory Authority is the Information Commissioner’s Office
					</Typography>

					<Typography variant="body1" paragraph>
						Your Rights:
					</Typography>

					<Typography variant="body1" paragraph>
						<ul className="list-disc px-12">
							<li>For processing activities for which we rely on consent as a basis for processing your data, you have the right to withdraw your consent at any time.</li>
							<li>For processing activities which are based on a statutory or contractual requirement, you may request your data not be processed for that purpose. However, this is not an absolute right and may be over-ridden by our statutory obligations. In other cases, requesting that data should not be processed for a particular reason may prevent us from executing a contract or delivering a service to you.</li>
							<li>You have the right to request:
								<ul className="list-disc px-12">
									<li>A copy of data we hold about you. (Right of Access)</li>
									<li>That any error in data we hold about you is corrected. (Right of Rectification)</li>
									<li>That data we hold about you be erased, unless we have a countervailing interest or legal obligation to retain it. (Right of Erasure)</li>
									<li>That we refrain from processing data for a specific purpose. (Right to Restrict processing)</li>
								</ul>
							</li>
							<li>You have the right to complain to the ICO and to seek compensation through the Courts.</li>
						</ul>
					</Typography>



				</GridItem>


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
