/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import RequestDemoForm from "views/forms/RequestDemoForm";
import compose from "recompose/compose";
import { withErrorHandler } from "hoc/ErrorHandler";

const styles = theme => ({
	

});


const SectionComponent = (props) => {

		return (
			<Section className={"flex flex-col justify-center p-0"} id="request-demo" title="Request Demo">			
				<GridContainer className={"p-0 md:px-0  md:py-6"}>
					<GridItem xs={12} className={"flex flex-row items-center p-0"}>
						<Typography>	
							Please enter your email address and we will get back to you as soon as possible.
						</Typography>	
					</GridItem>

					<GridItem xs={12} className={"flex flex-row items-center p-0"}>
						<RequestDemoForm includeTime/>		
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
