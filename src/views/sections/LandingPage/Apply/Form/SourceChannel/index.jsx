/** @format */

import React, { useCallback } from "react"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import MUITextField from "@mui/material/TextField"
import { usePersistentForms } from "contexts"

const ApplicationForm = React.forwardRef((props, ref) => {

	const { Autocomplete } =  usePersistentForms("job-application-form")

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
