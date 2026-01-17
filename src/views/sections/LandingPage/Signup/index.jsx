/** @format */

import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Section from "components/Section"
import React from "react"
import SignupForm from "views/forms/Auth/Signup"

const SectionComponent = props => {

	return (
		<Section className={"p-0 px-4 md:px-32"}>
			<Grid container sx={{}} className={"p-0"}>
				<Grid item xs={12} className={`flex flex-col`}>
					<Typography variant="h3" color="text.secondary" className={`mb-4`}>
						Sign up to start
					</Typography>
					<Typography variant="body1" color="text.disabled">
						To join our Community, schedule a demo or start a project, please complete the following sign -up form.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<SignupForm
						googleLoginProps={{
							sx: {
								backgroundColor: theme => theme.palette.action.hover,
								color: theme => theme.palette.google.main,
							},
						}}
					/>
				</Grid>
			</Grid>
		</Section>
	)
}


export default React.memo(SectionComponent)
