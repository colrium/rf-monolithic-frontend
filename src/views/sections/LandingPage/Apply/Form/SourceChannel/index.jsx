/** @format */

import React, { useCallback } from "react"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import MUITextField from "@mui/material/TextField"


import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"

import { usePersistentForm } from "hooks"

import { useNotificationsQueue, useNetworkServices } from "contexts"

const ApplicationForm = React.forwardRef((props, ref) => {
	const { onSubmit, ...rest } = props || {}

	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()


	const { submit, TextField, Field, Autocomplete, RadioGroup, values, setValue, resetValues, formState } = usePersistentForm({
		name: `job-application-form`,
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { country: "KE" },
		onSubmit: async (formData, e) => {
			if (Function.isFunction(onSubmit)) {
				onSubmit(formData, e)
			}
		},
	})

	return (
		<Grid container spacing={4} {...rest} component="div" ref={ref}>
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
