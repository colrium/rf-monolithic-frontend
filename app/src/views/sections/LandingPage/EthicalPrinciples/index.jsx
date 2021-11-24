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


				<GridItem xs={12} className="p-0 flex flex-col items-center py-6">
					<img src={ApiService.endpoint("/public/img/realfield/logo-black.svg")} className="sm:w-5/6 md:w-4/6 lg:w-1/3 h-auto" />
				</GridItem>

				<GridItem xs={12} className="p-0 py-2">
					<Typography variant="body1" className="font-bold" paragraph>
						Ethical Principles
					</Typography>

					<Typography variant="body1" paragraph>
						Realfield has a deep commitment to the following ethical principles and values as they relate to data collection; from a technical perspective to ensure value alignment with human dignity, creating social benefit and positive economic impact whilst respecting all applicable laws and regulations.
					</Typography>
				</GridItem>

				<GridItem xs={12} className="p-0 py-2">
					<Typography variant="body1" className="font-bold" paragraph>
						Human Dignity & Value Alignment
					</Typography>

					<Typography variant="body1" paragraph>
						We believe that data systems, and technology more broadly, has the capacity to encourage societies to be fairer and more equal. Through our ethics board and our continuous consultation with a network of African experts via community, national and regional ethics teams; we work hard to ensure that we are not espousing universal principles and are instead drawing from multiple, deep pools of local knowledge, tradition and cultural mores to inform how we craft robust and adaptive values.
					</Typography>

					<Typography variant="body1" paragraph>
						We pay particular attention to instances where bias and discrimination may arise and work proactively to implement processes which ensure the prioritisation of human dignity, rights, freedoms, and cultural diversity.
					</Typography>
				</GridItem>


				<GridItem xs={12} className="p-0 py-2">
					<Typography variant="body1" className="font-bold" paragraph>
						Social Benefit & Economic Impact
					</Typography>

					<Typography variant="body1" paragraph>
						Realfield aims to have a positive impact on the local, regional and national economies where Realfielders work to gather data. By stimulating research communities and engaging local workforces with flexible, adaptable and fairly compensated work, we anticipate a plethora of positive social and economic impacts from the collection of high quality data, including citizen and consumer data. The social benefit to people and societies where Realfield operates substantially exceeds the foreseeable risks and downsides.
					</Typography>

					<Typography variant="body1" paragraph>
						Our employment and recruitment models are created to benefit and empower as many people as possible; the residual benefits of these value alignments range from shared prosperity to empowered and strengthened research, commercial and third sector networks.
					</Typography>
				</GridItem>


				<GridItem xs={12} className="p-0 py-2">
					<Typography variant="body1" className="font-bold" paragraph>
						Fairness & Bias
					</Typography>

					<Typography variant="body1" paragraph>
						We are consciously aware and work consistently to avoid creating or reinforcing unfair bias: particularly those related to sensitive characteristics such as race, ethnicity, gender, nationality, income, sexual orientation, ability and political or religious belief.  We have a zero-tolerance policy for harm, discrimination and abuse for our Realfielders; this is covered extensively through our rigorous and comprehensive training processes.
					</Typography>

				</GridItem>

				<GridItem xs={12} className="p-0 py-2">
					<Typography variant="body1" className="font-bold" paragraph>
						Privacy & Trust
					</Typography>

					<Typography variant="body1" paragraph>
						At Realfield, we incorporate privacy design principles: encouraging architectures with privacy safeguards and providing appropriate transparency and control over the use of data. Through our informed consent, participants are informed and aware of the system’s capabilities and limitations.; we ensure that the access granted to personal data does not unreasonably curtail people’s real or perceived liberty. In line with GDPR and other international privacy standards, we ensure full respect for privacy and data protection; additionally, our data governance mechanisms, taking into account the high quality and integrity of our data, ensure only legitimised access to data.
					</Typography>

				</GridItem>

				<GridItem xs={12} className="p-0 py-2">
					<Typography variant="body1" className="font-bold" paragraph>
						Transparency & Accountability
					</Typography>

					<Typography variant="body1" paragraph>
						Through our whitepapers, engagement with industry and the research community, our lines of communication are open to encourage feedback, reviews and conversation. Our data, system and AI business models are transparent and clearly explained; our literature is adapted to the stakeholder concerned to ensure comprehensive and adaptive explainability.
					</Typography>

					<Typography variant="body1" paragraph>
						Our ethics board and network of experts provide the foundation for the many accountability mechanisms we have put in place to ensure responsibility, accountability, auditability, and the assessment of algorithms, data and design processes at Realfield. We are transparent and accountable at every engagement touchpoint, for multiple stakeholders.
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
