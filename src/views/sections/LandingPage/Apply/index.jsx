import React, { useState } from "react";

import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import { useNetworkServices } from "contexts/NetworkServices"
import compose from "recompose/compose"

import ApiService from "services/Api"
import ApplicationForm from "./Form"

const SectionComponent = props => {
	const { classes, auth, theme, device, ...rest } = props

	const {
		definations: { applications: defination },
	} = useNetworkServices()

	const service = ApiService.getContextRequests(defination?.endpoint)

	const [content, setContent] = useState("form")

	return (
		<Section id="jobs-apply">
			<Grid container className={"p-0"}>
				<Grid item xs={12} className={"p-0"}>
					<Grid container className={"p-0"}>
						<Grid item xs={12} sm={12} className={"p-0 pt-8 pb-4"}>
							<Typography variant="h3">Fielder Registration</Typography>
						</Grid>
					</Grid>

					<Grid container className={"p-0"}>
						<Grid item xs={12} sm={12} className={"p-0 py-2 pb-4"}>

							<Typography variant="subtitle2">
								It’s great to meet you! Please complete all fields required within the form below to register your interest
								in becoming a Real Fielder. All applications will be reviewed, and you will be contacted by our Team with
								further details. Thanks! We look forward to working with you soon!
							</Typography>
						</Grid>
					</Grid>

					<Grid container className={"p-0"}>
						{content === "form" && (
							<Grid item xs={12} className={"p-0 flex justify-center items-center text-center py-16"}>
								{/* <Typography variant="h3" className="text-center" color="text.disabled">
									We are temporarily not accepting applications. Please check back again soon!
								</Typography> */}
								<ApplicationForm
									onSubmitSuccess={() => setContent("acknowledgement")}
								/>
							</Grid>
						)}

						{content === "acknowledgement" && (
							<Grid item xs={12} className={"p-0 py-48 flex flex-col justify-center items-center"}>
								<Typography variant="subtitle1" color="primary" paragraph>
									Your application has been submitted successfully. Thankyou for your interest in working with us.
								</Typography>
								<Typography variant="body1" paragraph>
									A member of our will get in touch with you about your application as soon as possible{" "}
								</Typography>
							</Grid>
						)}
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
