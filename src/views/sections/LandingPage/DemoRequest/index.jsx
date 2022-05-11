/** @format */


import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import RequestDemoForm from "views/forms/RequestDemoForm";
import compose from "recompose/compose";


const styles = theme => ({


});


const SectionComponent = (props) => {

	return (
		<Section className={"flex flex-col justify-center p-0"} id="request-demo" title="Request Demo">
			<Grid container className={"p-0 md:px-0  md:py-6"}>
				<Grid item  xs={12} className={"flex flex-row items-center p-0"}>
					<Typography>
						Please enter your email address and we will get back to you as soon as possible.
					</Typography>
				</Grid>

				<Grid item  xs={12} className={"flex flex-row items-center p-0"}>
					<RequestDemoForm includeTime />
				</Grid>
			</Grid>
		</Section>
	);
}

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	device: state.device,
});

export default (
	compose(connect(mapStateToProps, {}), withTheme)(SectionComponent)
);
