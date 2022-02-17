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
		<Section className={"p-0"} id="about-us" title={""} >

			<GridContainer className={"p-0"}>
				<GridItem xs={12} className={"p-0 pt-8"}>
					<Typography variant="h3" paragraph>
						About Us
					</Typography>
				</GridItem>

				<GridItem xs={12} md={7} className={"p-0 md:pr-12 lg:pr-20"}>
					<Typography variant="subtitle2">
						We are anthropologists, academics, data collectors, data scientists, statisticians, software engineers, sociologists and students. We are truth seekers, information explorers and believers in the power of facts and evidence.
					</Typography>
				</GridItem>

				<GridItem xs={12} md={5} className="p-0">
					<Hidden smDown>
						<Typography variant="subtitle2" className="relative flex flex-row" paragraph>
							<Icon
								path={mdiFormatQuoteOpen}
								title="Quote"
								size={1.5}
								color={theme.palette.accent.main}
								className="absolute"
								style={{ top: -theme.spacing(1), left: -theme.spacing(1) }}
							/>
							{/*<span className="accent-text" style={{textIndent: theme.spacing(3)}}>Facts are stubborn things and whatever may be our wishes, our inclinations, or the dictates of our passion, they cannot alter the state of facts and evidence.</span>*/}
							<span className="accent-text" style={{ textIndent: theme.spacing(3) }}>It is a capital mistake to theorize before one has data.</span>
						</Typography>
						<GridContainer className={"p-0 flex flex-col items-end"}>
							{/*<Typography variant="caption" className="accent-text font-semibold mb-2 flex-1 text-right pr-8" paragraph>
								John Adams
							</Typography>*/}
							<Typography variant="caption" className="accent-text font-semibold mb-2 flex-1 text-right pr-8" paragraph>
								Arthur Conan Doyle
							</Typography>
						</GridContainer>
					</Hidden>

					<Hidden mdUp>
						<Typography variant="subtitle2" className="relative flex flex-row mt-8" paragraph>
							<Icon
								path={mdiFormatQuoteOpen}
								title="Quote"
								size={1.5}
								color={theme.palette.accent.main}
								className="absolute"
								style={{ top: -theme.spacing(1), left: -theme.spacing(1) }}
							/>
							<span className="accent-text" style={{ textIndent: theme.spacing(3) }}>It is a capital mistake to theorize before one has data.</span>
						</Typography>
						<GridContainer className={"p-0 flex flex-col items-end"}>
							<Typography variant="caption" className="accent-text font-semibold mb-2 flex-1 text-right pr-8" paragraph>
								Arthur Conan Doyle
							</Typography>
						</GridContainer>
					</Hidden>

				</GridItem>
				<GridItem xs={12} className={"p-0 pt-4"}>

					<Typography variant="h3" paragraph>
						Our Mission
					</Typography>
					<Hidden smDown>
						<Typography variant="subtitle2" paragraph>
							Realfield is pioneering the remote collection of ethical, accurate and reliable face-to-face and primary data across Africa and emerging markets, real time.
						</Typography>
					</Hidden>

					<Hidden mdUp>
						<Typography variant="subtitle2" paragraph>
							Our purpose is to provide accurate, ethical and reliable data from across Africa and emerging markets, real-time.
						</Typography>
					</Hidden>



				</GridItem>

				{/*<GridItem xs={12} className="p-0 py-8 mt-4" id="ethical-principles">
						<Typography variant="h3" className="primary-text w-full text-center" paragraph>
							Realfield is ethical data. Real time.
						</Typography>
					</GridItem>*/}
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
