/** @format */

import React, { useContext } from "react"
import Grid from "@mui/material/Grid"
import { ApplyFormContext } from "../../../ApplyForm"

const ApplicationForm = React.forwardRef((props, ref) => {

	const { Autocomplete } =  useContext(ApplyFormContext)

	return (
		<Grid container spacing={4} {...props} component="div" ref={ref}>
			<Grid item xs={12} className="">
				<Autocomplete
					variant="filled"
					name={`source`}
					label="How did you hear about us?"
					options={{
						Ajira: "Ajira",
						Twitter: "Twitter",
						Facebook: "Facebook",
						Instagram: "Instagram",
						LinkedIn: "LinkedIn",
						WhatsApp: "WhatsApp",
						"University Career department": "University Career department",
						"Job Websites": "Job Websites",
						"Word of mouth": "Word of mouth",
					}}
					rules={{
						required: "Source is required.",
					}}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>
		</Grid>
	)
})

export default React.memo(ApplicationForm)
