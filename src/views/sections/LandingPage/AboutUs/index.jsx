import React from "react";


import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import { mdiFormatQuoteOpen } from '@mdi/js';
import Icon from '@mdi/react'
import Hidden from '@mui/material/Hidden';
import compose from "recompose/compose";
import { Box } from "@mui/material"

const SectionComponent = props => {
	const { classes, auth, theme, device, ...rest } = props

	return (
		<Section className="pb-0" id="about-us" title={""}>
			<GridContainer className={"p-0"}>
				<GridItem xs={12} className={"p-0"}>
					<Typography variant="h4" color="text.secondary" paragraph>
						About Us
					</Typography>
				</GridItem>

				<GridItem xs={12} className={"p-0"}>
					<Typography color="text.secondary">
						We are anthropologists, academics, data collectors, data scientists, researchers, statisticians, software engineers,
						sociologists, subject matter experts and students. We are truth seekers, information explorers and believers in the
						power of facts and evidence.
					</Typography>
				</GridItem>

				<GridItem xs={12} className={"p-0 pt-4"}>
					<Typography variant="h4" color="text.secondary" paragraph>
						Our Mission
					</Typography>
					<Typography color="text.secondary" paragraph>
						We help you swiftly understand people’s preferences, attitudes and behaviours by using networks of primary data
						collectors working with proven methods enabled by Realfield’s platform.
					</Typography>
				</GridItem>

				<GridItem xs={12} className={"p-0 py-4"}>
					<Typography variant="h4" color="text.secondary" paragraph>
						How We Work
					</Typography>
					<GridContainer className={"p-0"}>
						<GridItem xs={12} className={"p-0 flex flex-row items-center justify-center"}>
							<iframe
								width="853"
								height="720"
								src={`https://www.youtube.com/embed/l4OqPF6NnJI`}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="w-full"
								title="How We Work"
							/>
						</GridItem>
					</GridContainer>
				</GridItem>
			</GridContainer>
		</Section>
	)
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
});

export default (
	compose(connect(mapStateToProps, {}), withTheme)(SectionComponent)
);
