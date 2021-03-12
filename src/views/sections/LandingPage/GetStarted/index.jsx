/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import LogoChevronWhite from 'assets/img/realfield/chevron-white.svg';
import compose from "recompose/compose";
import { withErrorHandler } from "hoc/ErrorHandler";

const styles = theme => ({
	

});


const SectionComponent = (props) => {

		return (
			<Section className={"p-0"} id="get-started">			
							<GridContainer className={"p-0 accent md:px-6  md:py-6"}>
								<GridItem xs={12} className={"flex flex-row items-center"}>
									<img src={LogoChevronWhite} className={"mr-4 h-10 w-10"} />
									<Typography variant="h4">
										Commission a Realfield Survey
									</Typography>
								</GridItem>

								<GridItem xs={12} className={"flex-1"}>
									<Typography variant="body1" gutterBottom>
										Data is the essential fuel required to power robust, evidence based analysis and decision making. Use the right data and get the analysis and insights you need. Use the wrong data and not only will your results be skewed rendering your analysis inaccurate, but you risk your project being on the wrong side of existing and future regulation and legislation. Garbage in, garbage out – it’s that simple. At Realfield we are dedicated to providing accurate, consistent, relevant and most importantly, ethical data. Real time. 
									</Typography>

									<Typography variant="body1" gutterBottom>
										Let us provide you with the right data to power your research and your insights. 
									</Typography>
								</GridItem>

							</GridContainer>
							<GridContainer className={"p-0"}>						
								<GridItem xs={12} className={"md:px-6 py-8"}>
									<Typography variant="h4">
										Sign up to start
									</Typography>

									


								</GridItem>
							</GridContainer>
					
			</Section>
		);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default withErrorHandler(
	compose(connect(mapStateToProps, {}), withStyles(styles), withTheme)(SectionComponent)
);
