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
					name={`education`}
					label="Education"
					placeholder="Your Highest level of education"
					rules={{
						required: "Education is required.",
					}}
					options={{
						technical: "Technical School",
						college: "College",
						undergraduate: "Under Graduate",
						postgraduate: "Post Graduate",
						doctorate: "Doctorate",
					}}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} className="">
				<TextField
					type="text"
					variant="filled"
					name={`institution`}
					label="Institution"
					placeholder="Institution"
					rules={{
						required: "Institution is required.",
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} className="">
				<TextField
					type="text"
					variant="filled"
					name={`course`}
					label="Course"
					placeholder="Education Course"
					rules={{
						required: "course is required.",
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
		</Grid>
	)
})

export default React.memo(ApplicationForm)
