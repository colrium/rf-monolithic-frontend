/** @format */


import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import React from "react";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import ApiService from "services/Api";
import compose from "recompose/compose";


const styles = theme => ({


});


const SectionComponent = (props) => {

	return (
		<Section className={"p-0"} id="get-started">
			<Grid container className={"p-0 accent md:px-6  md:py-6"}>
				<Grid item  xs={12} className={"flex flex-row items-center"}>
					<img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/chevron-white.svg")} className={"mr-4 h-10 w-10"} />
					<Typography variant="h4">
						Commission a Realfield Survey
					</Typography>
				</Grid>

				<Grid item  xs={12} className={"flex-1"}>
					<Typography variant="body1" gutterBottom>
						Data is the essential fuel required to power robust, evidence based analysis and decision making. Use the right data and get the analysis and insights you need. Use the wrong data and not only will your results be skewed rendering your analysis inaccurate, but you risk your project being on the wrong side of existing and future regulation and legislation. Garbage in, garbage out – it’s that simple. At Realfield we are dedicated to providing accurate, consistent, relevant and most importantly, ethical data. Real time.
					</Typography>

					<Typography variant="body1" gutterBottom>
						Let us provide you with the right data to power your research and your insights.
					</Typography>
				</Grid>

			</Grid>
			<Grid container className={"p-0"}>
				<Grid item  xs={12} className={"md:px-6 py-8"}>
					<Typography variant="h4">
						Sign up to start
					</Typography>




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
