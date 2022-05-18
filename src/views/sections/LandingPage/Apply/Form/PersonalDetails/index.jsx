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
			<Grid item xs={12} md={6} className="">
				<TextField
					variant="filled"
					name={`first_name`}
					label="First Name"
					placeholder="First Name"
					rules={{
						required: "First Name is required.",
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} md={6} className="">
				<TextField
					variant="filled"
					name={`last_name`}
					label="Last Name"
					placeholder="Last Name"
					rules={{
						required: "Last Name is required.",
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} md={6} className="">
				<TextField
					type="email"
					variant="filled"
					name={`email_address`}
					label="Email address"
					placeholder="email@example.com"
					rules={{
						required: "Email address is required.",
						pattern: {
							value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							message: "Invalid Email Address",
						},
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} md={6} className="">
				<TextField
					type="text"
					variant="filled"
					name={`phone_number`}
					label="Phone number"
					placeholder="Your phone number"
					rules={{
						required: "Phone number is required.",
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} md={6} className="">
				<Field
					label="Date of birth"
					name={`dob`}
					defaultValue={values?.dob || new Date().setFullYear(new Date().getFullYear() - 18)}
					component={DesktopDatePicker}
					margin="dense"
					renderInput={params => <MUITextField variant="filled" size="small" label="Date of birth" {...params} margin="dense" />}
					rules={{
						valueAsDate: true,
						validate: {
							isEmpty: v => Date.isDate(Date.parseFrom(v)) || "Date of birth is required ",
							isValidDate: v => Date.isDate(Date.parseFrom(v)) || "Date of birth is not a valid date ",
							isAdultDate: v => {
								const date_value = v || new Date()
								const adultYearMs = 1000 * 60 * 60 * 24 * 365 * 18
								const difference = Date.now() - date_value.getTime()
								return difference >= adultYearMs || "You must be 18 years or older to apply"
							},
						},
					}}
					required
				/>
			</Grid>
			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`gender`}
					label="Gender"
					placeholder="Your Gender"
					rules={{
						required: "Gender is required.",
					}}
					options={{
						male: "Male",
						female: "Female",
						nonbinary: "Nonbinary",
						transgender: "Transgender",
						prefer_not_to_say: "Prefer not to say",
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
					name={`bio`}
					label="Bio"
					placeholder="Tell us a little about yourself"
					rules={{
						// required: "Bio is required.",
					}}
					size="small"
					multiline
					minRows={8}
					fullWidth
					validate
				/>
			</Grid>

		</Grid>
	)
})

export default React.memo(ApplicationForm)
