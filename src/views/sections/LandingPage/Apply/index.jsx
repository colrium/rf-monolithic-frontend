/** @format */

import React from "react"

import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Section from "components/Section"
import ApplicationForm from "views/forms/ApplyForm"

const SectionComponent = props => {
	return (
		<Section id="jobs-apply" {...props}>
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
						<Grid item xs={12} className={"p-0 flex justify-center items-center text-center py-16"}>
							<ApplicationForm />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Section>
	)
}

export default SectionComponent
