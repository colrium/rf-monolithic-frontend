/** @format */

import React, { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import MUITextField from "@mui/material/TextField"

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"

import { usePersistentForm, useDeepMemo, useSetState } from "hooks"

import { useNotificationsQueue, useNetworkServices } from "contexts"
let contryCodeNames = {
	ET: "Ethiopia",
	KE: "Kenya",
	RW: "Rwanda",
	TZ: "Tanzania",
	UG: "Uganda",
}

const ApplicationFormComponent = React.forwardRef((props, ref) => {
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
	const [state, setState] = useSetState({
		administrativeLevel1Label: "Region/County/Province",
		administrativeLevel1Options: {},
	})


	const adminLevel1Data = useDeepMemo(
		async () => {
			let adminLevelLabel = "Region/County/Province"
			let adminLevelOptions = {}

			if (!String.isEmpty(values.country)) {
				adminLevelOptions = await Api.get("/geography/boundaries", {
					params: {
						admin_level_0: contryCodeNames[values.country],
						pagination: "-1",
						admin_level: 1,
						fields: "name,admin_level_type",
					},
				})
					.then(res => {
						let possibilitiesData = {}
						if (Array.isArray(res?.body?.data)) {
							let administrativeLevelLabelSet = false
							possibilitiesData = res.body.data.reduce((acc, curr) => {
								acc[curr.name] = curr.name
								if (!administrativeLevelLabelSet) {
									adminLevelLabel = curr.admin_level_type
									administrativeLevelLabelSet = true
								}
								return acc
							}, {})
						}

						return possibilitiesData
					})
					.catch(err => {
						console.log("Location Details err", err)
						return {}
					})
			}
			const optionsKeys = Object.keys(adminLevelOptions) || []
			const firstKey = optionsKeys[0] || null

			return {
				label: adminLevelLabel,
				options: adminLevelOptions,
				disabled: false,
				loading: false,
			}
		},
		[values.country],
		{ label: "Region/County/Province", options: {}, value: null, disabled: true, loading: true }
	)

	const adminLevel2Data = useDeepMemo(
		async () => {
			let adminLevelLabel = "Sub County/Sub Region/District"
			let adminLevelOptions = {}

			if (!String.isEmpty(values.country) && !String.isEmpty(values.administrative_level_1)) {
				adminLevelOptions = await Api.get("/geography/boundaries", {
					params: {
						admin_level_0: contryCodeNames[values.country],
						admin_level_1: values.administrative_level_1,
						pagination: "-1",
						admin_level: 2,
						fields: "name,admin_level_type",
					},
				})
					.then(res => {
						console.log("adminLevel2Data res", res)
						let possibilitiesData = {}
						if (Array.isArray(res?.body?.data)) {
							let administrativeLevelLabelSet = false
							possibilitiesData = res.body.data.reduce((acc, curr) => {
								acc[curr.name] = curr.name
								if (!administrativeLevelLabelSet) {
									adminLevelLabel = curr.admin_level_type
									administrativeLevelLabelSet = true
								}
								return acc
							}, {})
						}

						return possibilitiesData
					})
					.catch(err => {
						return {}
					})
			}
			const optionsKeys = Object.keys(adminLevelOptions) || []
			const firstKey = optionsKeys[0] || null

			return {
				label: adminLevelLabel,
				options: adminLevelOptions,
				value: firstKey,
				disabled: false,
				loading: false,
			}
		},
		[values.country, values.administrative_level_1],
		{ label: "Sub County/Sub Region/District", options: {}, value: null, disabled: true, loading: true }
	)

	const adminLevel3Data = useDeepMemo(
		async () => {
			let adminLevelLabel = "Sub County/Sub Region/District"
			let adminLevelOptions = {}

			if (
				!String.isEmpty(values.country) &&
				!String.isEmpty(values.administrative_level_1) &&
				!String.isEmpty(values.administrative_level_2)
			) {
				adminLevelOptions = await Api.get("/geography/boundaries", {
					params: {
						admin_level_0: contryCodeNames[values.country],
						admin_level_1: values.administrative_level_1,
						admin_level_2: values.administrative_level_2,
						pagination: "-1",
						admin_level: 3,
						fields: "name,admin_level_type",
					},
				})
					.then(res => {
						console.log("adminLevel3Data res", res)
						let possibilitiesData = {}
						if (Array.isArray(res?.body?.data)) {
							let administrativeLevelLabelSet = false
							possibilitiesData = res.body.data.reduce((acc, curr) => {
								acc[curr.name] = curr.name
								if (!administrativeLevelLabelSet) {
									adminLevelLabel = curr.admin_level_type
									administrativeLevelLabelSet = true
								}
								return acc
							}, {})
						}

						return possibilitiesData
					})
					.catch(err => {
						return {}
					})
			}
			const optionsKeys = Object.keys(adminLevelOptions) || []
			const firstKey = optionsKeys[0] || null

			return {
				label: adminLevelLabel,
				options: adminLevelOptions,
				value: firstKey,
				disabled: false,
				loading: false,
			}
		},
		[values.country, values.administrative_level_1, values.administrative_level_2],
		{ label: "Ward/Locality/Municipality", options: {}, value: null, disabled: true, loading: true}
	)

	return (
		<Grid container spacing={4} {...rest} component="div" ref={ref}>
			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`country`}
					label="Country"
					placeholder="Country"
					rules={{
						required: "Country is required.",
					}}
					options={{
						ET: "Ethiopia",
						KE: "Kenya",
						RW: "Rwanda",
						TZ: "Tanzania",
						UG: "Uganda",
					}}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>

			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`administrative_level_1`}
					placeholder={`Select your ${adminLevel1Data.label || "Administrative level 1"}.`}
					rules={{
						required: `${adminLevel1Data.label} is required.`,
						// deps: [`country`],
					}}
					{...adminLevel1Data}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>

			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`administrative_level_2`}
					placeholder={`Select your ${adminLevel2Data.label || "Administrative level 2"}.`}
					rules={{
						required: `${adminLevel2Data.label} is required.`,
						// deps: [`country`],
					}}
					{...adminLevel2Data}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>

			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`administrative_level_3`}
					placeholder={`Select your ${adminLevel3Data.label || "Administrative level 3"}.`}
					rules={{
						required: `${adminLevel3Data.label} is required.`,
						// deps: [`country`],
					}}
					{...adminLevel3Data}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>

			{/* <Grid container spacing={4}>
				<Grid item xs={12} className="flex flex-row justify-center items-center my-4">
					<LoadingButton
						disabled={!formState.isValid || formState.isSubmitting}
						loading={formState.isSubmitting}
						className="capitalize rounded-full px-8"
						variant="contained"
						sx={
							{
								// color: theme => theme.palette.text.primary,
								// backgroundColor: theme => theme.palette.background.paper,
							}
						}
						type="submit"
					>
						Submit
					</LoadingButton>
				</Grid>
			</Grid> */}
		</Grid>
	)
})

export default React.memo(ApplicationFormComponent)
