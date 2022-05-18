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


	const { submit, TextField, FilePicker, Autocomplete, RadioGroup, values, setValue, resetValues, formState } = usePersistentForm({
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
				<FilePicker
					variant="filled"
					name={`documents`}
					label="Your CV"
					placeholder="Your Curriculum Vitae"
					rules={{
						// required: "Resume is required.",
						validate: {
							isNotEmpty: v => {
								console.log("v", v)
								return !String.isEmpty(v) || "Curriculum Vitae is Required"
							},
						},
					}}
					acceptedFiles={[
						"application/pdf",
						"application/msword",
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					]}
					dropzoneText="Click to select file OR Drag & drop your Resume here"
					filesLimit={1}
					dropzoneIcon="insert_drive_file"
					size="small"
					margin="dense"
					fullWidth
					required
				/>
			</Grid>
			<Grid item xs={12} className="">
				<FilePicker
					variant="filled"
					name={`government_id`}
					label="Copy of Government ID"
					placeholder="Your Copy of Government ID"
					rules={{
						required: "Copy of Government ID is required.",
					}}
					acceptedFiles={["image/*", "application/*"]}
					dropzoneText="Click to select file \n OR \n Drag & drop your Copy of Government ID here"
					filesLimit={1}
					dropzoneIcon="credit_card"
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} className="">
				<FilePicker
					variant="filled"
					name={`avatar`}
					label="Selfie"
					placeholder="Your Selfie"
					rules={{
						required: "Selfie is required.",
					}}
					acceptedFiles={["image/*", "application/*"]}
					dropzoneText="Click to select file \n OR \n Drag & drop your selfie here"
					filesLimit={1}
					dropzoneIcon="portrait"
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
					name={`cover_letter`}
					label="Cover letter"
					placeholder="Cover letter"
					rules={{
						required: "Cover letter is required.",
					}}
					size="small"
					multiline
					minRows={8}
					fullWidth
					required
					validate
				/>
			</Grid>
		</Grid>
	)
})

export default React.memo(ApplicationForm)
