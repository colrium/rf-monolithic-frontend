import React, { useState } from "react";

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Section from "components/Section";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import { useNetworkServices } from "contexts/NetworkServices"
import compose from "recompose/compose"

import ApiService from "services/Api"
import BaseForm from "views/forms/BaseForm"

const SectionComponent = props => {
	const { classes, auth, theme, device, ...rest } = props

	const {
		definations: { applications: defination },
	} = useNetworkServices()

	const service = ApiService.getContextRequests(defination?.endpoint)

	const [content, setContent] = useState("form")

	return (
		<Section id="jobs-apply">
			<GridContainer className={"p-0"}>
				<GridItem xs={12} md={11} className={"p-0"}>
					<GridContainer className={"p-0"}>
						<GridItem xs={12} sm={12} className={"p-0 pt-8 pb-4"}>
							<Typography variant="h3">Fielder Registration</Typography>
						</GridItem>
					</GridContainer>

					<GridContainer className={"p-0"}>
						<GridItem xs={12} sm={12} className={"p-0 py-2 pb-4"}>
							{/*<Typography variant="subtitle2">
									Its great to meet you! Please complete all
									fields within the form below to register your
									interest in becoming a Real Fielder. All
									applications will be reviewed and you will be
									contacted by our Team with further details.
									Thanks! We look forward to working with you!! If you have any questions feel free to contact jobs at <a href="mailto:jobs@realfield.io" className="underline">jobs@realfield.io</a>.
								</Typography>*/}

							<Typography variant="subtitle2">
								It’s great to meet you! Please complete all fields required within the form below to register your interest
								in becoming a Real Fielder. All applications will be reviewed, and you will be contacted by our Team with
								further details. Thanks! We look forward to working with you soon!
							</Typography>
						</GridItem>
					</GridContainer>

					<GridContainer className={"p-0"}>
						{content === "form" && (
							<GridItem xs={12} className={"p-0"}>
								<BaseForm
									defination={defination}
									service={service}
									form="applications-form"
									show_title={false}
									text_fields_variant="filled"
									onSubmitSuccessMessage="Your Application has been submitted."
									inputColumnSize={6}
									show_discard={false}
									submit_btn_text={"Submit"}
									textFieldsProps={{
										margin: "dense",
										InputProps: {
											classes: {
												root: "inverse",
											},
										},
									}}
									textareaFieldsProps={{
										margin: "dense",
										InputProps: {
											classes: {
												root: "inverse",
											},
										},
									}}
									selectFieldsProps={{
										margin: "dense",
										classes: {
											inputRoot: "inverse",
										},
									}}
									onSubmitSuccess={() => setContent("acknowledgement")}
								/>
							</GridItem>
						)}

						{content === "acknowledgement" && (
							<GridItem xs={12} className={"p-0 py-48 flex flex-col justify-center items-center"}>
								<Typography variant="subtitle1" color="primary" paragraph>
									Your application has been submitted successfully. Thankyou for your interest in working with us.
								</Typography>
								<Typography variant="body1" paragraph>
									A member of our will get in touch with you about your application as soon as possible{" "}
								</Typography>
							</GridItem>
						)}
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
